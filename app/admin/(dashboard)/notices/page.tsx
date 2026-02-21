import { getNotices } from "@/app/actions/notice-admin";
import NoticeManager from "@/components/admin/NoticeManager";

export const dynamic = "force-dynamic";

export default async function AdminNoticePage() {
    const notices = await getNotices();

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <NoticeManager initialNotices={notices} />
        </div>
    );
}
