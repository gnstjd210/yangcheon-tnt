import Image from "next/image";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GreetingPage() {
    const greeting = await prisma.greeting.findFirst({
        where: { isVisible: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-start">
                {/* Left: Large Vertical Image */}
                <div className="w-full md:w-1/2 relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                    {greeting?.imageUrl ? (
                        <Image
                            src={greeting.imageUrl}
                            alt="Greeting"
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            이미지 준비중
                        </div>
                    )}
                </div>

                {/* Right: Majestic Text */}
                <div className="w-full md:w-1/2 pt-8 md:pt-12">
                    <h2 className="text-3xl md:text-5xl font-black text-navy-900 mb-8 leading-tight">
                        {greeting?.title || "인사말 제목이 없습니다."}
                    </h2>
                    <div className="w-20 h-1 bg-sky-500 mb-10"></div>
                    <div className="prose prose-lg text-gray-600 whitespace-pre-wrap leading-loose">
                        {greeting?.content || "인사말 내용이 없습니다."}
                    </div>
                </div>
            </div>
        </div>
    );
}
