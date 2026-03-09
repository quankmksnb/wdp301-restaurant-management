"use client";

import { useState } from "react";
import { Modal, Input, Select, InputNumber, Button, message } from "antd";
import { SaveOutlined, StopOutlined, PlusOutlined } from "@ant-design/icons";

import AddAreaModal from "./AddAreaModal";
import useAreas from "@/hooks/useAreas";
import { createTable } from "@/services/tableService";

const { TextArea } = Input;

export default function AddTableModal({ open, onClose, onConfirm }) {
  const { areas, refreshAreas } = useAreas();

  const [openAreaModal, setOpenAreaModal] = useState(false);

  const [tableName, setTableName] = useState("");
  const [selectedArea, setSelectedArea] = useState(null);
  const [order, setOrder] = useState(1);
  const [capacity, setCapacity] = useState(2);
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTableName("");
    setSelectedArea(null);
    setOrder(1);
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
        tableNumber: order,
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
        title="Thêm phòng/bàn"
        open={open}
        onCancel={handleClose}
        width={600}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={loading}
              className="!bg-green-600 hover:!bg-green-700"
              onClick={handleCreateTable}
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
              Tên phòng/bàn <span className="text-red-500">*</span>
            </label>

            <Input
              placeholder="Ví dụ: Bàn 01"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block">
              Khu vực <span className="text-red-500">*</span>
            </label>

            <div className="flex gap-2">
              <Select
                className="w-full"
                placeholder="--Lựa chọn khu vực--"
                value={selectedArea}
                onChange={(value) => setSelectedArea(value)}
                options={areas.map((area) => ({
                  value: area._id,
                  label: area.areaName,
                }))}
              />

              <Button
                icon={<PlusOutlined />}
                onClick={() => setOpenAreaModal(true)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block">Số thứ tự</label>

              <InputNumber
                style={{ width: "100%" }}
                value={order}
                min={1}
                onChange={(value) => setOrder(value)}
              />
            </div>

            <div>
              <label className="mb-2 block">Số ghế</label>

              <InputNumber
                style={{ width: "100%" }}
                value={capacity}
                min={2}
                onChange={(value) => setCapacity(value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block">Ghi chú</label>

            <TextArea
              rows={3}
              placeholder="Nhập ghi chú..."
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
          refreshAreas();
          setSelectedArea(newArea._id);
          setOpenAreaModal(false);
        }}
      />
    </>
  );
}
