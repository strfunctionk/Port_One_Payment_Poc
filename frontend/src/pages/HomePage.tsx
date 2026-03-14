import { useNavigate } from "react-router-dom";

import { usePostSignOut } from "@/apis/mutations/auth/usePostSignOut";
import { useGetProfile } from "@/apis/queries/user/useGetProfile";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
    const navigate = useNavigate();
    const { clearTokens } = useAuth();
    const { mutate: signOut } = usePostSignOut();
    const { data: profile } = useGetProfile();

    const handleSignOut = () => {
        signOut(undefined, {
            onSuccess: () => {
                clearTokens();
                navigate("/login");
            },
            onError: () => {
                clearTokens();
                navigate("/login");
            },
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">홈</h1>
            {profile && (
                <div className="text-center">
                    <p className="text-lg">{profile.name}님 환영합니다!</p>
                    <p className="text-sm text-gray-500">{profile.email}</p>
                </div>
            )}
            <button
                onClick={handleSignOut}
                className="rounded bg-red-500 px-4 py-2 text-white"
            >
                로그아웃
            </button>
        </div>
    );
}
