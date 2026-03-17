"use client";

import { useRouter } from "next/navigation";
import TooltipIcon from "@/app/components/TooltipIcon";
import { Search, Plus, Bell, LogOut, Volume2, VolumeX } from "lucide-react";

export default function WaiterHeader({
  activeTab,
  setActiveTab,
  selTable,
  setSelTable,
  soundOn,
  setSoundOn
}) {
  const router = useRouter();

  const TAB_ICONS = {
    phonban: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        <rect x="3" y="11" width="18" height="2" rx="1" />
        <rect x="5" y="7" width="14" height="2" rx="1" />
        <rect x="5" y="15" width="3" height="5" rx="1" />
        <rect x="16" y="15" width="3" height="5" rx="1" />
      </svg>
    ),
    thucdon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
      >
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" fill="white" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="13" y2="16" />
      </svg>
    ),
  };

  const TABS = [
    { key: "phonban", label: "Phòng bàn" },
    { key: "thucdon", label: "Thực đơn" },
  ];

  const handleToggleSound = () => {
    setSoundOn(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="h-14 flex bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white shadow-lg border-b border-blue-600">

      {/* LEFT - TABS & SEARCH */}
      <div className="flex-[0_0_67%] flex items-center px-4 gap-4">

        {/* Tabs */}
        <div className="flex items-center gap-1.5 bg-white/10 rounded-lg p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-[13px] font-semibold transition-all duration-200
              ${
                activeTab === t.key
                  ? "bg-white/20 shadow-md"
                  : "hover:bg-white/10"
              }`}
            >
              {TAB_ICONS[t.key]}
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2.5 flex-1 bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all">
          <Search size={15} className="text-white/70 flex-shrink-0" strokeWidth={2.5} />

          <input
            placeholder="Tìm món, bàn..."
            className="bg-transparent outline-none text-[13px] w-full placeholder:text-white/50 text-white font-medium"
          />
        </div>
      </div>

      {/* RIGHT - ACTIONS */}
      <div className="flex-1 flex items-center px-4 gap-4">

        {/* Selected table pill */}
        {selTable && (
          <div className="flex items-center gap-2.5 bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-sm rounded-lg px-3.5 py-2 border border-white/25 shadow-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-green-300 flex-shrink-0" />
              <span className="text-sm font-bold text-white truncate">
                {selTable.tableName ?? selTable.name}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelTable(null);
              }}
              className="ml-1 w-5 h-5 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-[12px] cursor-pointer transition-colors flex-shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        {!selTable && (
          <div className="text-sm text-white/50 font-medium italic">Chưa chọn bàn</div>
        )}

        <div className="flex-1" />

        {/* Right toolbar */}
        <div className="flex items-center gap-1.5">
          
          {/* Add button */}
          <button
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/15 hover:bg-white/25 border border-white/25 hover:border-white/40 transition-all cursor-pointer group"
            title="Thêm bàn"
          >
            <Plus size={18} className="text-white group-hover:scale-110 transition-transform" />
          </button>

          {/* Sound toggle */}
          <button
            onClick={handleToggleSound}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/15 hover:bg-white/25 border border-white/25 hover:border-white/40 transition-all cursor-pointer group"
            title={soundOn ? "Tắt âm thanh" : "Bật âm thanh"}
          >
            {soundOn ? (
              <Volume2 size={18} className="text-white group-hover:scale-110 transition-transform" />
            ) : (
              <VolumeX size={18} className="text-white/60 group-hover:text-white group-hover:scale-110 transition-all" />
            )}
          </button>

          {/* Notifications */}
          <button
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/15 hover:bg-white/25 border border-white/25 hover:border-white/40 transition-all cursor-pointer group relative"
            title="Thông báo"
          >
            <Bell size={18} className="text-white group-hover:scale-110 transition-transform" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/15 hover:bg-red-500/30 border border-white/25 hover:border-red-400/50 transition-all cursor-pointer group"
            title="Đăng xuất"
          >
            <LogOut size={18} className="text-white group-hover:scale-110 transition-transform" />
          </button>

        </div>
      </div>
    </div>
  );
}