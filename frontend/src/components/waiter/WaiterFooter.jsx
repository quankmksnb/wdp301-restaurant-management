"use client";

import { Phone, MapPin, Package } from "lucide-react";

export default function WaiterFooter() {
  return (
    <footer className="h-8 bg-[#003d7a] border-t border-white/10 text-white/80 text-[11px] flex items-center justify-center gap-4">
      <span className="flex items-center gap-1.5">
        <Package size={12} />
        v1.0.0
      </span>

      <span className="opacity-40">|</span>

      <span className="flex items-center gap-1.5">
        <Phone size={12} />
        Hỗ trợ 1900 6522
      </span>

      </div>

      {/* CENTER - Status */}
      <div className="flex items-center gap-2 text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-[11px]">Online</span>
        </div>

        <span className="text-slate-300">•</span>

        <div className="flex items-center gap-1">
          <Zap size={12} className="text-amber-500" />
          <span className="text-[11px] text-slate-600">v1.0.0</span>
        </div>
      </div>


    </footer>
  );
}