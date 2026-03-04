import { Metadata } from "next";
import AdultClassCardManager from "@/components/admin/AdultClassCardManager";

export const metadata: Metadata = {
    title: "성인 커리큘럼 카드 관리 - 양천TNT 관리자",
};

export default function AdultClassesAdminPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-navy-900">성인 커리큘럼 카드 관리</h1>
                <p className="text-gray-500 mt-1">성인 트레이닝 소개 페이지의 그룹레슨 3종 카드를 관리합니다.</p>
            </div>

            <AdultClassCardManager />
        </div>
    );
}
