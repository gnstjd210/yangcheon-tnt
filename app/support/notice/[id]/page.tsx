import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;

    const notice = await prisma.notice.findUnique({
        where: { id: resolvedParams.id }
    });

    if (!notice) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/support/notice" className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-navy-900">
                    <ArrowLeft size={24} />
                </Link>
                <h2 className="text-2xl font-bold text-navy-900">공지사항 상세</h2>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-8">
                <div className="border-b border-gray-200 pb-6 mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-navy-900 mb-4">{notice.title}</h1>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="font-bold">{notice.author}</span>
                        <span>{format(new Date(notice.createdAt), "yyyy.MM.dd")}</span>
                    </div>
                </div>

                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                    {notice.content}
                </div>
            </div>
            <div className="flex justify-center mt-8">
                <Link href="/support/notice" className="px-8 py-3 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition shadow-lg">
                    목록으로 돌아가기
                </Link>
            </div>
        </div>
    );
}
