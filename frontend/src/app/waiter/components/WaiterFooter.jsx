"use client";

import { Phone, MapPin, Zap } from "lucide-react";

export default function WaiterFooter() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-[12px]">
      
      {/* LEFT - Restaurant info */}
      <div className="flex items-center gap-4">
        
        {/* Restaurant name */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
            <MapPin size={13} className="text-white" />
          </div>
          <span className="font-semibold text-slate-800">ThanhHoa Restaurant</span>
        </div>

        <div className="w-px h-5 bg-slate-300" />

        {/* Support */}
        <a 
          href="tel:1900652200"
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors group"
        >
          <Phone size={13} className="group-hover:scale-110 transition-transform" />
          <span className="font-medium">1900 6522</span>
        </a>

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

      {/* RIGHT - Copyright */}
      <div className="text-slate-500 text-[11px]">
        © 2026 POS System • Built with ❤️
      </div>

    </footer>
  );
}