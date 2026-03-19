import { useState } from "react";

import { usePostPaymentComplete } from "@/apis/mutations/payment/usePostPaymentComplete";
import { requestPayment } from "@/apis/portone/requestPayment";

export default function PaymentForm() {
    const { mutate: completePayment, isPending: isCompleting } =
        usePostPaymentComplete();

    const [orderName, setOrderName] = useState("테스트 상품");
    const [amount, setAmount] = useState(100);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePayment = async () => {
        setIsProcessing(true);
        setError(null);

        const paymentId = `payment_${Date.now()}`;

        try {
            const response = await requestPayment({
                paymentId,
                orderName,
                amount,
            });

            if (response?.code) {
                setError(response.message || "결제가 취소되었습니다.");
                setIsProcessing(false);
                return;
            }

            completePayment(
                { paymentId, orderName, amount },
                {
                    onSuccess: () => {
                        setIsProcessing(false);
                        alert("결제가 완료되었습니다!");
                    },
                    onError: (err) => {
                        setError(
                            err instanceof Error
                                ? err.message
                                : "결제 검증에 실패했습니다."
                        );
                        setIsProcessing(false);
                    },
                }
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "결제 중 오류가 발생했습니다."
            );
            setIsProcessing(false);
        }
    };

    return (
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">새 결제</h2>

            <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    상품명
                </label>
                <input
                    type="text"
                    value={orderName}
                    onChange={(e) => setOrderName(e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    disabled={isProcessing}
                />
            </div>

            <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    결제 금액 (원)
                </label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    disabled={isProcessing}
                    min={100}
                />
            </div>

            {error && (
                <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
                    {error}
                </div>
            )}

            <button
                onClick={handlePayment}
                disabled={
                    isProcessing || isCompleting || !orderName || amount < 100
                }
                className="w-full rounded bg-blue-500 py-3 font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
                {isProcessing || isCompleting ? "처리 중..." : "카드 결제하기"}
            </button>
        </div>
    );
}
