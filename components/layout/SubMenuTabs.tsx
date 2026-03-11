"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabItem {
    label: string;
    href: string;
}

interface SubMenuTabsProps {
    items: TabItem[];
    containerClassName?: string;
    listClassName?: string;
    linkClassName?: string;
    activeLinkClassName?: string;
    inactiveLinkClassName?: string;
    exactMatch?: boolean;
}

export default function SubMenuTabs({
    items,
    containerClassName = "border-b border-gray-200 sticky top-20 z-30 bg-white shadow-sm",
    listClassName = "flex overflow-x-auto no-scrollbar justify-start md:justify-center gap-6 md:gap-10",
    linkClassName = "py-4 text-sm md:text-base font-bold whitespace-nowrap border-b-2 transition-colors px-2",
    activeLinkClassName = "border-navy-900 text-navy-900",
    inactiveLinkClassName = "border-transparent text-gray-400 hover:text-navy-900",
    exactMatch = false
}: SubMenuTabsProps) {
    const pathname = usePathname();

    return (
        <div className={containerClassName}>
            <div className="container mx-auto px-4">
                <div className={listClassName}>
                    {items.map((item) => {
                        const isActive = exactMatch
                            ? pathname === item.href
                            : (pathname || '').startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${linkClassName} ${isActive ? activeLinkClassName : inactiveLinkClassName}`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
