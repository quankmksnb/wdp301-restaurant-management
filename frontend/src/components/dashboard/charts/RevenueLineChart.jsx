"use client";

import { Box } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Component này nhận props: data (dữ liệu đã xử lý) và type (week/month/year để format tooltip)
export default function RevenueLineChart({ data, type }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
        <Box className="w-10 h-10 mb-2" />
        <span>Không có dữ liệu giao dịch</span>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f0f0f0"
        />
        <XAxis
          dataKey="display"
          fontSize={11}
          tickMargin={10}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          fontSize={11}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`}
        />
        <Tooltip
          formatter={(value) =>
            value !== undefined
              ? [
                  new Intl.NumberFormat("vi-VN").format(value) + "đ",
                  "Doanh thu",
                ]
              : [null, "Chưa có dữ liệu"]
          }
          contentStyle={{
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          labelFormatter={(labelValue, payload) => {
            return payload[0]?.payload?.name || labelValue;
          }}
        />
        <Line
          type="linear"
          dataKey="revenue"
          stroke="#3b82f6"
          strokeWidth={3}
          dot={(props) => {
            const { cx, cy, payload } = props;
            if (payload.revenue === undefined) return null;
            return (
              <circle
                cx={cx}
                cy={cy}
                r={4}
                fill="#3b82f6"
                stroke="#fff"
                strokeWidth={2}
              />
            );
          }}
          activeDot={{ r: 6 }}
          animationDuration={1000}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
