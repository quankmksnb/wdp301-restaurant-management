"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
    ChevronRight, ChevronDown, X, Pencil, Printer,
    Clock, Users, MapPin, CreditCard, UtensilsCrossed,
} from "lucide-react";
import {
    HOURS, CELL_WIDTH, ROW_HEIGHT, SIDEBAR_WIDTH,
    HEADER_HOURS, HEADER_CELL_WIDTH, STATUS_COLORS,
} from "./constants";

export default function Timeline({ areas, tables, reservations, statusFilters, onCellClick, onStatusChange, onEditReservation, selectedDate, viewMode }) {
    const [collapsedAreas, setCollapsedAreas] = useState({});
    const [currentTimePos, setCurrentTimePos] = useState(0);
    const [activePopover, setActivePopover] = useState(null);
    const scrollRef = useRef(null);
    const popoverRef = useRef(null);

    // Đóng popover khi click bên ngoài
    useEffect(() => {
        const handler = (e) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target)) setActivePopover(null);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Vị trí thời gian hiện tại (chỉ cho chế độ xem ngày)
    useEffect(() => {
        const tick = () => {
            const n = new Date();
            setCurrentTimePos(((n.getHours() - 6) + n.getMinutes() / 60) * CELL_WIDTH);
        };
        tick();
        const iv = setInterval(tick, 60000);
        return () => clearInterval(iv);
    }, []);

    // Tự động cuộn (chỉ cho chế độ xem ngày)
    useEffect(() => {
        if (viewMode === "day" && scrollRef.current && currentTimePos > 0) {
            scrollRef.current.scrollLeft = Math.max(0, currentTimePos - 400);
        }
    }, [currentTimePos, viewMode]);

    // Nhóm bàn theo khu vực
    const grouped = useMemo(() => {
        if (!areas || !tables) return [];
        return areas.map((a) => ({
            ...a,
            tables: tables.filter((t) => (t.area?._id || t.area) === a._id),
        }));
    }, [areas, tables]);

    const toggleArea = (id) => setCollapsedAreas((p) => ({ ...p, [id]: !p[id] }));

    const getTableRes = (tableId, tableName) =>
        (reservations || []).filter((r) => {
            const match = r.tableId === tableId || r.tableName === tableName;
            const filt = statusFilters ? statusFilters[r.status] : true;
            return match && filt;
        });

    const fmtTime = (d) => d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

    // ─── Tính cột dựa trên chế độ xem ───
    const columns = useMemo(() => {
        if (viewMode === "day") {
            return HOURS.map((h) => ({
                key: `h-${h}`,
                label: `${String(h).padStart(2, "0")}:00`,
                width: CELL_WIDTH,
            }));
        }

        if (viewMode === "week") {
            // Lấy ngày thứ 2 của tuần đã chọn
            const d = new Date(selectedDate);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            const monday = new Date(d.setDate(diff));
            const cols = [];
            const weekDayNames = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
            for (let i = 0; i < 7; i++) {
                const date = new Date(monday);
                date.setDate(monday.getDate() + i);
                cols.push({
                    key: `d-${i}`,
                    label: `${weekDayNames[i]} ${date.getDate()}/${date.getMonth() + 1}`,
                    width: 180,
                    date,
                });
            }
            return cols;
        }

        if (viewMode === "month") {
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const cols = [];
            const weekDayShort = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
            for (let d = 1; d <= daysInMonth; d++) {
                const date = new Date(year, month, d);
                const wd = weekDayShort[date.getDay()];
                cols.push({
                    key: `m-${d}`,
                    label: `${wd} ${d}`,
                    width: 80,
                    date,
                });
            }
            return cols;
        }
        return [];
    }, [viewMode, selectedDate]);

    const totalWidth = columns.reduce((s, c) => s + c.width, 0);

    // ─── Cột header nhóm 3 giờ (chỉ cho chế độ xem ngày) ───
    const headerColumns = useMemo(() => {
        if (viewMode === "day") {
            return HEADER_HOURS.map((h) => ({
                key: `hh-${h}`,
                label: `${String(h).padStart(2, "0")}:00`,
                width: HEADER_CELL_WIDTH,
            }));
        }
        return columns;
    }, [viewMode, columns]);

    return (
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Khu vực cuộn Timeline */}
            <div className="flex flex-1 min-h-0">
                {/* Cột cố định bên trái: PHÒNG/BÀN */}
                <div className="shrink-0 border-r border-gray-200 bg-white z-10" style={{ width: SIDEBAR_WIDTH }}>
                    {/* Góc trên bên trái */}
                    <div className="border-b border-gray-200">
                        <div className="h-9 px-3 flex items-center font-bold text-sm text-gray-800 uppercase tracking-wide bg-blue-50">
                            PHÒNG/BÀN
                        </div>
                    </div>

                    {/* Hàng khu vực + bàn */}
                    {grouped.map((area) => (
                        <div key={area._id}>
                            <div
                                onClick={() => toggleArea(area._id)}
                                className="flex items-center gap-1 px-2 cursor-pointer bg-gray-100 hover:bg-gray-200 transition border-b border-gray-200"
                                style={{ height: ROW_HEIGHT }}
                            >
                                {collapsedAreas[area._id]
                                    ? <ChevronRight className="w-3 h-3 text-gray-500" />
                                    : <ChevronDown className="w-3 h-3 text-gray-500" />}
                                <span className="text-sm font-semibold text-gray-500">{area.areaName}</span>
                            </div>

                            {!collapsedAreas[area._id] && area.tables.map((tbl) => (
                                <div
                                    key={tbl._id}
                                    className="flex items-center px-2 pl-5 border-b border-gray-100"
                                    style={{ height: ROW_HEIGHT }}
                                >
                                    <span className="text-sm text-gray-700 truncate">{tbl.tableName}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Lưới timeline có thể cuộn */}
                <div ref={scrollRef} className="flex-1 overflow-x-auto overflow-y-auto">
                    <div className="relative" style={{ width: totalWidth }}>
                        {/* Hàng tiêu đề */}
                        <div className="flex border-b border-gray-200 bg-blue-50 sticky top-0 z-[5] h-9">
                            {headerColumns.map((col) => (
                                <div
                                    key={col.key}
                                    className={`shrink-0 border-r border-blue-100 flex items-center justify-center text-xs font-semibold ${viewMode !== "day" && col.date &&
                                        col.date.getDate() === new Date().getDate() &&
                                        col.date.getMonth() === new Date().getMonth() &&
                                        col.date.getFullYear() === new Date().getFullYear()
                                        ? "text-white bg-blue-600"
                                        : "text-blue-800"
                                        }`}
                                    style={{ width: col.width }}
                                >
                                    {col.label}
                                </div>
                            ))}
                        </div>

                        {/* Hàng khu vực + bàn */}
                        {grouped.map((area) => (
                            <div key={area._id}>
                                {/* Hàng tiêu đề khu vực */}
                                <div className="bg-gray-100 border-b border-gray-200" style={{ height: ROW_HEIGHT }} />

                                {/* Hàng bàn */}
                                {!collapsedAreas[area._id] && area.tables.map((tbl) => {
                                    const tblRes = getTableRes(tbl._id, tbl.tableName);
                                    return (
                                        <div key={tbl._id} className="flex border-b border-gray-100 relative" style={{ height: ROW_HEIGHT }}>
                                            {/* Ô lưới */}
                                            {columns.map((col) => {
                                                // Kiểm tra ô có phải giờ quá khứ không (chỉ cho chế độ xem ngày + hôm nay)
                                                const now = new Date();
                                                const isToday = viewMode === "day" && selectedDate &&
                                                    selectedDate.getDate() === now.getDate() &&
                                                    selectedDate.getMonth() === now.getMonth() &&
                                                    selectedDate.getFullYear() === now.getFullYear();
                                                const isPastDate = viewMode === "day" && selectedDate &&
                                                    selectedDate < new Date(now.getFullYear(), now.getMonth(), now.getDate());
                                                const cellHour = viewMode === "day" ? parseInt(col.label) : null;
                                                const isPast = isPastDate || (isToday && cellHour !== null && cellHour < now.getHours());

                                                return (
                                                    <div
                                                        key={col.key}
                                                        onClick={() => !isPast && onCellClick(tbl, viewMode === "day" ? parseInt(col.label) : null)}
                                                        className={`shrink-0 border-r border-gray-100 transition ${isPast ? "bg-gray-200/60 cursor-not-allowed" : "cursor-pointer hover:bg-blue-50/40"}`}
                                                        style={{ width: col.width }}
                                                    />
                                                );
                                            })}

                                            {/* Khối đặt bàn (chế độ xem ngày) */}
                                            {viewMode === "day" && tblRes.map((res) => {
                                                const sH = res.startTime.getHours() + res.startTime.getMinutes() / 60;
                                                let eH = res.endTime.getHours() + res.endTime.getMinutes() / 60;
                                                // Nếu endTime qua ngày hôm sau (VD: 23:15 - 0:15), clamp tới cuối grid (24h)
                                                if (eH <= sH) eH = 24;
                                                const left = Math.max((sH - 6) * CELL_WIDTH, 0);
                                                const maxRight = (24 - 6) * CELL_WIDTH;
                                                const rawRight = (eH - 6) * CELL_WIDTH;
                                                const w = Math.min(rawRight, maxRight) - left;
                                                const col = STATUS_COLORS[res.status] || STATUS_COLORS.confirmed;
                                                const isActive = activePopover === res._id;

                                                // Clamp popup position so it doesn't overflow container
                                                const popoverLeft = Math.min(left + 20, maxRight - 370);

                                                return (
                                                    <div key={res._id}>
                                                        <div
                                                            onClick={(e) => { e.stopPropagation(); setActivePopover(isActive ? null : res._id); }}
                                                            className={`absolute top-[3px] rounded border flex items-center px-1.5 text-[9px] truncate z-[2] cursor-pointer hover:shadow transition-shadow ${isActive ? "ring-2 ring-blue-400 shadow" : ""}`}
                                                            style={{
                                                                left, width: Math.max(w, 30),
                                                                height: ROW_HEIGHT - 6,
                                                                backgroundColor: col.bg,
                                                                borderColor: col.border,
                                                                color: col.text,
                                                            }}
                                                        >
                                                            {res.customerName}
                                                        </div>

                                                        {/* Cửa sổ chi tiết */}
                                                        {isActive && (
                                                            <div
                                                                ref={popoverRef}
                                                                className="absolute z-50 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
                                                                style={{ left: Math.max(popoverLeft, 0), top: ROW_HEIGHT + 2, width: 360 }}
                                                            >
                                                                {/* Phần đầu */}
                                                                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.dot }} />
                                                                        <span className="text-xs font-bold text-gray-900">{res.customerName}</span>
                                                                        <span className="text-[10px] text-gray-500">{res.phone}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-0.5">
                                                                        <button className="p-1 rounded hover:bg-gray-200 cursor-pointer"><Pencil className="w-3.5 h-3.5 text-gray-500" /></button>
                                                                        <button className="p-1 rounded hover:bg-gray-200 cursor-pointer"><Printer className="w-3.5 h-3.5 text-gray-500" /></button>
                                                                        <button onClick={(e) => { e.stopPropagation(); setActivePopover(null); }} className="p-1 rounded hover:bg-gray-200 cursor-pointer"><X className="w-3.5 h-3.5 text-gray-500" /></button>
                                                                    </div>
                                                                </div>
                                                                {/* Nội dung */}
                                                                <div className="px-3 py-2 space-y-1.5 text-[11px] text-gray-700">
                                                                    <div className="grid grid-cols-2 gap-1">
                                                                        <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-gray-400" />{fmtTime(res.startTime)} - {fmtTime(res.endTime)}</div>
                                                                        <div className="flex items-center gap-1.5"><UtensilsCrossed className="w-3 h-3 text-gray-400" />Món đặt trước:</div>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5"><Users className="w-3 h-3 text-gray-400" />{(res.guests?.adults || 0) + (res.guests?.children || 0)} (🧑{res.guests?.adults || 0} 👶{res.guests?.children || 0})</div>
                                                                    <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-gray-400" />{res.tableName}</div>
                                                                </div>
                                                                {/* Hành động */}
                                                                {res.status !== "cancelled" && (
                                                                    <div className="flex items-center justify-center gap-2 px-3 py-2 border-t border-gray-100 bg-gray-50">
                                                                        {res.status !== "seated" && (
                                                                            <button
                                                                                onClick={(e) => { e.stopPropagation(); onStatusChange?.(res.reservationId, 'cancelled'); setActivePopover(null); }}
                                                                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-medium rounded cursor-pointer transition"
                                                                            >
                                                                                🗑 Hủy đặt
                                                                            </button>
                                                                        )}
                                                                        <button
                                                                            onClick={(e) => { e.stopPropagation(); onEditReservation?.(res); setActivePopover(null); }}
                                                                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-medium rounded cursor-pointer transition"
                                                                        >Cập nhật đặt bàn</button>
                                                                        {res.status !== "seated" && (
                                                                            <button
                                                                                onClick={(e) => { e.stopPropagation(); onStatusChange?.(res.reservationId, 'seated'); setActivePopover(null); }}
                                                                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-medium rounded cursor-pointer transition"
                                                                            >
                                                                                ✅ Nhận bàn
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            {/* Khối đặt bàn (chế độ xem tuần/tháng) - hiển thị dạng thanh màu */}
                                            {viewMode !== "day" && tblRes.map((res) => {
                                                const resDate = res.startTime;
                                                const colIdx = columns.findIndex((c) =>
                                                    c.date &&
                                                    c.date.getDate() === resDate.getDate() &&
                                                    c.date.getMonth() === resDate.getMonth() &&
                                                    c.date.getFullYear() === resDate.getFullYear()
                                                );
                                                if (colIdx === -1) return null;
                                                const leftPos = columns.slice(0, colIdx).reduce((s, c) => s + c.width, 0);
                                                const colW = columns[colIdx].width;
                                                const statusCol = STATUS_COLORS[res.status] || STATUS_COLORS.confirmed;

                                                return (
                                                    <div
                                                        key={res._id}
                                                        className="absolute top-[3px] rounded border flex items-center px-1 text-[8px] truncate z-[2]"
                                                        style={{
                                                            left: leftPos + 2,
                                                            width: colW - 4,
                                                            height: ROW_HEIGHT - 6,
                                                            backgroundColor: statusCol.bg,
                                                            borderColor: statusCol.border,
                                                            color: statusCol.text,
                                                        }}
                                                    >
                                                        {res.customerName}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}

                        {/* Đường chỉ thời gian đỏ (chỉ chế độ xem ngày) */}
                        {viewMode === "day" && (
                            <div className="absolute top-0 bottom-0 z-[3] pointer-events-none" style={{ left: currentTimePos }}>
                                <div className="w-0 h-0 absolute top-0" style={{ borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "5px solid #dc2626", marginLeft: "-4px" }} />
                                <div className="w-[2px] h-full bg-red-600 -ml-[1px]" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
