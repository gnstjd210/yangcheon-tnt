import CustomPageHeader from "@/components/layout/CustomPageHeader";
import SubMenuTabs from "@/components/layout/SubMenuTabs";

const TAB_ITEMS = [
    { label: "공지사항", href: "/support/notice" },
    { label: "자주 묻는 질문", href: "/support/faq" },
    { label: "문의", href: "/support/contact" },
];

export default function SupportLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <CustomPageHeader
                pageKey="support"
                fallbackTitle="CUSTOMER SUPPORT"
                fallbackSubtitle="무엇을 도와드릴까요?"
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
