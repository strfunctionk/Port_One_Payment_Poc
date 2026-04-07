import { axiosInstance } from "@/apis/axios";

export interface TicketProduct {
    id: number;
    name: string;
    price: number;
    creditAmount: number;
}

export const getTicketProducts = async (): Promise<TicketProduct[]> => {
    const response = await axiosInstance.get("/tickets/products");
    return response.data.result.products;
};
