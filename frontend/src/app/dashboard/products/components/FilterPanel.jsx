'use client';

import { Card, Input, Checkbox, Collapse, Radio } from 'antd';

export default function FilterPanel() {
    const collapseClass = `
    bg-white rounded-lg shadow-sm
    [&_.ant-collapse-header]:font-medium
    [&_.ant-collapse-item]:border-0
  `;

    const renderCollapse = (title, content) => (
        <Collapse
            defaultActiveKey={['1']}
            bordered={false}
            expandIconPlacement="end"
            className={collapseClass}
            style={{ background: "#fff", marginBottom: 16 }}
            items={[
                {
                    key: '1',
                    label: title,
                    children: content,
                },
            ]}
        />
    );

    return (
        <div className="space-y-[10px]">
            {/* SEARCH */}
            <div
                className="bg-white rounded-lg shadow-sm p-4 mb-4"
            >
                <div className="font-medium mb-2">Tìm kiếm</div>

                <Input
                    placeholder="Theo mã, tên hàng"
                    size="large"
                    className="w-full"
                />
            </div>


            {/* LOẠI THỰC ĐƠN */}
            {renderCollapse(
                'Loại thực đơn',
                <Checkbox.Group className="flex flex-col space-y-3">
                    <Checkbox value="food">Đồ ăn</Checkbox>
                    <Checkbox value="drink">Đồ uống</Checkbox>
                    <Checkbox value="other">Khác</Checkbox>
                </Checkbox.Group>
            )}

            {/* LOẠI HÀNG */}
            {renderCollapse(
                'Loại hàng',
                <Checkbox.Group className="flex flex-col space-y-3">
                    <Checkbox>Hàng hóa thường</Checkbox>
                    <Checkbox>Chế biến</Checkbox>
                    <Checkbox>Dịch vụ</Checkbox>
                    <Checkbox>Combo - Đóng gói</Checkbox>
                    <Checkbox>Combo tùy chọn</Checkbox>
                    <Checkbox>Buffet gọi món</Checkbox>
                </Checkbox.Group>
            )}

            {/* NHÓM HÀNG */}
            {renderCollapse(
                'Nhóm hàng',
                <>
                    <Input placeholder="Tìm kiếm nhóm hàng" className="mb-3" />
                    <Checkbox.Group className="flex flex-col space-y-2">
                        <Checkbox value="all">Tất cả</Checkbox>
                        <Checkbox value="nicotin">Nicotin</Checkbox>
                    </Checkbox.Group>
                </>
            )}

            {/* TRẠNG THÁI */}
            {renderCollapse(
                'Trạng thái',
                <Radio.Group className="flex flex-col space-y-3">
                    <Radio value="all">Tất cả</Radio>
                    <Radio value="active">Còn kinh doanh</Radio>
                    <Radio value="inactive">Ngừng kinh doanh</Radio>
                </Radio.Group>
            )}
        </div>
    );
}
