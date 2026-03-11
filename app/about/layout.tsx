import CustomPageHeader from "@/components/layout/CustomPageHeader";
import SubMenuTabs from "@/components/layout/SubMenuTabs";

const NAV_ITEMS = [
    { label: "인사말", href: "/about/greeting" },
    { label: "코치진", href: "/about/coach" },
    { label: "시설", href: "/about/facility" },
    { label: "오시는 길", href: "/about/location" },
    { label: "셔틀버스", href: "/about/shuttle" },
];

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <CustomPageHeader
                pageKey="about"
                fallbackTitle="TSA 소개"
                fallbackSubtitle="Yangcheon TNT Sports Academy"
            />

            <SubMenuTabs
                items={NAV_ITEMS}
                exactMatch={true}
            />

            <main className="flex-1 container mx-auto px-4 py-16">
                {children}
            </main>
        </div>
    );
}
