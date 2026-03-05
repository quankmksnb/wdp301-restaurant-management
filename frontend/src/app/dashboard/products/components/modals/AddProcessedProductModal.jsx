'use client';

import { Modal, Tabs, Input, Select, Button, InputNumber, Switch, Upload, Table } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { TextArea } = Input;

export default function AddProcessedProductModal({ open, onClose, onConfirm }) {
    const [manageRecipe, setManageRecipe] = useState(true);
    const [ingredients, setIngredients] = useState([]);

    const ProcessedInfoTab = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-2 block">Mã hàng hóa</label>
                    <Input placeholder="CB001" />
                </div>
                <div>
                    <label className="mb-2 block">Tên hàng chế biến</label>
                    <Input placeholder="Nhập tên hàng chế biến" />
                </div>
            </div>

            <div>
                <label className="mb-2 block">Nhóm hàng</label>
                <div className="flex gap-2">
                    <Select 
                        placeholder="--Lựa chọn--" 
                        className="flex-1"
                        options={[
                            { value: 'group1', label: 'Nhóm 1' },
                            { value: 'group2', label: 'Nhóm 2' },
                        ]}
                    />
                    <Button icon={<PlusOutlined />} />
                </div>
            </div>

            <div>
                <label className="mb-2 block">Hình ảnh</label>
                <Upload listType="picture-card" maxCount={5} multiple beforeUpload={() => false}>
                    <PlusOutlined />
                    <div className="mt-2">Tải ảnh</div>
                </Upload>
            </div>

            <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-4">Giá bán</h3>
                <InputNumber 
                    className="w-full" 
                    defaultValue={0} 
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
            </div>
        </div>
    );

    const RecipeTab = () => {
        const columns = [
            {
                title: 'Nguyên liệu',
                dataIndex: 'name',
                key: 'name',
                width: '40%',
            },
            {
                title: 'Số lượng',
                dataIndex: 'quantity',
                key: 'quantity',
                width: '25%',
            },
            {
                title: 'Đơn vị',
                dataIndex: 'unit',
                key: 'unit',
                width: '25%',
            },
            {
                title: '',
                key: 'action',
                width: '10%',
                render: () => <Button type="text" danger icon={<DeleteOutlined />} />,
            },
        ];

        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Công thức nguyên liệu</h3>
                    <Switch checked={manageRecipe} onChange={setManageRecipe} />
                </div>
                
                {manageRecipe && (
                    <>
                        <Button 
                            icon={<PlusOutlined />} 
                            type="dashed" 
                            className="w-full"
                        >
                            Thêm nguyên liệu
                        </Button>
                        
                        {ingredients.length > 0 && (
                            <Table 
                                columns={columns} 
                                dataSource={ingredients}
                                pagination={false}
                                size="small"
                            />
                        )}
                        
                        <div className="mt-4">
                            <label className="mb-2 block">Công thức chế biến</label>
                            <TextArea rows={6} placeholder="Mô tả các bước chế biến chi tiết..." />
                        </div>
                    </>
                )}
            </div>
        );
    };

    const tabItems = [
        { key: '1', label: 'Thông tin', children: <ProcessedInfoTab /> },
        { key: '2', label: 'Công thức', children: <RecipeTab /> },
        { 
            key: '3', 
            label: 'Mô tả', 
            children: (
                <div className="p-4">
                    <TextArea rows={8} placeholder="Mô tả món ăn..." />
                </div>
            ) 
        },
        { 
            key: '4', 
            label: 'Chi nhánh', 
            children: (
                <div className="p-4">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" />
                            Chi nhánh 1
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" />
                            Chi nhánh 2
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" />
                            Chi nhánh 3
                        </label>
                    </div>
                </div>
            ) 
        },
    ];

    return (
        <Modal
            title="Thêm hàng chế biến"
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