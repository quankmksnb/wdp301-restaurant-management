"use client";
import { useEffect, useState, useCallback } from "react";
import {
  ClipboardList,
  CookingPot,
  DollarSign,
  Receipt,
  UserCheck,
  Users,
} from "lucide-react";
import DashboardBox from "../../components/dashboard/DashboardBox";
import ResultItem from "../../components/dashboard/ResultItem";
import managerService from "@/services/managerService";
import { formatCurrency, getYesterDayISOString } from "@/utils/utils";
import { message } from "antd";
import RevenueLineChart from "@/components/dashboard/charts/RevenueLineChart";
import TopSellingChart from "@/components/dashboard/charts/TopSellingChart";

// Map label hiển thị sang key API
const typeMap = {
  "7 ngày qua": "week",
  "Tháng này": "month",
  "Năm nay": "year",
};

export default function Dashboard() {
  const [todayRevenue, setTodayRevenue] = useState({
    revenue: 0,
    profit: 0,
    orderCount: 0,
  });
  const [yesterdayRevenue, setYesterdayRevenue] = useState({
    revenue: 0,
    profit: 0,
    orderCount: 0,
  });

  const [liveOperationStats, setLiveOperationStats] = useState({
    activeTables: 0,
    kitchenStatus: {
      totalProcessing: 0,
    },
  });

  // State cho biểu đồ
  const [revenueData, setRevenueData] = useState([]);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [loadingChart, setLoadingChart] = useState(false);
  const [filterLabel, setFilterLabel] = useState("7 ngày qua");

  // State cho Top Món ăn
  const [topSellingData, setTopSellingData] = useState([]);
  const [loadingTopSelling, setLoadingTopSelling] = useState(true);
  const [topSellingFilterLabel, setTopSellingFilterLabel] =
    useState("Tháng này");

  // --- LOGIC XỬ LÝ DỮ LIỆU BIỂU ĐỒ (Điền ngày trống & xử lý tương lai) ---
  const fillMissingDates = useCallback((apiData, type) => {
    const result = [];
    const now = new Date();
    const todayStr = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();
    const thisMonthStr = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).getTime();

    let startDate = new Date();
    let iterations = 0;

    if (type === "week") {
      startDate.setDate(now.getDate() - 6);
      iterations = 7;
    } else if (type === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      iterations = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    } else if (type === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
      iterations = 12;
    }

    for (let i = 0; i < iterations; i++) {
      const currentDate = new Date(startDate);
      if (type === "year") {
        currentDate.setMonth(startDate.getMonth() + i);
      } else {
        currentDate.setDate(startDate.getDate() + i);
      }

      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");

      const dateKey =
        type === "year" ? `${year}-${month}` : `${year}-${month}-${day}`;
      const found = apiData.find((item) => item._id === dateKey);

      let isFuture = false;
      if (type === "year") {
        const checkMonth = new Date(year, currentDate.getMonth(), 1).getTime();
        isFuture = checkMonth > thisMonthStr;
      } else {
        const checkDay = new Date(
          year,
          currentDate.getMonth(),
          currentDate.getDate(),
        ).getTime();
        isFuture = checkDay > todayStr;
      }

      result.push({
        name: dateKey,
        display: type === "year" ? `T${month}` : `${day}/${month}`,
        revenue: isFuture ? undefined : found ? found.revenue : 0,
      });
    }
    return result;
  }, []);

  // --- API CALLS ---
  const fetchSummaryRevenue = async () => {
    setLoadingRevenue(true);
    try {
      const todaySummary = await managerService.getTodayRevenue();
      const yesterdaySummary = await managerService.getRevenueSumary(
        getYesterDayISOString(),
        getYesterDayISOString(),
      );
      const liveOperationData = await managerService.getLiveOperations();
      setTodayRevenue(todaySummary);
      setYesterdayRevenue(yesterdaySummary);
      setLiveOperationStats(liveOperationData);
    } catch (error) {
      console.error("Fetch summary error:", error);
      message.error("Không thể lấy dữ liệu doanh thu hôm nay");
    } finally {
      setLoadingRevenue(false);
    }
  };

  const fetchChartData = useCallback(
    async (label) => {
      setLoadingChart(true);
      try {
        const type = typeMap[label] || "week";
        const res = await managerService.getRevenueChartData(type);
        const formattedData = fillMissingDates(res, type);
        setRevenueData(formattedData);
      } catch (error) {
        console.error("Fetch chart error:", error);
        message.error("Không thể lấy dữ liệu biểu đồ");
      } finally {
        setLoadingChart(false);
      }
    },
    [fillMissingDates],
  );

  const fetchTopSellingData = useCallback(async (label) => {
    setLoadingTopSelling(true);
    try {
      const period = typeMap[label] || "month";
      // Gọi API top-selling
      const res = await managerService.getTopSellingItems(period);
      // Giả sử API trả về { success: true, data: [...] }
      setTopSellingData(res.data || []);
    } catch (error) {
      console.error("Fetch top selling error:", error);
      message.error("Không thể lấy dữ liệu top món ăn");
    } finally {
      setLoadingTopSelling(false);
    }
  }, []);

  useEffect(() => {
    fetchChartData(filterLabel);
  }, [filterLabel, fetchChartData]);

  useEffect(() => {
    fetchSummaryRevenue();
    fetchTopSellingData(topSellingFilterLabel);
  }, [fetchTopSellingData, topSellingFilterLabel]);

  useEffect(() => {
    fetchTopSellingData(topSellingFilterLabel);
  }, [topSellingFilterLabel, fetchTopSellingData]);
  return (
    <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        <section className="col-span-9 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-sm mb-3 uppercase text-gray-500">
              Kết quả kinh doanh hôm nay
            </h3>
            <div className="grid grid-cols-3 gap-10">
              <ResultItem
                icon={<Receipt />}
                title="Doanh thu"
                value={formatCurrency(todayRevenue.revenue)}
                note={"Hôm qua " + formatCurrency(yesterdayRevenue.revenue)}
                loading={loadingRevenue}
              />
              <ResultItem
                icon={<DollarSign />}
                title="Lợi nhuận"
                value={formatCurrency(todayRevenue.profit)}
                note=""
                highlight
                loading={loadingRevenue}
              />
              <ResultItem
                icon={<ClipboardList />}
                title="Số đơn hôm nay"
                value={todayRevenue.orderCount + " đơn"}
                note={"Hôm qua: " + yesterdayRevenue.orderCount + " đơn"}
                loading={loadingRevenue}
              />
              <ResultItem
                icon={<UserCheck />}
                title="Bàn đang có khách"
                value={liveOperationStats.activeTables + " bàn"}
                note=""
                loading={loadingRevenue}
              />
              <ResultItem
                icon={<CookingPot />}
                title="Món đang chế biến"
                value={
                  (liveOperationStats.kitchenStatus.totalProcessing || 0) +
                  " món"
                }
                note=""
                loading={loadingRevenue}
              />
            </div>
          </div>

          <DashboardBox
            title="DOANH THU"
            loading={loadingChart}
            currentLabel={filterLabel}
            onFilterChange={setFilterLabel}
          >
            <RevenueLineChart data={revenueData} type={typeMap[filterLabel]} />
          </DashboardBox>

          <DashboardBox
            title="10 MÓN BÁN CHẠY"
            loading={loadingTopSelling}
            currentLabel={topSellingFilterLabel}
            onFilterChange={setTopSellingFilterLabel}
          >
            <TopSellingChart
              data={topSellingData}
              loading={loadingTopSelling}
            />
          </DashboardBox>

          <DashboardBox
            title="DOANH THU"
            loading={loadingChart}
            currentLabel={filterLabel}
            onFilterChange={setFilterLabel}
          >
            <RevenueLineChart data={revenueData} type={typeMap[filterLabel]} />
          </DashboardBox>
        </section>

        <aside className="col-span-3 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-4 h-130">
            <h3 className="font-semibold text-sm mb-3 uppercase text-gray-500">
              Các hoạt động gần đây
            </h3>
            <div className="flex items-center justify-center h-full text-gray-400 text-xs italic">
              Chưa có hoạt động mới...
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
