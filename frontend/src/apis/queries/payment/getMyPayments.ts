import { axiosInstance } from "@/apis/axios";
import {
    PaymentMethod,
    TransactionStatus,
    TransactionType,
} from "@/enums/payment";

export interface CardDetail {
    cardName: string | null;
    cardNumber: string | null;
    cardBrand: string | null;
    approvalNumber: string | null;
    installmentMonth: number | null;
}

export interface EasyPayDetail {
    provider: string;
    cardName: string | null;
    cardNumber: string | null;
    cardBrand: string | null;
    approvalNumber: string | null;
    installmentMonth: number | null;
}

export interface Transaction {
    transactionId: string;
    type: TransactionType;
    amount: number;
    status: TransactionStatus;
    method: PaymentMethod;
    pgProvider: string | null;
    paidAt: string;
    createdAt: string;
    cardDetail: CardDetail | null;
    easyPayDetail: EasyPayDetail | null;
}

export interface Payment {
    paymentId: string;
    orderName: string;
    amount: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
    transactions: Transaction[];
}

export const getMyPayments = async (): Promise<Payment[]> => {
    const response = await axiosInstance.get("/payments/my");
    return response.data.result.payments;
};
