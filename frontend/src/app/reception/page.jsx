"use client";

import { useState, useEffect, useCallback } from "react";
import useTables from "@/hooks/useTables";
import useAreas from "@/hooks/useAreas";
import mockReservations from "@/app/reception/mockReservations";

import TopBar from "./components/TopBar";
import SubHeader from "./components/SubHeader";
import Sidebar from "./components/Sidebar";
import Timeline from "./components/Timeline";
import WeekView from "./components/WeekView";
import MonthView from "./components/MonthView";
import ReservationModal from "@/app/reception/components/ReservationModal";

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
            <div className="flex flex-1 min-h-0 overflow-hidden">
                {/* SIDEBAR */}
                <Sidebar
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    areas={areas}
                    viewMode={viewMode}
                />

                {/* DAY VIEW */}
                {viewMode === "day" && (
                    <Timeline
                        areas={areas}
                        tables={tables}
                        reservations={reservations}
                        statusFilters={statusFilters}
                        onCellClick={handleCellClick}
                        selectedDate={selectedDate}
                        viewMode={viewMode}
                    />
                )}

                {/* WEEK VIEW */}
                {viewMode === "week" && (
                    <WeekView
                        areas={areas}
                        tables={tables}
                        reservations={reservations}
                        statusFilters={statusFilters}
                        onCellClick={handleCellClick}
                        selectedDate={selectedDate}
                    />
                )}

                {/* MONTH VIEW */}
                {viewMode === "month" && (
                    <MonthView
                        reservations={reservations}
                        statusFilters={statusFilters}
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                    />
                )}
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