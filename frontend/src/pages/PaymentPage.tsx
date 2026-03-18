import * as PortOne from "@portone/browser-sdk/v2";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePostPaymentComplete } from "@/apis/mutations/payment/usePostPaymentComplete";
import { useGetMyPayments } from "@/apis/queries/payment/useGetMyPayments";
import { queryKeys } from "@/constants/queryKeys";

export default function PaymentPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { mutate: completePayment, isPending: isCompleting } =
        usePostPaymentComplete();
    const { data: payments, isLoading: isLoadingPayments } = useGetMyPayments();

    const [orderName, setOrderName] = useState("테스트 상품");
    const [amount, setAmount] = useState(1000);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePayment = async () => {
        setIsProcessing(true);
        setError(null);

        const paymentId = `payment_${Date.now()}`;

        try {
            const response = await PortOne.requestPayment({
                storeId: import.meta.env.VITE_PORTONE_STORE_ID,
                channelKey: import.meta.env.VITE_PORTONE_CHANNEL_KEY,
                paymentId,
                orderName,
                totalAmount: amount,
                currency: "CURRENCY_KRW",
                payMethod: "CARD",
            });

            if (response?.code) {
                setError(response.message || "결제가 취소되었습니다.");
                setIsProcessing(false);
                return;
            }

            // 결제 성공 시 서버에 검증 요청
            completePayment(
                {
                    paymentId,
                    orderName,
                    amount,
                },
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries({
                            queryKey: queryKeys.payment.my(),
                        });
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
                err instanceof Error ? err.message : "결제 중 오류가 발생했습니다."
            );
            setIsProcessing(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("ko-KR");
    };

    const formatAmount = (amount: number) => {
        return amount.toLocaleString("ko-KR") + "원";
    };

    return (
        <div className="mx-auto min-h-screen max-w-2xl p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">결제 테스트</h1>
                <button
                    onClick={() => navigate("/")}
                    className="text-gray-500 hover:text-gray-700"
                >
                    홈으로
                </button>
            </div>

            {/* 결제 폼 */}
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
                    disabled={isProcessing || isCompleting || !orderName || amount < 100}
                    className="w-full rounded bg-blue-500 py-3 font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                    {isProcessing || isCompleting ? "처리 중..." : "카드 결제하기"}
                </button>
            </div>

            {/* 결제 내역 */}
            <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-lg font-semibold">결제 내역</h2>

                {isLoadingPayments ? (
                    <p className="text-gray-500">로딩 중...</p>
                ) : payments && payments.length > 0 ? (
                    <div className="space-y-3">
                        {payments.map((payment) => (
                            <div
                                key={payment.paymentId}
                                className="rounded border border-gray-200 p-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-medium">{payment.orderName}</p>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(payment.paidAt || payment.createdAt)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-blue-600">
                                            {formatAmount(payment.amount)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {payment.method || "카드"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">결제 내역이 없습니다.</p>
                )}
            </div>
        </div>
    );
}
