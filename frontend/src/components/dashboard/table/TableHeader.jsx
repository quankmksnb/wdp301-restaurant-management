"use client";

import { useState } from "react";
import { Button, Space, Typography } from "antd";
import { PlusOutlined, AppstoreOutlined } from "@ant-design/icons";

import AddTableModal from "./modals/AddTableModal";
import AreaListModal from "./modals/AreaListModal";

const { Text } = Typography;

export default function TableHeader({
  selectedRowKeys = [],
  hasSelected = false,
  onDeselectAll = () => {},
  refreshTables,
  areas = [],
  onAreasChange,
}) {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openAreaModal, setOpenAreaModal] = useState(false);

  return (
    <div className="p-4 mb-10">
      <div className="flex justify-between items-center">
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

        <Space>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            className="!bg-secondary !border-secondary"
            onClick={() => setOpenAddModal(true)}
          >
            Thêm phòng/bàn
          </Button>

          <Button
            type="primary"
            size="large"
            icon={<AppstoreOutlined />}
            className="!bg-green-600 hover:!bg-green-700"
            onClick={() => setOpenAreaModal(true)}
          >
            Danh mục khu vực
          </Button>
        </Space>
      </div>

      <AddTableModal
        open={openAddModal}
        areas={areas}
        onClose={() => setOpenAddModal(false)}
        onConfirm={() => {
          refreshTables?.();
          onAreasChange?.();
          setOpenAddModal(false);
        }}
      />

      <AreaListModal
        open={openAreaModal}
        areas={areas}
        onAreasChange={onAreasChange}
        onClose={() => setOpenAreaModal(false)}
      />
    </div>
  );
}
