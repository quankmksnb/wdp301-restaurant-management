"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatCurrency } from "@/utils/utils";

const COLORS = {
  quantity: "#3b82f6",
  revenue: "#10b981",
};

export default function TopSellingChart({ data = [], loading }) {
  const [viewMode, setViewMode] = useState("quantity");

  const chartData = data.length > 0 ? data : [];

  const valueFormatter = (value) => {
    if (viewMode === "revenue") {
      return formatCurrency(value);
    }
    return `${value} lượt`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg border-gray-100">
          <p className="font-semibold text-sm mb-1 text-gray-800">{label}</p>
          <p className="text-xs">
            {viewMode === "quantity" ? "Số lượt bán: " : "Doanh thu: "}
            <span className="font-medium">
              {valueFormatter(payload[0].value)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Thanh chuyển đổi (Tabs) */}
      <div className="flex justify-end mb-4 -mt-2">
        <div className="flex bg-gray-100 p-1 rounded-sm text-xs border border-gray-100">
          <button
            onClick={() => setViewMode("quantity")}
            className={`px-3 py-1.5 rounded transition-colors ${
              viewMode === "quantity"
                ? "bg-white text-blue-600 font-medium shadow"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Theo lượt bán
          </button>
          <button
            onClick={() => setViewMode("revenue")}
            className={`px-3 py-1.5 rounded transition-colors ${
              viewMode === "revenue"
                ? "bg-white text-emerald-600 font-medium shadow"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Theo doanh thu
          </button>
        </div>
      </div>

      {/* Khu vực biểu đồ */}
      <div className="flex-1 w-full text-xs">
        {chartData.length === 0 && !loading ? (
          <div className="flex h-full items-center justify-center text-gray-400 italic">
            Không có dữ liệu món ăn trong thời gian này
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                horizontal={false}
              />

              <XAxis
                type="number"
                tickFormatter={valueFormatter}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280" }}
              />
              {/* Trục Y hiển thị tên món */}
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: "#374151", fontSize: 11 }}
                width={100}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={CustomTooltip} cursor={{ fill: "#f9fafb" }} />

              {/* Cột dữ liệu */}
              <Bar
                dataKey={viewMode === "quantity" ? "value" : "revenue"}
                radius={[0, 4, 4, 0]}
                barSize={15}
              >
                {/* Đổi màu cột dựa theo viewMode */}
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      viewMode === "quantity" ? COLORS.quantity : COLORS.revenue
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
