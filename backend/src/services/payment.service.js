import { PORTONE_API_SECRET, PORTONE_STORE_ID, PORTONE_API_URL } from "../configs/portone.config.js";
import {
  PaymentVerificationError,
  PaymentAmountMismatchError,
  PaymentAlreadyCompletedError,
} from "../errors/payment.error.js";
import {
  createPayment,
  getPaymentByPaymentId,
  getPaymentsByUserId,
} from "../repositories/payment.repository.js";
import { responseFromPayment, responseFromPayments } from "../dtos/payment.dto.js";

const getPaymentFromPortOne = async (paymentId) => {
  const url = `${PORTONE_API_URL}/payments/${encodeURIComponent(paymentId)}?storeId=${encodeURIComponent(PORTONE_STORE_ID)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `PortOne ${PORTONE_API_SECRET}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(JSON.stringify(errorData));
  }

  return response.json();
};

export const completePayment = async (data, userId) => {
  // 이미 처리된 결제인지 확인
  const existingPayment = await getPaymentByPaymentId(data.paymentId);
  if (existingPayment) {
    throw new PaymentAlreadyCompletedError("이미 처리된 결제입니다.");
  }

  // 포트원 API로 결제 정보 조회
  let payment;
  try {
    payment = await getPaymentFromPortOne(data.paymentId);
  } catch (err) {
    console.error("PortOne API Error:", err);
    throw new PaymentVerificationError("결제 정보를 조회할 수 없습니다.", {
      originalError: err.message || JSON.stringify(err),
    });
  }

  // 결제 상태 확인
  if (payment.status !== "PAID") {
    throw new PaymentVerificationError("결제가 완료되지 않았습니다.", {
      status: payment.status,
    });
  }

  // 결제 금액 검증
  if (payment.amount.total !== data.amount) {
    throw new PaymentAmountMismatchError("결제 금액이 일치하지 않습니다.", {
      expected: data.amount,
      actual: payment.amount.total,
    });
  }

  // 결제 정보 저장
  const savedPayment = await createPayment({
    paymentId: data.paymentId,
    transactionId: payment.transactionId,
    userId,
    orderName: data.orderName,
    amount: payment.amount.total,
    status: payment.status,
    method: payment.method?.type || null,
    paidAt: payment.paidAt ? new Date(payment.paidAt) : null,
  });

  return responseFromPayment({ payment: savedPayment });
};

export const getMyPayments = async (userId) => {
  const payments = await getPaymentsByUserId(userId);
  return responseFromPayments({ payments });
};
