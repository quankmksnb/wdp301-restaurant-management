"use client";

import { Modal, Input, Select, InputNumber, Button, message } from "antd";
import { SaveOutlined, StopOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

import useAreas from "@/hooks/useAreas";
import { updateTable } from "@/services/tableService";

const { TextArea } = Input;

export default function UpdateTableModal({ open, onClose, onConfirm, table }) {
  const { areas } = useAreas();

  const [tableName, setTableName] = useState("");
  const [selectedArea, setSelectedArea] = useState(null);
  const [order, setOrder] = useState(1);
  const [capacity, setCapacity] = useState(2);
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);

  /**
   * load data khi mở modal
   */
  useEffect(() => {
    if (open && table) {
      setTableName(table.tableName || "");
      setSelectedArea(table.area?._id || table.area || null);
      setOrder(table.tableNumber || 1);
      setCapacity(table.capacity || 2);
      setNote(table.note || "");
    }
  }, [open, table]);

  /**
   * reset form
   */
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
        tableNumber: order,
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
      title="Sửa thông tin phòng/bàn"
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
            onClick={handleUpdateTable}
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
        {/* tên bàn */}
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

        {/* khu vực */}
        <div>
          <label className="mb-2 block">
            Khu vực <span className="text-red-500">*</span>
          </label>

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
        </div>

        {/* số thứ tự + số ghế */}
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
              min={1}
              onChange={(value) => setCapacity(value)}
            />
          </div>
        </div>

        {/* ghi chú */}
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
  );
}
