import api from "./api";

// Thêm món vào bàn
export const addItemToTable = async (orderId, tableId, data) => {
    const res = await api.post(`/orders/${orderId}/tables/${tableId}/items`, data);
    return res.data;
};

// Gửi món xuống bếp
export const sendItemsToKitchen = async (orderId, data) => {
    const res = await api.patch(`/orders/${orderId}/send-to-kitchen`, data);
    return res.data;
};

// Hủy món
export const cancelItem = async (orderId, itemId) => {
    const res = await api.patch(`/orders/${orderId}/items/${itemId}/cancel`);
    return res.data;
};

// Lấy bill hiện tại của bàn
export const getCurrentBillByTable = async (tableId) => {
    const res = await api.get(`/orders/table/${tableId}/bill`);
    return res.data;
};

// Lấy bill chi tiết của order
export const getOrderBill = async (orderId) => {
    const res = await api.get(`/orders/${orderId}/bill`);
    return res.data;
};