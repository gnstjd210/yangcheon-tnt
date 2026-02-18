"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TAB_ITEMS = [
    { label: "공지사항", href: "/support/notice" },
    { label: "자주 묻는 질문", href: "/support/faq" },
    { label: "문의", href: "/support/contact" },
];

export default function SupportLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex flex-col">
            {/* Visual Header */}
            <div className="bg-white pt-4 pb-8">
                <div className="relative h-48 max-w-[1920px] mx-auto md:w-[95%] bg-navy-900 flex items-center justify-center overflow-hidden rounded-3xl mx-4">
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <div className="bg-gradient-to-r from-navy-900 to-green-900 absolute inset-0" />
                    <div className="relative z-20 text-center">
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                            CUSTOMER SUPPORT
                        </h1>
                        <p className="text-green-200 font-bold tracking-widest text-sm">
                            무엇을 도와드릴까요?
                        </p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation (Buttons Style as requested: 3 selection buttons) */}
            {/* Tab Navigation (Underline Style) */}
            <div className="border-b border-gray-200 bg-white sticky top-20 z-30 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center gap-8 md:gap-12">
                        {TAB_ITEMS.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`py-4 text-base md:text-lg font-bold border-b-[3px] transition-all px-2 ${isActive
                                        ? "border-navy-900 text-navy-900"
                                        : "border-transparent text-gray-400 hover:text-navy-900"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            <main className="flex-1 container mx-auto px-4 py-16 max-w-5xl">
                {children}
            </main>
        </div>
    );
}
