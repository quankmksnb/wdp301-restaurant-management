import api from "./api";

export const getTables = async (params = {}) => {
  const res = await api.get("/tables", { params });
  return res.data;
};

export const createTable = async (data) => {
  const res = await api.post("/tables", data);
  return res.data;
};

export const getTableById = async (id) => {
  const res = await api.get(`/tables/${id}`);
  return res.data;
};

export const updateTable = async (id, data) => {
  const res = await api.put(`/tables/${id}`, data);
  return res.data;
};

export const deleteTable = async (id) => {
  const res = await api.delete(`/tables/${id}`);
  return res.data;
};

export const toggleTableStatus = async (id) => {
  const res = await api.patch(`/tables/${id}/status`);
  return res.data;
};

// Lấy danh sách bàn theo khu vực (kèm totalAmount từ order active)
export const getTableByArea = async (params = {}) => {
  const res = await api.get("/tables/by-area", { params });
  return res.data;
};

export const getAllTables = async () => {
  const res = await api.get("/tables/all");
  return res.data;
};

export const getAllActiveTables = async () => {
    const res = await api.get("/tables/active");
    return res.data;
};
