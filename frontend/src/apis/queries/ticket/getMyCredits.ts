import { axiosInstance } from "@/apis/axios";

export interface MyCredits {
    remainingCount: number;
}

export const getMyCredits = async (): Promise<MyCredits> => {
    const response = await axiosInstance.get("/tickets/my-credits");
    return response.data.result;
};
