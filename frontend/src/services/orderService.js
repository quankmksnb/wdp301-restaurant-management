import api from "./api";

export const orderItems = async (data) => {
    const res = await api.post("/orders/items", data);
    return res.data.data;
};

/*Gửi món xuống bếp*/
export const sendToKitchen = async (orderId) => {
    const res = await api.patch("/orders/send-to-kitchen", {
        orderId,
    });
    return res.data;
};

/* Hủy một món trong order*/
export const cancelOrderItem = async ({ orderId, itemId }) => {
    const res = await api.patch("/orders/cancel-item", {
        orderId,
        itemId,
    });
    return res.data;
};

// Cập nhật số lượng món trong order
export const updateOrderItemQuantity = async ({ orderId, itemId, quantity }) => {
    const res = await api.patch("/orders/update-item-quantity", {
        orderId,
        itemId,
        quantity,
    });
    return res.data.data;
};

/*Lấy order hiện tại của bàn*/
export const getCurrentOrderByTable = async (tableId) => {
    const res = await api.get(`/orders/table/${tableId}`);
    return res.data.data;
};