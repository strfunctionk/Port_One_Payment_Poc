import { axiosInstance } from "@/apis/axios";
import { Payment } from "@/apis/queries/payment/getMyPayments";

interface PaymentCancelRequest {
    paymentId: string;
    reason: string;
}

type PaymentCancelResponse = Payment;

export const postPaymentCancel = async ({
    paymentId,
    reason,
}: PaymentCancelRequest): Promise<PaymentCancelResponse> => {
    const response = await axiosInstance.post(`/payments/${paymentId}/cancel`, { reason });
    return response.data.result;
};
