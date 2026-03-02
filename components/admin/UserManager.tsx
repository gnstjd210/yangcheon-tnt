"use client";

import { useState } from "react";
import { updateUserCategory, deleteUser } from "@/app/actions/user-admin";
import { Check, X, Edit2, Trash2 } from "lucide-react";

interface User {
    id: string;
    username: string | null;
    name: string | null;
    email: string | null;
    phone: string | null;
    category: string | null;
    subCategory: string | null;
    createdAt: Date;
}

const CATEGORIES = [
    { label: "전체", value: "ALL" },
    { label: "유소년트레이닝", value: "YOUTH" },
    { label: "성인트레이닝", value: "ADULT" },
    { label: "TNT W", value: "TNT_W" }
];

const SUB_CATEGORIES: Record<string, string[]> = {
    "ADULT": ["전체", "남성", "여성", "혼성"],
    "TNT_W": ["전체", "축구", "풋살"],
};

export default function UserManager({ initialUsers }: { initialUsers: User[] }) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [selectedSubCategory, setSelectedSubCategory] = useState("전체");
    const [editingUserId, setEditingUserId] = useState<string | null>(null);

    // Edit states
    const [editCategory, setEditCategory] = useState<string>("");
    const [editSubCategory, setEditSubCategory] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const filteredUsers = users.filter((user) => {
        if (selectedCategory !== "ALL" && user.category !== selectedCategory) return false;
        if (selectedCategory !== "ALL" && selectedSubCategory !== "전체" && user.subCategory !== selectedSubCategory) return false;
        return true;
    });

    const startEditing = (user: User) => {
        setEditingUserId(user.id);
        setEditCategory(user.category || "");
        setEditSubCategory(user.subCategory || "");
    };

    const cancelEditing = () => {
        setEditingUserId(null);
        setEditCategory("");
        setEditSubCategory("");
    };

    const handleSave = async (id: string) => {
        setIsLoading(true);
        try {
            await updateUserCategory(id, editCategory || null, editSubCategory || null);
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === id
                        ? { ...u, category: editCategory || null, subCategory: editSubCategory || null }
                        : u
                )
            );
            setEditingUserId(null);
        } catch (error) {
            console.error(error);
            alert("저장에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("정말 이 사용자를 삭제하시겠습니까? (이 작업은 되돌릴 수 없습니다.)")) return;
        setIsLoading(true);
        try {
            await deleteUser(id);
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (error) {
            console.error(error);
            alert("삭제에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const getBadgeStyle = (category: string | null, subCategory: string | null) => {
        if (!category) return "bg-gray-100 text-gray-600";
        if (category === "YOUTH") return "bg-green-100 text-green-700";
        if (category === "ADULT") {
            if (subCategory === "남성") return "bg-blue-100 text-blue-700";
            if (subCategory === "여성") return "bg-pink-100 text-pink-700";
            if (subCategory === "혼성") return "bg-purple-100 text-purple-700";
            return "bg-indigo-100 text-indigo-700";
        }
        if (category === "TNT_W") {
            if (subCategory === "축구") return "bg-sky-100 text-sky-700";
            if (subCategory === "풋살") return "bg-cyan-100 text-cyan-700";
            return "bg-sky-100 text-sky-700";
        }
        return "bg-gray-100 text-gray-600";
    };

    const formatCategoryName = (category: string | null) => {
        if (category === "YOUTH") return "유소년트레이닝";
        if (category === "ADULT") return "성인트레이닝";
        if (category === "TNT_W") return "TNT W";
        return category;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-navy-900">회원 관리</h1>
            </div>

            {/* Main Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => {
                            setSelectedCategory(cat.value);
                            setSelectedSubCategory("전체");
                        }}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition ${selectedCategory === cat.value
                            ? "bg-navy-900 text-white"
                            : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Sub Category Filters */}
            {selectedCategory !== "ALL" && SUB_CATEGORIES[selectedCategory] && (
                <div className="flex flex-wrap gap-2 mb-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase flex items-center px-2">세부 분류:</span>
                    {SUB_CATEGORIES[selectedCategory].map((subCat) => (
                        <button
                            key={subCat}
                            onClick={() => setSelectedSubCategory(subCat)}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${selectedSubCategory === subCat
                                ? "bg-sky-500 text-white"
                                : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
                                }`}
                        >
                            {subCat}
                        </button>
                    ))}
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">회원정보</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">연락처</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">소속 분류</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">가입일</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-400">등록된 회원이 없습니다.</td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50">
                                    <td className="p-4">
                                        <div className="font-bold text-navy-900">{user.name || "이름없음"}</div>
                                        <div className="text-xs text-gray-500">@{user.username || "SNS 로그인"}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-gray-700">{user.phone || "-"}</div>
                                        <div className="text-xs text-gray-500">{user.email || "-"}</div>
                                    </td>
                                    <td className="p-4">
                                        {editingUserId === user.id ? (
                                            <div className="flex flex-col gap-2">
                                                <select
                                                    value={editCategory}
                                                    onChange={(e) => {
                                                        setEditCategory(e.target.value);
                                                        setEditSubCategory(""); // Reset sub when main changes
                                                    }}
                                                    className="w-full text-sm p-1 border rounded"
                                                >
                                                    <option value="">분류 미지정</option>
                                                    <option value="YOUTH">유소년트레이닝</option>
                                                    <option value="ADULT">성인트레이닝</option>
                                                    <option value="TNT_W">TNT W</option>
                                                </select>

                                                {editCategory && SUB_CATEGORIES[editCategory] && (
                                                    <select
                                                        value={editSubCategory}
                                                        onChange={(e) => setEditSubCategory(e.target.value)}
                                                        className="w-full text-sm p-1 border rounded"
                                                    >
                                                        <option value="">세부 분류 선택</option>
                                                        {SUB_CATEGORIES[editCategory].filter(sc => sc !== '전체').map((subCat) => (
                                                            <option key={subCat} value={subCat}>{subCat}</option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-start gap-1">
                                                {user.category ? (
                                                    <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${getBadgeStyle(user.category, user.subCategory)}`}>
                                                        {formatCategoryName(user.category)} {user.subCategory ? `- ${user.subCategory}` : ""}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">분류 미지정</span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {editingUserId === user.id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSave(user.id)}
                                                        disabled={isLoading}
                                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={cancelEditing}
                                                        disabled={isLoading}
                                                        className="p-1.5 text-gray-400 hover:bg-gray-100 rounded transition"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEditing(user)}
                                                        className="p-1.5 text-gray-400 hover:text-sky-500 hover:bg-sky-50 rounded transition"
                                                        title="분류 수정"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                                                        title="사용자 삭제"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
