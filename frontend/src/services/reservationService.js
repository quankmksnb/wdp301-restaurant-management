import api from "./api";

// Lấy danh sách bàn trống
export const getAvailableTables = async (dateTime) => {
  const res = await api.get("/reservations/available-tables", {
    params: { dateTime },
  });
  return res.data;
};

// Lấy danh sách bàn đã đặt (confirmed / seated)
export const getReservedTables = async () => {
  const res = await api.get("/reservations/reserved-tables");
  return res.data;
};

// Đặt bàn bình thường (không gọi món)
export const createReservation = async (data) => {
  const res = await api.post("/reservations", data);
  return res.data;
};

// Đặt bàn + gọi món trước
export const createReservationWithOrder = async (data) => {
  const res = await api.post("/reservations/pre-order", data);
  return res.data;
};

// Cập nhật trạng thái reservation
export const updateReservationStatus = async (id, status, extraData = {}) => {
  const res = await api.patch(`/reservations/${id}/status`, { status, ...extraData });
  return res.data;
};

// Cập nhật chi tiết reservation
export const updateReservation = async (id, data) => {
  const res = await api.put(`/reservations/${id}`, data);
  return res.data;
};

// Lấy order của reservation (để edit)
export const getOrderByReservation = async (reservationId) => {
  const res = await api.get(`/orders/reservation/${reservationId}`);
  return res.data;
};
