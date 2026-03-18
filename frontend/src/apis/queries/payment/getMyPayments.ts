import { axiosInstance } from "@/apis/axios";

export interface Payment {
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

export const getMyPayments = async (): Promise<Payment[]> => {
    const response = await axiosInstance.get("/payment/my");
    return response.data.success;
};
