"use client";

import { useState, useMemo } from "react";
import { Select, Checkbox, Table, Tag, Input, DatePicker, Radio } from "antd";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import dayjs from "dayjs";

const STATUS_MAP = {
    confirmed: { label: "Đã xếp bàn", color: "green" },
    seated: { label: "Đã nhận bàn", color: "blue" },
    cancelled: { label: "Đã hủy", color: "default" },
    no_show: { label: "Quá giờ", color: "orange" },
};

export default function ReservationListView({
    reservations,
    areas,
    statusFilters,
    onStatusFilterChange,
    onStatusChange,
    onOpenModal,
    selectedDate,
    onSelectDate,
}) {
    const [searchText, setSearchText] = useState("");
    const [selectedArea, setSelectedArea] = useState("all");
    const [dateMode, setDateMode] = useState("all");
    const [customDate, setCustomDate] = useState(null);
    const [pageSize, setPageSize] = useState(15);

    // Sidebar collapse states
    const [searchOpen, setSearchOpen] = useState(true);
    const [dateOpen, setDateOpen] = useState(true);
    const [areaOpen, setAreaOpen] = useState(true);

    // Filter reservations
    const filteredData = useMemo(() => {
        let data = [...reservations];

        // Status filter
        data = data.filter((r) => statusFilters[r.status]);

        // Search
        if (searchText.trim()) {
            const q = searchText.toLowerCase();
            data = data.filter(
                (r) =>
                    r.customerName?.toLowerCase().includes(q) ||
                    r.phone?.includes(q) ||
                    r._id?.toLowerCase().includes(q)
            );
        }

        // Area filter
        if (selectedArea !== "all") {
            data = data.filter((r) => {
                // Match by tableId's area
                return r.areaId === selectedArea;
            });
        }

        // Date filter
        if (dateMode === "custom" && customDate) {
            data = data.filter((r) => {
                const resDate = r.startTime;
                return (
                    resDate.getFullYear() === customDate.year() &&
                    resDate.getMonth() === customDate.month() &&
                    resDate.getDate() === customDate.date()
                );
            });
        }

        return data;
    }, [reservations, statusFilters, searchText, selectedArea, dateMode, customDate]);

    // Generate reservation code from ID
    const getResCode = (id) => {
        if (!id) return "";
        const clean = id.replace(/_.*$/, ""); // remove table suffix
        return `DB${clean.slice(-5).toUpperCase()}`;
    };

    const columns = [
        {
            title: "Mã đặt bàn",
            dataIndex: "_id",
            key: "code",
            width: 130,
            render: (id) => (
                <span className="text-blue-600 font-medium text-xs">
                    {getResCode(id)}
                </span>
            ),
        },
        {
            title: "Giờ đến",
            dataIndex: "startTime",
            key: "time",
            width: 170,
            render: (t) =>
                t
                    ? dayjs(t).format("DD/MM/YYYY HH:mm")
                    : "",
            sorter: (a, b) => a.startTime - b.startTime,
        },
        {
            title: "Khách hàng",
            dataIndex: "customerName",
            key: "customer",
            width: 200,
        },
        {
            title: "Điện thoại",
            dataIndex: "phone",
            key: "phone",
            width: 140,
        },
        {
            title: "Số khách",
            dataIndex: "numberOfGuests",
            key: "guests",
            width: 90,
            align: "center",
        },
        {
            title: "Phòng/bàn",
            dataIndex: "tableName",
            key: "table",
            width: 130,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 130,
            render: (status) => {
                const s = STATUS_MAP[status] || { label: status, color: "default" };
                return <Tag color={s.color}>{s.label}</Tag>;
            },
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            key: "note",
            ellipsis: true,
        },
    ];

    const SidebarSection = ({ title, open, onToggle, children }) => (
        <div className="border-b border-gray-100">
            <button
                onClick={onToggle}
                className="flex items-center justify-between w-full px-4 py-2.5 font-semibold text-sm text-gray-800 hover:bg-gray-50 cursor-pointer"
            >
                {title}
                {open ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
            </button>
            {open && <div className="px-4 pb-3">{children}</div>}
        </div>
    );

    return (
        <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-[250px] min-w-[250px] border-r border-gray-200 bg-white flex flex-col text-sm overflow-y-auto shrink-0">
                {/* Search */}
                <SidebarSection title="Tìm kiếm" open={searchOpen} onToggle={() => setSearchOpen(!searchOpen)}>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Theo mã đặt bàn"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg text-xs py-2 pl-8 pr-3 outline-none focus:border-blue-400 transition"
                        />
                    </div>
                </SidebarSection>

                {/* Date filter */}
                <SidebarSection title="Thời gian đặt" open={dateOpen} onToggle={() => setDateOpen(!dateOpen)}>
                    <div className="space-y-2">
                        <Radio.Group
                            value={dateMode}
                            onChange={(e) => setDateMode(e.target.value)}
                            className="flex flex-col gap-1.5"
                        >
                            <Radio value="all" className="text-xs">
                                <span className="text-xs text-blue-600">Toàn thời gian</span>
                            </Radio>
                            <Radio value="custom" className="text-xs">
                                <span className="text-xs">Lựa chọn khác</span>
                            </Radio>
                        </Radio.Group>
                        {dateMode === "custom" && (
                            <DatePicker
                                value={customDate}
                                onChange={(val) => setCustomDate(val)}
                                format="DD/MM/YYYY"
                                size="small"
                                className="w-full"
                                placeholder="Chọn ngày"
                            />
                        )}
                    </div>
                </SidebarSection>

                {/* Area filter */}
                <SidebarSection title="Phòng/Bàn" open={areaOpen} onToggle={() => setAreaOpen(!areaOpen)}>
                    <Select
                        className="w-full"
                        size="small"
                        showSearch
                        placeholder="Chọn phòng/bàn"
                        value={selectedArea}
                        onChange={(val) => setSelectedArea(val)}
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        options={[
                            { label: "Tất cả", value: "all" },
                            ...(areas || []).map((a) => ({
                                label: a.areaName,
                                value: a._id,
                            })),
                        ]}
                    />
                </SidebarSection>
            </div>

            {/* Table Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Table */}
                <div className="flex-1 overflow-auto p-0">
                    <Table
                        dataSource={filteredData}
                        columns={columns}
                        rowKey="_id"
                        size="small"
                        pagination={{
                            pageSize,
                            showTotal: (total) => (
                                <span className="text-xs text-gray-500">{total}</span>
                            ),
                            size: "small",
                        }}
                        className="reception-list-table"
                        scroll={{ x: 1000 }}
                        rowClassName={(record) =>
                            record.status === "cancelled"
                                ? "opacity-50"
                                : ""
                        }
                    />
                </div>
            </div>
        </div>
    );
}
