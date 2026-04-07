import { AxiosError } from "axios";

interface BackendErrorResponse {
    isSuccess: false;
    code: string;
    message: string;
    result: null;
}

export const getErrorReason = (error: unknown): string => {
    if (error instanceof AxiosError) {
        const data = error.response?.data as BackendErrorResponse | undefined;
        if (data?.message) return data.message;
    }
    if (error instanceof Error) return error.message;
    return "알 수 없는 오류가 발생했습니다.";
};
