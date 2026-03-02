"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { upsertGreeting } from "@/app/actions/greeting";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400">에디터 로딩중...</div>
});

interface Greeting {
    id: string;
    role: string;
    title: string;
    content: string;
    imageUrl: string | null;
    isVisible: boolean;
}

export default function GreetingManager({ initialGreetings }: { initialGreetings: Greeting[] }) {
    // Determine initial active tab based on which role is selected
    const [activeTab, setActiveTab] = useState<"PRESIDENT" | "CEO">("PRESIDENT");

    // Find existing data for each role or fallback to empty
    const presidentData = initialGreetings.find((g) => g.role === "PRESIDENT");
    const ceoData = initialGreetings.find((g) => g.role === "CEO");

    // States for PRESIDENT
    const [presTitle, setPresTitle] = useState(presidentData?.title || "");
    const [presContent, setPresContent] = useState(presidentData?.content || "");
    const [presImageUrl, setPresImageUrl] = useState(presidentData?.imageUrl || "");

    // States for CEO
    const [ceoTitle, setCeoTitle] = useState(ceoData?.title || "");
    const [ceoContent, setCeoContent] = useState(ceoData?.content || "");
    const [ceoImageUrl, setCeoImageUrl] = useState(ceoData?.imageUrl || "");

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();

        if (activeTab === "PRESIDENT") {
            formData.append("role", "PRESIDENT");
            formData.append("title", presTitle);
            formData.append("content", presContent);
            formData.append("imageUrl", presImageUrl);
            formData.append("isVisible", "true");
        } else {
            formData.append("role", "CEO");
            formData.append("title", ceoTitle);
            formData.append("content", ceoContent);
            formData.append("imageUrl", ceoImageUrl);
            formData.append("isVisible", "true");
        }

        try {
            await upsertGreeting(formData);
            alert("인사말이 성공적으로 저장되었습니다.");
        } catch (error) {
            console.error("Failed to save greeting", error);
            alert("저장 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-navy-900">대표 인사말 설정</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        김진국 대표이사, 김훈성 대표의 인사말을 각각 관리할 수 있습니다.
                    </p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-2 gap-2">
                <button
                    onClick={() => setActiveTab("PRESIDENT")}
                    className={`flex-1 py-3 text-center font-bold text-sm rounded-lg transition-colors duration-200 ${activeTab === "PRESIDENT"
                        ? "bg-navy-900 text-white shadow-md"
                        : "text-gray-500 hover:bg-gray-50"
                        }`}
                >
                    대표이사 김진국
                </button>
                <button
                    onClick={() => setActiveTab("CEO")}
                    className={`flex-1 py-3 text-center font-bold text-sm rounded-lg transition-colors duration-200 ${activeTab === "CEO"
                        ? "bg-navy-900 text-white shadow-md"
                        : "text-gray-500 hover:bg-gray-50"
                        }`}
                >
                    대표 김훈성
                </button>
            </div>

            {/* Form */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8 md:flex-row">
                    {/* Image Column */}
                    <div className="w-full md:w-1/3 shrink-0">
                        <label className="block text-sm font-bold text-gray-700 mb-2">프리필 이미지</label>
                        <p className="text-xs text-sky-600 mb-4 bg-sky-50 p-2 rounded block">권장 비율: 3:4 세로형 크롭</p>
                        <div className="aspect-[3/4] w-full max-w-[300px] border border-gray-200 rounded-xl overflow-hidden shadow-inner mx-auto md:mx-0">
                            {activeTab === "PRESIDENT" ? (
                                <ImageUpload
                                    value={presImageUrl}
                                    onChange={(url) => setPresImageUrl(url)}
                                    onRemove={() => setPresImageUrl("")}
                                />
                            ) : (
                                <ImageUpload
                                    value={ceoImageUrl}
                                    onChange={(url) => setCeoImageUrl(url)}
                                    onRemove={() => setCeoImageUrl("")}
                                />
                            )}
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 space-y-6 flex flex-col">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                {activeTab === "PRESIDENT" ? "대표이사 제목" : "대표 제목"}
                            </label>
                            <input
                                type="text"
                                value={activeTab === "PRESIDENT" ? presTitle : ceoTitle}
                                onChange={(e) =>
                                    activeTab === "PRESIDENT"
                                        ? setPresTitle(e.target.value)
                                        : setCeoTitle(e.target.value)
                                }
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all font-bold text-lg text-navy-900 shadow-sm"
                                placeholder="예: 아이들의 꿈이 실현 되는 곳..."
                                required
                            />
                        </div>

                        <div className="flex-1 flex flex-col">
                            <label className="block text-sm font-bold text-gray-700 mb-2">인사말 본문</label>
                            <RichTextEditor
                                value={activeTab === "PRESIDENT" ? presContent : ceoContent}
                                onChange={(value) =>
                                    activeTab === "PRESIDENT"
                                        ? setPresContent(value)
                                        : setCeoContent(value)
                                }
                                placeholder="인사말 내용을 자유롭게 입력하세요"
                            />
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-8 py-3.5 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-600 transition disabled:opacity-50 flex items-center gap-2 shadow-md hover:shadow-lg text-lg"
                            >
                                {isLoading ? "저장 중..." : (
                                    <>
                                        <Check size={20} /> 현재 탭 내용 저장
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
