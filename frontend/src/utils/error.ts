import { AxiosError } from "axios";

interface BackendError {
    errorCode: string;
    reason: string;
    data: unknown;
}

interface BackendErrorResponse {
    resultType: "FAIL";
    error: BackendError;
    success: null;
}

export const getErrorReason = (error: unknown): string => {
    if (error instanceof AxiosError) {
        const data = error.response?.data as BackendErrorResponse | undefined;
        if (data?.error?.reason) return data.error.reason;
    }
    if (error instanceof Error) return error.message;
    return "알 수 없는 오류가 발생했습니다.";
};
