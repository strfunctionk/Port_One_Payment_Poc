import { createClerkClient, verifyToken } from "@clerk/backend";
import {
  AuthError,
  ExpirationAccessTokenError,
  NotAccessTokenError,
} from "../errors/auth.error.js";
import { parseBearerToken, verifyJwt } from "../utils/jwt.util.js";
import { prisma } from "../configs/db.config.js";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const getOrCreateUserByClerkId = async (clerkId) => {
  // 이미 존재하면 바로 반환
  let user = await prisma.user.findUnique({ where: { clerkId } });
  if (user) return user;

  // Clerk API로 사용자 정보 조회 (실패 시 clerkId만으로 생성)
  let email = `${clerkId}@clerk.local`;
  let name = clerkId;
  let username = `user_${clerkId.slice(-8)}`;

  try {
    const clerkUser = await clerkClient.users.getUser(clerkId);
    const primaryEmail = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    );
    if (primaryEmail?.emailAddress) email = primaryEmail.emailAddress;

    const firstName = clerkUser.firstName ?? "";
    const lastName = clerkUser.lastName ?? "";
    name = `${firstName} ${lastName}`.trim() || email;
    username = clerkUser.username
      ? `${clerkUser.username}_${clerkId.slice(-6)}`
      : `user_${clerkId.slice(-8)}`;
  } catch (err) {
    console.warn("[Auth] Clerk Users API 호출 실패, clerkId로만 생성:", err.message);
  }

  // 동시 요청 race condition 대비: upsert 실패 시 재조회
  try {
    user = await prisma.user.upsert({
      where: { email },
      update: { clerkId },
      create: { clerkId, email, name, username },
    });
    return user;
  } catch (_) {
    user = await prisma.user.findFirst({
      where: { OR: [{ clerkId }, { email }] },
    });
    if (user) return user;
    throw new Error("사용자 생성에 실패했습니다.");
  }
};

export const verifyAccessToken = async (req, res, next) => {
  const token = parseBearerToken(req.headers.authorization);
  if (!token) {
    return next(new AuthError("Access Token이 없습니다."));
  }

  // 1. 자체 JWT 시도
  try {
    const decoded = verifyJwt(token);
    if (decoded.payload?.type === "AT") {
      req.user = req.user || {};
      req.user.userId = decoded.payload.userId;
      return next();
    }
  } catch (_) {
    // 자체 JWT 아님 → Clerk 시도
  }

  // 2. Clerk JWT 검증
  let clerkPayload;
  try {
    clerkPayload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
  } catch (err) {
    console.error("[Auth] Clerk token 검증 실패:", err.message);
    if (err.message?.includes("expired")) {
      return next(new ExpirationAccessTokenError("Access Token이 만료되었습니다."));
    }
    return next(new NotAccessTokenError("유효하지 않은 토큰입니다."));
  }

  // 3. DB에서 사용자 조회/생성 (Clerk 계정은 있지만 로컬 DB에 없는 경우 자동 생성)
  try {
    const user = await getOrCreateUserByClerkId(clerkPayload.sub);
    req.user = req.user || {};
    req.user.userId = user.id;
    return next();
  } catch (err) {
    console.error("[Auth] 사용자 조회/생성 실패:", err.message);
    return next(err);
  }
};
