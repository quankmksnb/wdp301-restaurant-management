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