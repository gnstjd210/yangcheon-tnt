"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface GreetingData {
    id: string;
    role: string;
    title: string;
    content: string;
    imageUrl: string | null;
    isVisible: boolean;
}

export default function GreetingTabs({ greetings }: { greetings: GreetingData[] }) {
    const [activeTab, setActiveTab] = useState<"PRESIDENT" | "CEO">("PRESIDENT");

    // Find the current active greeting data
    // Fallback order ensures if one is missing, it won't crash
    const currentData =
        greetings.find((g) => g.role === activeTab) ||
        greetings.find((g) => g.role === (activeTab === "PRESIDENT" ? "CEO" : "PRESIDENT")) ||
        null;

    return (
        <div className="max-w-6xl mx-auto py-8 md:py-16">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-10 md:mb-16 px-4">
                <div className="flex bg-gray-100 rounded-full p-1.5 shadow-inner max-w-sm w-full">
                    <button
                        onClick={() => setActiveTab("PRESIDENT")}
                        className={`flex-1 py-3 text-center font-bold text-[15px] sm:text-base rounded-full transition-all duration-300 ${activeTab === "PRESIDENT"
                            ? "bg-navy-900 text-white shadow-md transform scale-100"
                            : "text-gray-500 hover:text-navy-900 hover:bg-white/50"
                            }`}
                    >
                        대표이사 김진국
                    </button>
                    <button
                        onClick={() => setActiveTab("CEO")}
                        className={`flex-1 py-3 text-center font-bold text-[15px] sm:text-base rounded-full transition-all duration-300 ${activeTab === "CEO"
                            ? "bg-navy-900 text-white shadow-md transform scale-100"
                            : "text-gray-500 hover:text-navy-900 hover:bg-white/50"
                            }`}
                    >
                        대표 김훈성
                    </button>
                </div>
            </div>

            {/* Content Area with AnimatePresence for smooth exit/enter */}
            <div className="relative min-h-[600px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab} // Using activeTab as key triggers unmount/mount animations
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="flex flex-col md:flex-row gap-12 md:gap-20 items-start w-full"
                    >
                        {/* Left: Standard Image Size (matching TNTW) */}
                        <div className="w-full md:w-1/2 relative min-h-[400px] rounded-3xl overflow-hidden bg-gray-100 shadow-2xl">
                            {currentData?.imageUrl ? (
                                <Image
                                    src={currentData.imageUrl}
                                    alt="Greeting Profile"
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 font-medium">
                                    이미지 준비중
                                </div>
                            )}
                        </div>

                        {/* Right: Majestic Text */}
                        <div className="w-full md:w-[55%] lg:w-1/2 flex flex-col pt-4 md:pt-0">
                            <h2 className="text-3xl md:text-[2.5rem] font-black text-navy-900 mb-8 md:mb-12 leading-[1.3] whitespace-pre-wrap tracking-tight md:-mt-2">
                                {currentData?.title || "인사말 제목이 없습니다."}
                            </h2>
                            <div className="text-base md:text-lg text-gray-700 whitespace-pre-wrap leading-loose font-medium tracking-wide">
                                {currentData?.content || "인사말 내용이 없습니다."}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
