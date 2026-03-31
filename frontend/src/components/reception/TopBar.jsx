"use client";

import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { Settings, Menu, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TopBar({ tabMode, setTabMode }) {
    const router = useRouter();
    const [userPhone, setUserPhone] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const decoded = jwtDecode(token);
                setUserPhone(decoded.fullName || "");
            }
        } catch (e) {
            console.error("Error decoding token:", e);
        }
    }, []);

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    return (
        <div className="h-12 bg-gradient-to-r from-[#1340b2] via-[#2d6fdc] to-[#3b82f6] flex items-center px-5 text-white text-sm shrink-0">
            {/* Bên trái: Tiêu đề */}
            <span className="font-bold text-base mr-8 tracking-wide">Đặt bàn</span>

            {/* Các tab chuyển đổi */}
            <div className="flex h-full">
                {[
                    { key: "calendar", label: "Theo lịch" },
                    { key: "list", label: "Lịch sử đặt bàn" },
                ].map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTabMode(t.key)}
                        className={`px-5 h-full flex items-center cursor-pointer transition-colors font-medium text-sm rounded-t-lg ${tabMode === t.key
                            ? "bg-white text-blue-700"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Bên phải */}
            <div className="ml-auto flex items-center gap-5">

                <span className="flex items-center gap-1.5">
                    {userPhone || "N/A"}
                </span>
                <div className="relative" ref={dropdownRef}>
                    <Menu
                        className="w-4.5 h-4.5 text-white/70 cursor-pointer hover:text-white"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    />
                    {dropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition"
                            >
                                <LogOut className="w-4 h-4" />
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
