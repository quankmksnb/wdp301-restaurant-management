'use client';

import { Table, Switch, Select, Input, Button } from 'antd';
import { useState } from 'react';
import { InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons';

export default function CommissionForm() {
    const [enabled, setEnabled] = useState(false);
    const [commissionRules, setCommissionRules] = useState([
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
            title: 'Hoa hồng thụ hưởng',
            dataIndex: 'commission',
            key: 'commission',
            render: () => (
                <Select
                    placeholder="Chọn Bảng hoa hồng"
                    className="w-full"
                    options={[
                        { value: 'table1', label: 'Bảng hoa hồng 1' },
                        { value: 'table2', label: 'Bảng hoa hồng 2' },
                    ]}
                />
            ),
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
                    <h3 className="font-semibold">Hoa hồng</h3>
                    <p className="text-sm text-gray-500">Thiết lập mức hoa hồng theo sản phẩm hoặc dịch vụ</p>
                </div>
                <Switch checked={enabled} onChange={setEnabled} />
            </div>

            {enabled && (
                <>
                    <Table
                        columns={columns}
                        dataSource={commissionRules}
                        pagination={false}
                        size="small"
                    />

                    <div className="mt-2">
                        <Button
                            type="link"
                            onClick={() => setCommissionRules([...commissionRules, { key: Date.now(), type: 'Tư vấn bán hàng' }])}
                        >
                            Thêm hoa hồng
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
