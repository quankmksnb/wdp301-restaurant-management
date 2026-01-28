'use client';

import { Table, Switch, Select, Input, Button } from 'antd';
import { useState } from 'react';
import { InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons';

export default function BonusForm() {
    const [enabled, setEnabled] = useState(false);
    const [bonusRules, setBonusRules] = useState([
        { key: '1', type: 'Tư vấn bán hàng' },
    ]);

    const columns = [
        {
            title: 'Loại hình',
            dataIndex: 'type',
            key: 'type',
            render: (text) => (
                <div className="py-2">{text}</div>
            ),
        },
        {
            title: (
                <div className="flex items-center gap-1">
                    Doanh thu
                    <InfoCircleOutlined className="text-gray-400" />
                </div>
            ),
            dataIndex: 'revenue',
            key: 'revenue',
            render: () => (
                <div className="flex items-center gap-2">
                    <span className="text-sm">Từ</span>
                    <Input className="text-right flex-1" />
                </div>
            ),
        },
        {
            title: 'Thưởng',
            dataIndex: 'bonus',
            key: 'bonus',
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
                    <h3 className="font-semibold">Thưởng</h3>
                    <p className="text-sm text-gray-500">Thiết lập thưởng theo doanh thu cho nhân viên</p>
                </div>
                <Switch checked={enabled} onChange={setEnabled} />
            </div>

            {enabled && (
                <>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm mb-2">Loại thưởng</label>
                            <Select
                                defaultValue="personal"
                                className="w-full"
                                options={[
                                    { value: 'personal', label: 'Theo doanh thu cá nhân' },
                                    { value: 'team', label: 'Theo doanh thu nhóm' },
                                ]}
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-2 flex items-center gap-1">
                                Hình thức
                                <InfoCircleOutlined className="text-gray-400" />
                            </label>
                            <Select
                                defaultValue="total"
                                className="w-full"
                                options={[
                                    { value: 'total', label: 'Tính theo mức tổng doanh thu' },
                                    { value: 'tier', label: 'Tính theo từng mức' },
                                ]}
                            />
                        </div>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={bonusRules}
                        pagination={false}
                        size="small"
                    />

                    <div className="mt-2">
                        <Button
                            type="link"
                            onClick={() => setBonusRules([...bonusRules, { key: Date.now(), type: 'Tư vấn bán hàng' }])}
                        >
                            Thêm thưởng
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
