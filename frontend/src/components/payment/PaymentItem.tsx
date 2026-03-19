import { Payment } from "@/apis/queries/payment/getMyPayments";
import { formatDate, formatMethod, formatAmount } from "@/utils/payment";

interface PaymentItemProps {
    payment: Payment;
}

export default function PaymentItem({ payment }: PaymentItemProps) {
    const tx = payment.transactions[0];
    if (!tx) return null;
    const detail = tx.cardDetail ?? tx.easyPayDetail;

    return (
        <div className="rounded border border-gray-200 p-4">
            <div className="flex items-start justify-between">
                <div>
                    <p className="font-medium">{payment.orderName}</p>
                    <p className="text-xs text-gray-400">{payment.paymentId}</p>
                    <p className="text-sm text-gray-500">
                        {formatDate(tx.paidAt || payment.createdAt)}
                    </p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-blue-600">
                        {formatAmount(payment.amount)} {payment.currency}
                    </p>
                    <p className="text-sm text-gray-500">
                        {formatMethod(tx)}
                    </p>
                </div>
            </div>
            {detail && (detail.cardNumber || detail.approvalNumber || detail.installmentMonth != null) && (
                <div className="mt-2 space-y-0.5 border-t border-gray-100 pt-2 text-xs text-gray-400">
                    {detail.cardNumber && (
                        <p>카드번호: {detail.cardNumber}</p>
                    )}
                    {detail.approvalNumber && (
                        <p>승인번호: {detail.approvalNumber}</p>
                    )}
                    {detail.installmentMonth != null && (
                        <p>
                            할부:{" "}
                            {detail.installmentMonth === 0
                                ? "일시불"
                                : `${detail.installmentMonth}개월`}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
