"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Repeat, Calendar } from "lucide-react";
import { createSchedule, updateSchedule, deleteSchedule, createBatchSchedules } from "@/app/actions/schedule";
import { format } from "date-fns";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

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
    { value: "pink", label: "분홍", bg: "bg-pink-500", hex: "#ec4899" },
    { value: "gray", label: "회색", bg: "bg-gray-500", hex: "#6b7280" },
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

    const handleBatchSubmit = async () => {
        if (!confirm("4주치 일정을 일괄 등록하시겠습니까?")) return;
        setIsLoading(true);

        const formData = new FormData();
        formData.append("isRecurring", "false");
        formData.append("date", date);
        formData.append("startTime", startTime);
        formData.append("endTime", endTime);
        formData.append("className", className);
        formData.append("color", color);
        formData.append("maxUsers", maxUsers.toString());

        try {
            await createBatchSchedules(formData);
            window.location.reload();
            closeModal();
        } catch (error) {
            console.error("Failed to save batch schedules", error);
            alert("일괄 등록에 실패했습니다.");
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

            {/* Calendar View */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <style jsx global>{`
                    .fc .fc-toolbar-title {
                        font-size: 1.25rem !important;
                        font-weight: 800;
                        color: #1e293b;
                    }
                    .fc-button-primary {
                        background-color: #0f172a !important;
                        border-color: #0f172a !important;
                    }
                    .fc-event {
                        cursor: pointer;
                        border: none;
                        border-radius: 4px;
                        padding: 2px 4px;
                        margin-bottom: 2px;
                    }
                    .fc-daygrid-day-number {
                        font-size: 0.875rem;
                        font-weight: 500;
                        color: #475569;
                    }
                `}</style>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    locale="ko"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,dayGridWeek"
                    }}
                    showNonCurrentDates={false}
                    fixedWeekCount={false}
                    events={schedules.map(schedule => {
                        const evtColor = COLORS.find(c => c.value === schedule.color)?.hex || "#3b82f6";
                        if (schedule.isRecurring) {
                            const dayMap: { [key: string]: number } = { "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6 };
                            return {
                                id: schedule.id,
                                title: `${schedule.startTime} ${schedule.className}`,
                                daysOfWeek: [dayMap[schedule.day || "Mon"]],
                                startTime: schedule.startTime,
                                endTime: schedule.endTime,
                                backgroundColor: evtColor,
                                borderColor: evtColor,
                                extendedProps: { ...schedule }
                            };
                        } else {
                            const d = schedule.date ? format(new Date(schedule.date), "yyyy-MM-dd") : "";
                            return {
                                id: schedule.id,
                                title: `${schedule.startTime} ${schedule.className}`,
                                start: `${d}T${schedule.startTime}`,
                                end: `${d}T${schedule.endTime}`,
                                backgroundColor: evtColor,
                                borderColor: evtColor,
                                extendedProps: { ...schedule }
                            };
                        }
                    })}
                    dateClick={(info) => {
                        setEditingSchedule(null);
                        setIsRecurring(false);
                        setDate(info.dateStr);
                        setStartTime("10:00");
                        setEndTime("11:00");
                        setClassName("");
                        setColor("blue");
                        setMaxUsers(12);
                        setIsModalOpen(true);
                    }}
                    eventClick={(info) => {
                        openModal(info.event.extendedProps as Schedule);
                    }}
                    height="auto"
                />
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-navy-900">
                                {editingSchedule ? "수업 수정" : "새 수업 추가"}
                            </h3>
                            {editingSchedule && (
                                <button type="button" onClick={() => handleDelete(editingSchedule.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-4 justify-start mr-auto flex items-center gap-1 text-sm font-bold">
                                    <Trash2 size={16} /> 삭제
                                </button>
                            )}
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

                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                <div className="flex gap-2">
                                    {!editingSchedule && !isRecurring && (
                                        <button
                                            type="button"
                                            onClick={handleBatchSubmit}
                                            disabled={isLoading}
                                            className="px-4 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition disabled:opacity-50 text-sm flex items-center gap-1"
                                        >
                                            <Calendar size={16} />
                                            한 달 일괄 등록 (4주)
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-3">
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
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
