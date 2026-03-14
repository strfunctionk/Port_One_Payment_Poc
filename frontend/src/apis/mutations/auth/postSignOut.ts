import { axiosInstance } from "@/apis/axios";

export const postSignOut = async (): Promise<void> => {
    await axiosInstance.post("/auth/signout");
};
