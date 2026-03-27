"use client";

import { useState } from "react";
import { ChevronDown, Check, Box } from "lucide-react";

export default function TopProductBox() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("Theo doanh thu");

  const options = ["Theo doanh thu", "Theo số lượng"];

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 h-[320px] relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm">
          TOP 10 HÀNG HÓA BÁN CHẠY 7 NGÀY QUA
        </h3>

        <div className="flex items-center gap-4 text-xs text-blue-600">
          
          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 font-medium hover:underline"
            >
              {type.toUpperCase()}
              <ChevronDown
                className={`w-4 h-4 transition ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-10">
                {options.map((item) => (
                  <div
                    key={item}
                    onClick={() => {
                      setType(item);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-2 text-xs cursor-pointer hover:bg-gray-100"
                  >
                    <span>{item}</span>
                    {type === item && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Time label */}
          <span className="text-gray-500">7 ngày qua</span>
        </div>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
        <Box className="w-10 h-10 mb-2" />
        <span>Không có dữ liệu</span>
      </div>
    </div>
  );
}
