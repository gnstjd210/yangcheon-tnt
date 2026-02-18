"use client";

import { useState } from "react";
import { format } from "date-fns";
import { PenSquare, X } from "lucide-react";
import { createPost } from "@/app/actions/post";

type Post = {
    id: string;
    title: string;
    author: string;
    content: string;
    category: string | null;
    createdAt: Date;
    views: number;
};

export default function PostList({ initialPosts }: { initialPosts: Post[] }) {
    const [isWriteOpen, setIsWriteOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        password: "",
        category: "잡담",
        content: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = new FormData();
        form.append("title", formData.title);
        form.append("author", formData.author);
        form.append("password", formData.password);
        form.append("category", formData.category);
        form.append("content", formData.content);

        const result = await createPost(form);
        if (result.success) {
            alert(result.message);
            setIsWriteOpen(false);
            window.location.reload();
        } else {
            alert(result.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="relative min-h-[500px]">
            {/* Post Table structure */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="grid grid-cols-12 bg-gray-50 p-4 text-xs font-bold text-gray-500 border-b border-gray-100">
                    <div className="col-span-1 text-center">번호</div>
                    <div className="col-span-2 text-center">분류</div>
                    <div className="col-span-5">제목</div>
                    <div className="col-span-2 text-center">작성자</div>
                    <div className="col-span-2 text-center">날짜</div>
                </div>
                <div className="divide-y divide-gray-50">
                    {initialPosts.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            등록된 게시글이 없습니다.
                        </div>
                    ) : (
                        initialPosts.map((post, index) => (
                            <div key={post.id} className="grid grid-cols-12 p-4 text-sm hover:bg-sky-50 transition cursor-pointer group">
                                <div className="col-span-1 text-center text-gray-400 font-mono">{initialPosts.length - index}</div>
                                <div className="col-span-2 text-center">
                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">{post.category || "기타"}</span>
                                </div>
                                <div className="col-span-5 font-bold text-navy-900 group-hover:text-sky-600 truncate pr-4">
                                    {post.title}
                                </div>
                                <div className="col-span-2 text-center text-gray-600">{post.author}</div>
                                <div className="col-span-2 text-center text-gray-400 text-xs flex items-center justify-center">
                                    {format(new Date(post.createdAt), "yyyy.MM.dd")}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Static Write Button */}
            <div className="flex justify-end mt-4">
                <button
                    onClick={() => setIsWriteOpen(true)}
                    className="bg-navy-900 text-white px-3 py-1.5 text-xs rounded-lg font-bold hover:bg-navy-800 transition shadow-sm flex items-center gap-1.5 group"
                >
                    <div className="bg-indigo-500 p-1 rounded-full group-hover:rotate-12 transition">
                        <PenSquare size={14} />
                    </div>
                    <span>게시글 작성하기</span>
                </button>
            </div>

            {/* Write Modal */}
            {isWriteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-lg text-navy-900">게시글 작성하기</h3>
                            <button onClick={() => setIsWriteOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">분류</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-sky-500 outline-none"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>잡담</option>
                                        <option>질문</option>
                                        <option>정보</option>
                                        <option>가입인사</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">이름</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-sky-500 outline-none"
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">비밀번호 (수정/삭제용)</label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-sky-500 outline-none font-mono"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="숫자 4자리"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">제목</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-sky-500 outline-none"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">내용</label>
                                <textarea
                                    className="w-full px-4 py-3 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:border-sky-500 outline-none h-48 resize-none"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-navy-900 text-white font-bold rounded-xl hover:bg-navy-800 transition shadow-lg shadow-navy-200 disabled:opacity-50"
                            >
                                {isSubmitting ? "등록 중..." : "등록하기"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
