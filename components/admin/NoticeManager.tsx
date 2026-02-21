"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { createNotice, updateNotice, deleteNotice } from "@/app/actions/notice-admin";

interface Notice {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
}

export default function NoticeManager({ initialNotices }: { initialNotices: Notice[] }) {
    const [notices] = useState<Notice[]>(initialNotices);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

    // Form States
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("관리자");
    const [isLoading, setIsLoading] = useState(false);

    const openModal = (notice?: Notice) => {
        if (notice) {
            setEditingNotice(notice);
            setTitle(notice.title);
            setContent(notice.content);
            setAuthor(notice.author);
        } else {
            setEditingNotice(null);
            setTitle("");
            setContent("");
            setAuthor("관리자");
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingNotice(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (editingNotice) {
                await updateNotice(editingNotice.id, { title, content, author });
                window.location.reload();
            } else {
                await createNotice({ title, content, author });
                window.location.reload();
            }
            closeModal();
        } catch (error) {
            console.error("Failed to save notice", error);
            alert("저장에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deleteNotice(id);
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete", error);
            alert("삭제에 실패했습니다.");
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-navy-900">공지사항 관리</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-navy-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-navy-800 transition"
                >
                    <Plus size={18} />
                    새 공지사항 작성
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">번호</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">제목</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">작성자</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">등록일</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {notices.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-400">등록된 공지사항이 없습니다.</td>
                            </tr>
                        ) : (
                            notices.map((notice, index) => (
                                <tr key={notice.id} className="hover:bg-gray-50/50">
                                    <td className="p-4 text-gray-500">{notices.length - index}</td>
                                    <td className="p-4 font-bold text-navy-900">{notice.title}</td>
                                    <td className="p-4 text-gray-600">{notice.author}</td>
                                    <td className="p-4 text-gray-600">{formatDate(notice.createdAt)}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openModal(notice)}
                                                className="p-2 text-gray-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(notice.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-navy-900 text-white">
                            <h3 className="text-xl font-bold">
                                {editingNotice ? "공지사항 수정" : "새 공지사항 작성"}
                            </h3>
                            <button onClick={closeModal} className="text-gray-300 hover:text-white transition">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">제목</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500 focus:bg-white transition"
                                    placeholder="공지사항 제목을 입력하세요"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">작성자</label>
                                <input
                                    type="text"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500 focus:bg-white transition"
                                    placeholder="작성자 이름"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">내용</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500 focus:bg-white transition min-h-[300px]"
                                    placeholder="공지사항 내용을 입력하세요"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-3 rounded-lg text-gray-600 font-bold hover:bg-gray-100 transition"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-3 rounded-lg bg-navy-900 text-white font-bold hover:bg-navy-800 transition disabled:opacity-50"
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
