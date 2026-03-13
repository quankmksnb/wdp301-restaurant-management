"use client";

import { Phone, MapPin, Package } from "lucide-react";

export default function WaiterFooter() {
  return (
    <footer className="h-8 bg-blue-900 border-t border-white/10 text-white/80 text-[11px] flex items-center justify-center gap-4">
      
      <span className="flex items-center gap-1.5">
        <Package size={12} />
        v1.0.0
      </span>

      <span className="opacity-40">|</span>

      <span className="flex items-center gap-1.5">
        <Phone size={12} />
        Hỗ trợ 1900 6522
      </span>

      <span className="opacity-40">|</span>

      <span className="flex items-center gap-1.5">
        <MapPin size={12} />
        Chi nhánh trung tâm
      </span>

    </footer>
  );
}