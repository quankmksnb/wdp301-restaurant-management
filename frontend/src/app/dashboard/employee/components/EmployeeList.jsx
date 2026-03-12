'use client';

import { useState } from 'react';
import { Table, Button, Popconfirm, Tooltip, Space, Dropdown, Tag, Pagination, Tabs } from 'antd';
import useExportFile from '@/hooks/useExportFile';
import {
    EditOutlined,
    UserAddOutlined,
    DownloadOutlined,
    MenuOutlined,
    CloseOutlined,
    StopOutlined,
    CheckCircleOutlined,
    SafetyCertificateOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { Typography } from 'antd';

const { Text } = Typography;

// ─── Column Checkbox helper ───
const ColumnCheckbox = ({ columnKey, label, visibleColumns, onToggle }) => (
    <div className="flex items-center">
        <input
            type="checkbox"
            checked={visibleColumns.includes(columnKey)}
            onChange={() => onToggle(columnKey)}
            className="mr-2"
        />
        {label}
    </div>
);

// ─── Expanded Row: Info Panel ───
function ExpandedInfoPanel({ employee }) {
    return (
        <div className="p-4">
            <div className="flex flex-col gap-6">
                {/* Photo */}
                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {employee.photo ? (
                        <img
                            src={`http://localhost:5000${employee.photo}`}
                            alt={employee.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<span class="text-gray-400 text-3xl">📷</span>';
                            }}
                        />
                    ) : (
                        <span className="text-gray-400 text-3xl">📷</span>
                    )}
                </div>

                {/* Info Grid */}
                <div className="w-full min-w-0 grid grid-cols-4 gap-x-4 gap-y-4 max-w-6xl">
                    {/* Row 1 */}
                    <div className="w-full overflow-hidden pr-2">
                        <div className="text-xs text-gray-500 mb-1">Mã nhân viên:</div>
                        <div className="font-medium line-clamp-2 break-words" title={employee.code}>{employee.code}</div>
                    </div>
                    <div className="w-full overflow-hidden pr-2">
                        <div className="text-xs text-gray-500 mb-1">Tên nhân viên:</div>
                        <div className="font-medium line-clamp-2 break-words" title={employee.name}>{employee.name}</div>
                    </div>
                    <div className="w-full overflow-hidden pr-2">
                        <div className="text-xs text-gray-500 mb-1">Ngày sinh:</div>
                        <div className="font-medium line-clamp-2 break-words" title={employee.birthDate}>{employee.birthDate || '-'}</div>
                    </div>

                    {/* Row 2 */}
                    <div className="w-full overflow-hidden pr-2">
                        <div className="text-xs text-gray-500 mb-1">Giới tính:</div>
                        <div className="font-medium line-clamp-2 break-words" title={employee.gender}>{employee.gender || '-'}</div>
                    </div>
                    <div className="w-full overflow-hidden pr-2">
                        <div className="text-xs text-gray-500 mb-1">Số CMND/CCCD:</div>
                        <div className="font-medium line-clamp-2 break-words" title={employee.idNumber}>{employee.idNumber || '-'}</div>
                    </div>
                    <div className="w-full overflow-hidden pr-2">
                        <div className="text-xs text-gray-500 mb-1">Phòng ban:</div>
                        <div className="font-medium line-clamp-2 break-words" title={employee.department}>{employee.department || '-'}</div>
                    </div>
                    <div className="w-full overflow-hidden pr-2">
                        <div className="text-xs text-gray-500 mb-1">Chức danh:</div>
                        <div className="font-medium line-clamp-2 break-words" title={employee.position}>{employee.position || '-'}</div>
                    </div>

                    {/* Row 3 */}
                    <div className="w-full overflow-hidden pr-2">
                        <div className="text-xs text-gray-500 mb-1">Ngày bắt đầu làm việc:</div>
                        <div className="font-medium line-clamp-2 break-words" title={employee.startDate}>{employee.startDate || '-'}</div>
                    </div>
                    {/* Row 4 */}
                    <div className="w-full overflow-hidden pr-2">
                        <div className="text-xs text-gray-500 mb-1">Số điện thoại:</div>
                        <div className="font-medium line-clamp-2 break-words" title={employee.phone}>{employee.phone || '-'}</div>
                    </div>
                    <div className="w-full overflow-hidden pr-2">
                        <div className="text-xs text-gray-500 mb-1">Email:</div>
                        <div className="font-medium line-clamp-2 break-words" title={employee.email}>{employee.email || '-'}</div>
                    </div>
                    <div className="w-full overflow-hidden pr-2">
                        <div className="text-xs text-gray-500 mb-1">Facebook:</div>
                        <div className="font-medium line-clamp-2 break-words" title={employee.facebook}>{employee.facebook || '-'}</div>
                    </div>
                    <div className="w-full overflow-hidden pr-2">
                        <div className="text-xs text-gray-500 mb-1">Địa chỉ:</div>
                        <div className="font-medium line-clamp-2 break-words" title={employee.address}>{employee.address || '-'}</div>
                    </div>
                </div>

                {/* Notes section */}
                <div className="w-full max-w-sm">
                    <div className="text-xs text-gray-500 mb-1">Ghi chú:</div>
                    <div className={`border rounded px-3 py-2 text-sm min-w-[200px] whitespace-pre-wrap ${employee.notes ? 'text-gray-700 bg-gray-50' : 'text-gray-400'}`}>
                        {employee.notes || 'Ghi chú...'}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Expanded Row Content with Tabs ───
function ExpandedRowContent({ employee, onEdit, onDeactivate }) {
    const tabItems = [
        {
            key: 'info',
            label: 'Thông tin',
            children: <ExpandedInfoPanel employee={employee} />,
        },
        {
            key: 'schedule',
            label: 'Lịch làm việc',
            children: <div className="p-4 text-gray-500">Chưa có dữ liệu lịch làm việc</div>,
        }
    ];

    return (
        <div>
            <Tabs defaultActiveKey="info" items={tabItems} className="px-4" />

            {/* Footer action bar */}
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-end bg-gray-50">
                <Space>
                    <Popconfirm
                        title="Ngừng làm việc"
                        description={`Bạn có chắc chắn muốn cho nhân viên "${employee.name}" ngừng làm việc?`}
                        onConfirm={() => onDeactivate && onDeactivate(employee.key)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            icon={<StopOutlined />}
                            className="text-gray-600 hover:text-red-500"
                        >
                            Ngừng làm việc
                        </Button>
                    </Popconfirm>

                    <Button
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        onClick={() => onEdit && onEdit(employee)}
                    >
                        Cập nhật
                    </Button>
                </Space>
            </div>
        </div>
    );
}

export default function EmployeeList({
    employees = [],
    visibleColumns = [],
    onEdit,
    onDelete,
    onOpenAddModal,
    onToggleColumn,
    loading = false,
    pagination = {},
    onPageChange,
    onExportFile,
    exportLoading = false,
}) {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const hasSelected = selectedRowKeys.length > 0;

    // Handle row click to toggle expand
    const handleRowClick = (record) => {
        setExpandedRowKeys((prev) => {
            if (prev.includes(record.key)) {
                return []; // collapse if already expanded
            }
            return [record.key]; // expand only this row
        });
    };

    const mainColumnDefs = [
        { key: 'photo', label: 'Ảnh' },
        { key: 'code', label: 'Mã nhân viên' },
        { key: 'name', label: 'Tên nhân viên' },
        { key: 'phone', label: 'Số điện thoại' },
        { key: 'email', label: 'Email' },
        { key: 'gender', label: 'Giới tính' },
    ];

    const additionalColumnDefs = [
        { key: 'birthDate', label: 'Ngày sinh' },
        { key: 'facebook', label: 'Facebook' },
        { key: 'address', label: 'Địa chỉ' },
        { key: 'position', label: 'Chức danh' },
        { key: 'startDate', label: 'Ngày bắt đầu làm việc' },
        { key: 'idNumber', label: 'Số CMND/CCCD' },
    ];

    const columnMenuItems = [
        {
            key: 'columns-grid',
            label: (
                <div className="grid grid-cols-2 gap-4 min-w-96">
                    <div className="space-y-2">
                        {mainColumnDefs.map((col) => (
                            <div key={col.key}>
                                <ColumnCheckbox
                                    columnKey={col.key}
                                    label={col.label}
                                    visibleColumns={visibleColumns}
                                    onToggle={onToggleColumn}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        {additionalColumnDefs.map((col) => (
                            <div key={col.key}>
                                <ColumnCheckbox
                                    columnKey={col.key}
                                    label={col.label}
                                    visibleColumns={visibleColumns}
                                    onToggle={onToggleColumn}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
    ];

    // Table columns — no more "actions" column, actions are in the expanded row
    const allColumns = [
        {
            title: 'Ảnh',
            dataIndex: 'photo',
            key: 'photo',
            width: 60,
            render: (text, record) => (
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                    {record.photo ? (
                        <img
                            src={`http://localhost:5000${record.photo}`}
                            alt={record.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<span class="text-gray-400 text-xs">📷</span>';
                            }}
                        />
                    ) : (
                        <span className="text-gray-400 text-xs">📷</span>
                    )}
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
            title: 'Nợ và tạm ứng',
            dataIndex: 'debt',
            key: 'debt',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'notes',
            key: 'notes',
        },
    ];

    // Filter columns by visibility
    const columns = allColumns.filter(
        (col) => visibleColumns.includes(col.key)
    );

    return (
        <div className="flex flex-col h-full">
            {/* ── Header ── */}
            <div className="p-4 mb-10">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <h1 className="text-3xl font-bold">Nhân viên</h1>

                        {hasSelected && (
                            <Space className="animate-fade-in">
                                <Text strong>{selectedRowKeys.length} mục đã chọn</Text>
                                <Button
                                    type="link"
                                    onClick={() => setSelectedRowKeys([])}
                                    icon={<CloseOutlined />}
                                />
                            </Space>
                        )}
                    </div>

                    <Space>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            className="!bg-secondary !border-secondary hover:!bg-secondary/90"
                            onClick={onOpenAddModal}
                        >
                            Thêm nhân viên
                        </Button>

                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            size="large"
                            className="!bg-secondary !border-secondary hover:!bg-secondary/90"
                            onClick={onExportFile}
                            loading={exportLoading}
                        >
                            Xuất file
                        </Button>

                        <Dropdown
                            menu={{ items: columnMenuItems }}
                            placement="bottomRight"
                            trigger={['click']}
                        >
                            <Button
                                size="large"
                                className="!bg-secondary !border-secondary hover:!bg-secondary/90 !text-white"
                                icon={<MenuOutlined className="text-white" />}
                            />
                        </Dropdown>
                    </Space>
                </div>
            </div>

            {/* ── Table with expandable rows ── */}
            <div className="flex-1 overflow-hidden" id="employee-table-container">
                <Table
                    rowSelection={{
                        selectedRowKeys,
                        onChange: setSelectedRowKeys,
                    }}
                    columns={columns}
                    dataSource={employees}
                    loading={loading}
                    pagination={false}
                    scroll={{ x: 'max-content', y: 'calc(100vh - 345px)' }}
                    className="border-t employee-table h-full [&_.ant-spin-nested-loading]:h-full [&_.ant-spin-container]:h-full [&_.ant-table]:h-full [&_.ant-table-container]:h-full [&_.ant-table-body]:!h-[calc(100vh-390px)]"
                    rowClassName="cursor-pointer hover:bg-gray-50"
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                    })}
                    expandable={{
                        expandedRowKeys,
                        onExpand: (expanded, record) => {
                            // Handled via onRow click
                        },
                        expandedRowRender: (record) => (
                            <ExpandedRowContent
                                employee={record}
                                onEdit={onEdit}
                                onDeactivate={onDelete}
                            />
                        ),
                        expandIcon: () => null, // Hide default expand icon
                        expandRowByClick: false, // We handle click ourselves via onRow
                    }}
                />
            </div>

            {/* ── Pagination (fixed at bottom) ── */}
            <div className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                    Tổng <strong className="text-gray-700">{pagination.total || 0}</strong> nhân viên
                </span>
                <Pagination
                    current={pagination.page || 1}
                    pageSize={pagination.limit || 10}
                    total={pagination.total || 0}
                    showSizeChanger
                    pageSizeOptions={['10', '20', '50', '100']}
                    onChange={(page, pageSize) => {
                        onPageChange && onPageChange(page, pageSize);
                    }}
                    size="small"
                />
            </div>
        </div>
    );
}
