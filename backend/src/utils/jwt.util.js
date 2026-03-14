import jwt from "jsonwebtoken";
export const createJwt = ({ userId, type }) => {
  const payload = {
    userId,
    type,
    issuer: "TOSS_PAYMENT_POC",
  };
  const expiresIn =
    type === "AT"
      ? process.env.ACCESS_TOKEN_EXPIRATION
      : process.env.REFRESH_TOKEN_EXPIRATION;
  return jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn });
};

export const parseBearerToken = (authorization) => {
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.split(" ")[1];
};

export const verifyJwt = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
