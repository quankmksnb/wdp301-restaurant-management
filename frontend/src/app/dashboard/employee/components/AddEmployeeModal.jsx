'use client';

import { Modal } from 'antd';
import EmployeeInfoTab from './tabs/EmployeeInfoTab';

export default function AddEmployeeModal({ open, onClose, onSave }) {
    return (
        <Modal
            title="Thêm mới nhân viên"
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
                    onClick={onSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-2"
                >
                    Lưu
                </button>,
            ]}
        >
            <EmployeeInfoTab />
        </Modal>
    );
}
