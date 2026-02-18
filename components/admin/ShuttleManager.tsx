"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { createShuttle, updateShuttle, deleteShuttle } from "@/app/actions/misc_about";

interface Shuttle {
    id: string;
    title: string;
    content: string;
    imageUrl: string | null;
}

export default function ShuttleManager({ initialShuttles }: { initialShuttles: Shuttle[] }) {
    const [shuttles] = useState<Shuttle[]>(initialShuttles);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingShuttle, setEditingShuttle] = useState<Shuttle | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const openModal = (shuttle?: Shuttle) => {
        if (shuttle) {
            setEditingShuttle(shuttle);
            setTitle(shuttle.title);
            setContent(shuttle.content);
            setImageUrl(shuttle.imageUrl || "");
        } else {
            setEditingShuttle(null);
            setTitle("");
            setContent("");
            setImageUrl("");
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingShuttle(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("imageUrl", imageUrl);

        try {
            if (editingShuttle) {
                await updateShuttle(editingShuttle.id, formData);
                window.location.reload();
            } else {
                await createShuttle(formData);
                window.location.reload();
            }
            closeModal();
        } catch (error) {
            console.error("Failed to save shuttle", error);
            alert("Error saving shuttle");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deleteShuttle(id);
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-navy-900">셔틀버스 운행 안내 관리</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-navy-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-navy-800 transition"
                >
                    <Plus size={18} />
                    노선 추가
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {shuttles.map((shuttle) => (
                    <div key={shuttle.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6">
                        <div className="relative w-full md:w-64 h-48 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {shuttle.imageUrl ? (
                                <Image src={shuttle.imageUrl} alt={shuttle.title} fill className="object-contain" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Route Map</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-navy-900">{shuttle.title}</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(shuttle)}
                                        className="p-2 text-gray-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(shuttle.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg text-gray-600 whitespace-pre-wrap leading-relaxed text-sm">
                                {shuttle.content}
                            </div>
                        </div>
                    </div>
                ))}

                {shuttles.length === 0 && (
                    <div className="text-center py-12 text-gray-400">등록된 셔틀버스 노선이 없습니다.</div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-navy-900">
                                {editingShuttle ? "노선 수정" : "새 노선 추가"}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            <div className="flex justify-center mb-4">
                                <div className="text-center">
                                    <p className="text-xs font-bold text-gray-500 mb-2">노선 이미지 (지도 등)</p>
                                    <ImageUpload
                                        value={imageUrl}
                                        onChange={(url) => setImageUrl(url)}
                                        onRemove={() => setImageUrl("")}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">노선명 / 호차</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    placeholder="예: 1호차 (양천구청 방향)"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">운행 정보 (경유지 등)</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500 min-h-[150px]"
                                    placeholder="주요 경유지 및 시간 정보를 입력하세요"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-3 rounded-lg text-gray-600 font-bold hover:bg-gray-100 transition"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-5 py-3 rounded-lg bg-navy-900 text-white font-bold hover:bg-sky-600 transition disabled:opacity-50"
                                >
                                    {isLoading ? "저장 중..." : "저장하기"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
