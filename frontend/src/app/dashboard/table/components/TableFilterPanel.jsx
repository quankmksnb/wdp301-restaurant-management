"use client";

import { Input, Collapse, Radio, Select } from "antd";

export default function TableFilterPanel() {
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
          options={[
            { label: "Tất cả", value: "all" },
            { label: "Lầu 1", value: "l1" },
            { label: "Lầu 2", value: "l2" },
            { label: "Lầu 3", value: "l3" },
          ]}
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
