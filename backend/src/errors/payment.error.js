export class PaymentNotFoundError extends Error {
  errorCode = "payment_not_found";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class PaymentVerificationError extends Error {
  errorCode = "payment_verification_failed";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class PaymentAmountMismatchError extends Error {
  errorCode = "payment_amount_mismatch";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class PaymentAlreadyCompletedError extends Error {
  errorCode = "payment_already_completed";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
