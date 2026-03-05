"use client";

import { Modal, Input, Button } from "antd";
import { SaveOutlined, StopOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function AddAreaModal({ open, onClose, onConfirm }) {
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
            onClick={onConfirm}
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
          <Input placeholder="Ví dụ: Lầu 1" />
        </div>

        <div>
          <label className="mb-2 block">Ghi chú</label>
          <TextArea rows={3} placeholder="Nhập ghi chú..." />
        </div>
      </div>
    </Modal>
  );
}
