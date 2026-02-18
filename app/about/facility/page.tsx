import Image from "next/image";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FacilityPage() {
    const facilities = await prisma.facility.findMany({
        orderBy: { order: "asc" },
    });

    return (
        <div className="max-w-6xl mx-auto space-y-24">
            {facilities.map((facility, index) => (
                <div
                    key={facility.id}
                    className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""
                        }`}
                >
                    {/* Image Side */}
                    <div className="w-full md:w-1/2 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                        {facility.imageUrl ? (
                            <Image
                                src={facility.imageUrl}
                                alt={facility.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                이미지 준비중
                            </div>
                        )}
                    </div>

                    {/* Text Side */}
                    <div className="w-full md:w-1/2">
                        <div className="w-16 h-1 bg-sky-500 mb-6"></div>
                        <h2 className="text-3xl md:text-4xl font-black text-navy-900 mb-6">
                            {facility.title}
                        </h2>
                        <div className="prose prose-lg text-gray-600 whitespace-pre-wrap leading-relaxed">
                            {facility.content}
                        </div>
                    </div>
                </div>
            ))}

            {facilities.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    등록된 시설 정보가 없습니다.
                </div>
            )}
        </div>
    );
}
