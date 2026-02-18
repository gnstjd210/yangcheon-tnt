import prisma from "@/lib/prisma";
import Image from "next/image";
import { MapPin, Navigation, Car, Bus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LocationPage() {
    const location = await prisma.location.findFirst();

    const lat = location?.lat || 37.53123;
    const lng = location?.lng || 126.86314;
    const title = location?.title || "양천 TNT 스포츠 아카데미";
    const address = location?.address || "서울시 강서구 곰달래로 59길 60";

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-black text-navy-900">{title}</h2>
                <p className="text-xl text-gray-600 flex items-center justify-center gap-2">
                    <MapPin className="text-sky-500" />
                    {address}
                </p>
            </div>

            <div className="relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl bg-gray-100">
                {/* 
                  TODO: Replace with actual center image. 
                  Place your image in public/images/center-view.jpg and update src below.
                */}
                <Image
                    src="https://placehold.co/1200x600/e2e8f0/1e293b?text=YANGCHEON+TNT+SPORTS+ACADEMY"
                    alt="Center View"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Address Info */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
                        <MapPin className="text-sky-500" />
                        주소 안내
                    </h3>
                    <p className="text-lg text-gray-700 font-bold mb-2">{address}</p>
                    <p className="text-gray-500 text-sm">대일고등학교 건너편 3층</p>
                </div>

                {/* Transport Info */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
                        <Navigation className="text-sky-500" />
                        오시는 길 안내
                    </h3>
                    <div className="space-y-4 text-gray-600">
                        <div className="flex gap-3">
                            <Bus className="text-gray-400 shrink-0" size={20} />
                            <div>
                                <span className="font-bold block mb-1">버스 이용 시</span>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    6628, 6630, 6715번 탑승 후 &apos;대일고등학교&apos; 정류장 하차
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Car className="text-gray-400 shrink-0" size={20} />
                            <div>
                                <span className="font-bold block mb-1">자차 이용 시</span>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    건물 내 주차 공간이 협소하오니 가급적 대중교통을 이용해 주시기 바랍니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
