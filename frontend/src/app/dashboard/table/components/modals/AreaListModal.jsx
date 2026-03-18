"use client";

import { Modal, Tag, Button } from "antd";
import { useState } from "react";
import {
  AppstoreOutlined,
  TableOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import useAreas from "@/hooks/useAreas";
import useAllTables from "@/hooks/useAllTables";
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
        title={
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
              <AppstoreOutlined className="text-green-600 text-base" />
            </div>
            <div>
              <div className="font-semibold text-gray-800">
                Danh mục khu vực
              </div>
              <div className="text-xs text-gray-400">
                {areas.length} khu vực
              </div>
            </div>
          </div>
        }
        open={open}
        onCancel={onClose}
        width={600}
        footer={
          <div className="flex justify-end">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="!bg-green-600 hover:!bg-green-700 !rounded-lg"
              onClick={() => setOpenAdd(true)}
            >
              Thêm khu vực
            </Button>
          </div>
        }
        styles={{
          body: {
            maxHeight: "55vh",
            overflowY: "auto",
            padding: "16px 24px",
          },
        }}
      >
        <div className="space-y-3">
          {grouped.map((area) => (
            <div
              key={area._id}
              className="rounded-xl border border-gray-200 hover:border-green-200 hover:shadow-sm transition-all"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-white group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <AppstoreOutlined className="text-green-600 text-sm" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">
                      {area.areaName}
                    </span>

                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {area.tables.length} bàn
                    </span>
                  </div>
                </div>
              </div>

              {/* TABLE LIST */}
              <div className="divide-y divide-gray-100 bg-white border-t">
                {area.tables.length === 0 ? (
                  <div className="px-5 py-3 text-sm text-gray-400">
                    Chưa có bàn
                  </div>
                ) : (
                  area.tables.map((table) => (
                    <div
                      key={table._id}
                      className="flex justify-between items-center px-5 py-2.5 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
                          <TableOutlined className="text-blue-400 text-xs" />
                        </div>

                        <span className="text-gray-700 text-sm">
                          {table.tableName}
                        </span>
                      </div>

                      <Tag
                        color={
                          table.tableStatus === "active" ? "success" : "default"
                        }
                        className="text-xs !rounded-full"
                      >
                        {table.tableStatus === "active"
                          ? "Hoạt động"
                          : "Tạm dừng"}
                      </Tag>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
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
