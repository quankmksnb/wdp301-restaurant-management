"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import useTables from "@/hooks/useTables";
import useAreas from "@/hooks/useAreas";
import { getReservedTables, updateReservationStatus } from "@/services/reservationService";
import { message, Modal, Input } from "antd";

import TopBar from "./components/TopBar";
import SubHeader from "./components/SubHeader";
import Sidebar from "./components/Sidebar";
import Timeline from "./components/Timeline";
import WeekView from "./components/WeekView";
import MonthView from "./components/MonthView";
import ReservationListView from "./components/ReservationListView";
import ReservationModal from "@/app/reception/components/ReservationModal";

// ─────────────────────────────────────────────────────────────────
// Transform API reservations to the flat shape Timeline expects
// Each reservation can have multiple tables → one entry per table
// ─────────────────────────────────────────────────────────────────
function transformReservations(apiReservations) {
    const result = [];
    (apiReservations || []).forEach((r) => {
        const startTime = new Date(r.reservationDateTime);
        // Default duration: 1 hours
        const endTime = new Date(startTime.getTime() + 1 * 60 * 60 * 1000);

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
                areaId: typeof table === "object" ? (table.area?._id || table.area) : "",
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

    // Cancel modal state
    const [cancelModal, setCancelModal] = useState({ open: false, reservationId: null });
    const [cancelReason, setCancelReason] = useState("");

    // Handle reservation status change (nhận bàn / hủy đặt)
    const handleStatusChange = useCallback(async (reservationId, newStatus) => {
        if (newStatus === "cancelled") {
            // Show cancel reason modal instead of immediate cancel
            setCancelModal({ open: true, reservationId });
            setCancelReason("");
            return;
        }
        try {
            await updateReservationStatus(reservationId, newStatus);
            message.success("Nhận bàn thành công!");
            fetchReservations();
        } catch (error) {
            console.error("Status change error:", error);
            message.error(
                error.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái"
            );
        }
    }, [fetchReservations]);

    // Confirm cancel with reason
    const handleConfirmCancel = useCallback(async () => {
        if (!cancelReason.trim()) {
            message.warning("Vui lòng nhập lý do hủy!");
            return;
        }
        try {
            await updateReservationStatus(cancelModal.reservationId, "cancelled", {
                cancellationReason: cancelReason,
            });
            message.success("Đã hủy đặt bàn!");
            setCancelModal({ open: false, reservationId: null });
            fetchReservations();
        } catch (error) {
            console.error("Cancel error:", error);
            message.error(
                error.response?.data?.message || "Có lỗi xảy ra khi hủy đặt bàn"
            );
        }
    }, [cancelModal.reservationId, cancelReason, fetchReservations]);

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

            {/* ══ CALENDAR BODY ══ */}
            {tabMode === "calendar" && (
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
                        onStatusChange={handleStatusChange}
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
            )}

            {/* ══ LIST VIEW ══ */}
            {tabMode === "list" && (
                <ReservationListView
                    reservations={allReservations}
                    areas={areas}
                    statusFilters={statusFilters}
                    onStatusFilterChange={handleStatusFilterChange}
                    onStatusChange={handleStatusChange}
                    onOpenModal={handleOpenModal}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                />
            )}

            {/* MODAL */}
            <ReservationModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                prefilledTable={prefilledTable}
                prefilledHour={prefilledHour}
                tables={tables}
                areas={areas}
                selectedDate={selectedDate}
                onReservationCreated={fetchReservations}
            />
            {/* CANCEL REASON MODAL */}
            <Modal
                open={cancelModal.open}
                onCancel={() => setCancelModal({ open: false, reservationId: null })}
                onOk={handleConfirmCancel}
                title={<span className="text-base font-bold text-red-600">🗑 Xác nhận hủy đặt bàn</span>}
                okText="Xác nhận hủy"
                cancelText="Quay lại"
                okButtonProps={{ danger: true }}
                centered
                width={420}
            >
                <div className="py-3">
                    <p className="text-sm text-gray-600 mb-3">Vui lòng nhập lý do hủy:</p>
                    <Input.TextArea
                        rows={3}
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Nhập lý do hủy đặt bàn..."
                        maxLength={200}
                        showCount
                    />
                </div>
            </Modal>
        </div>
    );
}
