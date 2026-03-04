'use client';

import { Modal, Tabs, Input, Select, Checkbox, Button, InputNumber, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export default function AddServiceModal({ open, onClose, onConfirm }) {
    const ServiceInfoTab = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-2 block">Mã dịch vụ</label>
                    <Input placeholder="DV001" />
                </div>
                <div>
                    <label className="mb-2 block">Tên dịch vụ</label>
                    <Input placeholder="Nhập tên dịch vụ" />
                </div>
            </div>

            <div>
                <label className="mb-2 block">Loại dịch vụ</label>
                <Select
                    className="w-full"
                    placeholder="Chọn loại dịch vụ"
                    options={[
                        { value: 'service1', label: 'Phục vụ tại bàn' },
                        { value: 'service2', label: 'Giao hàng' },
                        { value: 'service3', label: 'Đặt tiệc' },
                        { value: 'service4', label: 'Trang trí' },
                    ]}
                />
            </div>

            <div>
                <label className="mb-2 block">Hình ảnh</label>
                <Upload listType="picture-card" maxCount={3} multiple beforeUpload={() => false}>
                    <PlusOutlined />
                    <div className="mt-2">Tải ảnh</div>
                </Upload>
            </div>

            <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-4">Giá dịch vụ</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-2 block">Giá cố định</label>
                        <InputNumber 
                            className="w-full" 
                            defaultValue={0} 
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </div>
                    <div>
                        <label className="mb-2 block">Đơn vị tính</label>
                        <Select
                            className="w-full"
                            defaultValue="once"
                            options={[
                                { value: 'once', label: 'Lần' },
                                { value: 'hour', label: 'Giờ' },
                                { value: 'day', label: 'Ngày' },
                                { value: 'person', label: 'Người' },
                            ]}
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="mb-2 block">Mô tả dịch vụ</label>
                <TextArea rows={4} placeholder="Mô tả chi tiết về dịch vụ..." />
            </div>

            <Checkbox>Áp dụng cho tất cả chi nhánh</Checkbox>
        </div>
    );

    const tabItems = [
        { key: '1', label: 'Thông tin', children: <ServiceInfoTab /> },
        { 
            key: '2', 
            label: 'Điều khoản', 
            children: (
                <div className="p-4">
                    <label className="mb-2 block">Điều khoản sử dụng dịch vụ</label>
                    <TextArea rows={10} placeholder="Nhập điều khoản sử dụng dịch vụ..." />
                </div>
            ) 
        },
        { 
            key: '3', 
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
            title="Thêm dịch vụ"
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