"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type GalleryImage = {
    id: string;
    imageUrl: string;
    title: string | null;
    category: string;
    day: string;
    createdAt: Date;
};

const defaultFilters = ["All", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function GalleryGrid({ initialImages, filters = defaultFilters, filterType = "day" }: { initialImages: GalleryImage[], filters?: string[], filterType?: "day" | "category" | "team" }) {
    const [selectedFilter, setSelectedFilter] = useState("All");

    // Client-side filtering
    const filteredImages = selectedFilter === "All"
        ? initialImages
        : initialImages.filter(img => {
            if (filterType === "day") return img.day === selectedFilter;
            // For TNTW, we might use 'day' field to store 'Futsal'/'Soccer' or add a new field.
            // Let's assume we reuse 'day' field for now as a generic 'tag' for simplicity in this component,
            // or we updated schema to have 'team'.
            // If we use 'day' column for 'Futsal'/'Soccer' storage for TNTW images:
            return img.day === selectedFilter;
        });

    return (
        <div>
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${selectedFilter === filter
                            ? "bg-navy-900 text-white shadow-lg scale-105"
                            : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                            }`}
                    >
                        {filter === "All" ? "전체" : filter}
                    </button>
                ))}
            </div>

            {/* Image Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
                <AnimatePresence>
                    {filteredImages.map((image) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={image.id}
                            className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow"
                        >
                            <Image
                                src={image.imageUrl}
                                alt={image.title || "Gallery Image"}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white font-bold">{image.day}</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredImages.length === 0 && (
                <div className="text-center py-24 text-gray-400">
                    등록된 사진이 없습니다.
                </div>
            )}
        </div>
    );
}
