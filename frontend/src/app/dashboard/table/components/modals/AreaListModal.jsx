"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Tag } from "antd";
import { useState } from "react";

import useAllTables from "@/hooks/useAllTables";
import useAreas from "@/hooks/useAreas";
import AddAreaModal from "./AddAreaModal";

export default function AreaListModal({ open, onClose }) {
  const { areas, refreshAreas } = useAreas();
  const { tables } = useAllTables();

  const [openAdd, setOpenAdd] = useState(false);

  // group tables by area
  const grouped = areas.map((area) => {
    const areaTables = tables.filter((t) => t.area?._id === area._id);

    return {
      ...area,
      tables: areaTables,
    };
  });

  return (
    <>
      <Modal
        title="Danh mục khu vực"
        open={open}
        onCancel={onClose}
        footer={null}
        width={600}
      >
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {grouped.map((area) => (
            <div key={area._id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold text-lg">{area.areaName}</div>

                <Tag color="blue">{area.tables.length} bàn</Tag>
              </div>

              <div className="flex flex-wrap gap-2">
                {area.tables.length === 0 && (
                  <span className="text-gray-400 text-sm">Chưa có bàn</span>
                )}

                {area.tables.map((table) => (
                  <Tag
                    key={table._id}
                    color={table.tableStatus === "active" ? "green" : "default"}
                  >
                    {table.tableName}
                  </Tag>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenAdd(true)}
          >
            Thêm khu vực
          </Button>
        </div>
      </Modal>

      <AddAreaModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onConfirm={() => {
          refreshAreas();
          setOpenAdd(false);
        }}
      />
    </>
  );
}
