import { DollarSign, Users, ClipboardList, Truck } from "lucide-react";

import DashboardHeader from "./components/DashboardHeader";
import DashboardBox from "../../components/dashboard/DashboardBox";
import TopProductBox from "../../components/dashboard/TopProductBox";
import ResultItem from "../../components/dashboard/ResultItem";

export default function Dashboard() {
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
                icon={<DollarSign />}
                title="0 đơn đã xong"
                value="0"
                note="Hôm qua 0"
              />
              <ResultItem
                icon={<ClipboardList />}
                title="1 đơn đang phục vụ"
                value="8,000"
                note=" "
                highlight
              />
              <ResultItem
                icon={<Users />}
                title="Khách hàng"
                value="0"
                note="Hôm qua 0"
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
