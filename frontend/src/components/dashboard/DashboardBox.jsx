// components/dashboard/DashboardBox.jsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Spin } from "antd";

export default function DashboardBox({
  title,
  small,
  children,
  loading,
  onFilterChange,
  currentLabel,
}) {
  const [open, setOpen] = useState(false);

  const filters = ["7 ngày qua", "Tháng này", "Năm nay"];

  return (
    <div
      className={`relative bg-white rounded-lg shadow-sm p-3 ${
        small ? "h-65" : "h-100"      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-sm text-gray-700">{title}</h3>

        {onFilterChange && (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
            >
              {currentLabel}{" "}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {open && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setOpen(false)}
                ></div>

                <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg z-20 py-1">
                  {filters.map((item) => (
                    <div
                      key={item}
                      onClick={() => {
                        onFilterChange(item);
                        setOpen(false);
                      }}
                      className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 ${
                        currentLabel === item
                          ? "text-blue-600 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="h-[80%] w-full">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Spin size="small" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
