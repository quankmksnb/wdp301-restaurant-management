'use client';

import { Table, Switch, Select, Input, Button } from 'antd';
import { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';

export default function DeductionForm() {
    const [enabled, setEnabled] = useState(false);
    const [deductions, setDeductions] = useState([
        { key: '1' },
    ]);

    const columns = [
        {
            title: 'Tên giảm trừ',
            dataIndex: 'name',
            key: 'name',
            render: () => (
                <Select
                    placeholder="Chọn Loại giảm trừ"
                    className="w-full"
                    options={[
                        { value: 'late', label: 'Đi muộn' },
                        { value: 'early', label: 'Về sớm' },
                        { value: 'violation', label: 'Vi phạm nội quy' },
                    ]}
                />
            ),
        },
        {
            title: 'Loại giảm trừ',
            dataIndex: 'type',
            key: 'type',
            render: () => (
                <div className="flex items-center gap-2">
                    <Select
                        defaultValue="late"
                        className="flex-1"
                        options={[
                            { value: 'late', label: 'Đi muộn' },
                            { value: 'early', label: 'Về sớm' },
                            { value: 'violation', label: 'Vi phạm nội quy' },
                        ]}
                    />
                    <Input className="text-right w-32" />
                </div>
            ),
        },
        {
            title: 'Khoản giảm trừ',
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
                    <h3 className="font-semibold">Giảm trừ</h3>
                    <p className="text-sm text-gray-500">Thiết lập khoản giảm trừ như đi muộn, về sớm, vi phạm nội quy, ...</p>
                </div>
                <Switch checked={enabled} onChange={setEnabled} />
            </div>

            {enabled && (
                <>
                    <Table
                        columns={columns}
                        dataSource={deductions}
                        pagination={false}
                        size="small"
                    />

                    <div className="mt-2">
                        <Button
                            type="link"
                            onClick={() => setDeductions([...deductions, { key: Date.now() }])}
                        >
                            Thêm giảm trừ
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
