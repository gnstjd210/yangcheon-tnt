import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    try {
        console.log("Testing createNotice directly with Prisma...");
        const result = await prisma.notice.create({
            data: {
                title: "로컬 테스트 공지",
                content: "이것은 로컬 테스트용 공지사항입니다.",
                author: "관리자"
            }
        });
        console.log("Success:", result);
    } catch (error) {
        console.error("Error from Prisma create:");
        console.dir(error, { depth: null });
    } finally {
        await prisma.$disconnect()
    }
}

main();
