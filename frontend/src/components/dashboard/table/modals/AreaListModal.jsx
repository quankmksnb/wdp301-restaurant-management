"use client";

import { Modal, Tag, Button, message } from "antd";
import { useState } from "react";
import {
  AppstoreOutlined,
  TableOutlined,
  PlusOutlined,
  DownOutlined,
  EditOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";

import useAreas from "@/hooks/useAreas";
import useAllTables from "@/hooks/useAllTables";
import AddAreaModal from "./AddAreaModal";
import UpdateAreaModal from "./UpdateAreaModal";
import AddTableModal from "./AddTableModal";
import { toggleAreaStatus } from "@/services/areaService";

export default function AreaListModal({ open, onClose }) {
  const { areas, refreshAreas } = useAreas();
  const { tables, refreshTables } = useAllTables();

  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdateArea, setOpenUpdateArea] = useState(false);
  const [selectedAreaForUpdate, setSelectedAreaForUpdate] = useState(null);
  const [openAddTable, setOpenAddTable] = useState(false);
  const [selectedAreaForTable, setSelectedAreaForTable] = useState(null);

  const [expanded, setExpanded] = useState({});

  const toggleCollapse = (areaId) => {
    setExpanded((prev) => ({ ...prev, [areaId]: !prev[areaId] }));
  };

  const handleToggleAreaStatus = (e, area) => {
    e.stopPropagation();
    const isActive = area.areaStatus === "active";
    Modal.confirm({
      title: isActive ? "Ngừng hoạt động khu vực?" : "Kích hoạt lại khu vực?",
      content: isActive
        ? "Toàn bộ bàn trong khu vực sẽ bị ngừng hoạt động."
        : "Khu vực sẽ được kích hoạt lại.",
      okButtonProps: { danger: isActive },
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await toggleAreaStatus(area._id);
          message.success("Cập nhật thành công");
          refreshAreas();
          refreshTables();
        } catch (error) {
          console.log(error);
          message.error(
            error.response?.data?.message || "Không thể thay đổi trạng thái",
          );
        }
      },
    });
  };

  const handleOpenUpdateArea = (e, area) => {
    e.stopPropagation();
    setSelectedAreaForUpdate(area);
    setOpenUpdateArea(true);
  };

  const handleOpenAddTable = (e, area) => {
    e.stopPropagation();
    setSelectedAreaForTable(area);
    setOpenAddTable(true);
  };

  // group tables by area
  const grouped = areas.map((area) => ({
    ...area,
    tables: tables.filter((t) => t.area?._id === area._id),
  }));

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
          {grouped.map((area) => {
            const isCollapsed = !expanded[area._id];

            return (
              <div
                key={area._id}
                className="rounded-xl border border-gray-200 hover:border-green-200 hover:shadow-sm transition-all"
              >
                <div
                  role="button"
                  onClick={() => toggleCollapse(area._id)}
                  className="w-full flex justify-between items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-white rounded-t-xl cursor-pointer select-none"
                >
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

                  <div className="flex items-center gap-2">
                    <Button
                      size="small"
                      type="text"
                      icon={<PlusOutlined />}
                      className="!text-green-600 hover:!bg-green-50 !rounded-lg text-xs font-medium flex items-center gap-1"
                      onClick={(e) => handleOpenAddTable(e, area)}
                    >
                      Thêm bàn
                    </Button>

                    <Button
                      size="small"
                      type="text"
                      icon={<PoweroffOutlined />}
                      className={
                        area.areaStatus === "active"
                          ? "!text-orange-500 hover:!bg-orange-50 !rounded-lg"
                          : "!text-green-600 hover:!bg-green-50 !rounded-lg"
                      }
                      onClick={(e) => handleToggleAreaStatus(e, area)}
                      title={
                        area.areaStatus === "active"
                          ? "Ngừng hoạt động"
                          : "Kích hoạt lại"
                      }
                    />

                    <Button
                      size="small"
                      type="text"
                      icon={<EditOutlined />}
                      className="!text-blue-500 hover:!bg-blue-50 !rounded-lg"
                      onClick={(e) => handleOpenUpdateArea(e, area)}
                    />

                    {/* Chevron icon rotates when collapsed */}
                    <DownOutlined
                      className="text-gray-400 text-xs transition-transform duration-200 ml-1"
                      style={{
                        transform: isCollapsed
                          ? "rotate(-90deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  </div>
                </div>

                {!isCollapsed && (
                  <div
                    className="divide-y divide-gray-100 bg-white border-t rounded-b-xl overflow-y-auto"
                    style={{ maxHeight: "180px" }}
                  >
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
                              table.tableStatus === "active"
                                ? "success"
                                : "default"
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
                )}
              </div>
            );
          })}
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

      <UpdateAreaModal
        open={openUpdateArea}
        area={selectedAreaForUpdate}
        onClose={() => {
          setOpenUpdateArea(false);
          setSelectedAreaForUpdate(null);
        }}
        onConfirm={() => {
          refreshAreas();
          setOpenUpdateArea(false);
          setSelectedAreaForUpdate(null);
        }}
      />

      <AddTableModal
        open={openAddTable}
        defaultArea={selectedAreaForTable}
        onClose={() => {
          setOpenAddTable(false);
          setSelectedAreaForTable(null);
        }}
        onConfirm={() => {
          refreshTables?.();
          setOpenAddTable(false);
          setSelectedAreaForTable(null);
        }}
      />
    </>
  );
}
