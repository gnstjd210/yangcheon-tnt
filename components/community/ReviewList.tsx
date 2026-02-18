"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Star, MessageSquarePlus, X } from "lucide-react";
import { createReview } from "@/app/actions/review";

type Review = {
    id: string;
    name: string;
    program: string;
    content: string;
    rating: number;
    createdAt: Date;
};

export default function ReviewList({ initialReviews }: { initialReviews: Review[] }) {
    const [isWriteOpen, setIsWriteOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        program: "성인 그룹 레슨",
        content: "",
        rating: 5,
        password: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = new FormData();
        form.append("name", formData.name);
        form.append("program", formData.program);
        form.append("content", formData.content);
        form.append("rating", formData.rating.toString());
        form.append("password", formData.password);

        const result = await createReview(form);
        if (result.success) {
            alert(result.message);
            setIsWriteOpen(false);
            window.location.reload(); // Refresh to see new review
        } else {
            alert(result.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="relative min-h-[500px]">
            {/* Review List */}
            <div className="space-y-6">
                {initialReviews.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-400">등록된 후기가 없습니다. 첫 번째 후기를 남겨주세요!</p>
                    </div>
                ) : (
                    initialReviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-navy-900">{review.name}</h3>
                                        <span className="text-xs text-gray-400">| {review.program}</span>
                                    </div>
                                    <div className="flex text-yellow-400">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={i < review.rating ? 0 : 2} className="text-yellow-400" />
                                        ))}
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400 font-mono">
                                    {format(new Date(review.createdAt), "yyyy.MM.dd")}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                {review.content}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Static Write Button */}
            <div className="flex justify-end mt-4">
                <button
                    onClick={() => setIsWriteOpen(true)}
                    className="bg-navy-900 text-white px-3 py-1.5 text-xs rounded-lg font-bold hover:bg-navy-800 transition shadow-sm flex items-center gap-1.5 group"
                >
                    <div className="bg-sky-500 p-1 rounded-full group-hover:rotate-12 transition">
                        <MessageSquarePlus size={14} />
                    </div>
                    <span>후기 작성하기</span>
                </button>
            </div>

            {/* Write Modal */}
            {isWriteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-lg text-navy-900">후기 작성하기</h3>
                            <button onClick={() => setIsWriteOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">이름</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-sky-500 outline-none"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">프로그램</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-sky-500 outline-none"
                                        value={formData.program}
                                        onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                                    >
                                        <option>성인 그룹 레슨</option>
                                        <option>유소년 아카데미</option>
                                        <option>TNT W</option>
                                        <option>개인 레슨</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">별점</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                            className="text-yellow-400 hover:scale-110 transition"
                                        >
                                            <Star size={28} fill={star <= formData.rating ? "currentColor" : "none"} strokeWidth={star <= formData.rating ? 0 : 2} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">내용 (최대 1000자)</label>
                                <textarea
                                    className="w-full px-4 py-3 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-sky-500 outline-none h-32 resize-none"
                                    placeholder="훈련을 통해 느낀점이나 좋았던 점을 자유롭게 작성해주세요."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value.slice(0, 1000) })}
                                    required
                                />
                                <div className="text-right text-xs text-gray-400">{formData.content.length} / 1000</div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition shadow-lg shadow-navy-200 disabled:opacity-50"
                            >
                                {isSubmitting ? "등록 중..." : "등록하기"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
