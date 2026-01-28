'use client';

import { Table, Checkbox } from 'antd';

export default function EmployeeList({ onRowClick }) {
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
            sorter: true,
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
            sorter: true,
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
    ];

    // Sample employee data
    const data = [
        {
            key: '1',
            code: 'NV000001',
            workerCode: '',
            name: 'hoang',
            phone: '0375559358',
            idNumber: '',
            debt: '0',
            branch: '',
        },
    ];

    return (
        <div className="flex-1 bg-white">
            <Table
                columns={columns}
                dataSource={data}
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
