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
                <div className="w-full md:w-1/2 relative aspect-[4/5] md:aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100">
                    {greeting?.imageUrl ? (
                        <Image
                            src={greeting.imageUrl}
                            alt="Greeting"
                            fill
                            className="object-cover object-top"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            이미지 준비중
                        </div>
                    )}
                </div>

                {/* Right: Majestic Text */}
                <div className="w-full md:w-1/2 pt-4 md:pt-20 flex flex-col justify-center">
                    <h2 className="text-3xl md:text-4xl font-black text-navy-900 mb-12 leading-snug whitespace-pre-wrap shrink-0">
                        {greeting?.title || "인사말 제목이 없습니다."}
                    </h2>
                    <div className="text-base md:text-lg text-gray-700 whitespace-pre-wrap leading-[2] font-medium tracking-wide">
                        {greeting?.content || "인사말 내용이 없습니다."}
                    </div>
                </div>
            </div>
        </div>
    );
}
