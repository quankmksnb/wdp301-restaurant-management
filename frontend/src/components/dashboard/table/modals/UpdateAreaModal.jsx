"use client";

import { Modal, Input, Button, message } from "antd";
import { SaveOutlined, StopOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { updateArea } from "@/services/areaService";

const { TextArea } = Input;

export default function UpdateAreaModal({ open, onClose, onConfirm, area }) {
  const [areaName, setAreaName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && area) {
      setAreaName(area.areaName || "");
      setDescription(area.description || "");
    }
  }, [open, area]);

  const resetForm = () => {
    setAreaName("");
    setDescription("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleUpdateArea = async () => {
    if (!areaName.trim()) {
      message.error("Vui lòng nhập tên khu vực");
      return;
    }

    try {
      setLoading(true);

      await updateArea(area._id, {
        areaName,
        description,
      });

      message.success("Cập nhật khu vực thành công");

      onConfirm?.();

      handleClose();
    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Không thể cập nhật khu vực";
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Cập nhật khu vực"
      open={open}
      onCancel={handleClose}
      width={500}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="primary"
            icon={<SaveOutlined />}
            className="!bg-green-600 hover:!bg-green-700"
            loading={loading}
            onClick={handleUpdateArea}
          >
            Lưu
          </Button>

          <Button icon={<StopOutlined />} onClick={handleClose}>
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
