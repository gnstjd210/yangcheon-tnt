/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { getAdultClassCards, upsertAdultClassCard } from "@/app/actions/adult-class-card";
import { X } from "lucide-react";

type AdultCard = {
    id: string;
    type: string;
    title: string;
    subtitle: string;
    listItems: string;
};

const DEFAULT_TYPES = [
    { type: "male", name: "남성 그룹레슨", color: "sky-500" },
    { type: "female", name: "여성 그룹레슨", color: "orange-500" },
    { type: "mixed", name: "혼성 그룹레슨", color: "purple-500" },
];

export default function AdultClassCardManager() {
    const [cards, setCards] = useState<AdultCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Edit state
    const [currentType, setCurrentType] = useState<string>("male");
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [listItems, setListItems] = useState<string[]>(["", "", ""]);

    const fetchCards = async () => {
        setIsLoading(true);
        const res = await getAdultClassCards();
        if (res.success && res.cards) {
            setCards(res.cards);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const openEditDialog = (type: string) => {
        setCurrentType(type);
        const existing = cards.find(c => c.type === type);
        if (existing) {
            setTitle(existing.title);
            setSubtitle(existing.subtitle);
            try {
                const parsed = JSON.parse(existing.listItems);
                setListItems(Array.isArray(parsed) ? parsed : ["", "", ""]);
            } catch {
                setListItems(["", "", ""]);
            }
        } else {
            // Default seed
            const typeInfo = DEFAULT_TYPES.find(d => d.type === type);
            setTitle(typeInfo?.name || "");
            setSubtitle("기본기부터 전술 훈련까지 배웁니다.");
            setListItems(["장점 1", "장점 2", "장점 3"]);
        }
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!title.trim() || !subtitle.trim() || listItems.some(i => !i.trim())) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        const res = await upsertAdultClassCard({
            type: currentType,
            title,
            subtitle,
            listItems
        });

        if (res.success) {
            alert("카드가 성공적으로 저장되었습니다.");
            setIsDialogOpen(false);
            fetchCards();
        } else {
            alert(`오류 발생: ${res.error}`);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            {isLoading ? (
                <div className="py-10 text-center text-gray-500 font-medium">로딩 중...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-700 font-bold border-b">
                            <tr>
                                <th className="px-6 py-4">종류</th>
                                <th className="px-6 py-4">제목</th>
                                <th className="px-6 py-4">소제목</th>
                                <th className="px-6 py-4 text-center">설정 상태</th>
                                <th className="px-6 py-4 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {DEFAULT_TYPES.map((dt) => {
                                const card = cards.find(c => c.type === dt.type);
                                return (
                                    <tr key={dt.type} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-navy-900">{dt.name}</td>
                                        <td className="px-6 py-4">{card?.title || <span className="text-gray-400">설정 안됨</span>}</td>
                                        <td className="px-6 py-4 max-w-[200px] truncate">{card?.subtitle || <span className="text-gray-400">-</span>}</td>
                                        <td className="px-6 py-4 text-center">
                                            {card ? (
                                                <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                                                    데이터 활성
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full border border-gray-200">
                                                    기본문구 사용
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => openEditDialog(dt.type)}
                                                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 font-medium text-sm transition-colors focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                            >
                                                편집
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-navy-900">
                                {DEFAULT_TYPES.find(d => d.type === currentType)?.name} 편집
                            </h3>
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className="p-2 -mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-8 space-y-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">카드 제목</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="ex) 남성 그룹레슨"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">상세 소제목 (최대 2줄 권장)</label>
                                <textarea
                                    value={subtitle}
                                    onChange={(e) => setSubtitle(e.target.value)}
                                    placeholder="ex) 기본기부터 전술까지 배웁니다."
                                    rows={2}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-4">핵심 특징 (3가지)</label>
                                <div className="space-y-4">
                                    {listItems.map((item, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <span className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-navy-50 text-navy-800 rounded-full font-bold text-sm">
                                                {index + 1}
                                            </span>
                                            <input
                                                type="text"
                                                value={item}
                                                onChange={(e) => {
                                                    const newArray = [...listItems];
                                                    newArray[index] = e.target.value;
                                                    setListItems(newArray);
                                                }}
                                                placeholder={`특징 ${index + 1} 내용`}
                                                className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-6 bg-gray-50 flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className="px-6 py-2.5 font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors border border-gray-200"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-8 py-2.5 font-bold text-white bg-navy-900 hover:bg-navy-800 rounded-lg shadow-md transition-colors"
                            >
                                저장하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
