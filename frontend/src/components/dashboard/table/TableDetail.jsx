"use client";

import { Button, Space, Modal, message, Tabs, Tag } from "antd";
import { EditOutlined, DeleteOutlined, LockOutlined } from "@ant-design/icons";
import { toggleTableStatus, deleteTable } from "@/services/tableService";
import { useState } from "react";
import UpdateTableModal from "./modals/UpdateTableModal";

const tabItems = [{ key: "info", label: "Chi tiết phòng/bàn" }];

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="font-semibold">{value ?? "—"}</span>
    </div>
  );
}

export default function TableDetail({ table, onRefresh }) {
  const [openUpdate, setOpenUpdate] = useState(false);

  const isActive = table.tableStatus === "active";

  const handleToggleStatus = () => {
    Modal.confirm({
      title: "Xác nhận thay đổi trạng thái",
      content: "Bạn muốn thay đổi trạng thái bàn?",
      onOk: async () => {
        try {
          await toggleTableStatus(table._id);
          message.success("Cập nhật trạng thái thành công");
          onRefresh();
        } catch (error) {
          const errorMsg =
            error?.response?.data?.message || "Không thể cập nhật trạng thái";
          message.error(errorMsg);
        }
      },
    });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Xác nhận xóa bàn",
      content: "Bạn có chắc muốn xóa bàn này?",
      okButtonProps: { danger: true },
      onOk: async () => {
        await deleteTable(table._id);
        message.success("Xóa bàn thành công");
        onRefresh();
      },
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <Tabs defaultActiveKey="info" items={tabItems} />

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-green-700 mb-2">
          {table.tableName}
        </h2>
        <Tag color={isActive ? "success" : "default"}>
          {isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
        </Tag>
      </div>

      {/* THÔNG TIN */}
      <div className="grid grid-cols-3 gap-x-8 gap-y-4 text-sm mb-6">
        <InfoRow label="Khu vực" value={table.area?.areaName} />
        <InfoRow label="Số ghế" value={`${table.capacity} ghế`} />
        <InfoRow label="Ghi chú" value={table.note || "—"} />
      </div>

      {/* ACTIONS — giữ nguyên như cũ */}
      <div className="flex justify-end">
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setOpenUpdate(true)}
          >
            Cập nhật
          </Button>

          <Button
            type={!isActive ? "primary" : "default"}
            danger={isActive}
            icon={<LockOutlined />}
            onClick={handleToggleStatus}
            className={!isActive ? "!bg-green-600 hover:!bg-green-700" : ""}
          >
            {isActive ? "Ngừng hoạt động" : "Hoạt động lại"}
          </Button>

          <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
            Xóa
          </Button>
        </Space>
      </div>

      <UpdateTableModal
        open={openUpdate}
        table={table}
        onClose={() => setOpenUpdate(false)}
        onConfirm={() => {
          setOpenUpdate(false);
          onRefresh();
        }}
      />
    </div>
  );
}
