import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { usePostSignIn } from "@/apis/mutations/auth/usePostSignIn";
import { useAuth } from "@/context/AuthContext";
import { getErrorReason } from "@/utils/error";

export default function LoginPage() {
    const navigate = useNavigate();
    const { setTokens } = useAuth();
    const { mutate: signIn, isPending, error } = usePostSignIn();
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        signIn(form, {
            onSuccess: (data) => {
                setTokens(data.accessToken, data.refreshToken);
                navigate("/");
            },
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <form onSubmit={handleSubmit} className="flex w-80 flex-col gap-4">
                <h1 className="text-center text-2xl font-bold">로그인</h1>
                {error && (
                    <p className="text-sm text-red-500">
                        {getErrorReason(error)}
                    </p>
                )}
                <input
                    type="email"
                    name="email"
                    placeholder="이메일"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="rounded border px-3 py-2"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="rounded border px-3 py-2"
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded bg-blue-500 py-2 text-white disabled:opacity-50"
                >
                    {isPending ? "로그인 중..." : "로그인"}
                </button>
                <p className="text-center text-sm">
                    계정이 없으신가요?{" "}
                    <Link to="/signup" className="text-blue-500 underline">
                        회원가입
                    </Link>
                </p>
            </form>
        </div>
    );
}
