'use client';

import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { Button, Image, Space, Tabs, Tag } from 'antd';

const items = [
  {
    key: "info",
    label: "Thông tin",
  },
  {
    key: "stockCard",
    label: "Thẻ kho",
  },
  {
    key: "inventory",
    label: "Tồn kho",
  },
];


export default function ProductDetail({ product }) {
  return (
    <div className="p-6 bg-white">
      {/* Tabs */}
      <Tabs defaultActiveKey="info" items={items} />

      {/* Tên sản phẩm + Tags trạng thái */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-700 mb-3">
          {product.name}
        </h2>
        <Space size="middle">
          {product.directSale && (
            <Tag icon={<CheckCircleFilled />} color="success">
              Bán trực tiếp
            </Tag>
          )}
          {product.noPoint && (
            <Tag icon={<CloseCircleFilled />} color="error">
              Không tích điểm
            </Tag>
          )}
          {product.noExtra && (
            <Tag icon={<CloseCircleFilled />} color="error">
              Không là món thêm (Extra topping)
            </Tag>
          )}
        </Space>
      </div>

      {/* Layout chính: Ảnh + Thông tin */}
      <div className="grid grid-cols-3 gap-8">
        {/* Ảnh lớn + thumbnail */}
        <div className="col-span-1">
          <div className="flex flex-col items-center">
            <Image
              src={product.image}
              alt={product.name}
              className="w-full max-w-md rounded-lg shadow-lg object-cover"
              style={{ height: '360px' }}
            />
            <Image
              src={product.thumbnail || product.image}
              width={60}
              height={60}
              className="mt-4 rounded border-2 border-gray-300"
            />
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="col-span-2 space-y-5">
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-base">
            <div>
              <span className="text-gray-600">Mã hàng hóa:</span>
              <span className="ml-3 font-semibold">{product.code}</span>
            </div>
            <div>
              <span className="text-gray-600">Mô tả:</span>
              <span className="ml-3">{product.description || '-'}</span>
            </div>

            <div>
              <span className="text-gray-600">Loại thực đơn:</span>
              <span className="ml-3 font-semibold">{product.category}</span>
            </div>
            <div>
              <span className="text-gray-600">Ghi chú đặt hàng:</span>
              <span className="ml-3">{product.orderNote || '-'}</span>
            </div>

            <div>
              <span className="text-gray-600">Nhóm hàng:</span>
              <span className="ml-3 font-semibold">{product.group}</span>
            </div>
            <div></div>

            <div>
              <span className="text-gray-600">Loại hàng:</span>
              <span className="ml-3 font-semibold">{product.type}</span>
            </div>
            <div></div>

            <div>
              <span className="text-gray-600">Định mức tồn:</span>
              <span className="ml-3">
                {product.minStock} → {product.maxStock.toLocaleString('vi-VN')}
              </span>
            </div>
            <div></div>

            <div>
              <span className="text-gray-600">Giá bán:</span>
              <span className="ml-3 font-semibold">
                {product.price.toLocaleString('vi-VN')}
              </span>
            </div>
            <div></div>

            <div>
              <span className="text-gray-600">Giá vốn:</span>
              <span className="ml-3 font-semibold">
                {product.cost.toLocaleString('vi-VN')}
              </span>
            </div>
            <div></div>

            <div>
              <span className="text-gray-600">Vị trí:</span>
              <span className="ml-3">{product.location || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="mt-10 flex justify-end">
        <Space size="middle">
          <Button type="primary" size='large' className="bg-green-600 hover:bg-green-700">
            Cập nhật
          </Button>
          <Button size='large' >
            In mã vạch
          </Button>
          <Button type="primary" size='large' className="bg-green-500 hover:bg-green-600">
            Trang thái kinh doanh
          </Button>
          <Button size='large'danger>Xóa</Button>
        </Space>
      </div>
    </div>
  );
}