import { prisma } from "../configs/db.config.js";

export const createPayment = async (data) => {
  return await prisma.payment.create({
    data: {
      paymentId: data.paymentId,
      transactionId: data.transactionId,
      userId: data.userId,
      orderName: data.orderName,
      amount: data.amount,
      status: data.status,
      method: data.method,
      paidAt: data.paidAt,
    },
  });
};

export const getPaymentByPaymentId = async (paymentId) => {
  return await prisma.payment.findUnique({
    where: { paymentId },
  });
};

export const getPaymentsByUserId = async (userId) => {
  return await prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const updatePaymentStatus = async (paymentId, status) => {
  return await prisma.payment.update({
    where: { paymentId },
    data: { status },
  });
};
