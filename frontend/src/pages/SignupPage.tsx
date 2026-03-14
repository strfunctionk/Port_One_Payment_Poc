import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { usePostSignUp } from "@/apis/mutations/auth/usePostSignUp";
import { getErrorReason } from "@/utils/error";

export default function SignupPage() {
    const navigate = useNavigate();
    const { mutate: signUp, isPending, error } = usePostSignUp();
    const [form, setForm] = useState({
        email: "",
        password: "",
        passwordConfirm: "",
        name: "",
        username: "",
    });
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        if (
            e.target.name === "passwordConfirm" ||
            e.target.name === "password"
        ) {
            setPasswordError(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.passwordConfirm) {
            setPasswordError("비밀번호가 일치하지 않습니다.");
            return;
        }
        const { passwordConfirm: _, ...body } = form;
        signUp(body, {
            onSuccess: () => navigate("/login"),
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <form onSubmit={handleSubmit} className="flex w-80 flex-col gap-4">
                <h1 className="text-center text-2xl font-bold">회원가입</h1>
                {error && (
                    <p className="text-sm text-red-500">
                        {getErrorReason(error)}
                    </p>
                )}
                <input
                    type="text"
                    name="name"
                    placeholder="이름"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="rounded border px-3 py-2"
                />
                <input
                    type="text"
                    name="username"
                    placeholder="사용자명"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="rounded border px-3 py-2"
                />
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
                <div className="flex flex-col gap-1">
                    <input
                        type="password"
                        name="passwordConfirm"
                        placeholder="비밀번호 확인"
                        value={form.passwordConfirm}
                        onChange={handleChange}
                        required
                        className="rounded border px-3 py-2"
                    />
                    {passwordError && (
                        <p className="text-xs text-red-500">{passwordError}</p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded bg-blue-500 py-2 text-white disabled:opacity-50"
                >
                    {isPending ? "처리 중..." : "회원가입"}
                </button>
                <p className="text-center text-sm">
                    이미 계정이 있으신가요?{" "}
                    <Link to="/login" className="text-blue-500 underline">
                        로그인
                    </Link>
                </p>
            </form>
        </div>
    );
}
