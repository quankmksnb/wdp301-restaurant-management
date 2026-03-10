"use client";

import { Table, Tag } from "antd";
import { useState } from "react";

import TableHeader from "./TableHeader";
import TableDetail from "./TableDetail";

import useTables from "@/hooks/useTables";

export default function TableManagement() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [page, setPage] = useState(1);

  const { tables, total, loading, refreshTables } = useTables(page);

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  const columns = [
    {
      title: "Tên phòng/bàn",
      dataIndex: "tableName",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      render: (note) => note || "-",
    },
    {
      title: "Khu vực",
      dataIndex: ["area", "areaName"],
    },
    {
      title: "Số ghế",
      dataIndex: "capacity",
    },
    {
      title: "Trạng thái",
      dataIndex: "tableStatus",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "default"}>
          {status === "active" ? "Đang hoạt động" : "Ngừng hoạt động"}
        </Tag>
      ),
    },
  ];

  const handleRowClick = (record) => {
    const key = record._id;

    setExpandedRowKeys((prev) => (prev.includes(key) ? [] : [key]));
  };

  return (
    <div>
      <TableHeader refreshTables={refreshTables} />

      <Table
        rowKey="_id"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={tables}
        loading={loading}
        scroll={{ x: "max-content" }}
        className="border-t"
        pagination={{
          current: page,
          total: total,
          pageSize: 10,
          onChange: (p) => setPage(p),
        }}
        expandable={{
          expandedRowRender: (record) => (
            <TableDetail table={record} onRefresh={refreshTables} />
          ),
          expandedRowKeys,
          expandIcon: () => null,
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
    </div>
  );
}
