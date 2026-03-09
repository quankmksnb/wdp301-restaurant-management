"use client";

import { Button, Space, Modal, message } from "antd";
import { EditOutlined, DeleteOutlined, LockOutlined } from "@ant-design/icons";

import { toggleTableStatus, deleteTable } from "@/services/tableService";
import { useState } from "react";
import UpdateTableModal from "./modals/UpdateTableModal";

export default function TableDetail({ table, onRefresh }) {
  const [openUpdate, setOpenUpdate] = useState(false);

  const handleToggleStatus = () => {
    Modal.confirm({
      title: "Xác nhận thay đổi trạng thái",
      content: "Bạn muốn thay đổi trạng thái bàn?",
      onOk: async () => {
        await toggleTableStatus(table._id);
        message.success("Cập nhật trạng thái thành công");
        onRefresh();
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
    <div className="p-4 bg-white rounded">
      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        <div>
          <b>Tên phòng/bàn:</b> {table.tableName}
        </div>

        <div>
          <b>Số ghế:</b> {table.capacity}
        </div>

        <div>
          <b>Ghi chú:</b> {table.note || "-"}
        </div>

        <div>
          <b>Khu vực:</b> {table.area?.areaName}
        </div>
      </div>

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
            type={table.tableStatus === "inactive" ? "primary" : "default"}
            danger={table.tableStatus === "active"}
            icon={<LockOutlined />}
            onClick={handleToggleStatus}
            className={
              table.tableStatus === "inactive"
                ? "!bg-green-600 hover:!bg-green-700"
                : ""
            }
          >
            {table.tableStatus === "active"
              ? "Ngừng hoạt động"
              : "Hoạt động lại"}
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
