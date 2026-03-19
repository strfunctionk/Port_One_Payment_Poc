import { Transaction } from "@/apis/queries/payment/getMyPayments";
import { PaymentMethod } from "@/enums/payment";

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR");
};

export const formatMethod = (transaction: Transaction) => {
    if (transaction.easyPayDetail) {
        const { provider, cardName } = transaction.easyPayDetail;
        return cardName ? `${provider} / ${cardName}` : provider;
    }
    if (transaction.cardDetail) {
        const { cardName, cardBrand } = transaction.cardDetail;
        const cardInfo = [cardName, cardBrand].filter(Boolean).join(" / ");
        if (cardInfo) return cardInfo;
    }
    const methodMap: Record<PaymentMethod, string> = {
        [PaymentMethod.Card]: "카드",
        [PaymentMethod.EasyPay]: "간편결제",
        [PaymentMethod.Transfer]: "계좌이체",
        [PaymentMethod.VirtualAccount]: "가상계좌",
    };
    return methodMap[transaction.method];
};

export const formatAmount = (amount: number) => {
    return amount.toLocaleString("ko-KR") + "원";
};
