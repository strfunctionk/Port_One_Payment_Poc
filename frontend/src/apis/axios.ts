import axios from "axios";

type TokenGetter = () => Promise<string | null>;
let getToken: TokenGetter | null = null;

export const setTokenGetter = (fn: TokenGetter) => {
    getToken = fn;
};

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 인터셉터: Clerk에서 최신 토큰을 가져와 Authorization 헤더에 추가
axiosInstance.interceptors.request.use(
    async (config) => {
        if (getToken) {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 시 로그인 페이지로
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
