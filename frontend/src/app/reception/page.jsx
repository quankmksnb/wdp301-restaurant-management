"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Button, Badge, Select } from "antd";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  Settings,
  FileDown,
  X,
  Pencil,
  Printer,
  Clock,
  Users,
  MapPin,
  CreditCard,
  UtensilsCrossed,
  Menu,
} from "lucide-react";

import useTables from "@/hooks/useTables";
import useAreas from "@/hooks/useAreas";
import ReservationModal from "@/app/reception/components/ReservationModal";

// ─── Constants ───────────────────────────────────────────────────
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const CELL_WIDTH = 100;
const ROW_HEIGHT = 28;
const SIDEBAR_WIDTH = 150;
const DAYS_OF_WEEK = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MONTH_NAMES = [
  "Tháng 1","Tháng 2","Tháng 3","Tháng 4",
  "Tháng 5","Tháng 6","Tháng 7","Tháng 8",
  "Tháng 9","Tháng 10","Tháng 11","Tháng 12",
];

const STATUS_COLORS = {
  confirmed: { bg: "#dcfce7", border: "#4ade80", text: "#166534", dot: "#22c55e" },
  seated:    { bg: "#dbeafe", border: "#60a5fa", text: "#1e40af", dot: "#3b82f6" },
  no_show:   { bg: "#e5e7eb", border: "#9ca3af", text: "#374151", dot: "#9ca3af" },
  cancelled: { bg: "#fee2e2", border: "#fca5a5", text: "#dc2626", dot: "#ef4444" },
};

// ─── Helper: Calendar ────────────────────────────────────────────
function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDayOfMonth(y, m) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }

// ─── Mock Reservations ───────────────────────────────────────────
import mockReservations from "@/app/reception/mockReservations";

