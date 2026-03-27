'use client';

import { Modal, Form, message } from 'antd';
import { useEffect, useState } from 'react';
import EmployeeInfoTab from './tabs/EmployeeInfoTab';

export default function EmployeeFormModal({ open, onClose, onSave, employee = null }) {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const isEdit = !!employee;

    useEffect(() => {
        if (open) {
            if (employee) {
                form.setFieldsValue({
                    code: employee.code,
                    name: employee.name,
                    phone: employee.phone,
                    idNumber: employee.idNumber,
                    gender: employee.gender,
                    email: employee.email,

                    address: employee.address,
                    role: employee.role,
                });
            } else {
                form.resetFields();
            }
            setImageFile(null);
        }
    }, [open, employee, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            setSaving(true);

            // Build FormData to support image upload
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('phone', values.phone);
            formData.append('role', values.role || 'waiter');

            // Only send email when creating (email is locked on edit)
            if (!isEdit) {
                formData.append('email', values.email);
            }

            if (values.password) formData.append('password', values.password);
            if (values.code) formData.append('code', values.code);
            if (values.idNumber) formData.append('idNumber', values.idNumber);
            if (values.birthDate) formData.append('birthDate', values.birthDate.toISOString());
            if (values.gender) formData.append('gender', values.gender);
            if (values.startDate) formData.append('startDate', values.startDate.toISOString());

            if (values.address) formData.append('address', values.address);

            // Append image file if selected
            if (imageFile) {
                formData.append('photo', imageFile);
            }

            await onSave(formData);
        } catch (error) {
            // Form validation failed - ignore
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            title={isEdit ? 'Cập nhật nhân viên' : 'Thêm mới nhân viên'}
            open={open}
            onCancel={onClose}
            width={1000}
            style={{ top: 20 }}
            styles={{
                body: {
                    maxHeight: 'calc(100vh - 200px)',
                    overflowY: 'auto',
                },
            }}
            footer={[
                <button
                    key="cancel"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                    Bỏ qua
                </button>,
                <button
                    key="save"
                    onClick={handleSave}
                    disabled={saving}
                    className={`px-4 py-2 text-white rounded ml-2 inline-flex items-center gap-2 ${saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                    {saving && (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {isEdit ? 'Cập nhật' : 'Lưu'}
                </button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
            >
                <EmployeeInfoTab
                    form={form}
                    isEdit={isEdit}
                    imageFile={imageFile}
                    onImageChange={setImageFile}
                    existingImageUrl={employee?.photo || null}
                />
            </Form>
        </Modal>
    );
}
