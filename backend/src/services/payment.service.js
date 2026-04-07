import {
  PORTONE_API_SECRET,
  PORTONE_STORE_ID,
  PORTONE_API_URL,
  CHANNEL_KEYS,
} from "../configs/portone.config.js";
import {
  PaymentVerificationError,
  PaymentAmountMismatchError,
  PaymentAlreadyCompletedError,
  PaymentNotFoundError,
} from "../errors/payment.error.js";
import {
  createPayment,
  getPaymentByPaymentId,
  getPaymentsByUserId,
  addCancelTransaction,
} from "../repositories/payment.repository.js";
import {
  findAllActiveProducts,
  upsertCredit,
} from "../repositories/ticket.repository.js";
import { responseFromPayment, responseFromPayments } from "../dtos/payment.dto.js";

// ─── PortOne API 호출 ─────────────────────────────────────────────────────────

const portoneRequest = async (method, path, body) => {
  const url = `${PORTONE_API_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `PortOne ${PORTONE_API_SECRET}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(err));
  }
  return res.json();
};

const getPaymentFromPortOne = (paymentId) =>
  portoneRequest(
    "GET",
    `/payments/${encodeURIComponent(paymentId)}?storeId=${encodeURIComponent(PORTONE_STORE_ID)}`
  );

const cancelPaymentAtPortOne = (paymentId, reason) =>
  portoneRequest("POST", `/payments/${encodeURIComponent(paymentId)}/cancel`, {
    storeId: PORTONE_STORE_ID,
    reason,
  });

// ─── 결제 상세 추출 ───────────────────────────────────────────────────────────

const extractPaymentDetail = (method) => {
  if (!method) return { cardDetail: null, easyPayDetail: null };

  if (method.type === "PaymentMethodCard") {
    const card = method.card ?? null;
    return {
      cardDetail: {
        cardName: card?.name ?? null,
        cardNumber: card?.number ?? null,
        cardBrand: card?.brand ?? null,
        approvalNumber: method.approvalNumber ?? null,
        installmentMonth: method.installment?.month ?? null,
      },
      easyPayDetail: null,
    };
  }

  if (method.type === "PaymentMethodEasyPay") {
    const card = method.easyPayMethod?.card ?? null;
    return {
      cardDetail: null,
      easyPayDetail: {
        provider: method.provider,
        cardName: card?.name ?? null,
        cardNumber: card?.number ?? null,
        cardBrand: card?.brand ?? null,
        approvalNumber: method.easyPayMethod?.approvalNumber ?? null,
        installmentMonth: method.easyPayMethod?.installment?.month ?? null,
      },
    };
  }

  return { cardDetail: null, easyPayDetail: null };
};

// ─── 채널키 조회 ──────────────────────────────────────────────────────────────

export const getChannelKey = (pg) => {
  const channelKey = CHANNEL_KEYS[pg?.toUpperCase()];
  if (!channelKey) {
    throw new PaymentVerificationError(`지원하지 않는 PG사입니다: ${pg}`);
  }
  return { pgProvider: pg, channelKey };
};

// ─── 결제 완료 ────────────────────────────────────────────────────────────────

export const completePayment = async (data, userId) => {
  const existingPayment = await getPaymentByPaymentId(data.paymentId);
  if (existingPayment) {
    throw new PaymentAlreadyCompletedError("이미 처리된 결제입니다.");
  }

  // 티켓 상품 검증 및 금액 계산
  let totalCredits = 0;
  let validatedItems = [];

  if (data.items && data.items.length > 0) {
    const products = await findAllActiveProducts();
    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of data.items) {
      const product = productMap.get(item.ticketProductId);
      if (!product) {
        throw new PaymentVerificationError(
          `존재하지 않는 티켓 상품입니다: ${item.ticketProductId}`
        );
      }
      validatedItems.push({ product, quantity: item.quantity });
      totalCredits += product.creditAmount * item.quantity;
    }

    const expectedAmount = validatedItems.reduce(
      (sum, { product, quantity }) => sum + product.price * quantity,
      0
    );
    if (expectedAmount !== data.amount) {
      throw new PaymentAmountMismatchError("결제 금액이 상품 금액 합계와 일치하지 않습니다.", {
        expected: expectedAmount,
        actual: data.amount,
      });
    }
  }

  // PortOne API로 결제 정보 조회
  let portOnePayment;
  try {
    portOnePayment = await getPaymentFromPortOne(data.paymentId);
  } catch (err) {
    throw new PaymentVerificationError("결제 정보를 조회할 수 없습니다.", {
      originalError: err.message,
    });
  }

  if (portOnePayment.status !== "PAID") {
    throw new PaymentVerificationError("결제가 완료되지 않았습니다.", {
      status: portOnePayment.status,
    });
  }

  if (portOnePayment.amount.total !== data.amount) {
    throw new PaymentAmountMismatchError("결제 금액이 일치하지 않습니다.", {
      expected: data.amount,
      actual: portOnePayment.amount.total,
    });
  }

  const { cardDetail, easyPayDetail } = extractPaymentDetail(portOnePayment.method);

  const paymentTickets = validatedItems.map(({ product, quantity }) => ({
    ticketProductId: product.id,
    quantity,
    unitPrice: product.price,
    unitCreditAmount: product.creditAmount,
  }));

  const savedPayment = await createPayment({
    payment: {
      paymentId: data.paymentId,
      userId,
      orderName: data.orderName,
      amount: portOnePayment.amount.total,
      currency: portOnePayment.currency,
    },
    transaction: {
      transactionId: portOnePayment.transactionId,
      type: "PAYMENT",
      amount: portOnePayment.amount.total,
      status: portOnePayment.status,
      method: portOnePayment.method?.type,
      pgProvider: portOnePayment.pgProvider ?? null,
      paidAt: new Date(portOnePayment.paidAt),
      cardDetail,
      easyPayDetail,
    },
    paymentTickets,
  });

  if (totalCredits > 0) {
    await upsertCredit(userId, totalCredits);
  }

  return responseFromPayment({ payment: savedPayment });
};

// ─── 내 결제 내역 조회 ────────────────────────────────────────────────────────

export const getMyPayments = async (userId) => {
  const payments = await getPaymentsByUserId(userId);
  return responseFromPayments({ payments });
};

// ─── 결제 취소 ────────────────────────────────────────────────────────────────

export const cancelPayment = async (paymentId, reason, userId) => {
  const existingPayment = await getPaymentByPaymentId(paymentId);
  if (!existingPayment) {
    throw new PaymentNotFoundError("결제를 찾을 수 없습니다.");
  }
  if (existingPayment.userId !== userId) {
    throw new PaymentVerificationError("해당 결제의 취소 권한이 없습니다.");
  }

  let cancelResult;
  try {
    cancelResult = await cancelPaymentAtPortOne(paymentId, reason);
  } catch (err) {
    throw new PaymentVerificationError("PortOne 결제 취소에 실패했습니다.", {
      originalError: err.message,
    });
  }

  const cancellation = cancelResult.cancellation ?? cancelResult;

  const updatedPayment = await addCancelTransaction(existingPayment.id, {
    transactionId: cancellation.pgCancellationId ?? `cancel_${Date.now()}`,
    type: "CANCEL",
    amount: cancellation.totalAmount ?? existingPayment.amount,
    status: "CANCELLED",
    method: existingPayment.transactions[0]?.method ?? "PaymentMethodCard",
    pgProvider: existingPayment.transactions[0]?.pgProvider ?? null,
    paidAt: new Date(cancellation.cancelledAt ?? Date.now()),
  });

  return responseFromPayment({ payment: updatedPayment });
};
