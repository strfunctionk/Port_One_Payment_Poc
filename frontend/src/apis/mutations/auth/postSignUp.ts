import { axiosInstance } from "@/apis/axios";

export interface PostSignUpRequest {
    email: string;
    password: string;
    name: string;
    username: string;
}

export interface PostSignUpResponse {
    userId: number;
    email: string;
    name: string;
    username: string;
    avatar: string | null;
    createdAt: string;
    updatedAt: string;
}

export const postSignUp = async (
    body: PostSignUpRequest
): Promise<PostSignUpResponse> => {
    const { data } = await axiosInstance.post("/auth/signup", body);
    return data.success;
};
