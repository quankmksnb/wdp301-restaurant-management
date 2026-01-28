'use client';

import { Table, Switch, Select, Input, Button } from 'antd';
import { useState } from 'react';
import { InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons';

export default function AllowanceForm() {
    const [enabled, setEnabled] = useState(false);
    const [allowances, setAllowances] = useState([
        { key: '1' },
    ]);

    const columns = [
        {
            title: 'Tên phụ cấp',
            dataIndex: 'name',
            key: 'name',
            render: () => (
                <Select
                    placeholder="Chọn Loại phụ cấp"
                    className="w-full"
                    options={[
                        { value: 'lunch', label: 'Ăn trưa' },
                        { value: 'transport', label: 'Đi lại' },
                        { value: 'phone', label: 'Điện thoại' },
                    ]}
                />
            ),
        },
        {
            title: 'Loại phụ cấp',
            dataIndex: 'type',
            key: 'type',
            render: () => (
                <div className="flex items-center gap-2">
                    <Select
                        defaultValue="daily"
                        className="flex-1"
                        options={[
                            { value: 'daily', label: 'Phụ cấp cố định theo ngày' },
                            { value: 'shift', label: 'Phụ cấp theo ca' },
                            { value: 'month', label: 'Phụ cấp cố định theo tháng' },
                        ]}
                    />
                    <InfoCircleOutlined className="text-gray-400" />
                </div>
            ),
        },
        {
            title: 'Phụ cấp thụ hưởng',
            dataIndex: 'amount',
            key: 'amount',
            render: () => <Input className="text-right" />,
        },
        {
            title: '',
            key: 'action',
            width: 60,
            render: () => (
                <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    danger
                    size="small"
                />
            ),
        },
    ];

    return (
        <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold">Phụ cấp</h3>
                    <p className="text-sm text-gray-500">Thiết lập khoản hỗ trợ làm việc như ăn trưa, đi lại, điện thoại, ...</p>
                </div>
                <Switch checked={enabled} onChange={setEnabled} />
            </div>

            {enabled && (
                <>
                    <Table
                        columns={columns}
                        dataSource={allowances}
                        pagination={false}
                        size="small"
                    />

                    <div className="mt-2">
                        <Button
                            type="link"
                            onClick={() => setAllowances([...allowances, { key: Date.now() }])}
                        >
                            Thêm phụ cấp
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
