import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";

export default function LoginPage() {
    const { signIn, isLoaded } = useSignIn();
    const [loading, setLoading] = useState<"github" | "google" | null>(null);

    const handleOAuth = async (provider: "github" | "google") => {
        if (!isLoaded || !signIn || loading) return;
        setLoading(provider);
        try {
            await signIn.authenticateWithRedirect({
                strategy: provider === "github" ? "oauth_github" : "oauth_google",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/",
            });
        } catch (e) {
            console.error(e);
            setLoading(null);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex w-80 flex-col gap-4">
                <h1 className="text-center text-2xl font-bold">로그인</h1>
                <button
                    onClick={() => handleOAuth("github")}
                    disabled={!isLoaded || loading !== null}
                    className="rounded bg-gray-900 py-2 text-white disabled:opacity-50"
                >
                    {loading === "github" ? "로그인 중..." : "GitHub으로 로그인"}
                </button>
                <button
                    onClick={() => handleOAuth("google")}
                    disabled={!isLoaded || loading !== null}
                    className="rounded border py-2 disabled:opacity-50"
                >
                    {loading === "google" ? "로그인 중..." : "Google로 로그인"}
                </button>
            </div>
        </div>
    );
}
