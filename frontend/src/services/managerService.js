const { default: api } = require("@/services/api");

const managerService = {
  getRevenueSumary: async (startDate, endDate) => {
    try {
      const response = await api.get("/manager/revenue-summary", {
        params: { startDate, endDate },
      });

      return response.data;
    } catch (error) {
      console.error("Error in getPendingOrders:", error);
      throw error;
    }
  },
  getTodayRevenue: async () => {
    const today = new Date().toISOString().split("T")[0];
    try {
      const response = await api.get("/manager/revenue-summary", {
        params: {
          startDate: today,
          endDate: today,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error in getPendingOrders:", error);
      throw error;
    }
  },
};

export default managerService;
