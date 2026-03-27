const { default: api } = require("@/services/api");

const managerService = {
  getRevenueSumary: async (startDate, endDate) => {
    try {
      const response = await api.get("/manager/revenue-summary", {
        params: { startDate, endDate },
      });

      return response.data;
    } catch (error) {
      console.error("Error in getRevenueSumary:", error);
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
      console.error("Error in getTodayRevenue:", error);
      throw error;
    }
  },

  getRevenueChartData: async (type) => {
    try {
      const response = await api.get("/manager/revenue-chart", {
        params: { type },
      });
      return response.data;
    } catch (error) {
      console.error("Error in getRevenueChartData:", error);
      throw error;
    }
  },

  getLiveOperations: async () => {
    try {
      const response = await api.get("/manager/live-operation");

      return response.data;
    } catch (error) {
      console.error("Error in getLiveOperations:", error);
      throw error;
    }
  },

  getTopSellingItems: async (period) => {
    try {
      const response = await api.get("/manager/top-selling", {
        params: { period },
      });
      return response.data;
    } catch (error) {
      console.error("Error in getTopSellingItems:", error);
      throw error;
    }
  },

  getRevenueByArea: async (period) => {
    try {
      const response = await api.get("/manager/revenue-area", {
        params: { period },
      });
      return response.data;
    } catch (error) {
      console.error("Error in getTopSellingItems:", error);
      throw error;
    }
  },
};

export default managerService;
