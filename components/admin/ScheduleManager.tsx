"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Repeat, Calendar } from "lucide-react";
import { createSchedule, updateSchedule, deleteSchedule } from "@/app/actions/schedule";
import { format } from "date-fns";

interface Schedule {
    id: string;
    day: string | null;
    date: Date | null;
    isRecurring: boolean;
    startTime: string;
    endTime: string;
    className: string;
    color: string;
    currentUsers: number;
    maxUsers: number;
}

const DAYS = [
    { value: "Mon", label: "월요일" },
    { value: "Tue", label: "화요일" },
    { value: "Wed", label: "수요일" },
    { value: "Thu", label: "목요일" },
    { value: "Fri", label: "금요일" },
    { value: "Sat", label: "토요일" },
    { value: "Sun", label: "일요일" },
];

const COLORS = [
    { value: "blue", label: "파랑", bg: "bg-blue-500" },
    { value: "red", label: "빨강", bg: "bg-red-500" },
    { value: "green", label: "초록", bg: "bg-green-500" },
    { value: "yellow", label: "노랑", bg: "bg-yellow-500" },
    { value: "purple", label: "보라", bg: "bg-purple-500" },
    { value: "pink", label: "분홍", bg: "bg-pink-500" },
    { value: "gray", label: "회색", bg: "bg-gray-500" },
];

export default function ScheduleManager({ initialSchedules }: { initialSchedules: Schedule[] }) {
    const [schedules] = useState<Schedule[]>(initialSchedules);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [isRecurring, setIsRecurring] = useState(true);
    const [day, setDay] = useState("Mon");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("10:00");
    const [endTime, setEndTime] = useState("11:00");
    const [className, setClassName] = useState("");
    const [color, setColor] = useState("blue");
    const [maxUsers, setMaxUsers] = useState(12);

    const openModal = (schedule?: Schedule) => {
        if (schedule) {
            setEditingSchedule(schedule);
            setIsRecurring(schedule.isRecurring);
            setDay(schedule.day || "Mon");
            setDate(schedule.date ? format(new Date(schedule.date), "yyyy-MM-dd") : "");
            setStartTime(schedule.startTime);
            setEndTime(schedule.endTime);
            setClassName(schedule.className);
            setColor(schedule.color);
            setMaxUsers(schedule.maxUsers);
        } else {
            setEditingSchedule(null);
            setIsRecurring(true);
            setDay("Mon");
            setDate("");
            setStartTime("10:00");
            setEndTime("11:00");
            setClassName("");
            setColor("blue");
            setMaxUsers(12);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSchedule(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append("isRecurring", String(isRecurring));
        if (isRecurring) {
            formData.append("day", day);
        } else {
            formData.append("date", date);
        }
        formData.append("startTime", startTime);
        formData.append("endTime", endTime);
        formData.append("className", className);
        formData.append("color", color);
        formData.append("maxUsers", maxUsers.toString());

        try {
            if (editingSchedule) {
                await updateSchedule(editingSchedule.id, formData);
                window.location.reload();
            } else {
                await createSchedule(formData);
                window.location.reload();
            }
            closeModal();
        } catch (error) {
            console.error("Failed to save schedule", error);
            alert("Error saving schedule");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deleteSchedule(id);
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-navy-900">시간표 관리</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-navy-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-navy-800 transition"
                >
                    <Plus size={18} />
                    수업 추가
                </button>
            </div>

            {/* List View */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                        <tr>
                            <th className="p-4">유형</th>
                            <th className="p-4">일시</th>
                            <th className="p-4">시간</th>
                            <th className="p-4">수업명</th>
                            <th className="p-4">정원</th>
                            <th className="p-4 text-right">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {schedules.map((schedule) => (
                            <tr key={schedule.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    {schedule.isRecurring ? (
                                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                                            <Repeat size={12} /> 매주
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                                            <Calendar size={12} /> 날짜
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 font-medium text-navy-900">
                                    {schedule.isRecurring
                                        ? DAYS.find(d => d.value === schedule.day)?.label
                                        : schedule.date ? format(new Date(schedule.date), "yyyy-MM-dd") : "-"}
                                </td>
                                <td className="p-4 text-gray-600">
                                    {schedule.startTime} - {schedule.endTime}
                                </td>
                                <td className="p-4 font-bold">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${COLORS.find(c => c.value === schedule.color)?.bg}`} />
                                        {schedule.className}
                                    </div>
                                </td>
                                <td className="p-4 text-gray-600">
                                    {schedule.maxUsers}명
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => openModal(schedule)} className="p-1 text-gray-400 hover:text-sky-500 bg-gray-100 rounded">
                                            <Pencil size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(schedule.id)} className="p-1 text-gray-400 hover:text-red-500 bg-gray-100 rounded">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {schedules.length === 0 && (
                    <div className="p-12 text-center text-gray-400">등록된 수업이 없습니다.</div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-navy-900">
                                {editingSchedule ? "수업 수정" : "새 수업 추가"}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

                            {/* Toggle Type */}
                            <div className="flex bg-gray-100 p-1 rounded-lg mb-2">
                                <button
                                    type="button"
                                    onClick={() => setIsRecurring(true)}
                                    className={`flex-1 py-2 text-sm font-bold rounded-md transition flex items-center justify-center gap-2 ${isRecurring ? "bg-white text-navy-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <Repeat size={14} /> 매주 반복
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsRecurring(false)}
                                    className={`flex-1 py-2 text-sm font-bold rounded-md transition flex items-center justify-center gap-2 ${!isRecurring ? "bg-white text-navy-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <Calendar size={14} /> 특정 날짜
                                </button>
                            </div>

                            {isRecurring ? (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">요일</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {DAYS.map(d => (
                                            <button
                                                key={d.value}
                                                type="button"
                                                onClick={() => setDay(d.value)}
                                                className={`px-3 py-2 rounded-lg text-sm font-bold border transition ${day === d.value
                                                    ? "bg-navy-900 text-white border-navy-900"
                                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {d.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">날짜</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
                                        required={!isRecurring}
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">시작 시간</label>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">종료 시간</label>
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">수업명</label>
                                <input
                                    type="text"
                                    value={className}
                                    onChange={(e) => setClassName(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    placeholder="예: 유소년 취미반 A"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">색상</label>
                                <div className="flex gap-2 flex-wrap">
                                    {COLORS.map(c => (
                                        <button
                                            key={c.value}
                                            type="button"
                                            onClick={() => setColor(c.value)}
                                            className={`w-8 h-8 rounded-full border-2 transition flex items-center justify-center ${color === c.value ? "border-navy-900 scale-110 shadow-md" : "border-transparent"
                                                } ${c.bg}`}
                                            title={c.label}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">정원</label>
                                <input
                                    type="number"
                                    value={maxUsers}
                                    onChange={(e) => setMaxUsers(parseInt(e.target.value))}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    min="1"
                                    required
                                />
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
