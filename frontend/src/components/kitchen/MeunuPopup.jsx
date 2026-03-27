import { LogOut, ShieldCheck, User } from "lucide-react";
import React from "react";

export default function MeunuPopup({ handleLogout }) {
  return (
    <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-150 origin-top-right">
      <div className="h-px bg-gray-100 my-1" />

      <button
        onClick={handleLogout}
        className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 text-sm transition-colors"
      >
        <LogOut size={16} />
        <span className="font-medium">Thoát</span>
      </button>
    </div>
  );
}
