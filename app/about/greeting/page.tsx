import Image from "next/image";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GreetingPage() {
    const greeting = await prisma.greeting.findFirst({
        where: { isVisible: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="max-w-6xl mx-auto py-8 md:py-16">
            <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start">
                {/* Left: Large Vertical Image (Strict 3:4 aspect ratio from cropper) */}
                <div className="w-full md:w-[45%] lg:w-1/2 relative aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100 shrink-0 shadow-lg">
                    {greeting?.imageUrl ? (
                        <Image
                            src={greeting.imageUrl}
                            alt="Greeting Profile"
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            이미지 준비중
                        </div>
                    )}
                </div>

                {/* Right: Majestic Text */}
                <div className="w-full md:w-[55%] lg:w-1/2 flex flex-col pt-4 md:pt-0">
                    <h2 className="text-3xl md:text-[2.5rem] font-black text-navy-900 mb-8 md:mb-12 leading-[1.3] whitespace-pre-wrap tracking-tight md:-mt-2">
                        {greeting?.title || "인사말 제목이 없습니다."}
                    </h2>
                    <div className="text-base md:text-lg text-gray-700 whitespace-pre-wrap leading-loose font-medium tracking-wide">
                        {greeting?.content || "인사말 내용이 없습니다."}
                    </div>
                </div>
            </div>
        </div>
    );
}
