import { axiosInstance } from "@/apis/axios";
import { PgProvider } from "@/enums/payment";

interface ChannelKeyResponse {
    pgProvider: string;
    channelKey: string;
}

export const getChannelKey = async (pg: PgProvider): Promise<ChannelKeyResponse> => {
    const response = await axiosInstance.get("/payments/channel-key", {
        params: { pg },
    });
    return response.data.result;
};
