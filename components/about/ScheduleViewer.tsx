"use client";

import { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";

interface Schedule {
    id: string;
    day: string | null;
    date: Date | null;
    isRecurring: boolean;
    startTime: string;
    endTime: string;
    className: string;
    color: string;
    maxUsers: number;
    currentUsers: number;
}

const DAY_MAP: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
};

const COLOR_MAP: Record<string, string> = {
    blue: "#3B82F6",    // blue-500
    red: "#EF4444",     // red-500
    green: "#22C55E",   // green-500
    yellow: "#EAB308",  // yellow-500
    purple: "#A855F7",  // purple-500
    pink: "#EC4899",    // pink-500
    gray: "#6B7280",    // gray-500
};

export default function ScheduleViewer({ schedules }: { schedules: Schedule[] }) {
    const events = schedules.map((s) => {
        const baseEvent = {
            id: s.id,
            title: s.className,
            startTime: s.startTime,
            endTime: s.endTime,
            backgroundColor: COLOR_MAP[s.color] || "#6B7280",
            borderColor: COLOR_MAP[s.color] || "#6B7280",
            textColor: "#FFFFFF",
            extendedProps: {
                maxUsers: s.maxUsers,
                currentUsers: s.currentUsers,
            },
        };

        if (s.isRecurring && s.day) {
            return {
                ...baseEvent,
                daysOfWeek: [DAY_MAP[s.day]], // 0-6
            };
        } else if (s.date) {
            return {
                ...baseEvent,
                start: new Date(s.date).toISOString().split('T')[0] + 'T' + s.startTime,
                end: new Date(s.date).toISOString().split('T')[0] + 'T' + s.endTime,
            };
        }
        return null;
    }).filter(Boolean);

    const calendarRef = useRef<FullCalendar>(null);

    const handleTodayClick = () => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            calendarApi.today();
            // Trigger animation manually
            setTimeout(() => {
                const todayCell = document.querySelector('.fc-day-today') as HTMLElement;
                if (todayCell) {
                    todayCell.classList.remove('animate-pulse-fast');
                    void todayCell.offsetWidth; // Trigger reflow
                    todayCell.classList.add('animate-pulse-fast');
                }
            }, 50); // Small delay to ensure DOM update
        }
    };

    return (
        <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100 calendar-wrapper">
            <style jsx global>{`
        .fc-toolbar-title { font-size: 1.5rem !important; font-weight: 800 !important; color: #1B254B; }
        .fc-button-primary { background-color: #1B254B !important; border-color: #1B254B !important; padding: 0.5rem 1rem !important; font-weight: 700 !important; }
        .fc-button-primary:hover { background-color: #0F172A !important; border-color: #0F172A !important; }
        
        /* Today Highlight - Yellow Theme */
        .fc-day-today { 
            background-color: rgba(253, 224, 71, 0.15) !important;
            border: 2px solid #EAB308 !important;
        }
        .fc-day-today .fc-daygrid-day-number { color: #854D0E !important; font-weight: 900 !important; font-size: 1.1rem !important; }

        /* Pulse Animation */
        @keyframes pulse-fast {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.7); }
            50% { transform: scale(1.03); box-shadow: 0 0 0 10px rgba(234, 179, 8, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(234, 179, 8, 0); }
        }
        .animate-pulse-fast {
            animation: pulse-fast 0.6s ease-in-out 3; /* 3 times */
            z-index: 20;
            position: relative;
        }

        /* Clean Month View - Hide other month days completely */
        .fc-day-other { visibility: hidden !important; height: 0 !important; border: none !important; }
        .fc-scrollgrid-sync-table { height: auto !important; }
        .fc-view-harness { height: auto !important; }

        /* Cell Height & Spacing */
        .fc-daygrid-day-frame { min-height: 150px !important; }
        .fc-daygrid-day-top { flex-direction: row; padding: 4px !important; }
        .fc-col-header-cell-cushion { color: #4B5563; font-weight: 800; font-size: 1rem; padding: 12px 0 !important; }
        .fc-daygrid-day-number { color: #6B7280; font-weight: 600; font-size: 0.9rem; padding: 8px !important; }

        /* Event Styling */
        .fc-event { border-radius: 6px; padding: 4px 6px; border: none; margin-bottom: 4px !important; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
      `}</style>
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={koLocale}
                fixedWeekCount={false}
                showNonCurrentDates={false}
                customButtons={{
                    myToday: {
                        text: '오늘',
                        click: handleTodayClick
                    }
                }}
                headerToolbar={{
                    left: "prev,next myToday",
                    center: "title",
                    right: "dayGridMonth,dayGridWeek",
                }}
                dayMaxEvents={false}
                events={events as unknown as import("@fullcalendar/core").EventSourceInput}
                eventContent={(eventInfo) => (
                    <div className="flex flex-col overflow-hidden">
                        <div className="font-bold text-sm truncate leading-snug">{eventInfo.event.title}</div>
                        <div className="text-[11px] opacity-90 flex justify-between items-center mt-1">
                            <span>{eventInfo.timeText}</span>
                            <span className="bg-black/10 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                {eventInfo.event.extendedProps.currentUsers}/{eventInfo.event.extendedProps.maxUsers}
                            </span>
                        </div>
                    </div>
                )}
                height="auto"
                contentHeight="auto"
            />
        </div>
    );
}
