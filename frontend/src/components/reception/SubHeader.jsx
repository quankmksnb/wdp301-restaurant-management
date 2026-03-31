"use client";



export default function SubHeader({ viewMode, setViewMode, statusFilters, onStatusFilterChange, reservationCount, onOpenModal }) {
    const filters = [
        { key: "confirmed", label: "Đã xếp bàn", color: "#22c55e" },
        { key: "seated", label: "Đã nhận bàn", color: "#3b82f6" },
        { key: "completed", label: "Hoàn thành", color: "#a855f7" },
        { key: "cancelled", label: "Đã hủy", color: "#d1d5db" },
    ];

    return (
        <div className="h-11 bg-white border-b border-gray-200 flex items-center px-5 text-sm shrink-0">
            {/* Chế độ xem */}
            <div className="flex items-center gap-1.5 mr-8">
                {["day", "week", "month"].map((m) => (
                    <button
                        key={m}
                        onClick={() => setViewMode(m)}
                        className={`px-3 py-1 cursor-pointer transition rounded-lg ${viewMode === m
                            ? "text-blue-700 font-bold border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-800"
                            }`}
                    >
                        {m === "day" ? "Ngày" : m === "week" ? "Tuần" : "Tháng"}
                    </button>
                ))}
            </div>

            {/* Checkbox lọc trạng thái */}
            <div className="flex items-center gap-5">
                {filters.map(({ key, label, color }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={statusFilters[key]}
                            onChange={(e) => onStatusFilterChange(key, e.target.checked)}
                            className="cursor-pointer"
                            style={{ accentColor: color, width: 15, height: 15 }}
                        />
                        {label}
                    </label>
                ))}
            </div>

            {/* Hành động bên phải */}
            <div className="ml-auto flex items-center gap-3">

                <button
                    onClick={onOpenModal}
                    className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer transition"
                >
                    Đặt bàn (F1)
                    {reservationCount > 0 && (
                        <span className="ml-1 bg-white text-blue-700 text-[11px] font-bold px-2 rounded-full">
                            {reservationCount}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}
