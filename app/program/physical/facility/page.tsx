import { getFacilities } from "@/app/actions/facility";
import FacilitySection from "@/components/about/FacilitySection";
import { Facility } from "@prisma/client";

export const dynamic = "force-dynamic";

const DUMMY_FACILITIES: Facility[] = [
    {
        id: "dummy-1",
        title: "TSA 피지컬 트레이닝 메인 치료실",
        description: "최첨단 체형 평가 장비와 기능성 운동 기구가 완비된 프리미엄 치료 및 트레이닝 공간입니다. 넓고 쾌적한 환경에서 프라이빗한 1:1 세션을 진행하며, 올바른 신체 밸런스를 되찾기 위한 최적의 인프라를 제공합니다.",
        image1: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2000&auto=format&fit=crop",
        image2: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop",
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];

export default async function PhysicalFacilityPage() {
    const facilities = await getFacilities();
    const displayFacilities = facilities.length > 0 ? facilities : DUMMY_FACILITIES;

    return (
        <div className="bg-gray-50 pb-20 pt-8">
            {displayFacilities.map((facility) => (
                <FacilitySection key={facility.id} facility={facility} />
            ))}
        </div>
    );
}
