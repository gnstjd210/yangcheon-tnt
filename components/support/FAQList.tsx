"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

type FAQ = {
    id: string;
    question: string;
    answer: string;
    category: string;
};

// Recommended searches
const RECOMMENDATIONS = ["레슨비", "준비물", "주차", "셔틀", "환불"];

export default function FAQList({ initialFAQs }: { initialFAQs: FAQ[] }) {
    const [query, setQuery] = useState("");
    const [openId, setOpenId] = useState<string | null>(null);

    const filteredFAQs = initialFAQs.filter(faq =>
        faq.question.includes(query) || faq.answer.includes(query)
    );

    return (
        <div className="space-y-12">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-2xl font-bold text-navy-900 mb-6">자주 묻는 질문</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="궁금한 내용을 검색해보세요 (예: 입단비, 시간표)"
                        className="w-full px-6 py-4 rounded-full border-2 border-navy-900/10 focus:border-navy-900 focus:outline-none focus:shadow-lg transition text-lg bg-gray-50 focus:bg-white pl-14"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                </div>
                {/* Recommendations */}
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {RECOMMENDATIONS.map((rec) => (
                        <button
                            key={rec}
                            onClick={() => setQuery(rec)}
                            className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500 font-bold hover:bg-sky-100 hover:text-sky-600 transition"
                        >
                            #{rec}
                        </button>
                    ))}
                </div>
            </div>

            {/* Accordion List */}
            <div className="space-y-4">
                {filteredFAQs.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 border border-dashed rounded-xl">
                        검색 결과가 없습니다.
                    </div>
                ) : (
                    filteredFAQs.map((faq) => (
                        <div key={faq.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                            <button
                                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                                className="w-full flex justify-between items-center p-6 text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-sky-500 font-black text-xl">Q.</span>
                                    <span className="font-bold text-navy-900 text-lg">{faq.question}</span>
                                </div>
                                {openId === faq.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                            </button>
                            {openId === faq.id && (
                                <div className="bg-gray-50 p-6 pt-0 pl-16 pr-8 pb-8 text-gray-600 leading-relaxed border-t border-gray-50">
                                    <div className="mb-2 text-rose-500 font-black text-xl">A.</div>
                                    <div className="whitespace-pre-wrap">{faq.answer}</div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
