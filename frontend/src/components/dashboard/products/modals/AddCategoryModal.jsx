'use client';

import { Button, Form, Input, Modal, Select, message } from 'antd';
import { useEffect } from 'react';
import { createCategory } from '@/services/menuCategoryService';

export default function AddCategoryModal({ open, onClose, parentOptions = [], defaultParentId, onSuccess }) {
    const [form] = Form.useForm();

    // Set giá trị cha mặc định khi modal mở
    useEffect(() => {
        if (open) {
            form.setFieldsValue({ parentId: defaultParentId ?? undefined });
        }
    }, [open, defaultParentId]);

    const handleConfirm = async () => {
        try {
            const values = await form.validateFields();
            const res = await createCategory({
                categoryName: values.categoryName,
                parentId:     values.parentId,
            });

            message.success('Thêm nhóm hàng thành công');
            form.resetFields();
            onSuccess?.(res.data ?? res);
        } catch (err) {
            if (err?.response?.data?.message) {
                message.error(err.response.data.message);
            } else if (err?.message && !err?.errorFields) {
                message.error(err.message);
            }
        }
    };

    const handleClose = () => {
        form.resetFields();
        onClose?.();
    };

    return (
        <Modal
            title="Thêm nhóm hàng"
            open={open}
            onCancel={handleClose}
            width={480}
            destroyOnHidden        // ← thêm
            footer={
                <div className="flex justify-end gap-2">
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button
                        type="primary"
                        className="!bg-green-600 hover:!bg-green-700"
                        onClick={handleConfirm}
                    >
                        Lưu
                    </Button>
                </div>
            }
        >
            <Form
                form={form}
                layout="vertical"
                // ← XÓA initialValues, dùng useEffect thay thế
            >
                <Form.Item
                    name="parentId"
                    label="Thuộc loại thực đơn"
                    rules={[{ required: true, message: 'Vui lòng chọn loại thực đơn cha' }]}
                >
                    <Select
                        options={parentOptions}
                        placeholder="-- Chọn loại thực đơn --"
                    />
                </Form.Item>

                <Form.Item
                    name="categoryName"
                    label="Tên nhóm hàng"
                    rules={[{ required: true, message: 'Vui lòng nhập tên nhóm hàng' }]}
                >
                    <Input placeholder="VD: Bia, Nước ngọt, Kem..." />
                </Form.Item>
            </Form>
        </Modal>
    );
}