import { ReactNode, createContext, useContext, useEffect, useState } from "react";

import { registerTokenCallbacks } from "@/apis/axios";
import { LOCAL_STORAGE_KEY } from "@/constants/key";

interface AuthContextType {
    accessToken: string | null;
    setTokens: (accessToken: string, refreshToken: string) => void;
    clearTokens: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(() =>
        localStorage.getItem(LOCAL_STORAGE_KEY.accessToken)
    );

    const setTokens = (accessToken: string, refreshToken: string) => {
        localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, accessToken);
        localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, refreshToken);
        setAccessToken(accessToken);
    };

    const clearTokens = () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
        localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
        setAccessToken(null);
    };

    // axios 인터셉터가 토큰을 갱신/삭제할 때 React 상태만 동기화 (localStorage는 interceptor가 이미 처리)
    useEffect(() => {
        registerTokenCallbacks(
            (at) => setAccessToken(at),
            () => setAccessToken(null),
        );
    }, []);

    return (
        <AuthContext.Provider value={{ accessToken, setTokens, clearTokens }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
