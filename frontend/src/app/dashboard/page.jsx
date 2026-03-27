"use client";
import { useEffect, useState } from "react";
import { ClipboardList, DollarSign, Receipt, Users } from "lucide-react";
import DashboardBox from "../../components/dashboard/DashboardBox";
import ResultItem from "../../components/dashboard/ResultItem";
import managerService from "@/services/managerService";
import { formatCurrency, getYesterDayISOString } from "@/utils/utils";

export default function Dashboard() {
  const [todayRevenue, setsetTodayRevenue] = useState({
    revenue: 0,
    profit: 0,
    orderCount: 0,
  });
  const [yesterdayRevenue, setYesterdayRevenue] = useState({
    revenue: 0,
    profit: 0,
    orderCount: 0,
  });
  const [loadingRevenue, setLoadingRevenue] = useState(true);

  const fetchSummaryRevenue = async () => {
    setLoadingRevenue(true);
    try {
      const todaySummary = await managerService.getTodayRevenue();
      const yesterdaySummary = await managerService.getRevenueSumary(
        getYesterDayISOString(),
        getYesterDayISOString(),
      );
      setsetTodayRevenue(todaySummary);
      setYesterdayRevenue(yesterdaySummary);
    } catch (error) {
      console.error("Fetch employees error:", error);
      message.error(error.message || "Không thể lấy dữ liệu hôm nay");
    } finally {
      setLoadingRevenue(false);
    }
  };

  useEffect(() => {
    fetchSummaryRevenue();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-6 grid grid-cols-12 gap-6">
        <section className="col-span-9 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="font-semibold text-sm mb-4">
              KẾT QUẢ BÁN HÀNG HÔM NAY
            </h2>

            <div className="grid grid-cols-3 divide-x">
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
            </div>
          </div>

          <DashboardBox title="DOANH SỐ HÔM NAY" />

          <DashboardBox title="SỐ LƯỢNG KHÁCH HÔM NAY" />

          <DashboardBox title="TOP 10 HÀNG HÓA BÁN CHẠY 7 NGÀY QUA" small />
        </section>

        <aside className="col-span-3 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-4 h-[520px]">
            <h3 className="font-semibold text-sm mb-3">
              CÁC HOẠT ĐỘNG GẦN ĐÂY
            </h3>

            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Không có dữ liệu
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
