import Image from "next/image";
import prisma from "@/lib/prisma";
import { Bus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ShuttlePage() {
    const shuttles = await prisma.shuttle.findMany({
        orderBy: { createdAt: "asc" },
    });

    return (
        <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-black text-navy-900 mb-4">SHUTTLE BUS</h2>
                <p className="text-gray-500">
                    안전하고 편리한 셔틀버스 운행 정보를 안내해드립니다.
                </p>
            </div>

            {shuttles.map((shuttle) => (
                <div key={shuttle.id} className="flex flex-col md:flex-row gap-8 md:gap-12 bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                    {/* Image (Route Map) */}
                    <div className="w-full md:w-5/12 relative min-h-[300px] bg-gray-100 border-r border-gray-100">
                        {shuttle.imageUrl ? (
                            <Image
                                src={shuttle.imageUrl}
                                alt={shuttle.title}
                                fill
                                className="object-contain p-4"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                노선도 준비중
                            </div>
                        )}
                        <div className="absolute top-0 left-0 bg-navy-900 text-white px-6 py-3 rounded-br-2xl font-bold flex items-center gap-2">
                            <Bus size={20} />
                            {shuttle.title}
                        </div>
                    </div>

                    {/* Content (Route Text) */}
                    <div className="flex-1 p-8 md:p-12">
                        <h3 className="text-2xl font-bold text-navy-900 mb-6 border-b border-gray-100 pb-4">
                            주요 경유지 및 시간
                        </h3>
                        <div className="prose prose-lg text-gray-600 whitespace-pre-wrap leading-loose">
                            {shuttle.content || "운행 정보가 없습니다."}
                        </div>
                    </div>
                </div>
            ))}

            {shuttles.length === 0 && (
                <div className="text-center py-20 text-gray-400 bg-gray-50 rounded-3xl">
                    등록된 셔틀버스 운행 정보가 없습니다.
                </div>
            )}

            <div className="bg-sky-50 p-8 rounded-2xl text-center border-2 border-sky-100 border-dashed">
                <p className="font-bold text-navy-900 text-lg mb-2">셔틀버스 이용 문의</p>
                <p className="text-gray-600">
                    차량 운행 시간과 노선은 교통 상황에 따라 변동될 수 있습니다. <br />
                    정확한 시간은 담당 기사님께 문의해주세요.
                </p>
            </div>
        </div>
    );
}
