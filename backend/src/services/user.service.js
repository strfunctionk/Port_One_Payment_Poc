import { responseFromUser } from "../dtos/user.dto.js";
import { getUser } from "../repositories/user.repository.js";
import { NotFoundError } from "../errors/auth.error.js";

export const userProfile = async (userId) => {
  const user = await getUser(userId);
  if (!user) {
    throw new NotFoundError("유저를 찾을 수 없습니다.");
  }
  return responseFromUser({ user });
};
