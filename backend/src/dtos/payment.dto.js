export const bodyToPaymentComplete = (body) => {
  return {
    paymentId: body.paymentId,
    orderName: body.orderName,
    amount: body.amount,
  };
};

export const responseFromPayment = ({ payment }) => {
  return {
    paymentId: payment.paymentId,
    transactionId: payment.transactionId,
    orderName: payment.orderName,
    amount: payment.amount,
    status: payment.status,
    method: payment.method,
    paidAt: payment.paidAt,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
  };
};

export const responseFromPayments = ({ payments }) => {
  return payments.map((payment) => responseFromPayment({ payment }));
};
