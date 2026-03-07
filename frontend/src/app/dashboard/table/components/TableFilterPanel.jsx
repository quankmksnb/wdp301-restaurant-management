"use client";

import { Input, Collapse, Radio, Select } from "antd";
import useAreas from "@/hooks/useAreas";

export default function TableFilterPanel() {
  const { areas } = useAreas();

  const collapseClass = `
    bg-white rounded-lg shadow-sm
    [&_.ant-collapse-header]:font-medium
    [&_.ant-collapse-item]:border-0
  `;

  const renderCollapse = (title, content) => (
    <Collapse
      defaultActiveKey={["1"]}
      bordered={false}
      expandIconPlacement="end"
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
    <div className="space-y-[10px]">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="font-medium mb-2">Tìm kiếm</div>

        <Input placeholder="Theo tên bàn" size="large" />
      </div>

      {renderCollapse(
        "Khu vực",
        <Select
          className="w-full"
          size="large"
          defaultValue="all"
          options={areaOptions}
        />,
      )}

      {renderCollapse(
        "Trạng thái",
        <Radio.Group className="flex flex-col space-y-3">
          <Radio value="all">Tất cả</Radio>
          <Radio value="active">Đang hoạt động</Radio>
          <Radio value="inactive">Ngừng hoạt động</Radio>
        </Radio.Group>,
      )}
    </div>
  );
}
