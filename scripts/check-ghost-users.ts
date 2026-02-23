import prisma from "../lib/prisma";

async function main() {
  console.log("Checking for ghost users...");
  const ghostUsers = await prisma.user.findMany({
    where: { category: null }
  });
  console.log(`Found ${ghostUsers.length} ghost users with no category.`);
  if (ghostUsers.length > 0) {
    console.log("Ghost users:", ghostUsers);
  }

  console.log("\nChecking Registrations...");
  const regs = await prisma.registration.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log("Latest 5 registrations:", regs);

  const users = await prisma.user.findMany({
    where: { name: { in: regs.map(r => r.name) } }
  });
  console.log("Users matching latest registrations:", users);
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  });
