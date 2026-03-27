"use client";

import { Modal, Input, Select, InputNumber, Button, message } from "antd";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

import useAreas from "@/hooks/useAreas";
import { updateTable } from "@/services/tableService";

const { TextArea } = Input;

export default function UpdateTableModal({ open, onClose, onConfirm, table }) {
  const { areas } = useAreas();

  const [tableName, setTableName] = useState("");
  const [selectedArea, setSelectedArea] = useState(null);
  const [capacity, setCapacity] = useState(2);
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && table) {
      setTableName(table.tableName || "");
      setSelectedArea(table.area?._id || table.area || null);
      setCapacity(table.capacity || 2);
      setNote(table.note || "");
    }
  }, [open, table]);

  const resetForm = () => {
    setTableName("");
    setSelectedArea(null);
    setCapacity(2);
    setNote("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleUpdateTable = async () => {
    if (!tableName.trim()) {
      message.error("Vui lòng nhập tên bàn");
      return;
    }

    if (!selectedArea) {
      message.error("Vui lòng chọn khu vực");
      return;
    }

    try {
      setLoading(true);

      await updateTable(table._id, {
        tableName,
        capacity,
        area: selectedArea,
        note,
      });

      message.success("Cập nhật bàn thành công");
      onConfirm?.();
      handleClose();
    } catch (error) {
      const errMsg = error.response?.data?.message || "Không thể cập nhật bàn";
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Sửa thông tin phòng / bàn"
      open={open}
      onCancel={handleClose}
      width={520}
      footer={
        <div className="flex justify-end gap-2 pt-1">
          <Button icon={<CloseOutlined />} onClick={handleClose}>
            Hủy
          </Button>

          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            className="!bg-green-600 hover:!bg-green-700"
            onClick={handleUpdateTable}
          >
            Lưu thay đổi
          </Button>
        </div>
      }
    >
      <div className="space-y-5 py-2">
        {/* Tên bàn */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Tên phòng / bàn <span className="text-red-500">*</span>
          </label>
          <Input
            size="large"
            placeholder="Ví dụ: Bàn 01, Phòng VIP..."
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
          />
        </div>

        {/* Khu vực */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Khu vực <span className="text-red-500">*</span>
          </label>
          <Select
            size="large"
            className="w-full"
            placeholder="-- Chọn khu vực --"
            value={selectedArea}
            onChange={(value) => setSelectedArea(value)}
            options={areas
              .filter(
                (area) =>
                  area.areaStatus === "active" || area._id === table?.area?._id,
              )
              .map((area) => ({ value: area._id, label: area.areaName }))}
          />
        </div>

        {/* Số ghế */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Số ghế
          </label>
          <InputNumber
            size="large"
            style={{ width: "100%" }}
            value={capacity}
            min={1}
            addonAfter="ghế"
            onChange={(value) => setCapacity(value)}
          />
        </div>

        {/* Ghi chú */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Ghi chú
          </label>
          <TextArea
            rows={3}
            placeholder="Mô tả vị trí, đặc điểm bàn..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
