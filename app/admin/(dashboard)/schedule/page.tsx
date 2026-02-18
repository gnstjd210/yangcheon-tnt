import { getSchedules } from "@/app/actions/schedule";
import ScheduleManager from "@/components/admin/ScheduleManager";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
    const schedules = await getSchedules();
    return <ScheduleManager initialSchedules={schedules} />;
}
