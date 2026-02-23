import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting user category migration...");

    try {
        const registrations = await prisma.registration.findMany();
        let updatedCount = 0;

        for (const reg of registrations) {
            let userCategory: string | null = null;
            let userSubCategory: string | null = null;

            // Map category based on type
            if (reg.type === "Youth") {
                userCategory = "YOUTH";
            } else if (reg.type === "Adult") {
                userCategory = "ADULT";
                if (reg.experience?.includes("남성")) userSubCategory = "남성";
                else if (reg.experience?.includes("여성")) userSubCategory = "여성";
                else if (reg.experience?.includes("혼성")) userSubCategory = "혼성";
            } else if (reg.type === "TNTW") {
                userCategory = "TNT_W";
                if (reg.team && reg.team.includes("풋살")) userSubCategory = "풋살";
                else if (reg.team && reg.team.includes("축구")) userSubCategory = "축구";
            }

            if (!userCategory) continue;

            // Find matching user(s)
            // Try exact phone first, then try with stripped hyphens just in case
            const numericPhone = reg.phone.replace(/[^0-9]/g, '');

            const matchingUsers = await prisma.user.findMany({
                where: {
                    name: reg.name,
                    OR: [
                        { phone: reg.phone },
                        { phone: { contains: numericPhone } }
                    ]
                }
            });

            for (const user of matchingUsers) {
                // If they are missing category, or have old Korean category, update them.
                if (
                    user.category !== userCategory ||
                    user.subCategory !== userSubCategory
                ) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            category: userCategory,
                            subCategory: userSubCategory
                        }
                    });
                    updatedCount++;
                    console.log(`Updated user: ${user.name} (${user.phone}) -> ${userCategory} / ${userSubCategory || "None"}`);
                }
            }
        }

        // Also directly map users with old category naming
        const directUpdates = [
            { old: "유소년트레이닝", new: "YOUTH" },
            { old: "성인트레이닝", new: "ADULT" },
            { old: "TNT W", new: "TNT_W" }
        ];

        let directCount = 0;
        for (const mapping of directUpdates) {
            const usersWithOld = await prisma.user.findMany({
                where: { category: mapping.old }
            });

            for (const u of usersWithOld) {
                await prisma.user.update({
                    where: { id: u.id },
                    data: { category: mapping.new }
                });
                directCount++;
                console.log(`Directly updated user category: ${u.name} -> ${mapping.new}`);
            }
        }

        console.log(`Migration completed successfully. Updated ${updatedCount} via registration, ${directCount} via direct mapping.`);
    } catch (error) {
        console.error("Error during migration:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
