"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/utils/utils";
import { Spin } from "antd";

const BAR_COLOR = "#3b82f6";

export default function AreaRevenueChart({ data = [], loading }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold text-sm mb-1 text-gray-800">{label}</p>
          <p className={`text-xs text-[${BAR_COLOR}]`}>
            Doanh thu:{" "}
            <span className="font-medium">
              {formatCurrency(payload[0].value)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spin size="small" />
      </div>
    );
  }

  return (
    <div className="h-full w-full text-xs">
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center text-gray-400 italic">
          Không có dữ liệu doanh thu theo khu vực
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical" // Biểu đồ cột ngang
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              horizontal={false}
            />

            {/* Trục X hiển thị giá trị doanh thu */}
            <XAxis
              type="number"
              tickFormatter={(value) => formatCurrency(value)}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280" }}
            />

            {/* Trục Y hiển thị tên khu vực */}
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: "#374151", fontSize: 11 }}
              width={80} // Độ rộng cho tên khu vực
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={CustomTooltip} cursor={{ fill: "#f9fafb" }} />

            <Bar
              dataKey="value"
              barSize={15}
              fill={BAR_COLOR}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
