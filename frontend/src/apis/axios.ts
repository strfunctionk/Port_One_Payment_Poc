import axios, { InternalAxiosRequestConfig } from "axios";

import { LOCAL_STORAGE_KEY } from "@/constants/key";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// 전역 변수로 refresh 요청의 Promise를 저장해서 중복 요청을 방지
let refreshPromise: Promise<string> | null = null;

// AuthContext와 상태 동기화를 위한 콜백 (localStorage는 storage 유틸이 이미 처리하므로 state만 갱신)
let onTokensUpdated: ((accessToken: string) => void) | null = null;
let onTokensCleared: (() => void) | null = null;

export const registerTokenCallbacks = (
    updateFn: (accessToken: string) => void,
    clearFn: () => void
) => {
    onTokensUpdated = updateFn;
    onTokensCleared = clearFn;
};

// localStorage 직접 접근 유틸 (interceptor에서는 React hook 사용 불가)
const storage = {
    getAccessToken: () => localStorage.getItem(LOCAL_STORAGE_KEY.accessToken),
    getRefreshToken: () => localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken),
    setTokens: (accessToken: string, refreshToken: string) => {
        localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, accessToken);
        localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, refreshToken);
        onTokensUpdated?.(accessToken);
    },
    clearTokens: () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
        localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
        onTokensCleared?.();
    },
};

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 인터셉터: 모든 요청 전에 accessToken을 Authorization 헤더에 추가
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = storage.getAccessToken();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터: 419(토큰 만료) 시 refreshToken으로 accessToken 갱신
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest: CustomInternalAxiosRequestConfig = error.config;

        // 419: 토큰 만료 && 재시도 전인 경우
        if (error.response?.status === 419 && !originalRequest._retry) {
            // refresh 엔드포인트에서 419 발생 시 재시도 방지 → 로그아웃
            if (originalRequest.url?.includes("/auth/refresh")) {
                storage.clearTokens();
                window.location.href = "/login";
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            // 이미 refresh 진행 중이면 해당 Promise 재사용 (중복 요청 방지)
            if (!refreshPromise) {
                refreshPromise = (async () => {
                    const refreshToken = storage.getRefreshToken();
                    const { data } = await axiosInstance.post("/auth/refresh", {
                        refreshToken,
                    });
                    const { accessToken, refreshToken: newRefreshToken } =
                        data.success;
                    storage.setTokens(accessToken, newRefreshToken);
                    return accessToken;
                })()
                    .catch((err) => {
                        storage.clearTokens();
                        window.location.href = "/login";
                        return Promise.reject(err);
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            return refreshPromise.then((newAccessToken) => {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            });
        }

        // 401: 인증 정보 없음 → 로그인 페이지로
        if (error.response?.status === 401) {
            storage.clearTokens();
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);
