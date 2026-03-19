export enum TransactionType {
    PAYMENT = "PAYMENT",
    CANCEL = "CANCEL",
}

export enum TransactionStatus {
    PAID = "PAID",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    PARTIAL_CANCELLED = "PARTIAL_CANCELLED",
}

export enum PaymentMethod {
    Card = "PaymentMethodCard",
    EasyPay = "PaymentMethodEasyPay",
    Transfer = "PaymentMethodTransfer",
    VirtualAccount = "PaymentMethodVirtualAccount",
}
