import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testTypo() {
    console.log("Injecting typo test data...");

    // Direct Prisma Query
    await prisma.programData.upsert({
        where: { path: "/program/tntw/intro" },
        update: {
            title: "TNT W 오타테스트",
            subtitle: "오타 테스트 서브타이틀",
            description: "이것은 오타 테스트 설명입니다. 실시간 반영을 확인합니다."
        },
        create: {
            path: "/program/tntw/intro",
            title: "TNT W 오타테스트",
            subtitle: "오타 테스트 서브타이틀",
            description: "이것은 오타 테스트 설명입니다. 실시간 반영을 확인합니다."
        }
    });

    console.log("Upsert successful in DB.");

    console.log("Sleeping to let Next.js revalidate or refresh...");
    await new Promise(r => setTimeout(r, 2000));

    console.log("Fetching the public page...");
    // cache: no-store to ensure we bypass Next caching for test
    const html = await fetch("http://localhost:3008/program/tntw/intro", { cache: "no-store" }).then(r => r.text());

    if (html.includes("TNT W 오타테스트")) {
        console.log("✅ SUCCESS: 'TNT W 오타테스트' found in the rendered HTML!");
    } else {
        console.log("❌ FAILED: Could not find the test title in HTML.");
    }

    if (html.includes("이것은 오타 테스트 설명입니다")) {
        console.log("✅ SUCCESS: '이것은 오타 테스트 설명입니다' found in the rendered HTML!");
    } else {
        console.log("❌ FAILED: Could not find the test description in HTML.");
    }

    await prisma.$disconnect();
}

testTypo().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
