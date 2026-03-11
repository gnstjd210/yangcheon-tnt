import CustomPageHeader from "@/components/layout/CustomPageHeader";
import SubMenuTabs from "@/components/layout/SubMenuTabs";

const TAB_ITEMS = [
    { label: "레슨 후기", href: "/community/reviews" },
    { label: "자유게시판", href: "/community/freeboard" },
];

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <CustomPageHeader
                pageKey="community"
                fallbackTitle="COMMUNITY"
                fallbackSubtitle="소통과 나눔의 공간"
            />
            <SubMenuTabs
                items={TAB_ITEMS}
                linkClassName="py-4 text-base md:text-lg font-bold border-b-[3px] transition-all px-2"
            />
            <main className="flex-1 container mx-auto px-4 py-16 max-w-5xl">
                {children}
            </main>
        </div>
    );
}
