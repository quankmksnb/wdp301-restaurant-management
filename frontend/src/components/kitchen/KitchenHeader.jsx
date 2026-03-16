"use client";

import TooltipIcon from "@/app/components/TooltipIcon";
import { Search, Plus, Bell, LogOut, Volume2, VolumeX } from "lucide-react";

export default function KitchenHeader({
  activeTab,
  setActiveTab,
  selTable,
  setSelTable,
  soundOn,
  setSoundOn,
}) {
  const TAB_ICONS = {
    phonban: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <rect x="3" y="11" width="18" height="2" rx="1" />
        <rect x="5" y="7" width="14" height="2" rx="1" />
        <rect x="5" y="15" width="3" height="5" rx="1" />
        <rect x="16" y="15" width="3" height="5" rx="1" />
      </svg>
    ),
    thucdon: (
      <svg
        width="14"
        height="14"
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
    setSoundOn((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };
  return (
    <div className="h-11.5 flex bg-linear-to-r from-[#1340b2] via-[#2d6fdc] to-[#3b82f6] text-white">
      {/* LEFT */}
      <div className="flex-[0_0_67%] flex items-center px-2.5">
        {/* Tabs */}
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-1.25 rounded text-[13px] transition
            ${
              activeTab === t.key
                ? "bg-white/20 font-semibold"
                : "hover:bg-white/10"
            }`}
          >
            {TAB_ICONS[t.key]}
            {t.label}
          </button>
        ))}
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex items-center px-[10px] gap-2">
        {/* Selected table */}
        <div className="flex items-center gap-1 bg-white/20 border border-white/30 rounded px-2.5 py-[3px] text-[12px] font-semibold cursor-pointer">
          {selTable ? `${selTable.id}-${selTable.id + 1}` : "Chọn bàn"}

          {selTable && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setSelTable(null);
              }}
              className="bg-white/30 rounded-full w-[14px] h-[14px] flex items-center justify-center text-[10px]"
            >
              ×
            </span>
          )}
        </div>

        {/* Add */}
        <div className="w-[26px] h-[26px] flex items-center justify-center rounded border border-white/30 bg-white/20 cursor-pointer hover:bg-white/30 transition">
          <Plus size={13} />
        </div>

        <div className="flex-1" />
        <div className="ml-auto flex items-center gap-1">
          <TooltipIcon
            icon={
              soundOn ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5 opacity-60" />
              )
            }
            label={soundOn ? "Tắt âm thanh" : "Bật âm thanh"}
            onClick={handleToggleSound}
          />

          <TooltipIcon icon={<Bell className="w-5 h-5" />} label="Thông báo" />

          <TooltipIcon
            icon={<LogOut className="w-5 h-5" />}
            label="Đăng xuất"
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
}
