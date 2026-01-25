'use client';

import { Table, Checkbox, Space, Image, Tag } from 'antd';
import { useState } from 'react';
import ProductDetail from './ProductDetail';
import ProductHeader from './ProductHeader';
import { StarOutlined } from '@ant-design/icons';

const data = [
  {
    key: '1',
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400',
    thumbnail: 'https://via.placeholder.com/40',
    code: 'SP000001',
    name: 'Thăng long mềm (điếu)',
    category: 'Đồ uống',
    group: 'Nicotin',
    type: 'Hàng hóa thường',
    price: 8000,
    cost: 5000,
    stock: 0,
    minStock: 0,
    maxStock: 999999999,
    location: '',
    orderNote: '',
    description: '',
    status: 'Đang kinh doanh',
    directSale: true,
    noPoint: true,
    noExtra: true,
  },
  // Thêm data khác nếu cần
];

export default function ProductTable() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({
    image: true,
    code: true,
    name: true,
    category: true,
    group: true,
    type: true,
    price: true,
    cost: true,
    stock: true,
    location: false,
    order: false,
    latestStock: false,
    maxStock: false,
    status: false,
  });

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const handleColumnVisibilityChange = (columnKey, visible) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: visible,
    }));
  };

  const handleRowClick = (record) => {
    const key = record.key;
    if (expandedRowKeys.includes(key)) {
      setExpandedRowKeys([]);
    } else {
      setExpandedRowKeys([key]);
    }
  };

  const allColumns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (src) => <Image src={src} width={50} height={50} className="rounded object-cover" />,
      hidden: !visibleColumns.image,
    },
    {
      title: 'Mã hàng hóa',
      dataIndex: 'code',
      key: 'code',
      render: (text) => (
        <Space>
          <StarOutlined className="text-gray-400" />
          {text}
        </Space>
      ),
      hidden: !visibleColumns.code,
    },
    {
      title: 'Tên hàng',
      dataIndex: 'name',
      key: 'name',
      hidden: !visibleColumns.name,
    },
    {
      title: 'Loại thực đơn',
      dataIndex: 'category',
      key: 'category',
      hidden: !visibleColumns.category,
    },
    {
      title: 'Nhóm hàng',
      dataIndex: 'group',
      key: 'group',
      hidden: !visibleColumns.group,
    },
    {
      title: 'Loại hàng',
      dataIndex: 'type',
      key: 'type',
      hidden: !visibleColumns.type,
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      render: (v) => v.toLocaleString('vi-VN'),
      hidden: !visibleColumns.price,
    },
    {
      title: 'Giá vốn',
      dataIndex: 'cost',
      key: 'cost',
      render: (v) => v.toLocaleString('vi-VN'),
      hidden: !visibleColumns.cost,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      render: (value) => (
        <Tag color={value === 0 ? 'red' : 'green'}>{value}</Tag>
      ),
      hidden: !visibleColumns.stock,
    },
  ].filter(col => !col.hidden);

  return (
    <>
      <ProductHeader
        selectedRowKeys={selectedRowKeys}
        hasSelected={hasSelected}
        visibleColumns={visibleColumns}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        onDeselectAll={() => setSelectedRowKeys([])}
      />

      <Table
        rowSelection={rowSelection}
        columns={allColumns}
        dataSource={data}
        expandable={{
          expandedRowRender: (record) => <ProductDetail product={record} />,
          expandedRowKeys,
          onExpandedRowsChange: (keys) => setExpandedRowKeys(keys),
          expandRowByClick: true, // Quan trọng: click row để mở
          expandIcon: () => null, // Bỏ hoàn toàn dấu +
        }}
        pagination={false}
        scroll={{ x: 'max-content' }}
        className="border-t"
        rowClassName="cursor-pointer hover:bg-gray-50"
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
    </>
  );
}