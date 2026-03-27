"use client";

import { useState, useMemo } from "react";
import { Select, Table, Tag, DatePicker, Dropdown, Button, Statistic } from "antd";
import { Search, MoreHorizontal, Edit, CheckCircle, XCircle, History, Users, CalendarCheck, Ban, Clock } from "lucide-react";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const STATUS_MAP = {
    confirmed: { label: "Đã xếp bàn", color: "green", icon: <CalendarCheck size={12} /> },
    seated: { label: "Đã nhận bàn", color: "blue", icon: <Users size={12} /> },
    cancelled: { label: "Đã hủy", color: "default", icon: <Ban size={12} /> },
    completed: { label: "Hoàn thành", color: "purple", icon: <CheckCircle size={12} /> },
    no_show: { label: "Quá giờ", color: "orange", icon: <Clock size={12} /> },
};

export default function ReservationListView({
    reservations,
    areas,
    statusFilters,
    onStatusFilterChange,
    onStatusChange,
    onOpenModal,
    onEditReservation,
    selectedDate,
    onSelectDate,
}) {
    const [searchText, setSearchText] = useState("");
    const [selectedArea, setSelectedArea] = useState("all");
    const [dateRange, setDateRange] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [pageSize, setPageSize] = useState(15);

    // Thống kê tổng quan
    const stats = useMemo(() => {
        const total = reservations.length;
        const confirmed = reservations.filter(r => r.status === "confirmed").length;
        const seated = reservations.filter(r => r.status === "seated").length;
        const completed = reservations.filter(r => r.status === "completed").length;
        const cancelled = reservations.filter(r => r.status === "cancelled").length;
        return { total, confirmed, seated, completed, cancelled };
    }, [reservations]);

    // Lọc danh sách đặt bàn
    const filteredData = useMemo(() => {
        let data = [...reservations];

        // Lọc theo trạng thái
        if (statusFilter !== "all") {
            data = data.filter(r => r.status === statusFilter);
        }

        // Tìm kiếm
        if (searchText.trim()) {
            const q = searchText.toLowerCase();
            data = data.filter(
                (r) =>
                    r.customerName?.toLowerCase().includes(q) ||
                    r.phone?.includes(q) ||
                    r._id?.toLowerCase().includes(q)
            );
        }

        // Lọc theo khu vực
        if (selectedArea !== "all") {
            data = data.filter(r => r.areaId === selectedArea);
        }

        // Lọc theo khoảng ngày
        if (dateRange && dateRange[0] && dateRange[1]) {
            const start = dateRange[0].startOf("day");
            const end = dateRange[1].endOf("day");
            data = data.filter(r => {
                const d = dayjs(r.startTime);
                return d.isAfter(start) && d.isBefore(end);
            });
        }

        return data;
    }, [reservations, statusFilters, searchText, selectedArea, dateRange, statusFilter]);

    // Tạo mã đặt bàn từ ID
    const getResCode = (id) => {
        if (!id) return "";
        const clean = id.replace(/_.*$/, "");
        return `DB${clean.slice(-5).toUpperCase()}`;
    };

    const columns = [
        {
            title: "Mã đặt bàn",
            dataIndex: "_id",
            key: "code",
            width: 120,
            render: (id) => (
                <span className="text-blue-600 font-semibold text-xs font-mono bg-blue-50 px-2 py-0.5 rounded">
                    {getResCode(id)}
                </span>
            ),
        },
        {
            title: "Thời gian",
            dataIndex: "startTime",
            key: "time",
            width: 160,
            render: (t) => (
                <div className="text-xs">
                    <div className="font-medium text-gray-800">
                        {t ? dayjs(t).format("DD/MM/YYYY") : ""}
                    </div>
                    <div className="text-gray-400">
                        {t ? dayjs(t).format("HH:mm") : ""}
                    </div>
                </div>
            ),
            sorter: (a, b) => a.startTime - b.startTime,
        },
        {
            title: "Khách hàng",
            dataIndex: "customerName",
            key: "customer",
            width: 180,
            render: (name, record) => (
                <div className="text-xs">
                    <div className="font-medium text-gray-800">{name}</div>
                    <div className="text-gray-400">{record.phone}</div>
                </div>
            ),
        },
        {
            title: "Số khách",
            dataIndex: "numberOfGuests",
            key: "guests",
            width: 80,
            align: "center",
            render: (n) => (
                <span className="text-xs font-medium">{n} người</span>
            ),
        },
        {
            title: "Phòng/bàn",
            dataIndex: "tableName",
            key: "table",
            width: 140,
            render: (name) => (
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{name}</span>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 130,
            render: (status) => {
                const s = STATUS_MAP[status] || { label: status, color: "default" };
                return (
                    <Tag color={s.color} className="flex items-center gap-1 w-fit text-xs">
                        {s.icon} {s.label}
                    </Tag>
                );
            },
            filters: Object.entries(STATUS_MAP).map(([key, val]) => ({
                text: val.label,
                value: key,
            })),
            onFilter: (value, record) => record.status === value,
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            key: "note",
            width: 150,
            ellipsis: true,
            render: (note) => (
                <span className="text-xs text-gray-400 italic">{note || "—"}</span>
            ),
        },
        {
            title: "",
            key: "action",
            width: 50,
            align: "center",
            fixed: "right",
            render: (_, record) => {
                const isSeated = record.status === "seated";
                const isCancelled = record.status === "cancelled";

                const items = [];
                if (!isCancelled) {
                    items.push({
                        key: "edit",
                        label: "Cập nhật đặt bàn",
                        icon: <Edit size={14} />,
                        onClick: () => onEditReservation(record),
                    });
                }
                if (!isSeated && !isCancelled) {
                    items.push({
                        key: "seat",
                        label: "Nhận bàn",
                        icon: <CheckCircle size={14} className="text-green-600" />,
                        onClick: () => onStatusChange(record.reservationId, "seated"),
                    });
                }
                if (!isCancelled && !isSeated) {
                    items.push({
                        key: "cancel",
                        label: "Hủy đặt bàn",
                        icon: <XCircle size={14} className="text-red-500" />,
                        onClick: () => onStatusChange(record.reservationId, "cancelled"),
                    });
                }

                if (items.length === 0) return null;

                return (
                    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
                        <Button type="text" size="small" className="w-7 h-7 flex items-center justify-center p-0">
                            <MoreHorizontal size={14} className="text-gray-400" />
                        </Button>
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-gray-50">
            {/* Header thống kê */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-bold text-gray-800">Lịch sử đặt bàn</h2>
                    </div>
                </div>

                {/* Thẻ thống kê */}
                <div className="grid grid-cols-5 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3 border border-blue-100">
                        <div className="text-xs text-blue-600 font-medium mb-1">Tổng đặt bàn</div>
                        <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-3 border border-green-100">
                        <div className="text-xs text-green-600 font-medium mb-1">Đã xếp bàn</div>
                        <div className="text-2xl font-bold text-green-700">{stats.confirmed}</div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-3 border border-indigo-100">
                        <div className="text-xs text-indigo-600 font-medium mb-1">Đã nhận bàn</div>
                        <div className="text-2xl font-bold text-indigo-700">{stats.seated}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-3 border border-purple-100">
                        <div className="text-xs text-purple-600 font-medium mb-1">Hoàn thành</div>
                        <div className="text-2xl font-bold text-purple-700">{stats.completed}</div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-3 border border-gray-200">
                        <div className="text-xs text-gray-500 font-medium mb-1">Đã hủy</div>
                        <div className="text-2xl font-bold text-gray-600">{stats.cancelled}</div>
                    </div>
                </div>
            </div>

            {/* Thanh bộ lọc */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-wrap">
                {/* Tìm kiếm */}
                <div className="relative flex-shrink-0">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên, SĐT, mã đặt bàn..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="border border-gray-200 rounded-lg text-sm py-1.5 pl-8 pr-3 w-[260px] outline-none focus:border-blue-400 transition"
                    />
                </div>

                {/* Lọc theo ngày */}
                <RangePicker
                    value={dateRange}
                    onChange={(val) => setDateRange(val)}
                    format="DD/MM/YYYY"
                    size="middle"
                    placeholder={["Từ ngày", "Đến ngày"]}
                    className="flex-shrink-0"
                    allowClear
                />

                {/* Lọc trạng thái */}
                <Select
                    value={statusFilter}
                    onChange={(val) => setStatusFilter(val)}
                    className="w-[160px] flex-shrink-0"
                    options={[
                        { label: "Tất cả trạng thái", value: "all" },
                        { label: "Đã xếp bàn", value: "confirmed" },
                        { label: "Đã nhận bàn", value: "seated" },
                        { label: "Hoàn thành", value: "completed" },
                        { label: "Đã hủy", value: "cancelled" },
                    ]}
                />

                {/* Lọc khu vực */}
                <Select
                    value={selectedArea}
                    onChange={(val) => setSelectedArea(val)}
                    className="w-[160px] flex-shrink-0"
                    showSearch
                    placeholder="Phòng/Bàn"
                    filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                    options={[
                        { label: "Tất cả khu vực", value: "all" },
                        ...(areas || []).map((a) => ({
                            label: a.areaName,
                            value: a._id,
                        })),
                    ]}
                />

                {/* Nút reset filter */}
                {(searchText || dateRange || statusFilter !== "all" || selectedArea !== "all") && (
                    <button
                        onClick={() => {
                            setSearchText("");
                            setDateRange(null);
                            setStatusFilter("all");
                            setSelectedArea("all");
                        }}
                        className="text-xs text-red-500 hover:text-red-700 cursor-pointer transition underline"
                    >
                        Xóa bộ lọc
                    </button>
                )}
            </div>

            {/* Bảng dữ liệu */}
            <div className="flex-1 overflow-auto px-6 py-4">
                <Table
                    dataSource={filteredData}
                    columns={columns}
                    rowKey="_id"
                    size="small"
                    pagination={{
                        pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "15", "30", "50"],
                        onShowSizeChange: (_, size) => setPageSize(size),
                        showTotal: (total, range) => (
                            <span className="text-xs text-gray-500">
                                Hiển thị {range[0]}-{range[1]} / {total} đặt bàn
                            </span>
                        ),
                    }}
                    scroll={{ x: 900 }}
                    className="history-table"
                    rowClassName={(record) =>
                        record.status === "cancelled"
                            ? "opacity-50"
                            : "hover:bg-blue-50/30"
                    }
                />
            </div>
        </div>
    );
}
