const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.greeting.upsert({
        where: { role: 'PRESIDENT' },
        update: {},
        create: {
            role: 'PRESIDENT',
            title: '아이들의 꿈이 실현 되는 곳\n양천 TNT 스포츠 아카데미 입니다.',
            content: '안녕하십니까, 양천 TNT 스포츠 아카데미 대표이사 김진국 입니다...\n(내용 입력 예정)',
            imageUrl: null,
            isVisible: true,
        },
    });

    await prisma.greeting.upsert({
        where: { role: 'CEO' },
        update: {},
        create: {
            role: 'CEO',
            title: '최고의 시설과 지도진으로\n여러분을 맞이하겠습니다.',
            content: '안녕하세요, 양천 TNT 대표 김훈성입니다...\n(내용 입력 예정)',
            imageUrl: null,
            isVisible: true,
        },
    });

    console.log('Seeding tabbed greetings complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
