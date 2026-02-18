"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { createGreeting, updateGreeting, deleteGreeting } from "@/app/actions/greeting";

interface Greeting {
    id: string;
    title: string;
    content: string;
    imageUrl: string | null;
    isVisible: boolean;
}

export default function GreetingManager({ initialGreetings }: { initialGreetings: Greeting[] }) {
    const [greetings] = useState<Greeting[]>(initialGreetings);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGreeting, setEditingGreeting] = useState<Greeting | null>(null);

    // Form States
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isVisible, setIsVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const openModal = (greeting?: Greeting) => {
        if (greeting) {
            setEditingGreeting(greeting);
            setTitle(greeting.title);
            setContent(greeting.content);
            setImageUrl(greeting.imageUrl || "");
            setIsVisible(greeting.isVisible);
        } else {
            setEditingGreeting(null);
            setTitle("");
            setContent("");
            setImageUrl("");
            setIsVisible(true);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingGreeting(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("imageUrl", imageUrl);
        formData.append("isVisible", String(isVisible));

        try {
            if (editingGreeting) {
                await updateGreeting(editingGreeting.id, formData);
                // Optimistic update or refresh
                window.location.reload();
            } else {
                await createGreeting(formData);
                window.location.reload();
            }
            closeModal();
        } catch (error) {
            console.error("Failed to save greeting", error);
            alert("Error saving greeting");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deleteGreeting(id);
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-navy-900">인사말 관리</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-navy-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-navy-800 transition"
                >
                    <Plus size={18} />
                    인사말 추가
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">이미지</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">제목</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">내용 (요약)</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {greetings.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-400">데이터가 없습니다.</td>
                            </tr>
                        ) : greetings.map((greeting) => (
                            <tr key={greeting.id} className="hover:bg-gray-50/50">
                                <td className="p-4">
                                    {greeting.imageUrl ? (
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                                            <Image src={greeting.imageUrl} alt={greeting.title} fill className="object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                    )}
                                </td>
                                <td className="p-4 font-bold text-navy-900">{greeting.title}</td>
                                <td className="p-4 text-gray-600 max-w-xs truncate">{greeting.content}</td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => openModal(greeting)}
                                            className="p-2 text-gray-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(greeting.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-navy-900">
                                {editingGreeting ? "인사말 수정" : "새 인사말 추가"}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">이미지</label>
                                <ImageUpload
                                    value={imageUrl}
                                    onChange={(url) => setImageUrl(url)}
                                    onRemove={() => setImageUrl("")}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">제목</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    placeholder="제목을 입력하세요"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">내용</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500 min-h-[150px]"
                                    placeholder="인사말 내용을 입력하세요"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
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
