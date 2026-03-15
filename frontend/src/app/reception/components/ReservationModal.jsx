"use client";

import { useState } from "react";
import { Modal, Input, Select, DatePicker, InputNumber, Button } from "antd";
import { Search, Plus, Pencil } from "lucide-react";

export default function ReservationModal({
  open,
  onClose,
  prefilledTable,
  prefilledHour,
  tables,
  areas,
}) {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    adultsCount: 1,
    childrenCount: 0,
    duration: 0.5,
    durationUnit: "Giờ",
    deposit: "",
    depositMethod: "Tiền mặt",
    note: "",
  });

  // Generate reservation code
  const reservationCode = `RES${Date.now().toString(36).toUpperCase().slice(-6)}`;

  // Build table options grouped by area
  const tableOptions = (areas || []).flatMap((area) => {
    const areaTables = (tables || []).filter(
      (t) => (t.area?._id || t.area) === area._id
    );
    return areaTables.map((t) => ({
      label: `${t.tableName} (${area.areaName})`,
      value: t._id,
    }));
  });

  const defaultTableValue = prefilledTable ? [prefilledTable._id] : [];

  // Default arrival time
  const defaultArrival = (() => {
    const now = new Date();
    if (prefilledHour !== undefined && prefilledHour !== null) {
      now.setHours(prefilledHour, 0, 0, 0);
    }
    return now;
  })();

  const handleSave = () => {
    // TODO: Connect to backend
    console.log("Save reservation:", formData);
    onClose();
  };

  const handleSaveAndPrint = () => {
    // TODO: Connect to backend + print
    console.log("Save & Print reservation:", formData);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={760}
      title={
        <span className="text-base font-bold">Thêm mới đặt bàn</span>
      }
      destroyOnHidden
      centered
    >
      <div className="pt-2">
        {/* Row 1: Customer + Reservation Code */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-6">
            <label className="text-xs text-gray-600 mb-1 block">
              Tên khách hàng <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <Input
                prefix={<Search className="w-3.5 h-3.5 text-gray-400" />}
                placeholder="Tìm khách hàng (F4)"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                className="flex-1"
              />
              <Button
                icon={<Plus className="w-4 h-4" />}
                className="flex items-center justify-center"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label className="text-xs text-gray-600 mb-1 block">
              Mã đặt bàn
            </label>
            <Input
              disabled
              className="bg-gray-50"
              placeholder="Mã tự động"
            />
          </div>
        </div>

        {/* Row 2: Phone + Guest Count */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-6">
            <label className="text-xs text-gray-600 mb-1 block">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Nhập số điện thoại khách hàng"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          <div className="col-span-6">
            <label className="text-xs text-gray-600 mb-1 block">
              Số lượng khách
            </label>
            <div className="flex gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">🧑 Người lớn</span>
                <InputNumber
                  min={1}
                  max={50}
                  value={formData.adultsCount}
                  onChange={(val) =>
                    setFormData({ ...formData, adultsCount: val })
                  }
                  className="w-16"
                  size="small"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">👶 Trẻ em</span>
                <InputNumber
                  min={0}
                  max={20}
                  value={formData.childrenCount}
                  onChange={(val) =>
                    setFormData({ ...formData, childrenCount: val })
                  }
                  className="w-16"
                  size="small"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Arrival Time + Duration */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-6">
            <label className="text-xs text-gray-600 mb-1 block">
              Giờ đến
            </label>
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="DD/MM/YYYY HH:mm"
              placeholder="Chọn ngày giờ đến"
              className="w-full"
            />
          </div>
          <div className="col-span-6">
            <label className="text-xs text-gray-600 mb-1 block">
              Thời lượng
            </label>
            <div className="flex gap-2 items-center">
              <Select
                value={formData.durationUnit}
                onChange={(val) =>
                  setFormData({ ...formData, durationUnit: val })
                }
                options={[
                  { label: "Giờ", value: "Giờ" },
                  { label: "Phút", value: "Phút" },
                ]}
                className="w-24"
              />
              <InputNumber
                min={0.5}
                max={24}
                step={0.5}
                value={formData.duration}
                onChange={(val) =>
                  setFormData({ ...formData, duration: val })
                }
                className="w-20"
              />
            </div>
          </div>
        </div>

        {/* Row 4: Deposit + Room/Table */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-6">
            <label className="text-xs text-gray-600 mb-1 block">
              Tiền đặt cọc
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Nhập số tiền"
                value={formData.deposit}
                onChange={(e) =>
                  setFormData({ ...formData, deposit: e.target.value })
                }
                className="flex-1"
              />
              <Select
                value={formData.depositMethod}
                onChange={(val) =>
                  setFormData({ ...formData, depositMethod: val })
                }
                options={[
                  { label: "Tiền mặt", value: "Tiền mặt" },
                  { label: "Chuyển khoản", value: "Chuyển khoản" },
                  { label: "Thẻ", value: "Thẻ" },
                ]}
                className="w-32"
              />
            </div>
          </div>
          <div className="col-span-6">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-600 mb-1 block">
                Phòng/Bàn
              </label>
              <button className="text-xs text-blue-600 hover:underline cursor-pointer mb-1">
                Xem bàn trống
              </button>
            </div>
            <Select
              mode="multiple"
              placeholder="Chọn phòng/bàn"
              options={tableOptions}
              defaultValue={defaultTableValue}
              className="w-full"
            />
          </div>
        </div>

        {/* Row 5: Pre-order */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-6">
            <label className="text-xs text-gray-600 mb-1 block">
              Món đặt trước
            </label>
            <button className="text-sm text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              Thêm món
            </button>
          </div>
          <div className="col-span-6">
            <label className="text-xs text-gray-600 mb-1 block flex items-center gap-1">
              <Pencil className="w-3 h-3" />
              Ghi chú
            </label>
            <Input.TextArea
              rows={2}
              placeholder="Nhập ghi chú..."
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-3 pt-4 border-t border-gray-100">
          <Button
            type="primary"
            ghost
            onClick={handleSaveAndPrint}
            className="flex items-center gap-1 px-6"
          >
            📋 Lưu & in
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            className="flex items-center gap-1 px-6"
          >
            💾 Lưu
          </Button>
          <Button onClick={onClose} className="flex items-center gap-1 px-6">
            ↩ Bỏ qua
          </Button>
        </div>
      </div>
    </Modal>
  );
}
