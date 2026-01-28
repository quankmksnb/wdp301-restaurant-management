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
                    workerCode: employee.workerCode,
                    idNumber: employee.idNumber,
                    gender: employee.gender,
                    position: employee.position,
                    email: employee.email,
                    facebook: employee.facebook,
                    address: employee.address,
                    notes: employee.notes,
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, employee, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            if (isEdit) {
                // Merge with existing employee data to preserve key and other fields
                onSave({ ...employee, ...values });
                message.success('Cập nhật nhân viên thành công!');
            } else {
                // Generate auto code if needed
                if (!values.code) {
                    values.code = `NV${String(Date.now()).slice(-6)}`;
                }
                values.key = String(Date.now());
                values.debt = '0';
                values.branch = '';
                values.workerCode = values.workerCode || '';
                onSave(values);
                message.success('Thêm nhân viên thành công!');
            }
            onClose();
        } catch (error) {
            // Form validation failed
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
