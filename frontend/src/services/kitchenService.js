import api from "@/services/api";

const kitchenService = {
  /**
   * Lấy danh sách các món ăn đang chờ chế biến (pending/preparing)
   * @param {Object} params - Các tham số lọc
   * @param {string} params.itemName - Tìm kiếm theo tên món ăn
   * @param {boolean} params.isPreOrder - true: chỉ lấy đơn đặt trước, false: chỉ lấy đơn tại bàn
   * @returns {Promise} Trả về danh sách món ăn đã sắp xếp theo độ ưu tiên
   */

  getPendingOrders: async (params = {}) => {
    try {
      const response = await api.get("/kitchen/pending", { params });
      return response.data;
    } catch (error) {
      console.error("Error in getPendingOrders:", error);
      throw error;
    }
  },
  getOrdersByDish: async (itemName = "") => {
    try {
      const response = await api.get("/kitchen/by-dish", {
        params: { itemName },
      });
      return response.data;
    } catch (error) {
      console.error("Error in getPendingOrders:", error);
      throw error;
    }
  },
  getOrdersByTable: async (tableName = "") => {
    try {
      const response = await api.get("/kitchen/by-table", {
        params: { tableName },
      });
      return response.data;
    } catch (error) {
      console.error("Error in getPendingOrders:", error);
      throw error;
    }
  },

  /**
   * Cập nhật trạng thái của một món ăn (ví dụ: từ pending -> preparing -> ready)
   * @param {string} orderItemId - ID của item trong subOrder
   * @param {string} status - Trạng thái mới (preparing, ready, served, cancelled)
   */
  updateItemStatus: async (orderItemId, status, quantity = "all") => {
    try {
      const response = await api.patch(`/kitchen/item/${orderItemId}/status`, {
        status,
        quantityToUpdate: quantity, // Truyền số lượng cụ thể hoặc 'all'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default kitchenService;
