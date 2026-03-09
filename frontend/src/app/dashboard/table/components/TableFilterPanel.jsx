"use client";

import { useState } from "react";
import { Input, Collapse, Radio, Select, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import useAreas from "@/hooks/useAreas";
import AddAreaModal from "./modals/AddAreaModal";

export default function TableFilterPanel() {
  const { areas } = useAreas();
  const [openAreaModal, setOpenAreaModal] = useState(false);

  const collapseClass = `
    bg-white rounded-lg shadow-sm
    [&_.ant-collapse-header]:font-medium
    [&_.ant-collapse-item]:border-0
  `;

  const renderCollapse = (title, content, hideArrow = false) => (
    <Collapse
      defaultActiveKey={["1"]}
      bordered={false}
      expandIconPlacement="end"
      expandIcon={hideArrow ? () => null : undefined}
      className={collapseClass}
      style={{ background: "#fff", marginBottom: 16 }}
      items={[
        {
          key: "1",
          label: title,
          children: content,
        },
      ]}
    />
  );

  const areaOptions = [
    { label: "Tất cả", value: "all" },
    ...areas.map((area) => ({
      label: area.areaName,
      value: area._id,
    })),
  ];

  return (
    <>
      <div className="space-y-[10px]">
        {renderCollapse(
          <div className="flex justify-between items-center w-full">
            <span>Khu vực</span>

            <Button
              type="text"
              icon={<PlusOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                setOpenAreaModal(true);
              }}
            />
          </div>,
          <Select
            className="w-full"
            size="large"
            defaultValue="all"
            options={areaOptions}
          />,
          true,
        )}

        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="font-medium mb-2">Tìm kiếm</div>

          <Input placeholder="Theo tên phòng/bàn" size="large" />
        </div>

        {renderCollapse(
          "Trạng thái",
          <Radio.Group className="flex flex-col space-y-3">
            <Radio value="all">Tất cả</Radio>
            <Radio value="active">Đang hoạt động</Radio>
            <Radio value="inactive">Ngừng hoạt động</Radio>
          </Radio.Group>,
        )}
      </div>

      <AddAreaModal
        open={openAreaModal}
        onClose={() => setOpenAreaModal(false)}
        onConfirm={() => setOpenAreaModal(false)}
      />
    </>
  );
}
