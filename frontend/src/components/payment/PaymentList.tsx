import { useGetMyPayments } from "@/apis/queries/payment/useGetMyPayments";

import PaymentItem from "./PaymentItem";

export default function PaymentList() {
    const { data: payments, isLoading } = useGetMyPayments();

    return (
        <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">결제 내역</h2>

            {isLoading ? (
                <p className="text-gray-500">로딩 중...</p>
            ) : payments && payments.length > 0 ? (
                <div className="space-y-3">
                    {payments.map((payment) => (
                        <PaymentItem
                            key={payment.paymentId}
                            payment={payment}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">결제 내역이 없습니다.</p>
            )}
        </div>
    );
}
