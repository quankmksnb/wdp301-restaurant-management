"use client";

import { useState } from "react";
import { Utensils } from "lucide-react";

export default function TableCard({
  table,
  isSelected,
  isUsed,
  tTotal,
  tQty,
  tDishes,
  onClick,
}) {
  const [hover, setHover] = useState(false);

  let border, bg, text, subText, iconColor, shadow;

  if (isSelected) {
    border = "border-blue-700";
    bg = "bg-blue-700";
    text = "text-white";
    subText = "text-white/80";
    iconColor = "text-white/60";
    shadow = "shadow-lg shadow-blue-700/30";
  } else if (isUsed) {
    border = "border-blue-300";
    bg = "bg-blue-100";
    text = "text-blue-900";
    subText = "text-blue-500";
    iconColor = "text-blue-500";
    shadow = "shadow-md shadow-blue-900/10";
  } else if (hover) {
    border = "border-gray-300";
    bg = "bg-gray-100";
    text = "text-slate-800";
    subText = "text-gray-500";
    iconColor = "text-blue-400";
    shadow = "shadow-md";
  } else {
    border = "border-gray-300";
    bg = "bg-white";
    text = "text-slate-800";
    subText = "text-gray-500";
    iconColor = "text-blue-400";
    shadow = "shadow-sm";
  }

  // Hỗ trợ cả data API (_id, tableNumber) lẫn data cũ (id, name)
  const tableName = table.tableName ? `${table.tableName}` : table.tableNumber;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative cursor-pointer select-none py-2"
    >
      {/* top bar */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[52%] h-[9px] rounded-t-md border ${border} ${bg} border-b-0`}
      />

      {/* card */}
      <div
        className={`relative z-10 h-[80px] rounded-[18px] border ${border} ${bg} flex flex-col items-center justify-center gap-[3px] transition-all duration-150 ${shadow}`}
      >
        {(isUsed || isSelected) && tTotal > 0 ? (
          <>
            <div
              className={`text-[11.5px] font-bold flex items-baseline gap-1 ${
                isSelected ? "text-white" : "text-blue-700"
              }`}
            >
              {tTotal.toLocaleString("vi-VN")} ₫
              <span className={`text-[10px] font-normal ${subText}`}>
                
              </span>
            </div>

            <div className={`text-[10px] flex gap-1 ${subText}`}>
              
            </div>

            <div className={`text-[12px] font-semibold ${text}`}>
              {tableName}
            </div>
          </>
        ) : (
          <>
            <Utensils className={`w-5 h-5 ${iconColor}`} />
            <span className={`text-[12px] font-medium mt-[2px] ${text}`}>
              {tableName}
            </span>
          </>
        )}
      </div>

      {/* bottom bar */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[52%] h-[9px] rounded-b-md border ${border} ${bg} border-t-0`}
      />
    </div>
  );
}