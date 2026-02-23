"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Plus, FileText, X } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { createGalleryPost, deleteGalleryPost, updateGalleryPost } from "@/app/actions/gallery";

type GalleryPost = {
    id: string;
    type: string;
    category: string;
    title: string | null;
    content: string | null;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
};

const PROGRAMS = [
    { key: "YOUTH", label: "유소년 축구교실" },
    { key: "ADULT", label: "성인 트레이닝" },
    { key: "TNT_W", label: "TNT W" },
];

const DAYS = [
    { key: "Mon", label: "월요일" },
    { key: "Tue", label: "화요일" },
    { key: "Wed", label: "수요일" },
    { key: "Thu", label: "목요일" },
    { key: "Fri", label: "금요일" },
    { key: "Sat", label: "토요일" },
    { key: "Sun", label: "일요일" },
];

const TNT_W_CATEGORIES = [
    { key: "축구", label: "축구" },
    { key: "풋살", label: "풋살" },
];

export default function GalleryManager({ initialPosts }: { initialPosts: GalleryPost[] }) {
    const [posts, setPosts] = useState(initialPosts);
    const [activeTab, setActiveTab] = useState("YOUTH");
    const [isUploading, setIsUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("Mon");
    const [images, setImages] = useState<string[]>([]);

    // Add image helper
    const handleAddImage = (url: string) => {
        if (!url) return;
        setImages([...images, url]);
    };

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle("");
        setContent("");
        setImages([]);
        setCategory(activeTab === 'YOUTH' ? 'Mon' : (activeTab === 'TNT_W' ? '축구' : '일반'));
    };

    const openCreateModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (post: GalleryPost) => {
        setEditingId(post.id);
        setTitle(post.title || "");
        setContent(post.content || "");
        setCategory(post.category);
        setImages(post.images);
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (images.length === 0) return alert("최소 1장의 이미지를 업로드해주세요.");
        if (activeTab !== "YOUTH" && !title) return alert("제목을 입력해주세요.");

        setIsUploading(true);
        try {
            if (editingId) {
                const result = await updateGalleryPost(editingId, {
                    type: activeTab,
                    title: activeTab === 'YOUTH' ? undefined : (title || undefined),
                    content: activeTab === 'YOUTH' ? undefined : (content || undefined),
                    category,
                    images,
                });

                if (result.success && result.post) {
                    setPosts(posts.map(p => p.id === editingId ? result.post : p));
                    alert("수정되었습니다.");
                    setIsModalOpen(false);
                } else {
                    alert(result.message);
                }
            } else {
                const result = await createGalleryPost({
                    type: activeTab,
                    title: activeTab === 'YOUTH' ? undefined : (title || undefined),
                    content: activeTab === 'YOUTH' ? undefined : (content || undefined),
                    category,
                    images,
                });

                if (result.success && result.post) {
                    setPosts([result.post, ...posts]);
                    alert("등록되었습니다.");
                    setIsModalOpen(false);
                } else {
                    alert(result.message);
                }
            }
        } catch {
            alert("저장 실패");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string, type: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        try {
            await deleteGalleryPost(id, type);
            setPosts(posts.filter(p => p.id !== id));
        } catch {
            alert("삭제 실패");
        }
    };

    const filteredPosts = posts.filter(p => p.type === activeTab);

    return (
        <div className="space-y-6">
            {/* Header / Tabs */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex gap-2 bg-gray-50 p-1 rounded-lg">
                    {PROGRAMS.map(prog => (
                        <button
                            key={prog.key}
                            onClick={() => {
                                setActiveTab(prog.key);
                                setCategory(prog.key === 'YOUTH' ? 'Mon' : (prog.key === 'TNT_W' ? '축구' : '일반'));
                            }}
                            className={`px-4 py-2 rounded-md font-bold text-sm transition ${activeTab === prog.key
                                ? "bg-white text-navy-900 shadow"
                                : "text-gray-500 hover:text-navy-900 hover:bg-white/50"
                                }`}
                        >
                            {prog.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 transition"
                >
                    <Plus size={18} />
                    새 게시물 등록
                </button>
            </div>

            {/* List View */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-sm">
                                <th className="p-4 font-bold text-gray-500 w-24">유형</th>
                                <th className="p-4 font-bold text-gray-500 w-24">분류</th>
                                <th className="p-4 font-bold text-gray-500">제목/내용</th>
                                <th className="p-4 font-bold text-gray-500 w-32 text-center">사진 수</th>
                                <th className="p-4 font-bold text-gray-500 w-32">등록일</th>
                                <th className="p-4 font-bold text-gray-500 w-32 text-center">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPosts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400">
                                        등록된 게시물이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                filteredPosts.map(post => (
                                    <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                        <td className="p-4 font-bold text-navy-900 text-sm">{PROGRAMS.find(p => p.key === post.type)?.label}</td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                                                {post.type === 'YOUTH' ? DAYS.find(d => d.key === post.category)?.label : post.category}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-navy-900">
                                                {post.type === 'YOUTH' ? '유소년 갤러리 이미지' : post.title}
                                            </div>
                                            {post.type !== 'YOUTH' && post.content && (
                                                <div className="text-gray-500 text-xs truncate max-w-md mt-1">
                                                    {post.content}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center gap-1 text-sm font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded">
                                                <Image className="w-4 h-4 object-cover rounded-sm" src={post.images[0] || ""} alt="" width={16} height={16} />
                                                {post.images.length}장
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(post)}
                                                    className="p-2 text-gray-400 hover:text-sky-500 hover:bg-sky-50 rounded transition"
                                                >
                                                    <FileText size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.id, post.type)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
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

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
                    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6 md:p-8 relative my-8">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-black text-navy-900 mb-6 flex items-center gap-2">
                            {editingId ? "게시물 수정" : "새 게시물 등록"}
                            <span className="text-sm font-normal text-sky-500 bg-sky-50 px-3 py-1 rounded-full">
                                {PROGRAMS.find(p => p.key === activeTab)?.label}
                            </span>
                        </h2>

                        <div className="space-y-6">
                            {/* Category Selection */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">분류</label>
                                {activeTab === "YOUTH" && (
                                    <div className="flex flex-wrap gap-2">
                                        {DAYS.map((d) => (
                                            <button
                                                key={d.key}
                                                onClick={() => setCategory(d.key)}
                                                className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${category === d.key
                                                    ? "bg-navy-900 text-white border-navy-900"
                                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {d.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {activeTab === "TNT_W" && (
                                    <div className="flex gap-2">
                                        {TNT_W_CATEGORIES.map((c) => (
                                            <button
                                                key={c.key}
                                                onClick={() => setCategory(c.key)}
                                                className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${category === c.key
                                                    ? "bg-navy-900 text-white border-navy-900"
                                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {c.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {activeTab === "ADULT" && (
                                    <p className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg inline-block">분류 없음 (일반 게시글)</p>
                                )}
                            </div>

                            {/* Freeboard Fields */}
                            {activeTab !== "YOUTH" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">게시글 제목</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-100 focus:border-sky-500 outline-none"
                                            placeholder="제목을 입력하세요"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">본문 내용 (선택)</label>
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-100 focus:border-sky-500 outline-none resize-none"
                                            placeholder="사진에 대한 설명이나 본문 내용을 입력하세요"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Multi Image Upload */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between items-end">
                                    <span>사진 업로드 ({images.length}장)</span>
                                    <span className="text-xs text-gray-400 font-normal">여러 장을 계속 추가할 수 있습니다.</span>
                                </label>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                            <Image src={img} alt={`Preview ${idx}`} fill className="object-cover" />
                                            <button
                                                onClick={() => handleRemoveImage(idx)}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Upload Trigger Box */}
                                    <div className="aspect-square">
                                        <ImageUpload
                                            onChange={handleAddImage}
                                            onRemove={() => { }}
                                            value=""
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-lg transition"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isUploading}
                                    className="flex-1 py-3 bg-navy-900 text-white font-bold rounded-lg hover:bg-navy-800 transition disabled:opacity-50"
                                >
                                    {isUploading ? "저장 중..." : "저장완료"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
