import CustomPageHeader from "@/components/layout/CustomPageHeader";
import SubMenuTabs from "@/components/layout/SubMenuTabs";

const TAB_ITEMS = [
    { label: "프로그램 소개", href: "/program/physical/intro" },
    { label: "시설 안내", href: "/program/physical/facility" },
    { label: "상담 절차", href: "/program/physical/process" },
];

export default function PhysicalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full bg-white flex flex-col min-h-screen">
            <CustomPageHeader
                pageKey="physical"
                fallbackTitle="PHYSICAL TRAINING"
                fallbackSubtitle="피지컬 트레이닝"
            />
            <SubMenuTabs
                items={TAB_ITEMS}
                containerClassName="border-b border-gray-200 bg-white sticky top-[90px] xl:top-[120px] z-30 shadow-sm mt-8"
                linkClassName="py-4 text-base md:text-lg font-bold border-b-[3px] transition-all px-2 whitespace-nowrap"
            />
            <main className="flex-1 w-full relative">
                {children}
            </main>
        </div>
    );
}
