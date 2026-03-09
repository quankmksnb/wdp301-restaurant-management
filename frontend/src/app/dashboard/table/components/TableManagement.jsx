"use client";

import { useEffect, useState } from "react";
import { Table, Tag } from "antd";

import TableHeader from "./TableHeader";
import TableFilterPanel from "./TableFilterPanel";
import TableDetail from "./TableDetail";

import { getTables } from "@/services/tableService";

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchTables = async (page = 1, limit = 10) => {
    try {
      setLoading(true);

      const res = await getTables({
        page,
        limit,
      });

      const list = res.data || [];

      const mapped = list.map((t) => ({
        key: t._id,
        ...t,
      }));

      setTables(mapped);

      setPagination({
        current: page,
        pageSize: limit,
        total: res.total || list.length,
      });
    } catch (error) {
      console.error("Fetch tables error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const columns = [
    {
      title: "Tên phòng/bàn",
      dataIndex: "tableName",
      key: "tableName",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (value) => value || "-",
    },
    {
      title: "Khu vực",
      dataIndex: ["area", "areaName"],
      key: "area",
    },
    {
      title: "Số ghế",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Trạng thái",
      dataIndex: "tableStatus",
      key: "tableStatus",
      render: (status) =>
        status === "active" ? (
          <Tag color="green">Đang hoạt động</Tag>
        ) : (
          <Tag color="default">Ngừng hoạt động</Tag>
        ),
    },
    {
      title: "Số thứ tự",
      dataIndex: "tableNumber",
      key: "tableNumber",
    },
  ];

  const handleRowClick = (record) => {
    const key = record.key;

    setExpandedRowKeys((prev) => (prev.includes(key) ? [] : [key]));
  };

  const handleTableChange = (paginationInfo) => {
    fetchTables(paginationInfo.current, paginationInfo.pageSize);
  };

  return (
    <div className="space-y-4">
      <TableHeader onRefresh={fetchTables} />

      <Table
        columns={columns}
        dataSource={tables}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowClassName="cursor-pointer hover:bg-gray-50"
        expandable={{
          expandedRowRender: (record) => (
            <TableDetail
              table={record}
              onRefresh={() =>
                fetchTables(pagination.current, pagination.pageSize)
              }
            />
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
