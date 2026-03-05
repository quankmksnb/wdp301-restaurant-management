"use client";

import { useState } from "react";
import { Button, Space, Typography } from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import AddTableModal from "./modals/AddTableModal";

const { Text } = Typography;

export default function TableHeader({
  selectedRowKeys = [],
  hasSelected = false,
  onDeselectAll = () => {},
}) {
  const [openAddModal, setOpenAddModal] = useState(false);

  return (
    <div className="p-4 mb-10">
      <div className="flex justify-between items-center">
        {/* LEFT */}
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-bold">Phòng/Bàn</h1>

          {hasSelected && (
            <Space>
              <Text strong>{selectedRowKeys.length} mục đã chọn</Text>

              <Button type="link" onClick={onDeselectAll}>
                Bỏ chọn
              </Button>
            </Space>
          )}
        </div>

        {/* RIGHT BUTTON */}
        <Space>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            className="!bg-secondary !border-secondary hover:!bg-secondary/90"
            onClick={() => setOpenAddModal(true)}
          >
            Thêm phòng/bàn
          </Button>

          <Button
            type="primary"
            icon={<UploadOutlined />}
            size="large"
            className="!bg-secondary !border-secondary hover:!bg-secondary/90"
          >
            Import
          </Button>

          <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="large"
            className="!bg-secondary !border-secondary hover:!bg-secondary/90"
          >
            Xuất file
          </Button>
        </Space>
      </div>

      {/* MODAL */}
      <AddTableModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onConfirm={() => setOpenAddModal(false)}
      />
    </div>
  );
}
