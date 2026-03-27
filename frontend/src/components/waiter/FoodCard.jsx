"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function FoodCard({ food, onAdd, cartQty }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={() => onAdd(food)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`bg-white rounded-lg overflow-hidden cursor-pointer transition
        ${hover
          ? "border-2 border-blue-500 shadow-lg scale-[1.02]"
          : "border border-slate-200 shadow-sm"}`}
    >
      {/* Image */}
      <div className="relative pt-[68%] bg-slate-100 overflow-hidden">
        <img
          src={`${food.images || food.img || "/placeholder-food.png"}`}
          alt={food.itemName || food.name}
          className={`absolute inset-0 w-full h-full object-cover transition
            ${hover ? "scale-105" : ""}`}
        />

        {/* Hover add button */}
        {hover && (
          <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
            <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center">
              <Plus size={18} color="white" />
            </div>
          </div>
        )}

        {/* Price */}
        <div className={`absolute bottom-0 left-0 right-0 text-center text-[11px] font-bold text-white py-[3px]
          ${hover ? "bg-blue-600/90" : "bg-blue-800/80"}`}>
          {(food.price || 0).toLocaleString("vi-VN")}
        </div>

        {/* Cart qty badge */}
        {cartQty > 0 && (
          <div className="absolute top-1.5 right-1.5 bg-red-500 text-white w-5 h-5 text-[11px] rounded-full flex items-center justify-center font-bold">
            {cartQty}
          </div>
        )}

        {/* Unavailable overlay */}
        {food.availabilityStatus === "unavailable" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-[11px] font-semibold">Hết món</span>
          </div>
        )}
      </div>

      {/* Name */}
      <div
        className={`px-2 py-2 text-[12px] text-center min-h-[38px] flex items-center justify-center transition
          ${hover ? "text-blue-700 font-semibold" : "text-slate-800 font-medium"}`}
      >
        {food.itemName || food.name}
      </div>
    </div>
  );
}