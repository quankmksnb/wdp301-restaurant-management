'use client';

import { Table, Checkbox, Button, Popconfirm, Tooltip, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

export default function EmployeeList({ employees = [], onRowClick, onEdit, onDelete }) {
    const columns = [
        {
            title: '',
            dataIndex: 'select',
            key: 'select',
            width: 50,
            render: () => <Checkbox />,
        },
        {
            title: 'Ảnh',
            dataIndex: 'photo',
            key: 'photo',
            width: 60,
            render: () => (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-xs">📷</span>
                </div>
            ),
        },
        {
            title: 'Mã nhân viên',
            dataIndex: 'code',
            key: 'code',
            sorter: (a, b) => a.code.localeCompare(b.code),
        },
        {
            title: 'Mã chấm công',
            dataIndex: 'workerCode',
            key: 'workerCode',
        },
        {
            title: 'Tên nhân viên',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Số CMND/CCCD',
            dataIndex: 'idNumber',
            key: 'idNumber',
        },
        {
            title: 'Nợ ra toàn ứng',
            dataIndex: 'debt',
            key: 'debt',
            align: 'right',
        },
        {
            title: 'Chi nhánh',
            dataIndex: 'branch',
            key: 'branch',
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Space size="small" onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Sửa">
                        <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit && onEdit(record);
                            }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa nhân viên"
                        description={`Bạn có chắc chắn muốn xóa nhân viên "${record.name}"?`}
                        onConfirm={(e) => {
                            onDelete && onDelete(record.key);
                        }}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Xóa">
                            <Button
                                type="text"
                                size="small"
                                icon={<DeleteOutlined />}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="flex-1 bg-white">
            <Table
                columns={columns}
                dataSource={employees}
                pagination={{
                    pageSize: 20,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} nhân viên`,
                }}
                size="small"
                onRow={(record) => ({
                    onClick: () => onRowClick && onRowClick(record),
                    className: 'cursor-pointer hover:bg-blue-50',
                })}
            />
        </div>
    );
}
