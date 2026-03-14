import rateLimit from "express-rate-limit";

const rateLimitResponse = (reason) => ({
  resultType: "FAIL",
  error: { errorCode: "too_many_requests", reason, data: null },
  success: null,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse("요청이 너무 많습니다. 15분 후 다시 시도해주세요."),
});

export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse("토큰 갱신 요청이 너무 많습니다. 15분 후 다시 시도해주세요."),
});
