import api from "./api";


export const createMenuItem = async (formData) => {
    const res = await api.post("/menu-items", formData);
    return res.data;
};


export const getAllMenuItems = async (params) => {
    const res = await api.get("/menu-items", { params });
    return res.data; // { data, pagination }
};


export const getMenuItemById = async (id) => {
    const res = await api.get(`/menu-items/${id}`);
    return res.data;
};


export const updateMenuItem = async (id, formData) => {
    const res = await api.put(`/menu-items/${id}`, formData);
    return res.data;
};


export const deleteMenuItem = async (id) => {
    const res = await api.delete(`/menu-items/${id}`);
    return res.data;
};


export const toggleMenuItemStatus = async (id) => {
    const res = await api.patch(`/menu-items/${id}/toggle-status`);
    return res.data;
};

// Lấy menu item theo category con
export const getMenuItemsByChildCategory = async (params = {}) => {
    const res = await api.get("/menu-items/by-child-category", { params });
    return res.data;
};