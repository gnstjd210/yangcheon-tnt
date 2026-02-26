import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const facilities = [
        {
            title: "풋살장",
            description: "최고급 친환경 인조잔디를 사용하고 있으며, 넓고 쾌적한 공간에서 풋살을 즐기실 수 있습니다.",
            order: 1,
        },
        {
            title: "퍼포먼스센터",
            description: "전문적인 피지컬 트레이닝을 위한 최신식 웨이트 머신과 유산소 기구가 완비되어 있습니다.",
            order: 2,
        },
        {
            title: "샌드트레이닝",
            description: "모래사장에서 진행되는 특수 훈련을 통해 근력과 민첩성을 극대화할 수 있는 전용 샌드트레이닝 장입니다.",
            order: 3,
        },
        {
            title: "샤워실",
            description: "단독으로 탈의 및 샤워를 진행할 수 있는 프라이빗한 공간으로 헤어드라이어 등 편의물품이 구비되어 있습니다.",
            order: 4,
        },
    ];

    for (const f of facilities) {
        await prisma.facility.create({
            data: f
        });
    }

    console.log("Facilities seeded.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
