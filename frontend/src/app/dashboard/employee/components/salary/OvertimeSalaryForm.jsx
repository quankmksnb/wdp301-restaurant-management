'use client';

import { Table, Switch, Input } from 'antd';
import { useState } from 'react';

export default function OvertimeSalaryForm() {
    const [enabled, setEnabled] = useState(false);

    const columns = [
        {
            title: '',
            dataIndex: 'label',
            key: 'label',
            width: 200,
            render: () => 'Hệ số lương trên giờ',
        },
        {
            title: 'Ngày thường',
            dataIndex: 'weekday',
            key: 'weekday',
            render: () => <Input className="text-right" disabled={!enabled} />,
        },
        {
            title: 'Thứ 7',
            dataIndex: 'saturday',
            key: 'saturday',
            render: () => <Input className="text-right" disabled={!enabled} />,
        },
        {
            title: 'Chủ nhật',
            dataIndex: 'sunday',
            key: 'sunday',
            render: () => <Input className="text-right" disabled={!enabled} />,
        },
        {
            title: 'Ngày nghỉ',
            dataIndex: 'dayOff',
            key: 'dayOff',
            render: () => <Input className="text-right" disabled={!enabled} />,
        },
        {
            title: 'Ngày lễ tết',
            dataIndex: 'holiday',
            key: 'holiday',
            render: () => <Input className="text-right" disabled={!enabled} />,
        },
    ];

    const data = [{ key: '1' }];

    return (
        <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold">Lương làm thêm giờ</h3>
                </div>
                <Switch checked={enabled} onChange={setEnabled} />
            </div>

            {enabled && (
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    size="small"
                />
            )}
        </div>
    );
}
