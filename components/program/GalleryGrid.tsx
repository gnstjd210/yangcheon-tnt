"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type GalleryPost = {
    id: string;
    category: string;
    title: string | null;
    images: string[];
    createdAt: Date;
};

const DAY_LABELS: Record<string, string> = {
    "All": "전체",
    "Mon": "월요일",
    "Tue": "화요일",
    "Wed": "수요일",
    "Thu": "목요일",
    "Fri": "금요일",
    "Sat": "토요일",
    "Sun": "일요일"
};

const defaultFilters = ["All", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function GalleryGrid({ initialPosts, filters = defaultFilters }: { initialPosts: GalleryPost[], filters?: string[] }) {
    const [selectedFilter, setSelectedFilter] = useState("All");

    // Client-side filtering
    const filteredPosts = selectedFilter === "All"
        ? initialPosts
        : initialPosts.filter(post => post.category === selectedFilter);

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
                        {DAY_LABELS[filter] || filter}
                    </button>
                ))}
            </div>

            {/* Image Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
                <AnimatePresence>
                    {filteredPosts.map((post) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={post.id}
                            className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow"
                        >
                            <Image
                                src={post.images[0] || ""}
                                alt={post.title || "Gallery Image"}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white font-bold">{DAY_LABELS[post.category] || post.category}</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredPosts.length === 0 && (
                <div className="text-center py-24 text-gray-400">
                    등록된 사진이 없습니다.
                </div>
            )}
        </div>
    );
}
