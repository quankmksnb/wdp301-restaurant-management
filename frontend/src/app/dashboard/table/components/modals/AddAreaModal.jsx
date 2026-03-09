"use client";

import { Modal, Input, Button, message } from "antd";
import { SaveOutlined, StopOutlined } from "@ant-design/icons";
import { useState } from "react";
import { createArea } from "@/services/areaService";

const { TextArea } = Input;

export default function AddAreaModal({ open, onClose, onConfirm }) {
  const [areaName, setAreaName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateArea = async () => {
    if (!areaName.trim()) {
      message.error("Vui lòng nhập tên khu vực");
      return;
    }

    try {
      setLoading(true);

      const res = await createArea({
        areaName,
        description,
      });

      const newArea = res.data; // area vừa tạo

      message.success("Thêm khu vực thành công");

      onConfirm?.(newArea); // truyền ngược lên
      onClose();

      setAreaName("");
      setDescription("");
    } catch (error) {
      const errMsg = error.response?.data?.message || "Không thể tạo khu vực";
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm khu vực"
      open={open}
      onCancel={onClose}
      width={500}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="primary"
            icon={<SaveOutlined />}
            className="!bg-green-600 hover:!bg-green-700"
            loading={loading}
            onClick={handleCreateArea}
          >
            Lưu
          </Button>

          <Button icon={<StopOutlined />} onClick={onClose}>
            Bỏ qua
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-2 block">
            Tên khu vực <span className="text-red-500">*</span>
          </label>

          <Input
            placeholder="Ví dụ: Lầu 1"
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block">Ghi chú</label>

          <TextArea
            rows={3}
            placeholder="Nhập ghi chú..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
