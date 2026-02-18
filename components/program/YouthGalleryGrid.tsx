"use client";

import { useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";

type GalleryImage = {
    id: string;
    imageUrl: string;
    title: string | null;
    day: string;
};

const DAYS = [
    { key: "All", label: "전체" },
    { key: "Mon", label: "월요일" },
    { key: "Tue", label: "화요일" },
    { key: "Wed", label: "수요일" },
    { key: "Thu", label: "목요일" },
    { key: "Fri", label: "금요일" },
    { key: "Sat", label: "토요일" },
    { key: "Sun", label: "일요일" },
];

export default function YouthGalleryGrid({ initialImages }: { initialImages: GalleryImage[] }) {
    const [activeDay, setActiveDay] = useState("All");

    const filteredImages = initialImages.filter(
        (img) => activeDay === "All" || img.day === activeDay
    );

    return (
        <div className="w-full">
            {/* Day Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
                {DAYS.map((day) => (
                    <button
                        key={day.key}
                        onClick={() => setActiveDay(day.key)}
                        className={clsx(
                            "px-6 py-3 rounded-full font-bold text-sm md:text-base transition-all",
                            activeDay === day.key
                                ? "bg-navy-900 text-white shadow-lg scale-105"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        )}
                    >
                        {day.label}
                    </button>
                ))}
            </div>

            {/* Image Grid */}
            {filteredImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredImages.map((image) => (
                        <div key={image.id} className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                            <Image
                                src={image.imageUrl}
                                alt={image.title || "Gallery Image"}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white font-bold text-lg">{image.title}</p>
                            </div>
                            <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-navy-900 shadow-sm">
                                {DAYS.find(d => d.key === image.day)?.label || image.day}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-gray-400 font-medium text-lg">
                        등록된 사진이 없습니다.
                    </p>
                </div>
            )}
        </div>
    );
}
