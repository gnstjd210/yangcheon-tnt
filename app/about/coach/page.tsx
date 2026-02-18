import prisma from "@/lib/prisma";
import CoachGrid from "@/components/about/CoachGrid";

export const dynamic = "force-dynamic";

export default async function CoachPage() {
    const coaches = await prisma.coach.findMany({
        orderBy: { order: "asc" },
    });

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-black text-navy-900 mb-4">COACHING STAFF</h2>
                <p className="text-gray-500">
                    최고의 지도진이 체계적이고 전문적인 교육을 약속드립니다.
                </p>
            </div>

            <CoachGrid coaches={coaches} />
        </div>
    );
}
