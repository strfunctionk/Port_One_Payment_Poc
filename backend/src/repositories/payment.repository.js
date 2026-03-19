import { prisma } from "../configs/db.config.js";

const transactionInclude = {
  cardDetail: true,
  easyPayDetail: true,
};

export const createPayment = async ({ payment, transaction }) => {
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
    },
    include: { transactions: { include: transactionInclude } },
  });
};

export const getPaymentByPaymentId = async (paymentId) => {
  return await prisma.payment.findUnique({
    where: { paymentId },
    include: { transactions: { include: transactionInclude } },
  });
};

export const getPaymentsByUserId = async (userId) => {
  return await prisma.payment.findMany({
    where: { userId },
    include: { transactions: { include: transactionInclude } },
    orderBy: { createdAt: "desc" },
  });
};
