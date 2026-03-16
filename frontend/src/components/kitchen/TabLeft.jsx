"use client";

import { useState } from "react";
import { OrderItem } from "@/components/kitchen/OrderItem";

export default function TabLeft() {
  // 1. Khai báo state để quản lý tab đang chọn
  const [activeTab, setActiveTab] = useState("priority");

  // Danh sách các tabs để render cho gọn
  const tabs = [
    { id: "priority", label: "Ưu tiên" },
    { id: "by-dish", label: "Theo món" },
    { id: "by-room", label: "Theo phòng/bàn" },
  ];

  return (
    <div className="flex-1 bg-[#003d7a] rounded-tr-md rounded-br-md flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-white font-bold">Chờ chế biến</h2>

        <div className="flex items-center pt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 transition-all duration-200 font-medium rounded-t-lg text-[14px] ${
                activeTab === tab.id
                  ? "bg-white text-blue-800" // Style khi được chọn
                  : "text-white opacity-60 hover:opacity-100" // Style khi chưa chọn
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Nội dung thay đổi dựa trên tab */}
      <div className="flex-1 overflow-y-auto bg-white rounded-tr-lg rounded-br-lg p-2">
        {activeTab === "priority" && (
          <div className="animate-in fade-in duration-300">
            {/* Nội dung Tab Ưu tiên */}
            <OrderItem
              name="Súp kem kiểu Paris"
              table="Bàn 2"
              time="5 ngày trước"
              qty={1}
              note="1-9 - 11/03/2026 23:17 - Bởi bonghoadepnhat"
            />
            <OrderItem
              name="BLOODY MARY"
              table="Bàn 3"
              time="3 giờ trước"
              qty={1}
              note="1-12 - 16/03/2026 21:03 - Bởi bonghoadepnhat"
            />
            {/* ... copy các item khác vào đây */}
          </div>
        )}

        {activeTab === "by-dish" && (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400  rounded-lg h-full">
            {/* Placeholder Icon */}
            <div className="opacity-20 mb-4">
              <svg
                width="100"
                height="100"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11 9H9V2H7V9H5V2H3V9C3 11.12 4.66 12.84 6.75 12.97V22H9.25V12.97C11.34 12.84 13 11.12 13 9V2H11V9ZM16 6V14H18.5V22H21V2C18.24 2 16 4.24 16 6Z" />
              </svg>
            </div>
            <p>Chưa có dữ liệu theo món</p>
          </div>
        )}

        {activeTab === "by-room" && (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400  rounded-lg h-full">
            {/* Placeholder Icon */}
            <div className="opacity-20 mb-4">
              <svg
                width="100"
                height="100"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11 9H9V2H7V9H5V2H3V9C3 11.12 4.66 12.84 6.75 12.97V22H9.25V12.97C11.34 12.84 13 11.12 13 9V2H11V9ZM16 6V14H18.5V22H21V2C18.24 2 16 4.24 16 6Z" />
              </svg>
            </div>
            <p>Chưa có dữ liệu theo món theo phòng bàn</p>
          </div>
        )}
      </div>
    </div>
  );
}
