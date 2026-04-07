import * as PortOne from "@portone/browser-sdk/v2";
import { PgProvider } from "@/enums/payment";

interface RequestPaymentParams {
    paymentId: string;
    orderName: string;
    amount: number;
    channelKey: string;
    pgProvider: PgProvider;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
}

export const requestPayment = (params: RequestPaymentParams) => {
    const isEasyPay = params.pgProvider === PgProvider.KAKAOPAY;
    return PortOne.requestPayment({
        storeId: import.meta.env.VITE_PORTONE_STORE_ID,
        channelKey: params.channelKey,
        paymentId: params.paymentId,
        orderName: params.orderName,
        totalAmount: params.amount,
        currency: "CURRENCY_KRW",
        payMethod: isEasyPay ? "EASY_PAY" : "CARD",
        customer: {
            fullName: params.fullName,
            email: params.email,
            phoneNumber: params.phoneNumber,
        },
    });
};
