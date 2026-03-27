"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {getAllActiveTables} from "@/services/tableService";
import useAreas from "@/hooks/useAreas";
import {
  getReservedTables,
  updateReservationStatus,
} from "@/services/reservationService";
import { message, Modal, Input } from "antd";

import TopBar from "../../components/reception/TopBar";
import SubHeader from "../../components/reception/SubHeader";
import Sidebar from "../../components/reception/Sidebar";
import Timeline from "../../components/reception/Timeline";
import WeekView from "../../components/reception/WeekView";
import MonthView from "../../components/reception/MonthView";
import ReservationListView from "../../components/reception/ReservationListView";
import ReservationModal from "@/components/reception/ReservationModal";
import ProtectedRoute from "@/services/protectedRoute";

// ─────────────────────────────────────────────────────────────────
// Chuyển đổi dữ liệu reservation từ API sang dạng phẳng cho Timeline
// Mỗi reservation có thể có nhiều bàn → tạo 1 entry cho mỗi bàn
// ─────────────────────────────────────────────────────────────────
function transformReservations(apiReservations) {
  const result = [];
  (apiReservations || []).forEach((r) => {
    const startTime = new Date(r.reservationDateTime);
    // Thời lượng mặc định: 1 giờ
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
        areaId: typeof table === "object" ? table.area?._id || table.area : "",
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
// TRANG CHÍNH
// ─────────────────────────────────────────────────────────────────
export default function ReceptionPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("day");
  const [tabMode, setTabMode] = useState("calendar");
  const [modalOpen, setModalOpen] = useState(false);
  const [prefilledTable, setPrefilledTable] = useState(null);
  const [prefilledHour, setPrefilledHour] = useState(null);
  const [editingReservation, setEditingReservation] = useState(null);
  const [allRawReservations, setAllRawReservations] = useState([]);
  const [allReservations, setAllReservations] = useState([]);
  const [selectedArea, setSelectedArea] = useState("all");
  const [statusFilters, setStatusFilters] = useState({
    confirmed: true,
    seated: true,
    no_show: true,
    cancelled: false,
  });

  const [tables, setTables] = useState([]);
  const { areas } = useAreas();

  // Lấy danh sách tất cả bàn khi component mount
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await getAllActiveTables();
        setTables(res.data || []);
      } catch (err) {
        console.error("Failed to fetch tables:", err);
      }
    };
    fetchTables();
  }, []);

  // Lọc đặt bàn theo ngày đã chọn
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

  // Lọc bàn theo khu vực đã chọn
  const filteredTables = useMemo(() => {
    if (selectedArea === "all" || !selectedArea) return tables;
    return (tables || []).filter(
      (t) => (t.area?._id || t.area) === selectedArea,
    );
  }, [tables, selectedArea]);

  // Lấy danh sách đặt bàn từ API
  const fetchReservations = useCallback(async () => {
    try {
      const res = await getReservedTables();
      setAllRawReservations(res.data || []);
      const transformed = transformReservations(res.data || []);
      setAllReservations(transformed);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    }
  }, []);

  // Tải danh sách đặt bàn khi component mount
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleCellClick = useCallback((table, hour) => {
    setEditingReservation(null);
    setPrefilledTable(table);
    setPrefilledHour(hour);
    setModalOpen(true);
  }, []);

  const handleOpenModal = useCallback(() => {
    setEditingReservation(null);
    setPrefilledTable(null);
    setPrefilledHour(null);
    setModalOpen(true);
  }, []);

  const handleEditReservation = useCallback(
    (reservation) => {
      const rawRes = allRawReservations.find(
        (r) => r._id === (reservation.reservationId || reservation._id),
      );
      setEditingReservation(rawRes || reservation);
      setModalOpen(true);
    },
    [allRawReservations],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "F1") {
        e.preventDefault();
        handleOpenModal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleOpenModal]);

  const handleStatusFilterChange = useCallback((key, val) => {
    setStatusFilters((p) => ({ ...p, [key]: val }));
  }, []);

  // State cho modal hủy đặt bàn
  const [cancelModal, setCancelModal] = useState({
    open: false,
    reservationId: null,
  });
  const [cancelReason, setCancelReason] = useState("");

  // Xử lý thay đổi trạng thái đặt bàn (nhận bàn / hủy đặt)
  const handleStatusChange = useCallback(
    async (reservationId, newStatus) => {
      if (newStatus === "cancelled") {
        // Hiển thị modal nhập lý do hủy thay vì hủy ngay lập tức
        setCancelModal({ open: true, reservationId });
        setCancelReason("");
        return;
      }

      // FE check: chỉ cho nhận bàn trong ngày hôm nay
      if (newStatus === "seated") {
        const reservation = allReservations.find(
          (r) => r.reservationId === reservationId,
        );
        if (reservation) {
          const today = new Date();
          const resDate = reservation.startTime;
          if (
            resDate.getFullYear() !== today.getFullYear() ||
            resDate.getMonth() !== today.getMonth() ||
            resDate.getDate() !== today.getDate()
          ) {
            message.warning(
              "Chỉ được nhận bàn cho đặt bàn trong ngày hôm nay!",
            );
            return;
          }
        }
      }

      try {
        await updateReservationStatus(reservationId, newStatus);
        message.success("Nhận bàn thành công!");
        fetchReservations();
      } catch (error) {
        console.error("Status change error:", error);
        message.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi cập nhật trạng thái",
        );
      }
    },
    [fetchReservations, allReservations],
  );

  // Xác nhận hủy với lý do
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
        error.response?.data?.message || "Có lỗi xảy ra khi hủy đặt bàn",
      );
    }
  }, [cancelModal.reservationId, cancelReason, fetchReservations]);

  const confirmedCount = reservations.filter(
    (r) => r.status === "confirmed",
  ).length;

  return (
      <ProtectedRoute role="receptionist">
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-white select-none">
          {/* ══ THANH TRÊN CÙNG (xanh đậm) ══ */}
          <TopBar tabMode={tabMode} setTabMode={setTabMode} />

          {/* ══ THANH CÔNG CỤ PHỤ (trắng) - chỉ hiện ở chế độ lịch ══ */}
          {tabMode === "calendar" && (
            <SubHeader
              viewMode={viewMode}
              setViewMode={setViewMode}
              statusFilters={statusFilters}
              onStatusFilterChange={handleStatusFilterChange}
              reservationCount={confirmedCount}
              onOpenModal={handleOpenModal}
            />
          )}

          {/* ══ NỘI DUNG LỊCH ══ */}
          {tabMode === "calendar" && (
            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* THANH BÊN TRÁI */}
              <Sidebar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                areas={areas}
                viewMode={viewMode}
                selectedArea={selectedArea}
                onSelectArea={setSelectedArea}
              />

              {/* CHẾ ĐỘ XEM NGÀY */}
              {viewMode === "day" && (
                <Timeline
                  areas={areas}
                  tables={filteredTables}
                  reservations={reservations}
                  statusFilters={statusFilters}
                  onCellClick={handleCellClick}
                  onEditReservation={handleEditReservation}
                  onStatusChange={handleStatusChange}
                  selectedDate={selectedDate}
                  viewMode={viewMode}
                />
              )}

              {/* CHẾ ĐỘ XEM TUẦN */}
              {viewMode === "week" && (
                <WeekView
                  areas={areas}
                  tables={filteredTables}
                  reservations={allReservations}
                  statusFilters={statusFilters}
                  onCellClick={handleCellClick}
                  onEditReservation={handleEditReservation}
                  selectedDate={selectedDate}
                />
              )}

              {/* CHẾ ĐỘ XEM THÁNG */}
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

          {/* ══ CHẾ ĐỘ XEM DANH SÁCH ══ */}
          {tabMode === "list" && (
            <ReservationListView
              reservations={allReservations}
              areas={areas}
              statusFilters={statusFilters}
              onStatusFilterChange={handleStatusFilterChange}
              onStatusChange={handleStatusChange}
              onEditReservation={handleEditReservation}
              onOpenModal={handleOpenModal}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          )}

          {/* MODAL ĐẶT BÀN */}
          <ReservationModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            prefilledTable={prefilledTable}
            prefilledHour={prefilledHour}
            tables={tables}
            areas={areas}
            selectedDate={selectedDate}
            onReservationCreated={fetchReservations}
            editingReservation={editingReservation}
          />
          {/* MODAL LÝ DO HỦY */}
          <Modal
            open={cancelModal.open}
            onCancel={() => setCancelModal({ open: false, reservationId: null })}
            onOk={handleConfirmCancel}
            title={
              <span className="text-base font-bold text-red-600">
                🗑 Xác nhận hủy đặt bàn
              </span>
            }
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
      </ProtectedRoute>
  );
}
