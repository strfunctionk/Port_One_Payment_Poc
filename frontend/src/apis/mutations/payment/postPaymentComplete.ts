import { axiosInstance } from "@/apis/axios";

interface PaymentCompleteRequest {
    paymentId: string;
    orderName: string;
    amount: number;
}

import { Payment } from "@/apis/queries/payment/getMyPayments";

type PaymentCompleteResponse = Payment;

export const postPaymentComplete = async (
    data: PaymentCompleteRequest
): Promise<PaymentCompleteResponse> => {
    const response = await axiosInstance.post("/payment/complete", data);
    return response.data.success;
};
