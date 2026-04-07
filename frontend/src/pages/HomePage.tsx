import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();
    const { signOut } = useClerk();
    const { user } = useUser();

    const handleSignOut = () => {
        signOut({ redirectUrl: "/login" });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">홈</h1>
            {user && (
                <div className="text-center">
                    <p className="text-lg">{user.fullName}님 환영합니다!</p>
                    <p className="text-sm text-gray-500">
                        {user.primaryEmailAddress?.emailAddress}
                    </p>
                </div>
            )}
            <div className="flex gap-3">
                <button
                    onClick={() => navigate("/payment")}
                    className="rounded bg-blue-500 px-4 py-2 text-white"
                >
                    티켓 구매
                </button>
                <button
                    onClick={handleSignOut}
                    className="rounded bg-red-500 px-4 py-2 text-white"
                >
                    로그아웃
                </button>
            </div>
        </div>
    );
}
