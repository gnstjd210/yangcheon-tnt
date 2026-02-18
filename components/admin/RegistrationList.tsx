"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Check, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { updateRegistrationStatus } from "@/app/actions/registration-admin";

type Registration = {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    address: string | null;
    experience: string | null;
    affiliation: string | null;
    age: string | null;
    team: string | null;
    type: string;
    desiredClass: string | null;
    consultationMethod: string | null;
    awarenessPath: string | null;
    status: string;
    createdAt: Date;
};

export default function RegistrationList({ initialRegistrations }: { initialRegistrations: Registration[] }) {
    const [registrations, setRegistrations] = useState(initialRegistrations);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        const result = await updateRegistrationStatus(id, newStatus);
        if (result.success) {
            setRegistrations(registrations.map(reg =>
                reg.id === id ? { ...reg, status: newStatus } : reg
            ));
        } else {
            alert("상태 업데이트 실패");
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const [filterType, setFilterType] = useState<string>("All");

    const filteredRegistrations = registrations.filter(reg => {
        if (filterType === "All") return true;
        return reg.type === filterType;
    });

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Filter Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                <h3 className="font-bold text-navy-900">신청 목록 ({filteredRegistrations.length})</h3>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-sky-500"
                >
                    <option value="All">전체 보기</option>
                    <option value="Youth">유소년 (Youth)</option>
                    <option value="Adult">성인 (Adult)</option>
                    <option value="TNTW">TNTW</option>
                    <option value="Trial">체험 수업</option>
                </select>
            </div>

            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 font-bold text-sm text-gray-500">
                <div className="col-span-1 text-center">상태</div>
                <div className="col-span-2">이름</div>
                <div className="col-span-3">연락처</div>
                <div className="col-span-2">구분</div>
                <div className="col-span-3">신청일시</div>
                <div className="col-span-1 text-center">더보기</div>
            </div>

            {filteredRegistrations.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                    해당하는 신청 내역이 없습니다.
                </div>
            ) : (
                <div>
                    {filteredRegistrations.map((reg) => (
                        <div key={reg.id} className="border-b border-gray-50 last:border-0">
                            <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition text-sm text-navy-900">
                                <div className="col-span-1 flex justify-center">
                                    {reg.status === 'pending' ? (
                                        <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                            <Clock size={12} /> 대기
                                        </span>
                                    ) : (
                                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                            <Check size={12} /> 완료
                                        </span>
                                    )}
                                </div>
                                <div className="col-span-2 font-bold">{reg.name}</div>
                                <div className="col-span-2 text-gray-600">{reg.phone}</div>
                                <div className="col-span-1">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${reg.type === 'Youth' ? 'bg-sky-50 text-sky-600' :
                                        reg.type === 'Adult' ? 'bg-orange-50 text-orange-600' :
                                            reg.type === 'Trial' ? 'bg-purple-50 text-purple-600' :
                                                'bg-gray-100 text-gray-600'
                                        }`}>
                                        {reg.type === 'Trial' ? '체험 수업' : reg.type}
                                    </span>
                                </div>
                                {/* New column for Affiliation/Age/Team */}
                                <div className="col-span-2 text-gray-600">
                                    {reg.type === 'Youth' ? (
                                        <>
                                            {reg.affiliation && <div className="font-medium">{reg.affiliation}</div>}
                                            {reg.age && <div className="text-xs text-gray-500">{reg.age}세</div>}
                                            {!reg.affiliation && !reg.age && '-'}
                                        </>
                                    ) : reg.type === 'TNTW' ? (
                                        <div className="font-bold text-navy-900">{reg.team || '-'}</div>
                                    ) : reg.type === 'Trial' ? (
                                        <>
                                            <div className="font-medium">{reg.desiredClass}</div>
                                            <div className="text-xs text-gray-500">{reg.age}세</div>
                                        </>
                                    ) : (
                                        '-'
                                    )}
                                </div>
                                <div className="col-span-3 text-gray-400 text-xs">
                                    {format(new Date(reg.createdAt), "yyyy-MM-dd HH:mm")}
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <button
                                        onClick={() => toggleExpand(reg.id)}
                                        className="p-1 hover:bg-gray-200 rounded-full transition"
                                    >
                                        {expandedId === reg.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedId === reg.id && (
                                <div className="bg-gray-50 p-6 border-t border-gray-100 shadow-inner">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        {reg.type === 'Trial' ? (
                                            <>
                                                <div>
                                                    <h4 className="font-bold text-gray-500 text-xs mb-1">희망 수업</h4>
                                                    <p className="text-navy-900 font-medium">{reg.desiredClass || "-"}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-500 text-xs mb-1">상담 희망 방법</h4>
                                                    <p className="text-navy-900 font-medium">{reg.consultationMethod || "-"}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-500 text-xs mb-1">알게 된 경로</h4>
                                                    <p className="text-navy-900 font-medium">{reg.awarenessPath || "-"}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-500 text-xs mb-1">나이</h4>
                                                    <p className="text-navy-900 font-medium">{reg.age}세</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <h4 className="font-bold text-gray-500 text-xs mb-1">상세 주소</h4>
                                                    <p className="text-navy-900 font-medium">{reg.address || "-"}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-500 text-xs mb-1">이메일</h4>
                                                    <p className="text-navy-900 font-medium">{reg.email || "-"}</p>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <h4 className="font-bold text-gray-500 text-xs mb-1">축구 경험 / 비고</h4>
                                                    <p className="text-navy-900 font-medium whitespace-pre-wrap">{reg.experience || "없음"}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        {reg.status === 'pending' && (
                                            <button
                                                onClick={() => handleStatusUpdate(reg.id, 'completed')}
                                                className="px-4 py-2 bg-navy-900 text-white rounded-lg text-sm font-bold hover:bg-navy-800 transition shadow-sm"
                                            >
                                                상담 완료 처리
                                            </button>
                                        )}
                                        {reg.status === 'completed' && (
                                            <button
                                                onClick={() => handleStatusUpdate(reg.id, 'pending')}
                                                className="px-4 py-2 bg-white border border-gray-200 text-gray-500 rounded-lg text-sm font-bold hover:bg-gray-50 transition"
                                            >
                                                대기 상태로 변경
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
