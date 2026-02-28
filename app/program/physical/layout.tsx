"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const TAB_ITEMS = [
    { label: "프로그램 소개", href: "/program/physical/intro" },
    { label: "시설 안내", href: "/program/physical/facility" },
    { label: "상담 절차", href: "/program/physical/process" },
];

export default function PhysicalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="w-full bg-white flex flex-col min-h-screen">
            {/* Visual Header (Navy 48h Slim Design) */}
            <div className="bg-white pt-4 pb-0">
                <div className="relative h-48 max-w-[1920px] mx-auto md:w-[95%] bg-navy-900 flex items-center justify-center overflow-hidden rounded-3xl mx-4">
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2000&auto=format&fit=crop"
                        alt="Physical Training Background"
                        fill
                        className="object-cover opacity-50"
                        priority
                        unoptimized
                    />
                    <div className="relative z-20 text-center">
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
                            PHYSICAL TRAINING
                        </h1>
                        <p className="text-sky-400 font-bold tracking-widest text-sm md:text-base border-t border-white/20 inline-block px-12 pt-2">
                            피지컬 트레이닝
                        </p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation (Underline Style matching Support Layout) */}
            <div className="border-b border-gray-200 bg-white sticky top-[90px] xl:top-[120px] z-30 shadow-sm mt-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center gap-8 md:gap-16">
                        {TAB_ITEMS.map((item) => {
                            const isActive = (pathname || '').startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`py-4 text-base md:text-lg font-bold border-b-[3px] transition-all px-2 whitespace-nowrap ${isActive
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

            <main className="flex-1 w-full relative">
                {children}
            </main>
        </div>
    );
}
