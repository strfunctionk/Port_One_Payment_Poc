import { prisma } from "../configs/db.config.js";

const transactionInclude = {
  cardDetail: true,
  easyPayDetail: true,
};

const paymentInclude = {
  transactions: { include: transactionInclude },
  paymentTickets: true,
};

export const createPayment = async ({ payment, transaction, paymentTickets = [] }) => {
  const { cardDetail, easyPayDetail, ...txData } = transaction;

  return await prisma.payment.create({
    data: {
      paymentId: payment.paymentId,
      userId: payment.userId,
      orderName: payment.orderName,
      amount: payment.amount,
      currency: payment.currency,
      transactions: {
        create: {
          ...txData,
          ...(cardDetail ? { cardDetail: { create: cardDetail } } : {}),
          ...(easyPayDetail ? { easyPayDetail: { create: easyPayDetail } } : {}),
        },
      },
      ...(paymentTickets.length > 0
        ? { paymentTickets: { create: paymentTickets } }
        : {}),
    },
    include: paymentInclude,
  });
};

export const getPaymentByPaymentId = async (paymentId) => {
  return await prisma.payment.findUnique({
    where: { paymentId },
    include: paymentInclude,
  });
};

export const getPaymentsByUserId = async (userId) => {
  return await prisma.payment.findMany({
    where: { userId },
    include: paymentInclude,
    orderBy: { createdAt: "desc" },
  });
};

export const addCancelTransaction = async (paymentInternalId, transaction) => {
  await prisma.transaction.create({
    data: {
      ...transaction,
      paymentId: paymentInternalId,
    },
  });

  return await prisma.payment.findUnique({
    where: { id: paymentInternalId },
    include: paymentInclude,
  });
};
