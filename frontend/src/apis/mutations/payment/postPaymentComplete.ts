import { axiosInstance } from "@/apis/axios";
import { Payment } from "@/apis/queries/payment/getMyPayments";

export interface TicketPurchaseItem {
    ticketProductId: number;
    quantity: number;
}

interface PaymentCompleteRequest {
    paymentId: string;
    orderName: string;
    amount: number;
    items: TicketPurchaseItem[];
}

type PaymentCompleteResponse = Payment;

export const postPaymentComplete = async (
    data: PaymentCompleteRequest
): Promise<PaymentCompleteResponse> => {
    const response = await axiosInstance.post("/payments/complete", data);
    return response.data.result;
};
