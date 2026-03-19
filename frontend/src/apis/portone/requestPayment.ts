import * as PortOne from "@portone/browser-sdk/v2";

interface RequestPaymentParams {
    paymentId: string;
    orderName: string;
    amount: number;
}

export const requestPayment = (params: RequestPaymentParams) => {
    return PortOne.requestPayment({
        storeId: import.meta.env.VITE_PORTONE_STORE_ID,
        channelKey: import.meta.env.VITE_PORTONE_CHANNEL_KEY,
        paymentId: params.paymentId,
        orderName: params.orderName,
        totalAmount: params.amount,
        currency: "CURRENCY_KRW",
        payMethod: "CARD",
    });
};
