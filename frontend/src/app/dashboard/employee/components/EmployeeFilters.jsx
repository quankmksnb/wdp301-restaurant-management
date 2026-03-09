'use client';

import { Input, Radio, Collapse } from 'antd';
import { useState } from 'react';

export default function EmployeeFilters({ onFilterChange }) {
    const [selectedStatus, setSelectedStatus] = useState('active');
    const [search, setSearch] = useState('');

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        onFilterChange?.({ search: e.target.value, status: selectedStatus });
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
        onFilterChange?.({ search, status: e.target.value });
    };

    const collapseClass = `
        bg-white rounded-lg shadow-sm
        [&_.ant-collapse-header]:font-medium
        [&_.ant-collapse-item]:border-0
    `;

    const renderCollapse = (title, content) => (
        <Collapse
            defaultActiveKey={['1']}
            bordered={false}
            expandIconPlacement="end"
            className={collapseClass}
            style={{ background: '#fff', marginBottom: 16 }}
            items={[{ key: '1', label: title, children: content }]}
        />
    );

    return (
        <div className="space-y-[10px]">
            {/* TÌM KIẾM */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="font-medium mb-2">Tìm kiếm</div>
                <Input
                    placeholder="Theo mã, tên nhân viên"
                    size="large"
                    className="w-full"
                    value={search}
                    onChange={handleSearchChange}
                    allowClear
                />
            </div>

            {/* TRẠNG THÁI NHÂN VIÊN */}
            {renderCollapse(
                'Trạng thái nhân viên',
                <Radio.Group
                    value={selectedStatus}
                    onChange={handleStatusChange}
                >
                    <div className="flex flex-col gap-3">
                        <Radio value="active">Đang làm việc</Radio>
                        <Radio value="inactive">Đã nghỉ</Radio>
                    </div>
                </Radio.Group>
            )}
        </div>
    );
}
