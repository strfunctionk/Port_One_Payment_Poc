import { responseFromUser } from "../dtos/user.dto.js";
import { addUser } from "../repositories/user.repository.js";
import {
  getUserSignIn,
  updateUserRefresh,
  getUserRefresh,
} from "../repositories/auth.repository.js";
import {
  DuplicateEmailError,
  DuplicateUsernameError,
  InvalidRequestError,
  NotRefreshTokenError,
} from "../errors/auth.error.js";
import { responseFromAuth } from "../dtos/auth.dto.js";
import { createJwt, verifyJwt } from "../utils/jwt.util.js";
import { hashPassword, comparePassword } from "../utils/crypto.util.js";

export const signUp = async (data) => {
  const hashedPassword = await hashPassword(data.password);

  let created;
  try {
    created = await addUser({
      email: data.email,
      name: data.name,
      username: data.username,
      avatar: data.avatar || null,
      password: hashedPassword,
    });
  } catch (err) {
    if (err.code === "P2002") {
      const target = err.meta?.target;
      const field = Array.isArray(target) ? target[0] : target;
      if (field === "email") throw new DuplicateEmailError("이미 존재하는 이메일입니다.");
      if (field === "username") throw new DuplicateUsernameError("이미 존재하는 사용자명입니다.");
    }
    throw err;
  }

  return responseFromUser({ user: created });
};

export const signIn = async (data) => {
  const user = await getUserSignIn({ email: data.email });
  if (user === null) {
    throw new InvalidRequestError("이메일 또는 비밀번호가 일치하지 않습니다.");
  }

  const isPasswordValid = await comparePassword(data.password, user.password);
  if (!isPasswordValid) {
    throw new InvalidRequestError("이메일 또는 비밀번호가 일치하지 않습니다.");
  }

  const accessToken = createJwt({ userId: user.id, type: "AT" });
  const refreshToken = createJwt({ userId: user.id, type: "RT" });

  await updateUserRefresh(user.id, refreshToken);

  const auth = {
    id: user.id,
    accessToken,
    refreshToken,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return responseFromAuth({ auth });
};

export const signOut = async (userId) => {
  await updateUserRefresh(userId, null);
  return {};
};

export const refresh = async (data) => {
  let decoded;
  try {
    decoded = verifyJwt(data.refreshToken);
  } catch (err) {
    throw new NotRefreshTokenError("유효하지 않은 리프레시 토큰입니다.");
  }

  if (decoded.payload.type !== "RT") {
    throw new NotRefreshTokenError("유효하지 않은 리프레시 토큰입니다.");
  }

  const user = await getUserRefresh({ refreshToken: data.refreshToken });
  if (user === null) {
    throw new NotRefreshTokenError("유효하지 않은 리프레시 토큰입니다.");
  }

  const accessToken = createJwt({ userId: user.id, type: "AT" });
  const refreshToken = createJwt({ userId: user.id, type: "RT" });
  await updateUserRefresh(user.id, refreshToken);

  const auth = {
    id: user.id,
    accessToken,
    refreshToken,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  return responseFromAuth({ auth });
};
