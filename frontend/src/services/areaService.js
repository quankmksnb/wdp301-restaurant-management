import api from "./api";

export const getAllAreas = async () => {
  const res = await api.get("/areas");
  return res.data;
};

export const createArea = async (data) => {
  const res = await api.post("/areas", data);
  return res.data;
};

export const updateArea = async (id, data) => {
  const res = await api.put(`/areas/${id}`, data);
  return res.data;
};

export const deleteArea = async (id) => {
  const res = await api.delete(`/areas/${id}`);
  return res.data;
};
