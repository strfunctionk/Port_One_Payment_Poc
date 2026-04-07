import { useNavigate } from "react-router-dom";

import PaymentForm from "@/components/payment/PaymentForm";
import PaymentList from "@/components/payment/PaymentList";

export default function PaymentPage() {
    const navigate = useNavigate();

    return (
        <div className="mx-auto min-h-screen max-w-2xl p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">티켓 구매</h1>
                <button
                    onClick={() => navigate("/")}
                    className="text-gray-500 hover:text-gray-700"
                >
                    홈으로
                </button>
            </div>

            <PaymentForm />
            <PaymentList />
        </div>
    );
}
