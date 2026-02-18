"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { label: "인사말", href: "/about/greeting" },
    { label: "코치진 소개", href: "/about/coach" },
    { label: "시설 안내", href: "/about/facility" },
    { label: "오시는 길", href: "/about/location" },
    { label: "월간 시간표", href: "/about/schedule" },
    { label: "셔틀버스", href: "/about/shuttle" },
];

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex flex-col">
            {/* Visual Sub Header - Redesigned (Compact & Rounded) */}
            <div className="bg-white pt-4 pb-8"> {/* Container for visual separation */}
                <div className="relative h-48 max-w-[1920px] mx-auto md:w-[95%] bg-navy-900 flex items-center justify-center overflow-hidden rounded-3xl mx-4">
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    {/* Placeholder for a sub-header banner image */}
                    <div className="bg-gradient-to-r from-navy-900 to-sky-900 absolute inset-0" />

                    <div className="relative z-20 text-center">
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                            TSA 소개
                        </h1>
                        <p className="text-gray-300 font-medium text-sm">
                            Yangcheon TNT Sports Academy
                        </p>
                    </div>
                </div>
            </div>

            {/* Sub Navigation */}
            <div className="border-b border-gray-200 sticky top-20 z-30 bg-white shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex overflow-x-auto no-scrollbar justify-start md:justify-center gap-6 md:gap-10">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`py-5 text-sm md:text-base font-bold whitespace-nowrap border-b-2 transition-colors ${isActive
                                        ? "border-navy-900 text-navy-900"
                                        : "border-transparent text-gray-500 hover:text-navy-900"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            <main className="flex-1 container mx-auto px-4 py-16">
                {children}
            </main>
        </div>
    );
}
