'use client';

import {
    Modal, Tabs, Input, Select, Checkbox, Button,
    InputNumber, Switch, Collapse, Upload, Form
} from 'antd';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { TextArea } = Input;

/**
 * UpdateProductModal
 *
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - onConfirm: (values: object) => void
 *  - product: object   ← data từ component cha (ProductDetail)
 */
export default function UpdateProductModal({ open, onClose, onConfirm, product }) {
    const [form] = Form.useForm();
    const [manageStock, setManageStock] = useState(true);

    // Khi modal mở hoặc product thay đổi → reset form với data mới
    useEffect(() => {
        if (open && product) {
            form.setFieldsValue({
                code: product.code,
                name: product.name,
                category: product.category,
                group: product.group,
                location: product.location,
                directSale: product.directSale,
                noExtra: !product.noExtra,        // "Là món thêm" = ngược với noExtra
                cost: product.cost,
                price: product.price,
                minStock: product.minStock,
                maxStock: product.maxStock,
                description: product.description,
                orderNote: product.orderNote,
            });
        }
    }, [open, product, form]);

    const handleConfirm = async () => {
        try {
            const values = await form.validateFields();
            onConfirm?.({ ...product, ...values });
        } catch {
            // validation failed
        }
    };

    const ProductInfoTab = () => (
        <div>
            <div className="grid grid-cols-2 gap-4">
                <Form.Item name="code" label={<span className="flex items-center gap-1">Mã hàng hóa <QuestionCircleOutlined className="text-gray-400" /></span>} rules={[{ required: true, message: 'Vui lòng nhập mã hàng' }]}>
                    <Input placeholder="SP001" />
                </Form.Item>
                <Form.Item name="name" label={<span className="flex items-center gap-1">Tên hàng <QuestionCircleOutlined className="text-gray-400" /></span>} rules={[{ required: true, message: 'Vui lòng nhập tên hàng' }]}>
                    <Input placeholder="Nhập tên hàng hóa" />
                </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Form.Item name="category" label={<span className="flex items-center gap-1">Loại thực đơn <QuestionCircleOutlined className="text-gray-400" /></span>}>
                    <Select
                        className="w-full"
                        options={[
                            { value: 'Đồ ăn', label: 'Đồ ăn' },
                            { value: 'Đồ uống', label: 'Đồ uống' },
                            { value: 'Tráng miệng', label: 'Tráng miệng' },
                        ]}
                    />
                </Form.Item>
                <Form.Item name="group" label={<span className="flex items-center gap-1">Nhóm hàng <QuestionCircleOutlined className="text-gray-400" /></span>}>
                    <div className="flex gap-2">
                        <Select placeholder="--Lựa chọn--" className="flex-1" />
                        <Button icon={<PlusOutlined />} />
                    </div>
                </Form.Item>
            </div>

            <div>
                <label className="mb-2 block">Hình ảnh</label>
                <Upload
                    listType="picture-card"
                    maxCount={5}
                    multiple
                    beforeUpload={() => false}
                    defaultFileList={
                        product?.image
                            ? [{ uid: '-1', name: 'image', status: 'done', url: product.image }]
                            : []
                    }
                >
                    <PlusOutlined />
                    <div className="mt-2">Tải ảnh</div>
                </Upload>
            </div>

            <div className="mt-4 mb-4 rounded-sm overflow-hidden border border-gray-200">

                {/* Header */}
                <div className="bg-gray-200 px-4 py-2">
                    <h3 className="font-semibold text-gray-700">
                        Giá hàng hóa
                    </h3>
                </div>

                {/* Content */}
                <div className="bg-white ml-4 mt-2">
                    <div className="grid grid-cols-2 gap-4">

                        <Form.Item
                            name="cost"
                            label={
                                <span className="flex items-center gap-1">
                                    Giá vốn
                                    <QuestionCircleOutlined className="text-gray-400 text-sm" />
                                </span>
                            }
                        >
                            <InputNumber
                                className="w-full"
                                formatter={(v) =>
                                    `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                                parser={(v) =>
                                    v.replace(/\$\s?|(,*)/g, "")
                                }
                            />
                        </Form.Item>

                        <Form.Item name="price" label="Giá bán">
                            <InputNumber
                                className="w-full"
                                formatter={(v) =>
                                    `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                                parser={(v) =>
                                    v.replace(/\$\s?|(,*)/g, "")
                                }
                            />
                        </Form.Item>

                    </div>
                </div>

            </div>

            <Collapse
                ghost
                items={[
                    {
                        key: '1',
                        label: 'Thuộc tính (Màu sắc, Kích thước)',
                        children: <div className="p-4 text-gray-500">Chưa có thuộc tính nào</div>,
                    },
                    {
                        key: '2',
                        label: 'Đơn vị tính',
                        children: <div className="p-4 text-gray-500">Chưa có đơn vị tính nào</div>,
                    },
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
                <Form.Item name="description">
                    <TextArea rows={8} placeholder="Nhập mô tả chi tiết về sản phẩm..." />
                </Form.Item>
            ),
        },
        {
            key: '3',
            label: 'Thành phần',
            children: (
                <div className="p-4">
                    <TextArea rows={8} placeholder="Nhập thành phần của món ăn..." />
                </div>
            ),
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
            ),
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
            ),
        },
    ];

    return (
        <Modal
            title="Cập nhật hàng hóa"
            open={open}
            onCancel={onClose}
            width={1000}
            style={{ top: '5vh' }}
            styles={{
                body: { maxHeight: 'calc(95vh - 140px)', overflowY: 'auto' },
            }}
            footer={
                <div className="flex justify-end gap-2">
                    <Button onClick={onClose}>Hủy</Button>
                    <Button
                        type="primary"
                        className="!bg-green-600 hover:!bg-green-700"
                        onClick={handleConfirm}
                    >
                        Lưu cập nhật
                    </Button>
                </div>
            }
        >
            <Form form={form} layout="vertical">
                <Tabs items={tabItems} />
            </Form>
        </Modal>
    );
}