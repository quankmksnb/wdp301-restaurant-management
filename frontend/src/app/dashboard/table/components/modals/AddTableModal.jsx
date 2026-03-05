"use client";

import { Modal, Input, Select, InputNumber, Button } from "antd";
import { SaveOutlined, StopOutlined, PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function AddTableModal({ open, onClose, onConfirm }) {
  return (
    <Modal
      title="Thêm phòng/bàn"
      open={open}
      onCancel={onClose}
      width={600}
      footer={
        <div className="flex justify-end gap-2">
          <Button icon={<StopOutlined />} onClick={onClose}>
            Bỏ qua
          </Button>

          <Button
            type="primary"
            icon={<SaveOutlined />}
            className="!bg-green-600 hover:!bg-green-700"
            onClick={onConfirm}
          >
            Lưu
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* TÊN BÀN */}
        <div>
          <label className="mb-2 block">
            Tên phòng bàn <span className="text-red-500">*</span>
          </label>
          <Input placeholder="Ví dụ: Bàn 01" />
        </div>

        {/* KHU VỰC */}
        <div>
          <label className="mb-2 block">Khu vực</label>

          <div className="flex gap-2">
            <Select
              className="w-full"
              placeholder="--Lựa chọn--"
              options={[
                { value: "l1", label: "Lầu 1" },
                { value: "l2", label: "Lầu 2" },
              ]}
            />
            <Button icon={<PlusOutlined />} />
          </div>
        </div>

        {/* SỐ THỨ TỰ + SỐ GHẾ */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block">Số thứ tự</label>
            <InputNumber style={{ width: "100%" }} defaultValue={1} />
          </div>

          <div>
            <label className="mb-2 block">Số ghế</label>
            <InputNumber style={{ width: "100%" }} placeholder="Ví dụ: 4" />
          </div>
        </div>

        {/* GHI CHÚ */}
        <div>
          <label className="mb-2 block">Ghi chú</label>
          <TextArea rows={3} placeholder="Nhập ghi chú..." />
        </div>
      </div>
    </Modal>
  );
}
