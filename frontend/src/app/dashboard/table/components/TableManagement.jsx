"use client";

import { Table, Tag } from "antd";
import { useState } from "react";
import TableHeader from "./TableHeader";

const initialData = [
  {
    key: "1",
    name: "Bàn 20",
    note: "",
    area: "Lầu 3",
    seats: 4,
    status: "Đang hoạt động",
    order: 0,
  },
  {
    key: "2",
    name: "Bàn 19",
    note: "",
    area: "Lầu 3",
    seats: 6,
    status: "Ngừng hoạt động",
    order: 1,
  },
];

export default function TableManagement() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableData, setTableData] = useState(initialData);

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  const columns = [
    {
      title: "Tên phòng/bàn",
      dataIndex: "name",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
    },
    {
      title: "Khu vực",
      dataIndex: "area",
    },
    {
      title: "Số ghế",
      dataIndex: "seats",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Đang hoạt động" ? "green" : "default"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Số thứ tự",
      dataIndex: "order",
    },
  ];

  return (
    <div>
      {/* HEADER */}
      <TableHeader
        selectedRowKeys={selectedRowKeys}
        hasSelected={selectedRowKeys.length > 0}
        onDeselectAll={() => setSelectedRowKeys([])}
      />

      {/* TABLE */}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={tableData}
        pagination={{
          pageSize: 10,
        }}
        scroll={{ x: "max-content" }}
        className="border-t"
        rowClassName="cursor-pointer hover:bg-gray-50"
      />
    </div>
  );
}
