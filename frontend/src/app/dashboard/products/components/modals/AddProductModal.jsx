'use client';

import { Modal, Tabs, Input, Select, Checkbox, Button, InputNumber, Switch, Collapse, Upload } from 'antd';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { TextArea } = Input;

export default function AddProductModal({ open, onClose, onConfirm }) {
    const [sellDirectly, setSellDirectly] = useState(true);
    const [manageStock, setManageStock] = useState(true);

    const ProductInfoTab = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="flex items-center gap-2 mb-2">
                        Mã hàng hóa <QuestionCircleOutlined className="text-gray-400" />
                    </label>
                    <Input placeholder="SP001" />
                </div>
                <div>
                    <label className="flex items-center gap-2 mb-2">
                        Tên hàng <QuestionCircleOutlined className="text-gray-400" />
                    </label>
                    <Input placeholder="Nhập tên hàng hóa" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="flex items-center gap-2 mb-2">
                        Loại thực đơn <QuestionCircleOutlined className="text-gray-400" />
                    </label>
                    <Select
                        defaultValue="food"
                        className="w-full"
                        options={[
                            { value: 'food', label: 'Đồ ăn' },
                            { value: 'drink', label: 'Đồ uống' },
                            { value: 'dessert', label: 'Tráng miệng' },
                        ]}
                    />
                </div>
                <div>
                    <label className="flex items-center gap-2 mb-2">
                        Nhóm hàng <QuestionCircleOutlined className="text-gray-400" />
                    </label>
                    <div className="flex gap-2">
                        <Select placeholder="--Lựa chọn--" className="flex-1" />
                        <Button icon={<PlusOutlined />} />
                    </div>
                </div>
            </div>

            <div>
                <label className="flex items-center gap-2 mb-2">
                    Vị trí <QuestionCircleOutlined className="text-gray-400" />
                </label>
                <div className="flex gap-2">
                    <Input className="flex-1" placeholder="Ví dụ: Kệ A1" />
                    <Button icon={<PlusOutlined />} />
                </div>
            </div>

            <div className="space-y-2">
                <Checkbox checked={sellDirectly} onChange={(e) => setSellDirectly(e.target.checked)}>
                    Bán trực tiếp <QuestionCircleOutlined className="text-gray-400 ml-1" />
                </Checkbox>
                <Checkbox>
                    Là món thêm (Extra topping) <QuestionCircleOutlined className="text-gray-400 ml-1" />
                </Checkbox>
            </div>

            <div>
                <label className="mb-2 block">Hình ảnh</label>
                <Upload listType="picture-card" maxCount={5} multiple beforeUpload={() => false}>
                    <PlusOutlined />
                    <div className="mt-2">Tải ảnh</div>
                </Upload>
            </div>

            <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-4">Giá hàng hóa</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center gap-2 mb-2">
                            Giá vốn <QuestionCircleOutlined className="text-gray-400" />
                        </label>
                        <InputNumber 
                            className="w-full" 
                            defaultValue={0} 
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </div>
                    <div>
                        <label className="mb-2 block">Giá bán</label>
                        <InputNumber 
                            className="w-full" 
                            defaultValue={0} 
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Quản lý tồn kho</h3>
                    <Switch checked={manageStock} onChange={setManageStock} />
                </div>
                {manageStock && (
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="flex items-center gap-2 mb-2">
                                Tồn kho <QuestionCircleOutlined className="text-gray-400" />
                            </label>
                            <InputNumber className="w-full" defaultValue={0} />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 mb-2">
                                Ít nhất <QuestionCircleOutlined className="text-gray-400" />
                            </label>
                            <InputNumber className="w-full" defaultValue={0} />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 mb-2">
                                Nhiều nhất <QuestionCircleOutlined className="text-gray-400" />
                            </label>
                            <InputNumber className="w-full" defaultValue={999999999} />
                        </div>
                    </div>
                )}
            </div>

            <Collapse 
                ghost
                items={[
                    {
                        key: '1',
                        label: 'Thuộc tính (Màu sắc, Kích thước)',
                        children: <div className="p-4 text-gray-500">Chưa có thuộc tính nào</div>
                    },
                    {
                        key: '2',
                        label: 'Đơn vị tính',
                        children: <div className="p-4 text-gray-500">Chưa có đơn vị tính nào</div>
                    }
                ]}
            />
        </div>
    );

    const tabItems = [
        { key: '1', label: 'Thông tin', children: <ProductInfoTab /> },
        { 
            key: '2', 
            label: 'Mô tả chi tiết', 
            children: (
                <div className="p-4">
                    <TextArea rows={8} placeholder="Nhập mô tả chi tiết về sản phẩm..." />
                </div>
            ) 
        },
        { 
            key: '3', 
            label: 'Thành phần', 
            children: (
                <div className="p-4">
                    <TextArea rows={8} placeholder="Nhập thành phần của món ăn..." />
                </div>
            ) 
        },
        { 
            key: '4', 
            label: 'Món thêm', 
            children: (
                <div className="p-4">
                    <Select 
                        mode="multiple" 
                        className="w-full" 
                        placeholder="Chọn món thêm đi kèm"
                        options={[
                            { value: 'topping1', label: 'Topping 1' },
                            { value: 'topping2', label: 'Topping 2' },
                        ]}
                    />
                </div>
            ) 
        },
        { 
            key: '5', 
            label: 'Chi nhánh', 
            children: (
                <div className="p-4">
                    <Checkbox.Group className="flex flex-col gap-2">
                        <Checkbox value="branch1">Chi nhánh 1</Checkbox>
                        <Checkbox value="branch2">Chi nhánh 2</Checkbox>
                        <Checkbox value="branch3">Chi nhánh 3</Checkbox>
                    </Checkbox.Group>
                </div>
            ) 
        },
    ];

    return (
        <Modal
            title="Thêm hàng hóa"
            open={open}
            onCancel={onClose}
            width={1000}
            style={{ top: '5vh' }}
            styles={{ body: { maxHeight: 'calc(95vh - 140px)', overflowY: 'auto', padding: '20px' } }}
            footer={
                <div className="flex justify-end gap-2">
                    <Button onClick={onClose}>Hủy</Button>
                    <Button type="primary" className="!bg-green-600 hover:!bg-green-700" onClick={onConfirm}>
                        Lưu
                    </Button>
                    <Button type="primary" className="!bg-green-600 hover:!bg-green-700" onClick={onConfirm}>
                        Lưu & Thêm mới
                    </Button>
                </div>
            }
        >
            <Tabs items={tabItems} />
        </Modal>
    );
}