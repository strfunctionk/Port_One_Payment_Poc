import { axiosInstance } from "@/apis/axios";

export interface PostSignInRequest {
    email: string;
    password: string;
}

export interface PostSignInResponse {
    userId: number;
    accessToken: string;
    refreshToken: string;
    createdAt: string;
    updatedAt: string;
}

export const postSignIn = async (
    body: PostSignInRequest
): Promise<PostSignInResponse> => {
    const { data } = await axiosInstance.post("/auth/signin", body);
    return data.success;
};
