"use client";

import { useState } from "react";
import { deleteUser } from "@/app/actions/user-admin";
import { Trash2, Search } from "lucide-react";

interface User {
    id: string;
    username: string | null;
    name: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    detailAddress: string | null;
    birthDate: Date | null;
    marketingAgreed: boolean | null;
    provider: string | null;
    createdAt: Date;
}



export default function UserManager({ initialUsers }: { initialUsers: User[] }) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchTerm, setSearchTerm] = useState("");
    const filteredUsers = users.filter((user) => {
        const searchLower = searchTerm.toLowerCase();
        return !searchTerm ||
            (user.name?.toLowerCase().includes(searchLower) || user.email?.toLowerCase().includes(searchLower));
    });

    const handleDelete = async (id: string) => {
        if (!confirm("정말 이 사용자를 삭제하시겠습니까? (이 작업은 되돌릴 수 없습니다.)")) return;
        try {
            await deleteUser(id);
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (error) {
            console.error(error);
            alert("삭제에 실패했습니다.");
        }
    };

    const formatProvider = (provider: string | null) => {
        if (provider === "google") return <span className="text-red-500 font-bold">Google</span>;
        if (provider === "kakao") return <span className="text-yellow-600 font-bold">Kakao</span>;
        if (provider === "naver") return <span className="text-green-600 font-bold">Naver</span>;
        return <span className="text-navy-900 font-bold">이메일가입</span>;
    };

    const formatDetails = (user: User) => {
        let ageStr = "-";
        if (user.birthDate) {
            const today = new Date();
            const birth = new Date(user.birthDate);
            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            ageStr = `만 ${age}세`;
        }

        return (
            <div className="flex flex-col">
                <span className="text-gray-900 font-bold">{ageStr}</span>
                <span className="text-xs text-gray-500 mt-0.5">마케팅: {user.marketingAgreed ? "동의" : "미동의"}</span>
            </div>
        );
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-navy-900">회원 관리</h1>

                {/* Search Bar */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="이름 또는 이메일 검색"
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-transparent transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>



            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">이름 / 연락처</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">이메일 / 가입방식</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">만 나이 / 마케팅</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">주소</th>
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
                                        <div className="text-xs text-gray-500 mt-1">{user.phone || "-"}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-gray-700">{user.email || "-"}</div>
                                        <div className="text-xs mt-1">{formatProvider(user.provider)}</div>
                                    </td>
                                    <td className="p-4 text-sm">
                                        {formatDetails(user)}
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 max-w-[200px] truncate" title={`${user.address || ''} ${user.detailAddress || ''}`}>
                                        {user.address ? `${user.address} ${user.detailAddress || ''}` : "-"}
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                                            title="사용자 삭제"
                                        >
                                            <Trash2 size={18} />
                                        </button>
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
