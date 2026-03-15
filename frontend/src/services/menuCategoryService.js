import api from "./api";

export const createCategory = (data) => {
    return api.post("/menu-categories", data);
};


export const getAllCategories = (params) => {
    return api.get("/menu-categories", { params });
};


export const getCategoryTree = () => {
    return api.get("/menu-categories/tree");
};


export const updateCategory = (id, data) => {
    return api.put(`/menu-categories/${id}`, data);
};


export const deleteCategory = (id) => {
    return api.delete(`/menu-categories/${id}`);
};


export const getChildCategories = async (parentId) => {
  const res = await api.get("/menu-categories/children", {
    params: { parentId },
  });

  return res.data;
};