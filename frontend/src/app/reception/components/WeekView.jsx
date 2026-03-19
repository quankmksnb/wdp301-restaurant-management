"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { ChevronRight, ChevronDown, X, Clock, Users, MapPin } from "lucide-react";
import { HOURS, CELL_WIDTH, ROW_HEIGHT, HEADER_HOURS, HEADER_CELL_WIDTH, STATUS_COLORS } from "./constants";

export default function WeekView({ areas, tables, reservations, statusFilters, onCellClick, selectedDate, onEditReservation, onStatusChange }) {
    const [collapsedAreas, setCollapsedAreas] = useState({});
    const [currentTimePos, setCurrentTimePos] = useState(0);
    const [activePopover, setActivePopover] = useState(null);
    const scrollRef = useRef(null);
    const popoverRef = useRef(null);

    // Get Mon–Sun of the selected week
    const weekDays = useMemo(() => {
        const d = new Date(selectedDate);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const mon = new Date(selectedDate);
        mon.setDate(diff);
        mon.setHours(0, 0, 0, 0);
        return Array.from({ length: 7 }, (_, i) => {
            const dt = new Date(mon);
            dt.setDate(mon.getDate() + i);
            return dt;
        });
    }, [selectedDate]);

    // Current time position
    useEffect(() => {
        const tick = () => {
            const n = new Date();
            setCurrentTimePos((n.getHours() + n.getMinutes() / 60) * CELL_WIDTH);
        };
        tick();
        const iv = setInterval(tick, 60000);
        return () => clearInterval(iv);
    }, []);

    // Auto-scroll to current time
    useEffect(() => {
        if (scrollRef.current && currentTimePos > 0) {
            const today = new Date();
            const todayIdx = weekDays.findIndex(d => d.toDateString() === today.toDateString());
            if (todayIdx !== -1) {
                const offset = todayIdx * CELL_WIDTH * 24 + Math.max(0, currentTimePos - 200);
                scrollRef.current.scrollLeft = offset;
            }
        }
    }, [currentTimePos, weekDays]);

    // Close popover on outside click
    useEffect(() => {
        const h = (e) => { if (popoverRef.current && !popoverRef.current.contains(e.target)) setActivePopover(null); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    const grouped = useMemo(() => {
        if (!areas || !tables) return [];
        return areas.map(a => ({
            ...a,
            tables: tables.filter(t => (t.area?._id || t.area) === a._id),
        }));
    }, [areas, tables]);

    const toggleArea = (id) => setCollapsedAreas(p => ({ ...p, [id]: !p[id] }));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const DAY_FULL = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    const TOTAL_DAY_WIDTH = CELL_WIDTH * 24;

    const fmtTime = (d) => d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Scrollable grid */}
            <div ref={scrollRef} className="flex-1 overflow-x-auto overflow-y-auto">
                <div style={{ width: TOTAL_DAY_WIDTH * 7 }}>
                    {/* Day headers */}
                    <div className="flex sticky top-0 z-[8] bg-white border-b border-gray-200" style={{ height: 40 }}>
                        {weekDays.map((d, i) => {
                            const isToday = d.toDateString() === today.toDateString();
                            const isSelected = d.toDateString() === selectedDate.toDateString();
                            return (
                                <div
                                    key={i}
                                    className={`shrink-0 border-r border-gray-200 flex items-center justify-center text-xs font-semibold
                                        ${isToday ? "bg-blue-600 text-white" : isSelected ? "bg-blue-50 text-blue-700" : "text-gray-600"}`}
                                    style={{ width: TOTAL_DAY_WIDTH }}
                                >
                                    {DAY_FULL[d.getDay()]}, {d.getDate()} Tháng {d.getMonth() + 1}, {d.getFullYear()}
                                </div>
                            );
                        })}
                    </div>

                    {/* Hour sub-headers */}
                    <div className="flex sticky top-[40px] z-[7] border-b border-gray-200 bg-blue-50" style={{ height: 36 }}>
                        {weekDays.map((d, di) => (
                            HEADER_HOURS.map(h => (
                                <div
                                    key={`${di}-${h}`}
                                    className="shrink-0 border-r border-blue-100 flex items-center justify-center text-xs text-blue-800 font-semibold"
                                    style={{ width: HEADER_CELL_WIDTH }}
                                >
                                    {String(h).padStart(2, "0")}:00
                                </div>
                            ))
                        ))}
                    </div>

                    {/* Rows */}
                    {grouped.map(area => (
                        <div key={area._id}>
                            {/* Area row */}
                            <div className="bg-gray-100 border-b border-gray-200" style={{ height: ROW_HEIGHT, width: TOTAL_DAY_WIDTH * 7 }} />

                            {/* Table rows */}
                            {!collapsedAreas[area._id] && area.tables.map(tbl => {
                                const tblRes = (reservations || []).filter(r => {
                                    const match = r.tableId === tbl._id || r.tableName === tbl.tableName;
                                    const filt = statusFilters ? statusFilters[r.status] : true;
                                    return match && filt;
                                });
                                return (
                                    <div key={tbl._id} className="flex border-b border-gray-100 relative" style={{ height: ROW_HEIGHT }}>
                                        {weekDays.map((d, di) => {
                                            const dayRes = tblRes.filter(r =>
                                                r.startTime.toDateString() === d.toDateString()
                                            );
                                            return (
                                                <div key={di} className="shrink-0 relative" style={{ width: TOTAL_DAY_WIDTH }}>
                                                    {/* Hour cells */}
                                                    <div className="flex h-full">
                                                        {HOURS.map(h => (
                                                            <div
                                                                key={h}
                                                                onClick={() => onCellClick(tbl, h)}
                                                                className="shrink-0 border-r border-gray-100 cursor-pointer hover:bg-blue-50/40 h-full transition"
                                                                style={{ width: CELL_WIDTH }}
                                                            />
                                                        ))}
                                                    </div>
                                                    {/* Day boundary */}
                                                    <div className="absolute top-0 bottom-0 right-0 w-px bg-gray-300" />

                                                    {/* Reservations */}
                                                    {dayRes.map(res => {
                                                        const sH = res.startTime.getHours() + res.startTime.getMinutes() / 60;
                                                        const eH = res.endTime.getHours() + res.endTime.getMinutes() / 60;
                                                        const left = sH * CELL_WIDTH;
                                                        const w = Math.max((eH - sH) * CELL_WIDTH, 30);
                                                        const col = STATUS_COLORS[res.status] || STATUS_COLORS.confirmed;
                                                        const isActive = activePopover === res._id;
                                                        return (
                                                            <div key={res._id}>
                                                                <div
                                                                    onClick={e => { e.stopPropagation(); setActivePopover(isActive ? null : res._id); }}
                                                                    className={`absolute top-[3px] rounded border flex items-center px-1.5 text-[9px] truncate z-[2] cursor-pointer hover:shadow transition-shadow ${isActive ? "ring-2 ring-blue-400 shadow" : ""}`}
                                                                    style={{ left, width: w, height: ROW_HEIGHT - 6, backgroundColor: col.bg, borderColor: col.border, color: col.text }}
                                                                >
                                                                    {res.customerName}
                                                                </div>
                                                                {isActive && (
                                                                    <div
                                                                        ref={popoverRef}
                                                                        className="absolute z-50 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
                                                                        style={{ left: left + Math.min(w / 2, 60), top: ROW_HEIGHT + 2, width: 320 }}
                                                                    >
                                                                        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.dot }} />
                                                                                <span className="text-xs font-bold text-gray-900">{res.customerName}</span>
                                                                                <span className="text-[10px] text-gray-500">{res.phone}</span>
                                                                            </div>
                                                                            <button onClick={e => { e.stopPropagation(); setActivePopover(null); }} className="p-1 rounded hover:bg-gray-200 cursor-pointer"><X className="w-3.5 h-3.5 text-gray-500" /></button>
                                                                        </div>
                                                                        <div className="px-3 py-2 space-y-1.5 text-[11px] text-gray-700">
                                                                            <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-gray-400" />{fmtTime(res.startTime)} - {fmtTime(res.endTime)}</div>
                                                                            <div className="flex items-center gap-1.5"><Users className="w-3 h-3 text-gray-400" />{(res.guests?.adults || 0) + (res.guests?.children || 0)} khách</div>
                                                                            <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-gray-400" />{res.tableName}</div>
                                                                        </div>
                                                                        <div className="flex items-center justify-center gap-2 px-3 py-2 border-t border-gray-100 bg-gray-50">
                                                                            {res.status !== "cancelled" && (
                                                                                <button onClick={(e) => { e.stopPropagation(); onStatusChange(res.reservationId, "cancelled"); setActivePopover(null); }} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-medium rounded cursor-pointer transition">🗑 Hủy đặt</button>
                                                                            )}
                                                                            {res.status !== "cancelled" && (
                                                                                <button onClick={(e) => { e.stopPropagation(); onEditReservation(res); setActivePopover(null); }} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-[10px] font-medium rounded cursor-pointer transition">📝 Cập nhật</button>
                                                                            )}
                                                                            {res.status !== "seated" && res.status !== "cancelled" && (
                                                                                <button onClick={(e) => { e.stopPropagation(); onStatusChange(res.reservationId, "seated"); setActivePopover(null); }} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-medium rounded cursor-pointer transition">✅ Nhận bàn</button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}

                                                    {/* Current time indicator for today */}
                                                    {d.toDateString() === today.toDateString() && (
                                                        <div className="absolute top-0 bottom-0 z-[3] pointer-events-none" style={{ left: currentTimePos }}>
                                                            <div className="w-[2px] h-full bg-red-500 opacity-70" />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
