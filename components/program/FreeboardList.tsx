"use client";

import Link from "next/link";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

type GalleryPost = {
    id: string;
    category: string;
    title: string | null;
    createdAt: Date;
    images: string[];
};

interface FreeboardListProps {
    initialPosts: GalleryPost[];
    basePath: string;
    filters?: { key: string; label: string }[];
}

export default function FreeboardList({ initialPosts, basePath, filters }: FreeboardListProps) {
    const [selectedCategory, setSelectedCategory] = useState("ALL");

    const filteredPosts = selectedCategory === "ALL"
        ? initialPosts
        : initialPosts.filter(post => post.category === selectedCategory);

    return (
        <div className="w-full">
            {/* Filter Tabs (TNTW) */}
            {filters && filters.length > 0 && (
                <div className="flex justify-center gap-2 mb-8">
                    {filters.map(filter => (
                        <button
                            key={filter.key}
                            onClick={() => setSelectedCategory(filter.key)}
                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${selectedCategory === filter.key
                                    ? "bg-navy-900 text-white shadow-lg"
                                    : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            )}

            {/* List Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 py-4 border-b-2 border-navy-900 text-center font-bold text-gray-700">
                <div className="col-span-1">번호</div>
                <div className="col-span-2">분류</div>
                <div className="col-span-6 text-left pl-4">제목</div>
                <div className="col-span-1">첨부</div>
                <div className="col-span-2">등록일</div>
            </div>

            {/* List Body */}
            <div className="flex flex-col">
                {filteredPosts.length === 0 ? (
                    <div className="py-24 text-center text-gray-400 border-b border-gray-200">
                        등록된 게시물이 없습니다.
                    </div>
                ) : (
                    filteredPosts.map((post, index) => (
                        <Link
                            href={`${basePath}/${post.id}`}
                            key={post.id}
                            className="group grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 py-4 border-b border-gray-200 hover:bg-gray-50 transition items-center text-center text-sm md:text-base"
                        >
                            {/* Mobile Layout */}
                            <div className="md:hidden flex flex-col items-start px-4 w-full">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                                        {post.category || "일반"}
                                    </span>
                                    {post.images.length > 0 && <ImageIcon size={14} className="text-gray-400" />}
                                </div>
                                <div className="text-left font-bold text-navy-900 line-clamp-1 group-hover:text-sky-600 transition">
                                    {post.title || "제목 없음"}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden md:block col-span-1 text-gray-500">
                                {filteredPosts.length - index}
                            </div>
                            <div className="hidden md:block col-span-2">
                                <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
                                    {post.category || "일반"}
                                </span>
                            </div>
                            <div className="hidden md:block col-span-6 text-left pl-4 font-bold text-navy-900 group-hover:text-sky-600 transition truncate">
                                {post.title || "제목 없음"}
                            </div>
                            <div className="hidden md:flex col-span-1 justify-center shrink-0">
                                {post.images.length > 0 && (
                                    <span className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        <ImageIcon size={12} /> {post.images.length}
                                    </span>
                                )}
                            </div>
                            <div className="hidden md:block col-span-2 text-gray-500 text-sm">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
