import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Inserting [페이지 헤더 관리] into AdminMenu...');

    const existing = await prisma.adminMenu.findUnique({
        where: { href: '/admin/page-headers' }
    });

    if (existing) {
        console.log('Already exists!');
    } else {
        await prisma.adminMenu.create({
            data: {
                label: "페이지 헤더 관리",
                href: "/admin/page-headers",
                iconName: "LayoutTemplate",
                group: "기타",
                orderIndex: 14
            }
        });
        console.log('Successfully added.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
