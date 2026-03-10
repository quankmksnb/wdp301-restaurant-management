'use client';

import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Modal, Select, Tabs, Upload, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { getCategoryTree } from '@/services/menuCategoryService';
import { createMenuItem } from '@/services/menuItemService';
import AddCategoryModal from './AddCategoryModal';

const { TextArea } = Input;

function SectionHeader({ title }) {
    return (
        <div className="bg-gray-200 px-4 py-2 -mx-4 mb-4">
            <h3 className="font-semibold text-gray-700">{title}</h3>
        </div>
    );
}

// Wrapper thêm suffix ₫ phía sau InputNumber mà không dùng Space.Compact
function PriceInput({ value, onChange, ...rest }) {
    return (
        <div className="flex items-center">
            <InputNumber
                {...rest}
                value={value}
                onChange={onChange}
                className="flex-1"
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(v) => v.replace(/\$\s?|(,*)/g, '')}
            />
            <span
                style={{ borderTopRightRadius: 6, borderBottomRightRadius: 6 }}
                className="inline-flex items-center px-3 h-8 bg-gray-100 border border-l-0 border-gray-300 text-gray-500 text-sm"
            >
                ₫
            </span>
        </div>
    );
}

function ProductInfoTab({ parentOptions, childOptions, selectedParentId, onParentChange, fileList, onFileChange, onCategoryAdded }) {
    const [addCategoryOpen, setAddCategoryOpen] = useState(false);

    return (
        <div className="space-y-2">
            {/* ── Thông tin cơ bản ── */}
            <SectionHeader title="Thông tin cơ bản" />
            <div className="grid grid-cols-2 gap-4">
                <Form.Item
                    name="productCode"
                    label={<span className="flex items-center gap-1">Mã hàng hóa <QuestionCircleOutlined className="text-gray-400" /></span>}
                    rules={[{ required: true, message: 'Vui lòng nhập mã hàng' }]}
                >
                    <Input placeholder="SP001" />
                </Form.Item>
                <Form.Item
                    name="itemName"
                    label={<span className="flex items-center gap-1">Tên hàng <QuestionCircleOutlined className="text-gray-400" /></span>}
                    rules={[{ required: true, message: 'Vui lòng nhập tên hàng' }]}
                >
                    <Input placeholder="Nhập tên hàng hóa" />
                </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Form.Item
                    name="parentCategory"
                    label={<span className="flex items-center gap-1">Loại thực đơn <QuestionCircleOutlined className="text-gray-400" /></span>}
                >
                    <Select
                        className="w-full"
                        options={parentOptions}
                        placeholder="-- Chọn loại --"
                        onChange={onParentChange}
                    />
                </Form.Item>

                <Form.Item
                    label={<span className="flex items-center gap-1">Nhóm hàng <QuestionCircleOutlined className="text-gray-400" /></span>}
                >
                    <div className="flex gap-2">
                        <Form.Item
                            name="category"
                            noStyle
                            rules={[{ required: true, message: 'Vui lòng chọn nhóm hàng' }]}
                        >
                            <Select
                                className="w-full"
                                placeholder="-- Lựa chọn --"
                                options={childOptions}
                                disabled={!selectedParentId}
                            />
                        </Form.Item>
                        <Button
                            icon={<PlusOutlined />}
                            onClick={() => setAddCategoryOpen(true)}
                            title="Thêm nhóm hàng mới"
                        />
                    </div>
                </Form.Item>
            </div>

            {/* ── Hình ảnh ── */}
            <SectionHeader title="Hình ảnh" />
            <div className="mb-2">
                <Upload
                    listType="picture-card"
                    maxCount={5}
                    multiple
                    beforeUpload={() => false}
                    fileList={fileList}
                    onChange={({ fileList: newList }) => onFileChange(newList)}
                >
                    {fileList.length < 5 && (
                        <>
                            <PlusOutlined />
                            <div className="mt-1 text-xs">Tải ảnh</div>
                        </>
                    )}
                </Upload>
            </div>

            {/* ── Giá hàng hóa ── */}
            <SectionHeader title="Giá hàng hóa" />
            <div className="grid grid-cols-2 gap-4 pb-2">
                {/* Giá vốn — không required, dùng PriceInput trực tiếp */}
                <Form.Item
                    name="cost"
                    label={<span className="flex items-center gap-1">Giá vốn <QuestionCircleOutlined className="text-gray-400 text-sm" /></span>}
                    rules={[
                        { required: true, message: "Vui lòng nhập giá bán" },
                        {
                            validator: (_, value) => {
                                if (!value || value <= 0) {
                                    return Promise.reject('Giá bán phải lớn hơn 0');
                                }
                                return Promise.resolve();
                            }
                        },
                    ]}
                >
                    <PriceInput />
                </Form.Item>

                {/* Giá bán — required, PriceInput nhận value/onChange từ Form.Item */}
                <Form.Item
                    name="price"
                    label="Giá bán"
                    rules={[
                        { required: true, message: 'Vui lòng nhập giá bán' },
                        // ← bỏ type: 'number', dùng validator thủ công
                        {
                            validator: (_, value) => {
                                if (!value || value <= 0) {
                                    return Promise.reject('Giá bán phải lớn hơn 0');
                                }
                                return Promise.resolve();
                            }
                        },
                    ]}
                >
                    <PriceInput />
                </Form.Item>
            </div>

            <AddCategoryModal
                open={addCategoryOpen}
                onClose={() => setAddCategoryOpen(false)}
                parentOptions={parentOptions}
                defaultParentId={selectedParentId}
                onSuccess={(newCategory) => {
                    setAddCategoryOpen(false);
                    onCategoryAdded?.(newCategory);
                }}
            />
        </div>
    );
}

