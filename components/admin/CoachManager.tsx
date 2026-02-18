"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { createCoach, updateCoach, deleteCoach } from "@/app/actions/coach";

interface Coach {
    id: string;
    name: string;
    position: string;
    message: string | null;
    careers: string; // JSON
    imageUrl: string | null;
    order: number;
}

export default function CoachManager({ initialCoaches }: { initialCoaches: Coach[] }) {
    const [coaches] = useState<Coach[]>(initialCoaches);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [message, setMessage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [careersList, setCareersList] = useState<string[]>([""]);
    const [order, setOrder] = useState(0);

    const openModal = (coach?: Coach) => {
        if (coach) {
            setEditingCoach(coach);
            setName(coach.name);
            setPosition(coach.position);
            setMessage(coach.message || "");
            setImageUrl(coach.imageUrl || "");
            try {
                const parsed = JSON.parse(coach.careers);
                setCareersList(Array.isArray(parsed) && parsed.length > 0 ? parsed : [""]);
            } catch {
                setCareersList([""]);
            }
            setOrder(coach.order);
        } else {
            setEditingCoach(null);
            setName("");
            setPosition("");
            setMessage("");
            setImageUrl("");
            setCareersList([""]);
            setOrder(initialCoaches.length);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCoach(null);
    };

    const handleCareerChange = (index: number, value: string) => {
        const newList = [...careersList];
        newList[index] = value;
        setCareersList(newList);
    };

    const addCareerField = () => {
        setCareersList([...careersList, ""]);
    };

    const removeCareerField = (index: number) => {
        const newList = careersList.filter((_, i) => i !== index);
        setCareersList(newList.length ? newList : [""]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Filter empty careers
        const validCareers = careersList.filter(c => c.trim() !== "");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("position", position);
        formData.append("message", message);
        formData.append("imageUrl", imageUrl);
        formData.append("careers", JSON.stringify(validCareers));
        formData.append("order", order.toString());

        try {
            if (editingCoach) {
                await updateCoach(editingCoach.id, formData);
                window.location.reload();
            } else {
                await createCoach(formData);
                window.location.reload();
            }
            closeModal();
        } catch (error) {
            console.error("Failed to save coach", error);
            alert("Error saving coach");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deleteCoach(id);
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-navy-900">코치진 관리</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-navy-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-navy-800 transition"
                >
                    <Plus size={18} />
                    코치 추가
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coaches.map((coach) => (
                    <div key={coach.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="relative w-full h-48 bg-gray-100">
                            {coach.imageUrl ? (
                                <Image src={coach.imageUrl} alt={coach.name} fill className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                            )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-navy-900">{coach.name}</h3>
                                    <p className="text-sm text-sky-500 font-medium">{coach.position}</p>
                                </div>
                                <div className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">
                                    No.{coach.order}
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2 justify-end">
                                <button
                                    onClick={() => openModal(coach)}
                                    className="p-2 text-gray-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(coach.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {coaches.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-400">
                        등록된 코치진이 없습니다.
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold text-navy-900">
                                {editingCoach ? "코치 수정" : "새 코치 추가"}
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">이름</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
                                        placeholder="이름"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">노출 순서</label>
                                    <input
                                        type="number"
                                        value={order}
                                        onChange={(e) => setOrder(parseInt(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">직급/포지션</label>
                                <input
                                    type="text"
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    placeholder="예: 감독, 수석코치"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">한마디 (선택)</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500 min-h-[80px]"
                                    placeholder="코치의 각오나 인사말"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">주요 경력</label>
                                <div className="flex flex-col gap-2">
                                    {careersList.map((career, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={career}
                                                onChange={(e) => handleCareerChange(index, e.target.value)}
                                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500 text-sm"
                                                placeholder="경력 내용을 입력하세요"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeCareerField(index)}
                                                className="text-gray-400 hover:text-red-500 p-2"
                                                disabled={careersList.length === 1}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addCareerField}
                                        className="text-sm text-sky-500 font-bold hover:text-sky-600 self-start mt-1 flex items-center gap-1"
                                    >
                                        <Plus size={14} /> 경력 추가
                                    </button>
                                </div>
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
