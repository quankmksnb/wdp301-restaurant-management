"use client";

import { useState, useEffect } from "react";
import { Modal, Input, Select, InputNumber, Button, message } from "antd";
import { SaveOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";

import AddAreaModal from "./AddAreaModal";
import { createTable } from "@/services/tableService";

const { TextArea } = Input;

export default function AddTableModal({
  open,
  onClose,
  onConfirm,
  defaultArea,
  areas = [],
}) {
  const [openAreaModal, setOpenAreaModal] = useState(false);
  // local copy để có thể thêm area mới vào dropdown ngay lập tức
  const [localAreas, setLocalAreas] = useState([]);

  const [tableName, setTableName] = useState("");
  const [selectedArea, setSelectedArea] = useState(null);
  const [capacity, setCapacity] = useState(2);
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);

  // Đồng bộ localAreas khi prop areas thay đổi
  useEffect(() => {
    setLocalAreas(areas);
  }, [areas]);

  useEffect(() => {
    if (open && defaultArea) {
      setSelectedArea(defaultArea._id);
    }
  }, [open, defaultArea]);

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

  const handleCreateTable = async () => {
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

      await createTable({
        tableName,
        capacity,
        area: selectedArea,
        note,
      });

      message.success("Tạo bàn thành công");
      onConfirm?.();
      handleClose();
    } catch (error) {
      const errMsg = error.response?.data?.message || "Không thể tạo bàn";
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="Thêm phòng / bàn"
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
              onClick={handleCreateTable}
            >
              Lưu bàn
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
            <div className="flex gap-2">
              <Select
                size="large"
                className="flex-1"
                placeholder="-- Chọn khu vực --"
                value={selectedArea}
                onChange={(value) => setSelectedArea(value)}
                options={localAreas
                  .filter((area) => area.areaStatus === "active")
                  .map((area) => ({ value: area._id, label: area.areaName }))}
              />
              <Button
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setOpenAreaModal(true)}
                title="Thêm khu vực mới"
              />
            </div>
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

      <AddAreaModal
        open={openAreaModal}
        onClose={() => setOpenAreaModal(false)}
        onConfirm={(newArea) => {
          // Thêm area mới vào local list ngay lập tức để dropdown hiển thị liền
          if (newArea) {
            setLocalAreas((prev) => [...prev, newArea]);
            setSelectedArea(newArea._id);
          }
          // Báo lên page để refresh toàn bộ
          onConfirm?.();
          setOpenAreaModal(false);
        }}
      />
    </>
  );
}
