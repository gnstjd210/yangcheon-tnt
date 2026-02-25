"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteTrialRegistration } from "@/app/actions/trials";

type TrialRegistration = {
    id: string;
    name: string;
    phone: string;
    childAge: string;
    desiredClass: string;
    consultationMethod: string;
    awarenessPath: string | null;
    createdAt: Date;
};

const TABS = [
    { key: "전체", label: "전체" },
    { key: "전화", label: "전화상담" },
    { key: "방문", label: "축구교실방문" },
    { key: "메시지", label: "메세지상담" }
];

export default function TrialManager({ initialTrials }: { initialTrials: TrialRegistration[] }) {
    const [trials, setTrials] = useState(initialTrials);
    const [activeTab, setActiveTab] = useState("전체");

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.")) return;

        try {
            await deleteTrialRegistration(id);
            setTrials(trials.filter(t => t.id !== id));
            alert("삭제되었습니다.");
        } catch {
            alert("식제에 실패했습니다.");
        }
    };

    const filteredTrials = trials.filter(trial => {
        if (activeTab === "전체") return true;
        return trial.consultationMethod === activeTab;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-black text-navy-900 tracking-tight">체험수업 신청 관리</h1>
                <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition ${activeTab === tab.key
                                ? "bg-navy-900 text-white shadow-md transform scale-105"
                                : "text-gray-500 hover:text-navy-900 hover:bg-gray-50 bg-transparent"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-sm">
                                <th className="px-5 py-4 font-bold text-gray-500 w-24">이름</th>
                                <th className="px-5 py-4 font-bold text-gray-500 w-40">연락처</th>
                                <th className="px-5 py-4 font-bold text-gray-500 w-24">자녀나이</th>
                                <th className="px-5 py-4 font-bold text-gray-500 max-w-[250px]">희망수업</th>
                                <th className="px-5 py-4 font-bold text-gray-500 w-32">유입경로</th>
                                <th className="px-5 py-4 font-bold text-gray-500 min-w-[130px]">상담방법</th>
                                <th className="px-5 py-4 font-bold text-gray-500 w-40">신청일시</th>
                                <th className="px-5 py-4 font-bold text-gray-500 w-20 text-center">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTrials.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-400">
                                        등록된 체험수업 신청이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                filteredTrials.map(trial => (
                                    <tr key={trial.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                        <td className="px-5 py-4 font-bold text-navy-900">{trial.name}</td>
                                        <td className="px-5 py-4 font-mono text-sm text-gray-600 tracking-tight">{trial.phone}</td>
                                        <td className="px-5 py-4 text-sm font-medium">{trial.childAge}</td>
                                        <td className="px-5 py-4 text-sm font-medium truncate max-w-[250px]" title={trial.desiredClass}>
                                            {trial.desiredClass}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded text-[11px] font-bold whitespace-nowrap">
                                                {trial.awarenessPath || "-"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-tight whitespace-nowrap ${trial.consultationMethod === '축구교실방문' || trial.consultationMethod === '방문' ? 'bg-indigo-50 text-indigo-600' :
                                                trial.consultationMethod === '전화상담' || trial.consultationMethod === '전화' ? 'bg-sky-50 text-sky-600' :
                                                    'bg-green-50 text-green-600'
                                                }`}>
                                                {trial.consultationMethod}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-500">
                                            {new Date(trial.createdAt).toLocaleDateString()}
                                            <br />
                                            <span className="text-xs text-gray-400">
                                                {new Date(trial.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <button
                                                onClick={() => handleDelete(trial.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                                                title="삭제하기"
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
        </div>
    );
}
