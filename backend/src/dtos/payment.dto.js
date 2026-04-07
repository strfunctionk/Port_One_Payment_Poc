export const bodyToPaymentComplete = (body) => {
  return {
    paymentId: body.paymentId,
    orderName: body.orderName,
    amount: body.amount,
    items: body.items ?? [],
  };
};

const responseFromTransaction = (transaction) => {
  return {
    transactionId: transaction.transactionId,
    type: transaction.type,
    amount: transaction.amount,
    status: transaction.status,
    method: transaction.method,
    pgProvider: transaction.pgProvider ?? null,
    paidAt: transaction.paidAt,
    createdAt: transaction.createdAt,
    cardDetail: transaction.cardDetail ?? null,
    easyPayDetail: transaction.easyPayDetail ?? null,
  };
};

export const responseFromPayment = ({ payment }) => {
  return {
    paymentId: payment.paymentId,
    orderName: payment.orderName,
    amount: payment.amount,
    currency: payment.currency,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
    transactions: payment.transactions.map(responseFromTransaction),
  };
};

export const responseFromPayments = ({ payments }) => {
  return payments.map((payment) => responseFromPayment({ payment }));
};
