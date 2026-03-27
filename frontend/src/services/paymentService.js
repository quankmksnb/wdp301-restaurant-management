import api from "./api";

// Thanh toán tiền mặt
export const payByCash = async (orderId, data) => {
    try {
        const res = await api.post(`/payments/cash/${orderId}`, data);
        return res.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            message: "Thanh toán thất bại",
        };
    }
};

// Tạo thanh toán VNPay
export const createVNPayPayment = async (data) => {
    try {
        const res = await api.post(`/payments/vnpay-create`, data);
        return res.data;
    } catch (error) {
        throw error.response?.data || {
            success: false,
            message: "Tạo thanh toán VNPay thất bại",
        };
    }
};