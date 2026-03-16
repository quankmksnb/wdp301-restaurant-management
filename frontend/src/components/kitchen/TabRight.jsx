import { Bell, Menu, Settings, Volume2 } from "lucide-react";

export default function TabRight() {
  return (
    <div className="flex-1 bg-[#003d7a] rounded-md flex flex-col overflow-hidden">
      <div className="flex items-center h-10 justify-between">
        <h2 className=" text-white font-bold">Đã xong/ Chờ cung ứng</h2>
        <div className="flex gap-[8px]">
          <button className="bg-[#00408C] text-white w-8 h-8 rounded-md flex items-center justify-center cursor-pointer">
            <Volume2 size={18} />
          </button>
          <button className="bg-[#00408C] text-white w-8 h-8 rounded-md flex items-center justify-center cursor-pointer">
            <Settings size={18} />
          </button>
          <button className="bg-[#00408C] text-white w-8 h-8 rounded-md flex items-center justify-center cursor-pointer">
            <Bell size={18} />
          </button>
          <button className="bg-[#00408C] text-white w-8 h-8 rounded-md flex items-center justify-center cursor-pointer">
            <Menu size={18} />
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white rounded-lg">
        {/* Placeholder Icon */}
        <div className="opacity-20 mb-4">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 9H9V2H7V9H5V2H3V9C3 11.12 4.66 12.84 6.75 12.97V22H9.25V12.97C11.34 12.84 13 11.12 13 9V2H11V9ZM16 6V14H18.5V22H21V2C18.24 2 16 4.24 16 6Z" />
          </svg>
        </div>
        <p>Chưa có đơn hàng cần cung ứng</p>
      </div>
    </div>
  );
}
