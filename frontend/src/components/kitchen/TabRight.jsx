"use client";

import kitchenService from "@/services/kitchenService";
import { Bell, Menu, Settings, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MeunuPopup from "@/components/kitchen/MeunuPopup";
import ReadyItem from "@/components/kitchen/items/ReadyItem";
import toast from "react-hot-toast";
import { kitchenEvents } from "@/utils/kitchenEvents";

export default function TabRight() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef(null);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await kitchenService.getReadyItems();
      setItems(res.data || []);
    } catch (error) {
      console.error("Fetch ready items error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handler = () => fetchData();

    kitchenEvents.addEventListener("kitchen-updated", handler);

    return () => {
      kitchenEvents.removeEventListener("kitchen-updated", handler);
    };
  }, []);

  const handleServe = async (id, quantity = "all") => {
    try {
      await kitchenService.updateItemStatus(id, "served", quantity);
      toast.success(
        "Đã cũng ứng " + (quantity === "all" ? "tất cả" : "1") + " món",
      );
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
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
    <div className="flex-1 bg-[#003d7a] rounded-tl-md rounded-bl-md flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 h-11.25">
        <h2 className="text-white font-bold">Đã xong / Chờ cung ứng</h2>

        <div className="flex gap-2 relative" ref={menuRef}>
          <button className="bg-[#00408C] text-white w-8 h-8 rounded-md flex items-center justify-center">
            <Volume2 size={18} />
          </button>

          <button className="bg-[#00408C] text-white w-8 h-8 rounded-md flex items-center justify-center">
            <Settings size={18} />
          </button>

          <button className="bg-[#00408C] text-white w-8 h-8 rounded-md flex items-center justify-center">
            <Bell size={18} />
          </button>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="bg-[#00408C] text-white w-8 h-8 rounded-md flex items-center justify-center"
          >
            <Menu size={18} />
          </button>

          {showMenu && <MeunuPopup handleLogout={handleLogout} />}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 bg-white overflow-y-auto">
        {loading && (
          <div className="p-6 text-center text-gray-400">Đang tải...</div>
        )}

        {!loading && !items.length && (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 h-full">
            <div className="opacity-20 mb-4">
              <svg
                width="100"
                height="100"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11 9H9V2H7V9H5V2H3V9C3 11.12 4.66 12.84 6.75 12.97V22H9.25V12.97C11.34 12.84 13 11.12 13 9V2H11V9ZM16 6V14H18.5V22H21V2C18.24 2 16 4.24 16 6Z" />
              </svg>
            </div>

            <p>Chưa có món nào cần cung ứng</p>
          </div>
        )}

        {items.map((item) => (
          <ReadyItem
            key={item._id}
            name={item.itemName}
            table={item.tableName}
            qty={item.quantity}
            note={item.note}
            onServeOne={() => handleServe(item._id, 1)}
            onServeAll={() => handleServe(item._id, "all")}
          />
        ))}
      </div>
    </div>
  );
}
