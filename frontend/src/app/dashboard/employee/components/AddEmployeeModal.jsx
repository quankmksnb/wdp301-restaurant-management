'use client';

import { Modal, Form, message } from 'antd';
import { useEffect } from 'react';
import EmployeeInfoTab from './tabs/EmployeeInfoTab';

export default function EmployeeFormModal({ open, onClose, onSave, employee = null }) {
    const [form] = Form.useForm();
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
                    position: employee.position,
                    department: employee.department,
                    email: employee.email,
                    facebook: employee.facebook,
                    address: employee.address,
                    city: employee.city,
                    notes: employee.notes,
                    role: employee.role,
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, employee, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            // Build data payload for API
            const payload = {
                name: values.name,
                phone: values.phone,
                role: values.role || 'waiter',
                password: values.password || undefined, // undefined → backend defaults to 123456
                code: values.code || undefined, // undefined → backend auto-generates
                idNumber: values.idNumber,
                birthDate: values.birthDate ? values.birthDate.toISOString() : undefined,
                gender: values.gender,
                department: values.department,
                position: values.position,
                startDate: values.startDate ? values.startDate.toISOString() : undefined,
                email: values.email,
                facebook: values.facebook,
                address: values.address,
                city: values.city,
                notes: values.notes,
            };

            await onSave(payload);
        } catch (error) {
            // Form validation failed - ignore
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
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-2"
                >
                    {isEdit ? 'Cập nhật' : 'Lưu'}
                </button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
            >
                <EmployeeInfoTab form={form} isEdit={isEdit} />
            </Form>
        </Modal>
    );
}
