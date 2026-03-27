"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import TooltipIcon from "../auth/TooltipIcon";

export default function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const menus = [
    { label: "Tổng quan", path: "/dashboard" },
    { label: "Hàng hóa", path: "/dashboard/products" },
    { label: "Phòng/Bàn", path: "/dashboard/table" },
    { label: "Nhân viên", path: "/dashboard/employee" },
    { label: "Báo cáo", path: "/dashboard/reports" },
  ];

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <header className="w-full text-white shadow-sm">
      <div
        className="h-14 flex items-center px-6"
        style={{
          background:
            "linear-gradient(90deg,#1340b2 0%,#2d6fdc 55%,#3b82f6 100%)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative">
            <Image
              src="/images/logo.png"
              alt="ThanHoa Restaurant"
              fill
              className="object-contain"
              priority
            />
          </div>

          <span className="text-lg font-semibold tracking-wide">ThanHoa</span>
        </div>

        {/* Menu */}
        <nav className="ml-10 flex items-center gap-8 text-sm font-medium">
          {menus.map((item) => {
            const isActive =
              item.path === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.path);

            if (item.component) {
              const isActive = pathname.startsWith(item.path);
              return (
                <React.Fragment key={item.path}>
                  {React.cloneElement(item.component, { isActive })}
                </React.Fragment>
              );
            }

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`
          relative pb-1 transition-all duration-300
          ${isActive ? "font-semibold" : "opacity-80 hover:opacity-100"}
        `}
              >
                {item.label}
                <span
                  className={`
            absolute left-0 bottom-0 h-[2px] bg-white transition-all duration-300
            ${isActive ? "w-full" : "w-0 group-hover:w-full"}
          `}
                />
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <TooltipIcon icon={<Bell className="w-5 h-5" />} label="Thông báo" />

          <TooltipIcon
            icon={<Settings className="w-5 h-5" />}
            label="Cài đặt"
          />

          <TooltipIcon
            icon={<LogOut className="w-5 h-5" />}
            label="Đăng xuất"
            onClick={handleLogout}
          />
        </div>
      </div>
    </header>
  );
}
