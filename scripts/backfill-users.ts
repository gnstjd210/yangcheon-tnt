import prisma from "../lib/prisma";

async function main() {
    console.log("Backfilling missing Users from Registrations...");
    const regs = await prisma.registration.findMany({
        orderBy: { createdAt: 'asc' }
    });

    let createdCount = 0;

    for (const reg of regs) {
        // Find if user exists
        const userExists = await prisma.user.findFirst({
            where: {
                OR: [
                    { name: reg.name, phone: { contains: reg.phone.replace(/[^0-9]/g, '') } },
                    { name: reg.name, phone: reg.phone }
                ]
            }
        });

        if (!userExists) {
            let userCategory: string | null = null;
            let userSubCategory: string | null = null;

            if (reg.type === "Youth") {
                userCategory = "YOUTH";
            } else if (reg.type === "Adult") {
                userCategory = "ADULT";
                if (reg.experience?.includes("남성")) userSubCategory = "남성";
                else if (reg.experience?.includes("여성")) userSubCategory = "여성";
                else if (reg.experience?.includes("혼성")) userSubCategory = "혼성";
            } else if (reg.type === "TNTW") {
                userCategory = "TNT_W";
                if (reg.team?.includes("풋살")) userSubCategory = "풋살";
                else if (reg.team?.includes("축구")) userSubCategory = "축구";
            }

            if (userCategory) {
                const baseUsername = reg.phone ? reg.phone.replace(/[^0-9]/g, '') : `user_${Date.now()}`;
                let username = baseUsername;
                let counter = 1;

                while (await prisma.user.findUnique({ where: { username } })) {
                    username = `${baseUsername}_${counter}`;
                    counter++;
                }

                await prisma.user.create({
                    data: {
                        username,
                        password: reg.phone || "1234",
                        name: reg.name,
                        phone: reg.phone,
                        email: reg.email,
                        address: reg.address,
                        category: userCategory,
                        subCategory: userSubCategory,
                        createdAt: reg.createdAt // Preserve original registration date
                    }
                });
                createdCount++;
                console.log(`Created User for Registration: ${reg.name} (${reg.phone}) - Category: ${userCategory}`);
            }
        }
    }

    console.log(`\nBackfill complete. Created ${createdCount} new users.`);
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    });
