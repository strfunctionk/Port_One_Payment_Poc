import { axiosInstance } from "@/apis/axios";

interface PaymentCompleteRequest {
    paymentId: string;
    orderName: string;
    amount: number;
}

interface PaymentCompleteResponse {
    paymentId: string;
    transactionId: string;
    orderName: string;
    amount: number;
    status: string;
    method: string;
    paidAt: string;
    createdAt: string;
    updatedAt: string;
}

export const postPaymentComplete = async (
    data: PaymentCompleteRequest
): Promise<PaymentCompleteResponse> => {
    const response = await axiosInstance.post("/payment/complete", data);
    return response.data.success;
};