// ─────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────
export default function ReceptionPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("day");
  const [tabMode, setTabMode] = useState("calendar");
  const [modalOpen, setModalOpen] = useState(false);
  const [prefilledTable, setPrefilledTable] = useState(null);
  const [prefilledHour, setPrefilledHour] = useState(null);
  const [statusFilters, setStatusFilters] = useState({
    confirmed: true, seated: true, no_show: true, cancelled: false,
  });

  const { tables } = useTables(1, 100);
  const { areas } = useAreas();
  const reservations = mockReservations;

  const handleCellClick = useCallback((table, hour) => {
    setPrefilledTable(table);
    setPrefilledHour(hour);
    setModalOpen(true);
  }, []);

  const handleOpenModal = useCallback(() => {
    setPrefilledTable(null);
    setPrefilledHour(null);
    setModalOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "F1") { e.preventDefault(); handleOpenModal(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleOpenModal]);

  const handleStatusFilterChange = useCallback((key, val) => {
    setStatusFilters((p) => ({ ...p, [key]: val }));
  }, []);

  const confirmedCount = reservations.filter((r) => r.status === "confirmed").length;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white select-none">
      {/* ══ TOP BAR (dark blue) ══ */}
      <TopBar tabMode={tabMode} setTabMode={setTabMode} />

      {/* ══ SUB-HEADER (white) ══ */}
      <SubHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        statusFilters={statusFilters}
        onStatusFilterChange={handleStatusFilterChange}
        reservationCount={confirmedCount}
        onOpenModal={handleOpenModal}
      />

      {/* ══ BODY ══ */}
      <div className="flex flex-1 min-h-0">
        {/* SIDEBAR */}
        <Sidebar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          areas={areas}
        />

        {/* TIMELINE */}
        <Timeline
          areas={areas}
          tables={tables}
          reservations={reservations}
          statusFilters={statusFilters}
          onCellClick={handleCellClick}
          selectedDate={selectedDate}
        />
      </div>

      {/* MODAL */}
      <ReservationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        prefilledTable={prefilledTable}
        prefilledHour={prefilledHour}
        tables={tables}
        areas={areas}
      />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// TOP BAR
// ═════════════════════════════════════════════════════════════════
function TopBar({ tabMode, setTabMode }) {
  return (
    <div className="h-12 bg-[#1a3071] flex items-center px-5 text-white text-sm shrink-0">
      {/* Left: Title */}
      <span className="font-bold text-base mr-8 tracking-wide">Đặt bàn</span>

      {/* Tabs */}
      <div className="flex h-full">
        {[
          { key: "calendar", label: "Theo lịch" },
          { key: "list", label: "Theo danh sách" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTabMode(t.key)}
            className={`px-5 h-full flex items-center cursor-pointer transition-colors font-medium text-sm rounded-t-lg ${
              tabMode === t.key
                ? "bg-white text-[#1a3071]"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-5">
        <span className="flex items-center gap-2 text-white/90">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          Chi nhánh trung tâm
        </span>
        <Settings className="w-4 h-4 text-white/70 cursor-pointer hover:text-white" />
        <span className="flex items-center gap-1.5">
          <span>👤</span> 0912621789
        </span>
        <Menu className="w-4.5 h-4.5 text-white/70 cursor-pointer hover:text-white" />
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// SUB-HEADER
// ═════════════════════════════════════════════════════════════════
function SubHeader({ viewMode, setViewMode, statusFilters, onStatusFilterChange, reservationCount, onOpenModal }) {
  const filters = [
    { key: "confirmed", label: "Đã xếp bàn", color: "#22c55e" },
    { key: "seated",    label: "Đã nhận bàn", color: "#3b82f6" },
    { key: "no_show",   label: "Quá giờ / Không đến", color: "#9ca3af" },
    { key: "cancelled", label: "Đã hủy", color: "#d1d5db" },
  ];

  return (
    <div className="h-11 bg-white border-b border-gray-200 flex items-center px-5 text-sm shrink-0">
      {/* View mode */}
      <div className="flex items-center gap-1.5 mr-8">
        {["day", "week", "month"].map((m) => (
          <button
            key={m}
            onClick={() => setViewMode(m)}
            className={`px-3 py-1 cursor-pointer transition rounded-lg ${
              viewMode === m
                ? "text-blue-700 font-bold border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {m === "day" ? "Ngày" : m === "week" ? "Tuần" : "Tháng"}
          </button>
        ))}
      </div>

      {/* Status checkboxes */}
      <div className="flex items-center gap-5">
        {filters.map(({ key, label, color }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
            <input
              type="checkbox"
              checked={statusFilters[key]}
              onChange={(e) => onStatusFilterChange(key, e.target.checked)}
              className="cursor-pointer"
              style={{ accentColor: color, width: 15, height: 15 }}
            />
            {label}
          </label>
        ))}
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition">
          <FileDown className="w-4 h-4" /> Xuất file
        </button>
        <button
          onClick={onOpenModal}
          className="flex items-center gap-2 px-4 py-1.5 bg-[#1a3071] text-white rounded-lg text-sm font-medium hover:bg-[#15275e] cursor-pointer transition"
        >
          📋 Đặt bàn (F1)
          {reservationCount > 0 && (
            <span className="ml-1 bg-white text-[#1a3071] text-[11px] font-bold px-2 rounded-full">
              {reservationCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// SIDEBAR
// ═════════════════════════════════════════════════════════════════
function Sidebar({ selectedDate, onSelectDate, areas }) {
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

  const dayOfWeek = selectedDate.toLocaleDateString("vi-VN", { weekday: "long" });
  const fmtDate = selectedDate.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="w-[200px] min-w-[200px] border-r border-gray-200 bg-white flex flex-col text-sm overflow-y-auto shrink-0">
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
          <span className="text-gray-400 ml-1 capitalize">{dayOfWeek}, {fmtDate}</span>
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

// ═════════════════════════════════════════════════════════════════
// TIMELINE
// ═════════════════════════════════════════════════════════════════
function Timeline({ areas, tables, reservations, statusFilters, onCellClick, selectedDate }) {
  const [collapsedAreas, setCollapsedAreas] = useState({});
  const [currentTimePos, setCurrentTimePos] = useState(0);
  const [activePopover, setActivePopover] = useState(null);
  const scrollRef = useRef(null);
  const popoverRef = useRef(null);

  // Close popover on outside click
  useEffect(() => {
    const handler = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) setActivePopover(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Current time
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setCurrentTimePos((n.getHours() + n.getMinutes() / 60) * CELL_WIDTH);
    };
    tick();
    const iv = setInterval(tick, 60000);
    return () => clearInterval(iv);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current && currentTimePos > 0) {
      scrollRef.current.scrollLeft = Math.max(0, currentTimePos - 400);
    }
  }, [currentTimePos]);

  // Group tables by area
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

  // Date header for the selected day
  const dateLabel = selectedDate.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {/* Timeline scrollable area */}
      <div className="flex flex-1 min-h-0">
        {/* Fixed left column: PHÒNG/BÀN */}
        <div className="shrink-0 border-r border-gray-200 bg-white z-10" style={{ width: SIDEBAR_WIDTH }}>
          {/* Top-left corner: "PHÒNG/BÀN" label spanning date + hour header height */}
          <div className="border-b border-gray-200 flex flex-col justify-end">
            <div className="h-7 border-b border-gray-100" /> {/* date header space */}
            <div className="h-9 px-3 flex items-center font-bold text-xs text-blue-800 uppercase tracking-wide bg-blue-50">
              PHÒNG/BÀN
            </div>
          </div>

          {/* Area + table rows */}
          {grouped.map((area) => (
            <div key={area._id}>
              {/* Area header */}
              <div
                onClick={() => toggleArea(area._id)}
                className="flex items-center gap-1 px-2 cursor-pointer bg-gray-100 hover:bg-gray-200 transition border-b border-gray-200"
                style={{ height: ROW_HEIGHT }}
              >
                {collapsedAreas[area._id]
                  ? <ChevronRight className="w-3 h-3 text-gray-500" />
                  : <ChevronDown className="w-3 h-3 text-gray-500" />}
                <span className="text-[11px] font-semibold text-blue-700">{area.areaName}</span>
              </div>

              {/* Tables */}
              {!collapsedAreas[area._id] && area.tables.map((tbl) => (
                <div
                  key={tbl._id}
                  className="flex items-center px-2 pl-5 border-b border-gray-100"
                  style={{ height: ROW_HEIGHT }}
                >
                  <span className="text-[11px] text-blue-600 truncate">{tbl.tableName}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Scrollable timeline grid */}
        <div ref={scrollRef} className="flex-1 overflow-x-auto overflow-y-auto">
          <div className="relative" style={{ width: CELL_WIDTH * 24 }}>
            {/* Date header */}
            <div className="h-7 border-b border-gray-100 bg-white sticky top-0 z-[6] flex items-center">
              <span className="text-xs text-gray-500 font-medium px-3 capitalize">{dateLabel}</span>
            </div>

            {/* Hours header */}
            <div className="flex border-b border-gray-200 bg-blue-50 sticky top-7 z-[5] h-9">
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="shrink-0 border-r border-blue-100 flex items-center justify-center text-xs text-blue-800 font-semibold"
                  style={{ width: CELL_WIDTH }}
                >
                  {String(h).padStart(2, "0")}:00
                </div>
              ))}
            </div>

            {/* Area + table rows */}
            {grouped.map((area) => (
              <div key={area._id}>
                {/* Area header row - solid gray, no grid lines */}
                <div className="bg-gray-100 border-b border-gray-200" style={{ height: ROW_HEIGHT }} />

                {/* Table rows */}
                {!collapsedAreas[area._id] && area.tables.map((tbl) => {
                  const tblRes = getTableRes(tbl._id, tbl.tableName);
                  return (
                    <div key={tbl._id} className="flex border-b border-gray-100 relative" style={{ height: ROW_HEIGHT }}>
                      {/* Hour cells */}
                      {HOURS.map((h) => (
                        <div
                          key={h}
                          onClick={() => onCellClick(tbl, h)}
                          className="shrink-0 border-r border-gray-100 cursor-pointer hover:bg-blue-50/40 transition"
                          style={{ width: CELL_WIDTH }}
                        />
                      ))}

                      {/* Reservation blocks */}
                      {tblRes.map((res) => {
                        const sH = res.startTime.getHours() + res.startTime.getMinutes() / 60;
                        const eH = res.endTime.getHours() + res.endTime.getMinutes() / 60;
                        const left = sH * CELL_WIDTH;
                        const w = (eH - sH) * CELL_WIDTH;
                        const col = STATUS_COLORS[res.status] || STATUS_COLORS.confirmed;
                        const isActive = activePopover === res._id;

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

                            {/* Popover */}
                            {isActive && (
                              <div
                                ref={popoverRef}
                                className="absolute z-50 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
                                style={{ left: left + Math.min(w / 2, 60), top: ROW_HEIGHT + 2, width: 360 }}
                              >
                                {/* Header */}
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
                                {/* Body */}
                                <div className="px-3 py-2 space-y-1.5 text-[11px] text-gray-700">
                                  <div className="grid grid-cols-2 gap-1">
                                    <div className="flex items-center gap-1.5"><CreditCard className="w-3 h-3 text-gray-400" />{res._id.toUpperCase().slice(0, 10)}</div>
                                    <div className="flex items-center gap-1.5"><CreditCard className="w-3 h-3 text-gray-400" />Tiền cọc: {(res.deposit || 0).toLocaleString("vi-VN")}</div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1">
                                    <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-gray-400" />{fmtTime(res.startTime)} - {fmtTime(res.endTime)}</div>
                                    <div className="flex items-center gap-1.5"><UtensilsCrossed className="w-3 h-3 text-gray-400" />Món đặt trước:</div>
                                  </div>
                                  <div className="flex items-center gap-1.5"><Users className="w-3 h-3 text-gray-400" />{(res.guests?.adults || 0) + (res.guests?.children || 0)} (🧑{res.guests?.adults || 0} 👶{res.guests?.children || 0})</div>
                                  <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-gray-400" />{res.tableName}</div>
                                </div>
                                {/* Actions */}
                                <div className="flex items-center justify-center gap-2 px-3 py-2 border-t border-gray-100 bg-gray-50">
                                  <button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-medium rounded cursor-pointer transition">🗑 Hủy đặt</button>
                                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-medium rounded cursor-pointer transition">📋 Nhận gọi món</button>
                                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-medium rounded cursor-pointer transition">✅ Nhận bàn</button>
                                </div>
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

            {/* Red time indicator */}
            <div className="absolute top-0 bottom-0 z-[3] pointer-events-none" style={{ left: currentTimePos }}>
              <div className="w-0 h-0 absolute top-0" style={{ borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "5px solid #dc2626", marginLeft: "-4px" }} />
              <div className="w-[2px] h-full bg-red-600 -ml-[1px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}