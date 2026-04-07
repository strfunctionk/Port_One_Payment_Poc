import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = [
    { name: "리포트 생성권 1개", price: 4900, creditAmount: 1 },
    { name: "리포트 생성권 3개", price: 9900, creditAmount: 3 },
  ];

  for (const product of products) {
    await prisma.ticketProduct.upsert({
      where: { id: products.indexOf(product) + 1 },
      update: {},
      create: product,
    });
  }

  console.log("Ticket products seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
