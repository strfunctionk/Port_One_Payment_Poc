import {
  findAllActiveProducts,
  findCreditByUserId,
} from "../repositories/ticket.repository.js";

export const getTicketProducts = async () => {
  return findAllActiveProducts();
};

export const getMyCredits = async (userId) => {
  const credit = await findCreditByUserId(userId);
  return { remainingCount: credit?.remainingCount ?? 0 };
};
