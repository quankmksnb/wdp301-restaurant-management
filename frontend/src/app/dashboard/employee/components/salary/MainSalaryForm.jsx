'use client';

import { Select, Input, Button, Table, Switch } from 'antd';
import { useState } from 'react';
import { InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons';

export default function MainSalaryForm() {
    const [salaryType, setSalaryType] = useState('shift');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [shiftRules, setShiftRules] = useState([]);

    const salaryTypes = [
        { value: 'shift', label: 'Theo ca làm việc' },
        { value: 'hour', label: 'Theo giờ làm việc' },
        { value: 'day', label: 'Theo ngày công chuẩn' },
        { value: 'fixed', label: 'Cố định' },
    ];

    const unitSuffix = {
        shift: '/ ca',
        hour: '/ giờ',
        day: '/ ngày',
        fixed: '',
    };

    const columns = [
        {
            title: 'Ca',
            dataIndex: 'shift',
            key: 'shift',
            width: 150,
            render: () => <Select placeholder="Chọn ca" className="w-full" />,
        },
        {
            title: 'Lương/ca',
            dataIndex: 'salary',
            key: 'salary',
            render: () => <Input className="text-right" />,
        },
        {
            title: 'Thứ 7',
            dataIndex: 'saturday',
            key: 'saturday',
            render: () => <Input className="text-right" />,
        },
        {
            title: 'Chủ nhật',
            dataIndex: 'sunday',
            key: 'sunday',
            render: () => <Input className="text-right" />,
        },
        {
            title: 'Ngày nghỉ',
            dataIndex: 'dayOff',
            key: 'dayOff',
            render: () => <Input className="text-right" />,
        },
        {
            title: 'Ngày lễ tết',
            dataIndex: 'holiday',
            key: 'holiday',
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
            <div className="mb-4">
                <h3 className="font-semibold mb-2">Lương chính</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm mb-2">Loại lương</label>
                    <div className="flex items-center gap-2">
                        <Select
                            value={salaryType}
                            onChange={setSalaryType}
                            options={salaryTypes}
                            className="flex-1"
                        />
                        <InfoCircleOutlined className="text-gray-400" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm mb-2">Mức lương</label>
                    <div className="relative">
                        <Input className="text-right pr-12" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {unitSuffix[salaryType]}
                        </span>
                    </div>
                </div>
                {salaryType === 'shift' && (
                    <div className="flex items-end">
                        <div className="flex items-center gap-2">
                            <span className="text-sm">Thiết lập nâng cao</span>
                            <Switch
                                checked={showAdvanced}
                                onChange={setShowAdvanced}
                            />
                        </div>
                    </div>
                )}
            </div>

            {showAdvanced && salaryType === 'shift' && (
                <div className="mt-4">
                    <Table
                        columns={columns}
                        dataSource={shiftRules}
                        pagination={false}
                        size="small"
                        locale={{
                            emptyText: 'Không tìm thấy kết quả nào phù hợp',
                        }}
                    />
                    <div className="mt-2">
                        <Button
                            type="link"
                            onClick={() => setShiftRules([...shiftRules, { key: Date.now() }])}
                        >
                            Thêm điều kiện
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
