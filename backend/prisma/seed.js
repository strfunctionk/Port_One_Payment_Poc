import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("test_1234!!", 12);

  await prisma.user.upsert({
    where: { email: "user1@exam.com" },
    update: {},
    create: {
      email: "user1@exam.com",
      name: "테스트 유저",
      username: "testuser",
      password: hashedPassword,
    },
  });

  console.log("Seed complete: user1@exam.com / test_1234!!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
