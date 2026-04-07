import { prisma } from "../configs/db.config.js";

export const findAllActiveProducts = async () => {
  return prisma.ticketProduct.findMany({
    where: { active: true },
    orderBy: { id: "asc" },
  });
};

export const findCreditByUserId = async (userId) => {
  return prisma.memberReportCredit.findUnique({ where: { userId } });
};

export const upsertCredit = async (userId, additionalCount) => {
  return prisma.memberReportCredit.upsert({
    where: { userId },
    update: { remainingCount: { increment: additionalCount } },
    create: { userId, remainingCount: additionalCount },
  });
};
