import api from "./api";

export const getAllAreas = async () => {
  const res = await api.get("/areas");
  return res.data;
};

export const createArea = async (data) => {
  const res = await api.post("/areas", data);
  return res.data;
};
