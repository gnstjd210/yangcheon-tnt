"use client";

import { useState } from "react";
import { CheckCircle, Trash2 } from "lucide-react";
import { approveReview, deleteReview } from "@/app/actions/review-admin";

interface Review {
    id: string;
    name: string;
    program: string;
    content: string;
    rating: number;
    isApproved: boolean;
    createdAt: Date;
}

export default function ReviewManager({ initialReviews }: { initialReviews: Review[] }) {
    const [reviews] = useState<Review[]>(initialReviews);
    const [isLoading, setIsLoading] = useState(false);

    const handleApprove = async (id: string) => {
        if (!confirm("이 후기를 승인하여 홈페이지에 노출하시겠습니까?")) return;
        setIsLoading(true);
        try {
            await approveReview(id);
            alert("승인되었습니다.");
            window.location.reload();
        } catch (error) {
            console.error("Failed to approve review", error);
            alert("승인 처리에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;
        setIsLoading(true);
        try {
            await deleteReview(id);
            alert("삭제되었습니다.");
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete review", error);
            alert("삭제 처리에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const renderStars = (rating: number) => {
        return "⭐".repeat(rating);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-navy-900">레슨 후기 관리</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase w-16 text-center">번호</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase w-24">상태</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase w-32">작성자/프로그램</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">내용/별점</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase w-28">등록일</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase w-24 text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {reviews.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-400">등록된 후기가 없습니다.</td>
                            </tr>
                        ) : (
                            reviews.map((review, index) => (
                                <tr key={review.id} className="hover:bg-gray-50/50">
                                    <td className="p-4 text-center text-gray-500">{reviews.length - index}</td>
                                    <td className="p-4">
                                        {review.isApproved ? (
                                            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                                승인됨
                                            </span>
                                        ) : (
                                            <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                                                승인 대기
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-navy-900">{review.name}</div>
                                        <div className="text-sm text-gray-500">{review.program}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-gray-800 mb-1">{review.content}</div>
                                        <div className="text-xs">{renderStars(review.rating)}</div>
                                    </td>
                                    <td className="p-4 text-gray-600 text-sm">{formatDate(review.createdAt)}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {!review.isApproved && (
                                                <button
                                                    onClick={() => handleApprove(review.id)}
                                                    disabled={isLoading}
                                                    title="승인"
                                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(review.id)}
                                                disabled={isLoading}
                                                title="삭제"
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
