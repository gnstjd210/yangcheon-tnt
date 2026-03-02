import { getFacilities } from "@/app/actions/facility";
import FacilitySection from "@/components/about/FacilitySection";

export const dynamic = "force-dynamic";

export default async function FacilityPage() {
    const facilities = await getFacilities("TSA");

    return (
        <div className="w-full bg-white py-12 md:py-20 animate-fade-in">
            {/* Page Header */}
            <div className="text-center mb-16 px-4">
                <span className="text-red-800 font-bold tracking-widest text-sm uppercase mb-3 block">
                    Introduction of the Facility
                </span>
                <h1 className="text-3xl md:text-4xl font-black text-navy-900 tracking-tight">
                    시설 소개
                </h1>
                <div className="w-12 h-1 bg-red-800 mx-auto mt-6"></div>
            </div>

            {/* Facilities List */}
            <div className="w-full">
                {facilities.length > 0 ? (
                    facilities.map((facility) => (
                        <FacilitySection key={facility.id} facility={facility} />
                    ))
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        등록된 시설 정보가 없습니다. 관리자 페이지에서 시설을 추가해주세요.
                    </div>
                )}
            </div>
        </div>
    );
}
