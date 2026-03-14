import { prisma } from "../configs/db.config.js";

export const addUser = async (data) => {
  return prisma.user.create({ data });
};

export const getUser = async (userId) => {
  return prisma.user.findUnique({ where: { id: userId } });
};
