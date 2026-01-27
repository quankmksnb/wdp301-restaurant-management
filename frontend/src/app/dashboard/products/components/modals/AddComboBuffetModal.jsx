'use client';

import { Modal, Tabs, Input, Select, Button, InputNumber, Upload, Table } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { TextArea } = Input;

export default function AddComboBuffetModal({ open, onClose, onConfirm }) {
    const [dishes, setDishes] = useState([]);

    const ComboInfoTab = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-2 block">Mã combo</label>
                    <Input placeholder="COMBO001" />
                </div>
                <div>
                    <label className="mb-2 block">Tên combo buffet</label>
                    <Input placeholder="Nhập tên combo" />
                </div>
            </div>

            <div>
                <label className="mb-2 block">Loại combo</label>
                <Select
                    className="w-full"
                    placeholder="Chọn loại combo"
                    options={[
                        { value: 'standard', label: 'Buffet tiêu chuẩn' },
                        { value: 'premium', label: 'Buffet cao cấp' },
                        { value: 'vip', label: 'Buffet VIP' },
                        { value: 'kids', label: 'Buffet trẻ em' },
                    ]}
                />
            </div>

            <div>
                <label className="mb-2 block">Hình ảnh</label>
                <Upload listType="picture-card" maxCount={5} multiple beforeUpload={() => false}>
                    <PlusOutlined />
                    <div className="mt-2">Tải ảnh</div>
                </Upload>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-2 block">Giá combo</label>
                    <InputNumber 
                        className="w-full" 
                        defaultValue={0} 
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                </div>
                <div>
                    <label className="mb-2 block">Số người tối thiểu</label>
                    <InputNumber className="w-full" defaultValue={1} min={1} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-2 block">Thời gian áp dụng</label>
                    <Select
                        className="w-full"
                        placeholder="Chọn thời gian"
                        options={[
                            { value: 'allday', label: 'Cả ngày' },
                            { value: 'lunch', label: 'Buổi trưa (11:00 - 14:00)' },
                            { value: 'dinner', label: 'Buổi tối (17:00 - 21:00)' },
                            { value: 'weekend', label: 'Cuối tuần' },
                        ]}
                    />
                </div>
                <div>
                    <label className="mb-2 block">Thời lượng</label>
                    <Select
                        className="w-full"
                        defaultValue="120"
                        options={[
                            { value: '60', label: '60 phút' },
                            { value: '90', label: '90 phút' },
                            { value: '120', label: '120 phút' },
                            { value: '180', label: '180 phút' },
                        ]}
                    />
                </div>
            </div>

            <div>
                <label className="mb-2 block">Mô tả combo</label>
                <TextArea rows={4} placeholder="Mô tả chi tiết về combo buffet..." />
            </div>
        </div>
    );

    const DishesTab = () => {
        const columns = [
            {
                title: 'Món ăn',
                dataIndex: 'name',
                key: 'name',
                width: '50%',
            },
            {
                title: 'Loại',
                dataIndex: 'type',
                key: 'type',
                width: '30%',
            },
            {
                title: '',
                key: 'action',
                width: '20%',
                render: () => <Button type="text" danger icon={<DeleteOutlined />} />,
            },
        ];

        return (
            <div className="space-y-4">
                <div>
                    <label className="mb-2 block">Món ăn trong combo</label>
                    <Button 
                        icon={<PlusOutlined />} 
                        type="dashed" 
                        className="w-full mb-4"
                    >
                        Thêm món ăn
                    </Button>
                    
                    {dishes.length > 0 ? (
                        <Table 
                            columns={columns} 
                            dataSource={dishes}
                            pagination={false}
                            size="small"
                        />
                    ) : (
                        <div className="text-gray-400 text-center py-8 border border-dashed border-gray-300 rounded">
                            Chưa có món ăn nào được thêm vào combo
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const tabItems = [
        { key: '1', label: 'Thông tin', children: <ComboInfoTab /> },
        { key: '2', label: 'Món ăn', children: <DishesTab /> },
        { 
            key: '3', 
            label: 'Quy định', 
            children: (
                <div className="p-4">
                    <label className="mb-2 block">Quy định sử dụng combo buffet</label>
                    <TextArea 
                        rows={10} 
                        placeholder="Nhập các quy định và điều khoản sử dụng combo buffet..."
                        defaultValue="1. Thời gian sử dụng combo theo quy định&#10;2. Không mang thức ăn ra ngoài&#10;3. Phụ thu 10% cho trẻ em dưới 1m&#10;4. Đặt trước ít nhất 24h"
                    />
                </div>
            ) 
        },
        { 
            key: '4', 
            label: 'Chi nhánh', 
            children: (
                <div className="p-4">
                    <div className="space-y-3">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4" />
                            <span>Chi nhánh 1 - Quận 1</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4" />
                            <span>Chi nhánh 2 - Quận 3</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4" />
                            <span>Chi nhánh 3 - Quận 5</span>
                        </label>
                    </div>
                </div>
            ) 
        },
    ];

    return (
        <Modal
            title="Thêm combo buffet"
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