'use client';

import { Table, Checkbox, Button, Popconfirm, Tooltip, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

export default function EmployeeList({
    employees = [],
    visibleColumns = [],
    onRowClick,
    onEdit,
    onDelete,
    loading = false,
    pagination = {},
    onPageChange,
}) {
    const allColumns = [
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
            title: 'Chi nhánh',
            dataIndex: 'branch',
            key: 'branch',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'birthDate',
            key: 'birthDate',
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Facebook',
            dataIndex: 'facebook',
            key: 'facebook',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Chức danh',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Ngày bắt đầu làm việc',
            dataIndex: 'startDate',
            key: 'startDate',
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

    // Always show 'select' and 'actions', filter the rest by visibleColumns
    const alwaysVisible = ['select', 'actions'];
    const columns = allColumns.filter(
        (col) => alwaysVisible.includes(col.key) || visibleColumns.includes(col.key)
    );

    return (
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto">
                <Table
                    columns={columns}
                    dataSource={employees}
                    pagination={false}
                    size="small"
                    loading={loading}
                    onRow={(record) => ({
                        onClick: () => onRowClick && onRowClick(record),
                        className: 'cursor-pointer hover:bg-blue-50',
                    })}
                />
            </div>
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-2.5 flex items-center justify-between text-sm text-gray-500">
                <span>Tổng <strong className="text-gray-700">{pagination.total || employees.length}</strong> nhân viên</span>
                <div className="flex items-center gap-2">
                    <button
                        className="px-2 py-1 border rounded hover:bg-white disabled:opacity-40"
                        disabled={pagination.page <= 1}
                        onClick={() => onPageChange && onPageChange(pagination.page - 1, pagination.limit)}
                    >
                        ‹
                    </button>
                    <span>Trang <strong>{pagination.page || 1}</strong> / {pagination.totalPages || 1}</span>
                    <button
                        className="px-2 py-1 border rounded hover:bg-white disabled:opacity-40"
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => onPageChange && onPageChange(pagination.page + 1, pagination.limit)}
                    >
                        ›
                    </button>
                    <span className="ml-2">Hiển thị</span>
                    <select
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                        value={pagination.limit || 10}
                        onChange={(e) => onPageChange && onPageChange(1, parseInt(e.target.value))}
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <span>/ trang</span>
                </div>
            </div>
        </div>
    );
}
