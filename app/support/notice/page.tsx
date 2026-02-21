import { getNotices } from "@/app/actions/support";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function NoticesPage() {
    const notices = await getNotices();

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-6">공지사항</h2>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="grid grid-cols-12 bg-gray-50 p-4 text-xs font-bold text-gray-500 border-b border-gray-100 items-center">
                    <div className="col-span-2 text-center">작성자</div>
                    <div className="col-span-8">제목</div>
                    <div className="col-span-2 text-center">등록일</div>
                </div>
                <div className="divide-y divide-gray-50">
                    {notices.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            등록된 공지사항이 없습니다.
                        </div>
                    ) : (
                        notices.map((notice) => (
                            <div key={notice.id} className="grid grid-cols-12 p-4 text-sm hover:bg-gray-50 transition cursor-pointer group items-center">
                                <div className="col-span-2 text-center text-gray-500">{notice.author}</div>
                                <div className="col-span-8 font-bold text-navy-900 group-hover:text-rose-600 truncate pr-4">
                                    {notice.title}
                                </div>
                                <div className="col-span-2 text-center text-gray-400 text-xs text-center">
                                    {format(new Date(notice.createdAt), "yyyy.MM.dd")}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
