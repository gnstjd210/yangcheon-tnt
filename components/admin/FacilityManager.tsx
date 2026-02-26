"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, GripVertical, Check, X, Building2 } from "lucide-react";
import { Facility } from "@prisma/client";
import { createFacility, updateFacility, deleteFacility } from "@/app/actions/facility";
import ImageUpload from "@/components/admin/ImageUpload";

interface FacilityManagerProps {
    initialFacilities: Facility[];
}

export default function FacilityManager({ initialFacilities }: FacilityManagerProps) {
    const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image1, setImage1] = useState("");
    const [image2, setImage2] = useState("");
    const [order, setOrder] = useState(0);

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setImage1("");
        setImage2("");
        setOrder(facilities.length);
        setEditingFacility(null);
    };

    const openModal = (facility?: Facility) => {
        if (facility) {
            setEditingFacility(facility);
            setTitle(facility.title);
            setDescription(facility.description);
            setImage1(facility.image1 || "");
            setImage2(facility.image2 || "");
            setOrder(facility.order);
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("image1", image1);
        formData.append("image2", image2);
        formData.append("order", String(order));

        try {
            if (editingFacility) {
                await updateFacility(editingFacility.id, formData);
            } else {
                await createFacility(formData);
            }
            window.location.reload();
        } catch (error) {
            console.error("Failed to save facility", error);
            alert("저장에 실패했습니다.");
        } finally {
            setIsLoading(false);
            closeModal();
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("정말 이 시설을 삭제하시겠습니까?")) return;

        try {
            await deleteFacility(id);
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete facility", error);
            alert("삭제에 실패했습니다.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                        <Building2 className="text-sky-500" />
                        시설 목록
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        어센드 모델에 기반하여 시설 소개 텍스트 및 이미지를 (16:9) 관리합니다.
                    </p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-navy-900 text-white rounded-lg hover:bg-navy-800 transition shadow-md"
                >
                    <Plus size={18} />
                    시설 추가
                </button>
            </div>

            <div className="space-y-4">
                {facilities.map((facility) => (
                    <div key={facility.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start">
                        {/* Drag Handle & Order */}
                        <div className="flex flex-col items-center gap-2 text-gray-400 self-center md:self-start">
                            <GripVertical className="cursor-grab hover:text-navy-900 transition" />
                            <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-full">{facility.order}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-4 w-full">
                            <div>
                                <h3 className="text-xl font-bold text-navy-900 flex items-center gap-2 border-b pb-2 mb-3">
                                    <span className="w-2 h-2 rounded-full bg-red-800 shrink-0"></span>
                                    {facility.title}
                                </h3>
                                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed min-h-[60px]">
                                    {facility.description}
                                </p>
                            </div>

                            {/* Images Preview Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative w-full aspect-video bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                                    {facility.image1 ? (
                                        <Image src={facility.image1} alt="설비 이미지 1" fill className="object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-sm text-gray-400">이미지 없음</div>
                                    )}
                                </div>
                                <div className="relative w-full aspect-video bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                                    {facility.image2 ? (
                                        <Image src={facility.image2} alt="설비 이미지 2" fill className="object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-sm text-gray-400">이미지 없음</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 self-end md:self-start shrink-0">
                            <button
                                onClick={() => openModal(facility)}
                                className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                            >
                                <Edit2 size={16} /> 수정
                            </button>
                            <button
                                onClick={() => handleDelete(facility.id)}
                                className="flex items-center gap-2 px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
                            >
                                <Trash2 size={16} /> 삭제
                            </button>
                        </div>
                    </div>
                ))}

                {facilities.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-500">
                        등록된 시설이 없습니다.
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                            <h3 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                                {editingFacility ? <Edit2 className="text-sky-500" /> : <Plus className="text-sky-500" />}
                                {editingFacility ? "시설 수정" : "새 시설 추가"}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-200 rounded-full">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6">
                                {/* Left Column: Info */}
                                <div className="space-y-4 border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">항목 제목 (예: 풋살장)</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition shadow-sm"
                                            required
                                            placeholder="시설 이름 입력"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">노출 순서 (낮을수록 먼저 노출)</label>
                                        <input
                                            type="number"
                                            value={order}
                                            onChange={(e) => setOrder(parseInt(e.target.value))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition shadow-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">주요 설명</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition shadow-sm"
                                            rows={6}
                                            required
                                            placeholder="시설에 대한 설명을 입력하세요..."
                                        />
                                    </div>
                                </div>

                                {/* Right Column: Images */}
                                <div className="space-y-3">
                                    <div className="bg-sky-50 p-4 rounded-lg flex flex-col mb-2">
                                        <label className="text-sm font-bold text-navy-900 mb-1">시각 자료 (이미지 2장)</label>
                                        <p className="text-xs text-sky-700">권장 비율: 16:9 가로 고정 | 좌측이 1번, 우측이 2번 이미지입니다.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-sm font-bold text-gray-600 block text-center">이미지 1 (좌측)</span>
                                            <div className="w-full aspect-video rounded-xl overflow-hidden border border-gray-200">
                                                <ImageUpload
                                                    value={image1}
                                                    onChange={setImage1}
                                                    onRemove={() => setImage1("")}
                                                    aspectRatio={16 / 9}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <span className="text-sm font-bold text-gray-600 block text-center">이미지 2 (우측)</span>
                                            <div className="w-full aspect-video rounded-xl overflow-hidden border border-gray-200">
                                                <ImageUpload
                                                    value={image2}
                                                    onChange={setImage2}
                                                    onRemove={() => setImage2("")}
                                                    aspectRatio={16 / 9}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-2.5 rounded-lg text-gray-600 font-bold hover:bg-gray-100 transition"
                                    disabled={isLoading}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2.5 rounded-lg bg-sky-500 text-white font-bold hover:bg-sky-600 transition disabled:opacity-50 flex items-center gap-2 shadow-md"
                                >
                                    {isLoading ? "저장 중..." : (
                                        <>
                                            <Check size={18} /> 저장하기
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
