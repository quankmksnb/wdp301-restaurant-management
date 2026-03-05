"use client";

import { useState } from "react";
import { ChevronDown, Box } from "lucide-react";

export default function DashboardBox({ title, small }) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("Hôm nay");

  const options = [
    "Hôm nay",
    "Hôm qua",
    "7 ngày qua",
    "Tháng này",
  ];

  return (
    <div
      className={`relative bg-white rounded-lg shadow-sm p-5 ${
        small ? "h-[260px]" : "h-[380px]"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm">{title}</h3>

        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            {label}
            <ChevronDown
              className={`w-4 h-4 transition ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg z-10">
              {options.map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    setLabel(item);
                    setOpen(false);
                  }}
                  className={`px-3 py-2 text-xs cursor-pointer
                    hover:bg-gray-100
                    ${label === item ? "text-blue-600 font-medium" : ""}
                  `}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
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
