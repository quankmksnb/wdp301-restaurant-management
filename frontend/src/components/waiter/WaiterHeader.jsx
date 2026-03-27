"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Bell, LogOut, Volume2, VolumeX, X } from "lucide-react";

export default function WaiterHeader({
  activeTab,
  setActiveTab,
  selTable,
  setSelTable,
  soundOn,
  setSoundOn,
  searchQuery = "",
  onSearchChange,
}) {
  const router = useRouter();
  const inputRef = useRef(null);

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
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleClearSearch = () => {
    onSearchChange?.("");
    inputRef.current?.focus();
  };

  return (
    <div className="h-14 flex bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white shadow-lg border-b border-blue-600">

      {/* LEFT */}
      <div className="flex-[0_0_67%] flex items-center px-4 gap-4">

        {/* Tabs */}
        <div className="flex items-center gap-1.5 bg-white/10 rounded-lg p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-[13px] font-semibold transition-all duration-200
              ${activeTab === t.key ? "bg-white/20 shadow-md" : "hover:bg-white/10"}`}
            >
              {TAB_ICONS[t.key]}
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div
          className={`flex items-center gap-2.5 flex-1 backdrop-blur-sm rounded-lg px-4 py-2 border transition-all
            ${searchQuery
              ? "bg-white/25 border-white/50 shadow-inner"
              : "bg-white/15 border-white/20 hover:bg-white/20 hover:border-white/30"
            }`}
        >
          <Search size={15} className="text-white/70 flex-shrink-0" strokeWidth={2.5} />

          <input
            ref={inputRef}
            value={searchQuery}
            onChange={e => onSearchChange?.(e.target.value)}
            placeholder="Tìm món ăn..."
            className="bg-transparent outline-none text-[13px] w-full placeholder:text-white/50 text-white font-medium"
          />

          {/* Nút xoá khi có text */}
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded-full bg-white/30 hover:bg-white/50 transition-colors"
              title="Xoá tìm kiếm"
            >
              <X size={10} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      {/* RIGHT */}
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
              onClick={(e) => { e.stopPropagation(); setSelTable(null); }}
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

        {/* Toolbar */}
        <div className="flex items-center gap-1.5">

          <button
            onClick={() => setSoundOn(prev => !prev)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/15 hover:bg-white/25 border border-white/25 hover:border-white/40 transition-all cursor-pointer group"
            title={soundOn ? "Tắt âm thanh" : "Bật âm thanh"}
          >
            {soundOn ? (
              <Volume2 size={18} className="text-white group-hover:scale-110 transition-transform" />
            ) : (
              <VolumeX size={18} className="text-white/60 group-hover:text-white group-hover:scale-110 transition-all" />
            )}
          </button>

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