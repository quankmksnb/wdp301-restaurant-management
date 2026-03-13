'use client';

import { Drawer, Tabs, Button, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

function EmployeeInfoPanel({ employee }) {
    return (
        <div className="p-4">
            <div className="flex gap-6">
                {/* Photo */}
                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-400 text-3xl">📷</span>
                </div>

                {/* Info Grid */}
                <div className="flex-1 grid grid-cols-4 gap-x-6 gap-y-4">
                    {/* Row 1 */}
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Mã nhân viên:</div>
                        <div className="font-medium">{employee.code}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Tên nhân viên:</div>
                        <div className="font-medium">{employee.name}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Ngày sinh:</div>
                        <div className="font-medium">{employee.birthDate || '-'}</div>
                    </div>

                    {/* Row 2 */}
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Giới tính:</div>
                        <div className="font-medium">{employee.gender || '-'}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Số CMND/CCCD:</div>
                        <div className="font-medium">{employee.idNumber || '-'}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Chức danh:</div>
                        <div className="font-medium">{employee.position || '-'}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Ngày bắt đầu làm việc:</div>
                        <div className="font-medium">{employee.startDate || '-'}</div>
                    </div>

                    {/* Row 3 */}
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Số điện thoại:</div>
                        <div className="font-medium">{employee.phone}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Email:</div>
                        <div className="font-medium">{employee.email || '-'}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Facebook:</div>
                        <div className="font-medium">{employee.facebook || '-'}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Địa chỉ:</div>
                        <div className="font-medium">{employee.address || '-'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AccountNotesPanel() {
    return (
        <div className="p-4">
            <div className="mb-4">
                <div className="text-sm font-medium mb-2">Thiết bị di động:</div>
                <div className="text-sm text-gray-500">Ghi chú...</div>
            </div>
        </div>
    );
}

export default function EmployeeDetailDrawer({ open, onClose, employee, onEdit, onDelete }) {
    if (!employee) return null;

    const items = [
        {
            key: 'info',
            label: 'Thông tin',
            children: <EmployeeInfoPanel employee={employee} />,
        },
        {
            key: 'schedule',
            label: 'Lịch làm việc',
            children: <div className="p-4 text-gray-500">Chưa có dữ liệu lịch làm việc</div>,
        },
        {
            key: 'account',
            label: 'Tài khoản và ghi chú',
            children: <AccountNotesPanel />,
        },
    ];

    return (
        <Drawer
            title={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">{employee.name}</span>
                        <span className="text-sm text-gray-500">({employee.code})</span>
                    </div>
                    <Space size="small">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => {
                                onEdit && onEdit(employee);
                            }}
                        >
                            Sửa
                        </Button>
                        <Popconfirm
                            title="Xóa nhân viên"
                            description={`Bạn có chắc chắn muốn xóa nhân viên "${employee.name}"?`}
                            onConfirm={() => {
                                onDelete && onDelete(employee.key);
                                onClose();
                            }}
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                        >
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                            >
                                Xóa
                            </Button>
                        </Popconfirm>
                    </Space>
                </div>
            }
            placement="right"
            onClose={onClose}
            open={open}
            styles={{
                wrapper: {
                    width: 900,
                },
                body: {
                    padding: 0,
                },
            }}
        >
            <Tabs
                defaultActiveKey="info"
                items={items}
                className="px-4"
            />
        </Drawer>
    );
}
