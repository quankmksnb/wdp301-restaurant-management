"use client";

import { Table, Tag, Button, Space, Typography, Dropdown } from "antd";
import { useState } from "react";
import {
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

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

  const hasSelected = selectedRowKeys.length > 0;

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
      <div className="p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-3xl font-bold">Phòng/Bàn</h1>

            {hasSelected && (
              <Space className="animate-fade-in">
                <Text strong>{selectedRowKeys.length} mục đã chọn</Text>

                <Button
                  type="link"
                  icon={<CloseOutlined />}
                  onClick={() => setSelectedRowKeys([])}
                />
              </Space>
            )}
          </div>

          <Space>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              className="!bg-secondary !border-secondary hover:!bg-secondary/90"
            >
              Thêm phòng/bàn
            </Button>

            <Button
              type="primary"
              size="large"
              icon={<UploadOutlined />}
              className="!bg-secondary !border-secondary hover:!bg-secondary/90"
            >
              Import
            </Button>

            <Button
              type="primary"
              size="large"
              icon={<DownloadOutlined />}
              className="!bg-secondary !border-secondary hover:!bg-secondary/90"
            >
              Xuất file
            </Button>

            <Dropdown menu={{ items: [] }} trigger={["click"]}>
              <Button
                size="large"
                icon={<MenuOutlined />}
                className="!bg-secondary !border-secondary hover:!bg-secondary/90 !text-white"
              />
            </Dropdown>
          </Space>
        </div>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
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
