import Link from "next/link";
import React from "react";

export default function DashboardHeader() {
  return (
    <header className="w-full h-12 flex items-center bg-light">
      <nav className="max-w-387.5 w-full mx-auto">
        <Link
          href={"/dashboard"}
          className="text-white font-semibold px-4.25 py-2.5 text-[14px] cursor-pointer hover:rounded-sm hover:bg-[#0060d0] transition-all duration-250"
        >
          Tổng quan
        </Link>
        <Link
          href={"/dashboard/products"}
          className="text-white font-semibold px-4.25 py-2.5 text-[14px] cursor-pointer hover:rounded-sm hover:bg-[#0060d0] transition-all duration-250"
        >
          Hàng hóa
        </Link>
        <Link
          href={"/dashboard/table"}
          className="text-white font-semibold px-4.25 py-2.5 text-[14px] cursor-pointer hover:rounded-sm hover:bg-[#0060d0] transition-all duration-250"
        >
          Phòng bàn
        </Link>
        <Link
          href={"/dashboard/staff"}
          className="text-white font-semibold px-4.25 py-2.5 text-[14px] cursor-pointer hover:rounded-sm hover:bg-[#0060d0] transition-all duration-250"
        >
          Nhân viên
        </Link>
        <Link
          href={"/dashboard"}
          className="text-white font-semibold px-4.25 py-2.5 text-[14px] cursor-pointer hover:rounded-sm hover:bg-[#0060d0] transition-all duration-250"
        >
          Link 5
        </Link>
      </nav>
    </header>
  );
}
