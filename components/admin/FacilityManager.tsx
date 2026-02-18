"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { createFacility, updateFacility, deleteFacility } from "@/app/actions/misc_about";

interface Facility {
    id: string;
    title: string;
    content: string;
    imageUrl: string | null;
    order: number;
}

export default function FacilityManager({ initialFacilities }: { initialFacilities: Facility[] }) {
    const [facilities] = useState<Facility[]>(initialFacilities);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [order, setOrder] = useState(0);

    const openModal = (facility?: Facility) => {
        if (facility) {
            setEditingFacility(facility);
            setTitle(facility.title);
            setContent(facility.content);
            setImageUrl(facility.imageUrl || "");
            setOrder(facility.order);
        } else {
            setEditingFacility(null);
            setTitle("");
            setContent("");
            setImageUrl("");
            setOrder(facilities.length);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFacility(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("imageUrl", imageUrl);
        formData.append("order", order.toString());

        try {
            if (editingFacility) {
                await updateFacility(editingFacility.id, formData);
                window.location.reload();
            } else {
                await createFacility(formData);
                window.location.reload();
            }
            closeModal();
        } catch (error) {
            console.error("Failed to save facility", error);
            alert("Error saving facility");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deleteFacility(id);
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-navy-900">시설 소개 관리</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-navy-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-navy-800 transition"
                >
                    <Plus size={18} />
                    시설 추가
                </button>
            </div>

            <div className="space-y-4">
                {facilities.map((facility) => (
                    <div key={facility.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex gap-6 items-center">
                        <div className="relative w-32 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {facility.imageUrl ? (
                                <Image src={facility.imageUrl} alt={facility.title} fill className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Image</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-500">#{facility.order}</span>
                                <h3 className="text-lg font-bold text-navy-900">{facility.title}</h3>
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2">{facility.content}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => openModal(facility)}
                                className="p-2 text-gray-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition"
                            >
                                <Pencil size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(facility.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {facilities.length === 0 && (
                    <div className="text-center py-12 text-gray-400">등록된 시설 정보가 없습니다.</div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-navy-900">
                                {editingFacility ? "시설 수정" : "새 시설 추가"}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            <div className="flex justify-center mb-4">
                                <ImageUpload
                                    value={imageUrl}
                                    onChange={(url) => setImageUrl(url)}
                                    onRemove={() => setImageUrl("")}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">시설명</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
                                        placeholder="예: 실내 구장"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">순서</label>
                                    <input
                                        type="number"
                                        value={order}
                                        onChange={(e) => setOrder(parseInt(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">설명</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500 min-h-[120px]"
                                    placeholder="시설에 대한 설명을 입력하세요"
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
