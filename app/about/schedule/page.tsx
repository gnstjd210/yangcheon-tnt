import prisma from "@/lib/prisma";
import ScheduleViewer from "@/components/about/ScheduleViewer";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
    const schedules = await prisma.schedule.findMany();

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-navy-900 mb-4">MONTHLY SCHEDULE</h2>
                <p className="text-gray-500">
                    양천 TNT 스포츠 아카데미의 정규 수업 일정입니다.
                </p>
            </div>

            <div className="overflow-x-auto pb-8">
                <div className="min-w-[1000px]">
                    <ScheduleViewer schedules={schedules} />
                </div>
            </div>

            <div className="mt-8 text-center bg-gray-50 p-6 rounded-xl text-gray-600 text-sm">
                * 사정에 따라 스케줄이 변경될 수 있습니다. 자세한 문의는 전화로 부탁드립니다.
            </div>
        </div>
    );
}
