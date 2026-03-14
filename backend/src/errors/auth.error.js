class AppError extends Error {
  constructor(errorCode, statusCode, reason, data = null) {
    super(reason);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.reason = reason;
    this.data = data;
  }
}

export class InvalidRequestError extends AppError {
  constructor(reason, data) {
    super("invalid_request", 400, reason, data);
  }
}

export class AuthError extends AppError {
  constructor(reason, data) {
    super("unauthorized", 401, reason, data);
  }
}

export class NotAccessTokenError extends AppError {
  constructor(reason, data) {
    super("not_access_token", 403, reason, data);
  }
}

export class NotRefreshTokenError extends AppError {
  constructor(reason, data) {
    super("not_refresh_token", 403, reason, data);
  }
}

export class NotFoundError extends AppError {
  constructor(reason, data) {
    super("not_found", 404, reason, data);
  }
}

export class DuplicateEmailError extends AppError {
  constructor(reason, data) {
    super("duplicate_email", 409, reason, data);
  }
}

export class DuplicateUsernameError extends AppError {
  constructor(reason, data) {
    super("duplicate_username", 409, reason, data);
  }
}

export class ExpirationAccessTokenError extends AppError {
  constructor(reason, data) {
    super("expired_access_token", 419, reason, data);
  }
}
