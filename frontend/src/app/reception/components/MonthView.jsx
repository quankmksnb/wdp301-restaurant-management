"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { STATUS_COLORS } from "./constants";

export default function MonthView({ reservations, statusFilters, selectedDate, onSelectDate }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    const MONTH_NAMES_FULL = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

    const goMonth = (delta) => {
        const d = new Date(selectedDate);
        d.setDate(1);
        d.setMonth(d.getMonth() + delta);
        onSelectDate(d);
    };

    // Build calendar cells (6 weeks × 7 days)
    const cells = useMemo(() => {
        const firstDay = new Date(year, month, 1).getDay();
        const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Mon = 0
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        const grid = [];
        for (let i = 0; i < startOffset; i++) {
            grid.push({ day: daysInPrevMonth - startOffset + 1 + i, type: "prev", date: new Date(year, month - 1, daysInPrevMonth - startOffset + 1 + i) });
        }
        for (let d = 1; d <= daysInMonth; d++) {
            grid.push({ day: d, type: "cur", date: new Date(year, month, d) });
        }
        const rem = 42 - grid.length;
        for (let i = 1; i <= rem; i++) {
            grid.push({ day: i, type: "next", date: new Date(year, month + 1, i) });
        }
        return grid;
    }, [year, month]);

    const getResForDate = (date) => {
        return (reservations || []).filter(r => {
            const filt = statusFilters ? statusFilters[r.status] : true;
            return filt && r.startTime.toDateString() === date.toDateString();
        });
    };

    const DOW = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
            {/* Month navigation header */}
            <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-200 bg-white">
                <button onClick={() => goMonth(-1)} className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <span className="font-semibold text-gray-800 text-sm">{MONTH_NAMES_FULL[month]} {year}</span>
                <button onClick={() => goMonth(1)} className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
            </div>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 border-b border-gray-200">
                {DOW.map(d => (
                    <div key={d} className="py-2 text-center text-xs font-semibold text-gray-500 border-r last:border-r-0 border-gray-200">
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-6 overflow-hidden">
                {cells.map((cell, idx) => {
                    const isToday = cell.date.toDateString() === today.toDateString();
                    const isSelected = cell.date.toDateString() === selectedDate.toDateString();
                    const isOtherMonth = cell.type !== "cur";
                    const dayRes = getResForDate(cell.date);

                    return (
                        <div
                            key={idx}
                            onClick={() => onSelectDate(cell.date)}
                            className={`border-r border-b border-gray-200 last:border-r-0 flex flex-col p-1.5 cursor-pointer overflow-hidden transition hover:bg-gray-50/80
                                ${isOtherMonth ? "bg-gray-50/40" : "bg-white"}`}
                        >
                            {/* Day number */}
                            <div className="flex items-center mb-1">
                                <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full
                                    ${isToday ? "bg-blue-600 text-white font-bold" : isSelected && !isOtherMonth ? "bg-blue-100 text-blue-700 font-semibold" : isOtherMonth ? "text-gray-300" : "text-gray-700"}`}>
                                    {cell.day}
                                </span>
                            </div>

                            {/* Reservation chips */}
                            <div className="flex flex-col gap-0.5 overflow-hidden">
                                {dayRes.slice(0, 3).map(res => {
                                    const col = STATUS_COLORS[res.status] || STATUS_COLORS.confirmed;
                                    const fmtT = res.startTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
                                    return (
                                        <div
                                            key={res._id}
                                            className="flex items-center gap-1 rounded px-1 py-0.5 text-[10px] truncate"
                                            style={{ backgroundColor: col.bg, color: col.text, borderLeft: `3px solid ${col.border}` }}
                                        >
                                            <span className="font-medium shrink-0">{fmtT}</span>
                                            <span className="truncate">{res.customerName}</span>
                                            <span className="ml-auto flex items-center gap-0.5 shrink-0">
                                                <Users className="w-2.5 h-2.5" />{(res.guests?.adults || 0) + (res.guests?.children || 0)}
                                            </span>
                                        </div>
                                    );
                                })}
                                {dayRes.length > 3 && (
                                    <div className="text-[10px] text-gray-400 px-1">+{dayRes.length - 3} more</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
