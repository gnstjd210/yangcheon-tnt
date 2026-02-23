import { getGalleryPostById } from "@/app/actions/gallery";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ImageIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdultGalleryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await getGalleryPostById(id);

    if (!post || post.type !== "ADULT") {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-16">
            <Link
                href="/program/adult/gallery"
                className="inline-flex items-center gap-2 text-sky-600 font-bold mb-8 hover:text-sky-700 transition"
            >
                <ArrowLeft size={20} />
                목록으로 돌아가기
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 md:p-12 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-sky-50 text-sky-600 font-bold px-3 py-1 rounded-full text-sm">
                            {post.category || "일반"}
                        </span>
                        <span className="text-gray-400 text-sm">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-navy-900 leading-tight">
                        {post.title}
                    </h1>
                </div>

                <div className="p-8 md:p-12">
                    {post.content && (
                        <div className="text-gray-700 text-lg leading-relaxed mb-12 whitespace-pre-wrap">
                            {post.content}
                        </div>
                    )}

                    {post.images.length > 0 && (
                        <div className="space-y-6">
                            <h3 className="font-bold flex items-center gap-2 text-gray-500 border-b pb-2">
                                <ImageIcon size={20} />
                                첨부 이미지 ({post.images.length}장)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {post.images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-auto hover:opacity-95 transition-opacity">
                                        <Image
                                            src={img}
                                            alt={`Attached image ${idx + 1}`}
                                            width={800}
                                            height={800}
                                            className="rounded-xl w-full h-auto object-cover border border-gray-100"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
