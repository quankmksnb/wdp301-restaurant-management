export default function ByRoomTab() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 h-full">
      <div className="opacity-20 mb-4">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11 9H9V2H7V9H5V2H3V9C3 11.12 4.66 12.84 6.75 12.97V22H9.25V12.97C11.34 12.84 13 11.12 13 9V2H11V9ZM16 6V14H18.5V22H21V2C18.24 2 16 4.24 16 6Z" />
        </svg>
      </div>

      <p>Chưa có dữ liệu theo phòng/bàn</p>
    </div>
  );
}
