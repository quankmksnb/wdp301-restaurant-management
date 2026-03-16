"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import useTables from "@/hooks/useTables";
import useAreas from "@/hooks/useAreas";
import { getReservedTables } from "@/services/reservationService";

import TopBar from "./components/TopBar";
import SubHeader from "./components/SubHeader";
import Sidebar from "./components/Sidebar";
import Timeline from "./components/Timeline";
import WeekView from "./components/WeekView";
import MonthView from "./components/MonthView";
import ReservationModal from "@/app/reception/components/ReservationModal";

// ─────────────────────────────────────────────────────────────────
// Transform API reservations to the flat shape Timeline expects
// Each reservation can have multiple tables → one entry per table
// ─────────────────────────────────────────────────────────────────
function transformReservations(apiReservations) {
    const result = [];
    (apiReservations || []).forEach((r) => {
        const startTime = new Date(r.reservationDateTime);
        // Default duration: 2 hours
        const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

        (r.tables || []).forEach((table) => {
            const tableId = typeof table === "object" ? table._id : table;
            const tableName = typeof table === "object" ? table.tableName : "";

            result.push({
                _id: `${r._id}_${tableId}`,
                reservationId: r._id,
                customerName: r.customer?.customer || "Khách",
                phone: r.customer?.phone || "",
                tableId,
                tableName,
                startTime,
                endTime,
                guests: {
                    adults: r.numberOfGuests || 0,
                    children: 0,
                },
                numberOfGuests: r.numberOfGuests || 0,
                status: r.status || "confirmed",
                deposit: 0,
                note: r.note || "",
            });
        });
    });
    return result;
}

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
    const [allReservations, setAllReservations] = useState([]);
    const [selectedArea, setSelectedArea] = useState("all");
    const [statusFilters, setStatusFilters] = useState({
        confirmed: true, seated: true, no_show: true, cancelled: false,
    });

    const { tables } = useTables(1, 100);
    const { areas } = useAreas();

    // Filter reservations by selected date
    const reservations = useMemo(() => {
        return allReservations.filter((r) => {
            const resDate = r.startTime;
            return (
                resDate.getFullYear() === selectedDate.getFullYear() &&
                resDate.getMonth() === selectedDate.getMonth() &&
                resDate.getDate() === selectedDate.getDate()
            );
        });
    }, [allReservations, selectedDate]);

    // Filter tables by selected area
    const filteredTables = useMemo(() => {
        if (selectedArea === "all" || !selectedArea) return tables;
        return (tables || []).filter(
            (t) => (t.area?._id || t.area) === selectedArea
        );
    }, [tables, selectedArea]);

    // Fetch reservations from API
    const fetchReservations = useCallback(async () => {
        try {
            const res = await getReservedTables();
            const transformed = transformReservations(res.data || []);
            setAllReservations(transformed);
        } catch (error) {
            console.error("Failed to fetch reservations:", error);
        }
    }, []);

    // Load reservations on mount
    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

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
                    selectedArea={selectedArea}
                    onSelectArea={setSelectedArea}
                />

                {/* DAY VIEW */}
                {viewMode === "day" && (
                    <Timeline
                        areas={areas}
                        tables={filteredTables}
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
                        tables={filteredTables}
                        reservations={allReservations}
                        statusFilters={statusFilters}
                        onCellClick={handleCellClick}
                        selectedDate={selectedDate}
                    />
                )}

                {/* MONTH VIEW */}
                {viewMode === "month" && (
                    <MonthView
                        reservations={allReservations}
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
                onReservationCreated={fetchReservations}
            />
        </div>
    );
}