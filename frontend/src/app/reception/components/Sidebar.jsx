"use client";

import { useState, useMemo } from "react";
import { Select } from "antd";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Search } from "lucide-react";
import { DAYS_OF_WEEK, MONTH_NAMES, getDaysInMonth, getFirstDayOfMonth } from "./constants";

export default function Sidebar({ selectedDate, onSelectDate, areas }) {
    const [curMonth, setCurMonth] = useState(selectedDate.getMonth());
    const [curYear, setCurYear] = useState(selectedDate.getFullYear());
    const [roomOpen, setRoomOpen] = useState(true);
    const [waitOpen, setWaitOpen] = useState(true);

    const today = new Date();
    const daysInMonth = getDaysInMonth(curYear, curMonth);
    const firstDay = getFirstDayOfMonth(curYear, curMonth);
    const prevDays = getDaysInMonth(curYear, curMonth - 1);

    const cells = useMemo(() => {
        const c = [];
        for (let i = firstDay - 1; i >= 0; i--) c.push({ d: prevDays - i, t: "prev" });
        for (let d = 1; d <= daysInMonth; d++) c.push({ d, t: "cur" });
        const rem = 42 - c.length;
        for (let i = 1; i <= rem; i++) c.push({ d: i, t: "next" });
        return c;
    }, [curYear, curMonth, daysInMonth, firstDay, prevDays]);

    const isToday = (c) =>
        c.t === "cur" && c.d === today.getDate() && curMonth === today.getMonth() && curYear === today.getFullYear();
    const isSel = (c) =>
        c.t === "cur" && c.d === selectedDate.getDate() && curMonth === selectedDate.getMonth() && curYear === selectedDate.getFullYear();

    const prevM = () => { if (curMonth === 0) { setCurMonth(11); setCurYear(curYear - 1); } else setCurMonth(curMonth - 1); };
    const nextM = () => { if (curMonth === 11) { setCurMonth(0); setCurYear(curYear + 1); } else setCurMonth(curMonth + 1); };

    const todayDayOfWeek = today.toLocaleDateString("vi-VN", { weekday: "long" });
    const todayFmtDate = today.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });

    return (
        <div className="w-[250px] min-w-[250px] border-r border-gray-200 bg-white flex flex-col text-sm overflow-y-auto shrink-0">
            {/* Calendar */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-800 text-sm">{MONTH_NAMES[curMonth]}, {curYear}</span>
                    <div className="flex gap-1">
                        <button onClick={prevM} className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer">
                            <ChevronLeft className="w-4 h-4 text-gray-500" />
                        </button>
                        <button onClick={nextM} className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer">
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 text-center mb-1">
                    {DAYS_OF_WEEK.map((d) => (
                        <span key={d} className="text-xs text-gray-500 leading-5">{d}</span>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-7 text-center">
                    {cells.map((c, i) => (
                        <button
                            key={i}
                            onClick={() => c.t === "cur" && onSelectDate(new Date(curYear, curMonth, c.d))}
                            className={`
                w-7 h-7 text-xs rounded-full flex items-center justify-center mx-auto cursor-pointer transition
                ${c.t !== "cur" ? "text-gray-300" : "text-gray-700 hover:bg-blue-50"}
                ${isToday(c) ? "bg-blue-600 text-white font-bold hover:bg-blue-700" : ""}
                ${isSel(c) && !isToday(c) ? "bg-blue-100 text-blue-700 font-semibold" : ""}
              `}
                        >
                            {c.d}
                        </button>
                    ))}
                </div>

                {/* Today link */}
                <div className="mt-2 text-xs leading-tight">
                    <button
                        onClick={() => { onSelectDate(new Date()); setCurMonth(today.getMonth()); setCurYear(today.getFullYear()); }}
                        className="text-blue-600 hover:underline cursor-pointer"
                    >
                        Hôm nay
                    </button>
                    <span className="text-gray-400 ml-1 capitalize">{todayDayOfWeek}, {todayFmtDate}</span>
                </div>
            </div>

            {/* Phòng/Bàn */}
            <div className="border-b border-gray-100">
                <button onClick={() => setRoomOpen(!roomOpen)} className="flex items-center justify-between w-full px-4 py-3 font-semibold text-sm text-gray-800 hover:bg-gray-50 cursor-pointer">
                    Phòng/Bàn
                    {roomOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
                </button>
                {roomOpen && (
                    <div className="px-4 pb-3">
                        <Select
                            className="w-full"
                            size="middle"
                            showSearch
                            placeholder="Tìm phòng/bàn..."
                            defaultValue="all"
                            popupMatchSelectWidth={false}
                            filterOption={(input, option) =>
                                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                            }
                            options={[
                                { label: "Tất cả", value: "all" },
                                ...(areas || []).map((a) => ({ label: a.areaName, value: a._id })),
                            ]}
                        />
                    </div>
                )}
            </div>

            {/* Chờ xếp bàn */}
            <div className="border-b border-gray-100">
                <button onClick={() => setWaitOpen(!waitOpen)} className="flex items-center justify-between w-full px-4 py-3 font-semibold text-sm text-gray-800 hover:bg-gray-50 cursor-pointer">
                    Chờ xếp bàn
                    {waitOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {waitOpen && (
                    <div className="px-4 pb-3">
                        <div className="relative mb-2">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                placeholder="Tìm theo khách đặt"
                                className="w-full border border-gray-200 rounded-lg text-sm py-2 pl-8 pr-3 outline-none focus:border-blue-400 transition"
                            />
                        </div>
                        <div className="text-xs text-orange-500 border border-orange-300 rounded-lg px-3 py-2 text-center bg-orange-50">
                            Không có phiếu đặt nào
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
