import { axiosInstance } from "@/apis/axios";

export interface GetProfileResponse {
    userId: number;
    email: string;
    name: string;
    username: string;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
}

export const getProfile = async (): Promise<GetProfileResponse> => {
    const { data } = await axiosInstance.get("/user");
    return data.success;
};
