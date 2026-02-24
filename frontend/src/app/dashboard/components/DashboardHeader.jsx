"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bell,
  Settings,
  User,
  ChevronDown,
  LogOut,
  Utensils,
  ClipboardList,
  CreditCard,
} from "lucide-react";
import Image from "next/image";

export default function DashboardHeader() {
  const menus = [
    "Tổng quan",
    "Hàng hóa",
    "Phòng/Bàn",
    "Nhân viên",
    "Báo cáo",
  ];

  const [languageOpen, setLanguageOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const langRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLanguageOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full text-white shadow-sm">
      <div className="h-10 bg-blue-700 flex items-center justify-end px-6 text-xs gap-4 relative">

        <Bell className="w-4 h-4 cursor-pointer opacity-90 hover:opacity-100" />
        <Settings className="w-4 h-4 cursor-pointer opacity-90 hover:opacity-100" />

        {/* ===== User ===== */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => setUserOpen(!userOpen)}
            className="flex items-center gap-1 hover:opacity-100 opacity-90"
          >
            0986667778
            <User className="w-4 h-4" />
            <ChevronDown className="w-3 h-3" />
          </button>

          {userOpen && (
            <div className="absolute right-0 mt-2 w-45 bg-white text-gray-700 rounded-md shadow-lg py-1 text-sm z-50">
              <DropdownItem icon={<User />} label="Tài khoản" />
              <div className="border-t my-1" />
              <DropdownItem
                icon={<LogOut className="text-red-500" />}
                label="Đăng xuất"
                danger
              />
            </div>
          )}
        </div>
      </div>

      <div className="h-14 bg-blue-600 flex items-center px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative">
            <Image
              src="/images/logo.png"
              alt="ThanhHoa Restaurant"
              fill
              className="object-contain"
              priority
            />
          </div>

          <span className="text-lg font-semibold tracking-wide">
            ThanhHoa
          </span>
        </div>


        {/* Menu */}
        <nav className="ml-10 flex items-center gap-6 text-sm font-medium">
          {menus.map((item) => (
            <span
              key={item}
              className={`cursor-pointer relative pb-1
                ${item === "Tổng quan"
                  ? "font-semibold after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-white"
                  : "opacity-90 hover:opacity-100"
                }`}
            >
              {item}
            </span>
          ))}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-3">
          <RoleButton
            label="Nhà bếp"
            icon={<Utensils className="w-4 h-4" />}
          />
          <RoleButton
            label="Lễ tân"
            icon={<ClipboardList className="w-4 h-4" />}
          />
          <RoleButton
            label="Thu ngân"
            icon={<CreditCard className="w-4 h-4" />}
          />
        </div>

      </div>
    </header>
  );
}


function RoleButton({ label, icon }) {
  return (
    <button
      className="
        bg-white text-blue-600
        text-sm font-medium
        px-4 py-1.5
        rounded-full
        flex items-center gap-2
        hover:bg-blue-50
        transition
      "
    >
      {icon}
      {label}
    </button>
  );
}

function DropdownItem({ icon, label, danger }) {
  return (
    <div
      className={`px-8 py-1 flex items-center gap-3 cursor-pointer
        ${danger ? "hover:bg-red-50 text-red-600" : "hover:bg-gray-100"}
      `}
    >
      {icon}
      {label}
    </div>
  );
}
