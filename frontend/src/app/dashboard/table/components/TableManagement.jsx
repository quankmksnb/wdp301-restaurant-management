"use client";

import { Table, Tag } from "antd";
import { useState } from "react";

const data = [
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
    status: "Đang hoạt động",
    order: 1,
  },
];

export default function TableManagement() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  const columns = [
    {
      title: "Tên phòng/bàn",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Khu vực",
      dataIndex: "area",
      key: "area",
    },
    {
      title: "Số ghế",
      dataIndex: "seats",
      key: "seats",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Đang hoạt động" ? "green" : "default"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Số thứ tự",
      dataIndex: "order",
      key: "order",
    },
  ];

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data}
      pagination={false}
      scroll={{ x: "max-content" }}
      className="border-t"
      rowClassName="cursor-pointer hover:bg-gray-50"
    />
  );
}
