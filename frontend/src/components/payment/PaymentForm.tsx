import { useState } from "react";

import { TicketPurchaseItem } from "@/apis/mutations/payment/postPaymentComplete";
import { usePostPaymentComplete } from "@/apis/mutations/payment/usePostPaymentComplete";
import { getChannelKey } from "@/apis/queries/payment/getChannelKey";
import { useGetMyCredits } from "@/apis/queries/ticket/useGetMyCredits";
import { useGetTicketProducts } from "@/apis/queries/ticket/useGetTicketProducts";
import { requestPayment } from "@/apis/portone/requestPayment";
import { PgProvider } from "@/enums/payment";
import { formatAmount } from "@/utils/payment";

const PG_BUTTONS: { label: string; pg: PgProvider }[] = [
    { label: "NHN KCP (카드)", pg: PgProvider.NHN_KCP },
    { label: "KG이니시스 (카드)", pg: PgProvider.KG_INICIS },
    { label: "카카오페이 (간편결제)", pg: PgProvider.KAKAOPAY },
];

export default function PaymentForm() {
    const { mutate: completePayment } = usePostPaymentComplete();
    const { data: ticketProducts, isLoading: isProductsLoading } = useGetTicketProducts();
    const { data: myCredits, isLoading: isCreditsLoading } = useGetMyCredits();

    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [processingPg, setProcessingPg] = useState<PgProvider | null>(null);
    const [error, setError] = useState<string | null>(null);

    const selectedItems: TicketPurchaseItem[] = Object.entries(quantities)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => ({ ticketProductId: Number(id), quantity: qty }));

    const totalAmount = selectedItems.reduce((sum, item) => {
        const product = ticketProducts?.find((p) => p.id === item.ticketProductId);
        return sum + (product?.price ?? 0) * item.quantity;
    }, 0);

    const orderName = (() => {
        if (selectedItems.length === 0) return "";
        if (selectedItems.length === 1) {
            const product = ticketProducts?.find(
                (p) => p.id === selectedItems[0].ticketProductId
            );
            return product
                ? `${product.name} x${selectedItems[0].quantity}`
                : "";
        }
        return `티켓 ${selectedItems.length}종 구매`;
    })();

    const handleQuantityChange = (productId: number, delta: number) => {
        setQuantities((prev) => {
            const next = (prev[productId] ?? 0) + delta;
            if (next <= 0) {
                const { [productId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [productId]: next };
        });
    };

    const handlePayment = async (pg: PgProvider) => {
        if (selectedItems.length === 0 || totalAmount <= 0) return;

        setProcessingPg(pg);
        setError(null);

        const paymentId = `payment_${Date.now()}`;

        try {
            const { channelKey } = await getChannelKey(pg);

            const response = await requestPayment({
                paymentId,
                orderName,
                amount: totalAmount,
                channelKey,
                pgProvider: pg,
            });

            if (response?.code) {
                setError(response.message || "결제가 취소되었습니다.");
                setProcessingPg(null);
                return;
            }

            completePayment(
                { paymentId, orderName, amount: totalAmount, items: selectedItems },
                {
                    onSuccess: () => {
                        setProcessingPg(null);
                        setQuantities({});
                        alert("결제가 완료되었습니다!");
                    },
                    onError: (err) => {
                        setError(
                            err instanceof Error
                                ? err.message
                                : "결제 검증에 실패했습니다."
                        );
                        setProcessingPg(null);
                    },
                }
            );
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "결제 중 오류가 발생했습니다."
            );
            setProcessingPg(null);
        }
    };

    const isProcessing = processingPg !== null;

    return (
        <div className="mb-8 space-y-4">
            {/* 내 크레딧 */}
            <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm font-medium text-blue-700">내 리포트 생성권</p>
                {isCreditsLoading ? (
                    <p className="mt-1 text-2xl font-bold text-blue-900">로딩 중...</p>
                ) : (
                    <p className="mt-1 text-2xl font-bold text-blue-900">
                        {myCredits?.remainingCount ?? 0}개 남음
                    </p>
                )}
            </div>

            {/* 티켓 상품 목록 */}
            <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-lg font-semibold">티켓 상품</h2>

                {isProductsLoading ? (
                    <p className="text-gray-500">로딩 중...</p>
                ) : ticketProducts && ticketProducts.length > 0 ? (
                    <div className="space-y-3">
                        {ticketProducts.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                            >
                                <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-gray-500">
                                        리포트 생성권 {product.creditAmount}개 제공
                                    </p>
                                    <p className="mt-1 font-semibold text-blue-600">
                                        {formatAmount(product.price)}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            handleQuantityChange(product.id, -1)
                                        }
                                        disabled={
                                            isProcessing ||
                                            !quantities[product.id]
                                        }
                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        -
                                    </button>
                                    <span className="w-6 text-center font-medium">
                                        {quantities[product.id] ?? 0}
                                    </span>
                                    <button
                                        onClick={() =>
                                            handleQuantityChange(product.id, 1)
                                        }
                                        disabled={isProcessing}
                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-500 text-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">판매 중인 상품이 없습니다.</p>
                )}
            </div>

            {/* 결제 수단 선택 */}
            {selectedItems.length > 0 && (
                <div className="rounded-lg bg-white p-6 shadow">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">결제하기</h2>
                        <p className="text-lg font-bold text-blue-600">
                            합계 {formatAmount(totalAmount)}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        {PG_BUTTONS.map(({ label, pg }) => (
                            <button
                                key={pg}
                                onClick={() => handlePayment(pg)}
                                disabled={isProcessing}
                                className="w-full rounded bg-blue-500 py-3 font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                            >
                                {processingPg === pg ? "처리 중..." : label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
