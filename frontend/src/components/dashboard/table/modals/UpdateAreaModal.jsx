"use client";

import { Modal, Input, Button, message, Tag } from "antd";
import {
  SaveOutlined,
  StopOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { updateArea, toggleAreaStatus } from "@/services/areaService";

const { TextArea } = Input;

export default function UpdateAreaModal({ open, onClose, onConfirm, area }) {
  const [areaName, setAreaName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState(false);

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
      await updateArea(area._id, { areaName, description });
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

  const handleToggleStatus = () => {
    const isActive = area?.areaStatus === "active";

    Modal.confirm({
      title: isActive ? "Ngừng hoạt động khu vực?" : "Kích hoạt lại khu vực?",
      content: isActive
        ? "Toàn bộ bàn trong khu vực này sẽ bị ngừng hoạt động."
        : "Khu vực sẽ được kích hoạt lại. Các bàn cần mở lại thủ công.",
      okButtonProps: { danger: isActive },
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setToggling(true);
          await toggleAreaStatus(area._id);
          message.success(
            isActive
              ? "Đã ngừng hoạt động khu vực"
              : "Đã kích hoạt lại khu vực",
          );
          onConfirm?.();
          handleClose();
        } catch (error) {
          const errMsg =
            error.response?.data?.message || "Không thể thay đổi trạng thái";
          message.error(errMsg);
        } finally {
          setToggling(false);
        }
      },
    });
  };

  return (
    <Modal
      title="Cập nhật khu vực"
      open={open}
      onCancel={handleClose}
      width={500}
      footer={
        <div className="flex justify-between items-center">
          {/* Nút toggle bên trái */}
          <Button
            icon={<PoweroffOutlined />}
            loading={toggling}
            danger={area?.areaStatus === "active"}
            className={
              area?.areaStatus !== "active"
                ? "!bg-green-600 hover:!bg-green-700 !text-white !border-green-600"
                : ""
            }
            onClick={handleToggleStatus}
          >
            {area?.areaStatus === "active"
              ? "Ngừng hoạt động"
              : "Kích hoạt lại"}
          </Button>

          {/* Nút lưu / bỏ qua bên phải */}
          <div className="flex gap-2">
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
        </div>
      }
    >
      <div className="space-y-4">
        {/* Badge trạng thái */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Trạng thái:</span>
          <Tag color={area?.areaStatus === "active" ? "success" : "default"}>
            {area?.areaStatus === "active"
              ? "Đang hoạt động"
              : "Ngừng hoạt động"}
          </Tag>
        </div>

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