export default function AddProductModal({ open, onClose, onConfirm }) {
    const [form] = Form.useForm();
    const [categoryTree, setCategoryTree] = useState([]);
    const [selectedParentId, setSelectedParentId] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadCategoryTree = () => {
        getCategoryTree()
            .then(res => setCategoryTree(Array.isArray(res) ? res : res?.data ?? []))
            .catch(console.error);
    };

    useEffect(() => { loadCategoryTree(); }, []);

    useEffect(() => {
        if (open) {
            form.resetFields();
            setSelectedParentId(null);
            setFileList([]);
        }
    }, [open]);

    const handleConfirm = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            const formData = new FormData();
            formData.append("itemName", values.itemName);
            formData.append("productCode", values.productCode);
            formData.append("price", values.price);
            formData.append("costPrice", values.cost || 0);
            formData.append("description", values.description || "");
            formData.append("availabilityStatus", "available");
            formData.append("category", values.category);

            fileList.forEach(file => {
                if (file.originFileObj) formData.append("images", file.originFileObj);
            });

            const newItem = await createMenuItem(formData);
            message.success("Thêm hàng hóa thành công");
            onConfirm?.(newItem);
        } catch (err) {
            if (err?.response?.data?.message) {
                message.error(err.response.data.message);
            } else if (err?.message && !err?.errorFields) {
                message.error(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const parentOptions = useMemo(() =>
        categoryTree.map(p => ({ value: p._id?.toString(), label: p.categoryName })),
        [categoryTree]
    );

    const childOptions = useMemo(() =>
        categoryTree
            .find(p => p._id?.toString() === selectedParentId?.toString())
            ?.children?.map(c => ({ value: c._id?.toString(), label: c.categoryName })) ?? [],
        [categoryTree, selectedParentId]
    );

    const handleParentChange = (val) => {
        setSelectedParentId(val);
        form.setFieldValue('category', undefined);
    };

    const handleCategoryAdded = (newCategory) => {
        loadCategoryTree();
        form.setFieldValue('category', newCategory._id?.toString());
    };

    const tabItems = useMemo(() => [
        {
            key: '1',
            label: 'Thông tin',
            children: (
                <ProductInfoTab
                    parentOptions={parentOptions}
                    childOptions={childOptions}
                    selectedParentId={selectedParentId}
                    onParentChange={handleParentChange}
                    fileList={fileList}
                    onFileChange={setFileList}
                    onCategoryAdded={handleCategoryAdded}
                />
            ),
        },
        {
            key: '2',
            label: 'Mô tả chi tiết',
            children: (
                <div className="space-y-2">
                    <SectionHeader title="Mô tả chi tiết" />
                    <Form.Item name="description">
                        <TextArea rows={8} placeholder="Nhập mô tả chi tiết về sản phẩm..." />
                    </Form.Item>
                </div>
            ),
        },
    ], [parentOptions, childOptions, selectedParentId, fileList]);

    return (
        <Modal
            title="Thêm hàng hóa"
            open={open}
            onCancel={onClose}
            width={1000}
            destroyOnHidden
            style={{ top: '10vh' }}
            styles={{ body: { maxHeight: 'calc(95vh - 140px)', overflowY: 'auto', padding: '20px' } }}
            footer={
                <div className="flex justify-end gap-2">
                    <Button onClick={onClose} disabled={loading}>Hủy</Button>
                    <Button
                        type="primary"
                        className="!bg-green-600 hover:!bg-green-700"
                        loading={loading}
                        onClick={handleConfirm}
                    >
                        Lưu
                    </Button>
                </div>
            }
        >
            <Form form={form} layout="vertical" initialValues={{ cost: 0, price: 0 }}>
                <Tabs items={tabItems} />
            </Form>
        </Modal>
    );
}