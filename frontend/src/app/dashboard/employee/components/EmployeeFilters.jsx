'use client';

import { Input, Radio, Collapse, Select } from 'antd';
import { useState } from 'react';

export default function EmployeeFilters({ onFilterChange }) {
    const [selectedStatus, setSelectedStatus] = useState('active');
    const [search, setSearch] = useState('');
    const [selectedRole, setSelectedRole] = useState([]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        onFilterChange?.({ search: e.target.value, status: selectedStatus, role: selectedRole.join(',') });
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
        onFilterChange?.({ search, status: e.target.value, role: selectedRole.join(',') });
    };

    const handleRoleChange = (values) => {
        const roleVals = values || [];
        setSelectedRole(roleVals);
        onFilterChange?.({ search, status: selectedStatus, role: roleVals.join(',') });
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

            {/* CHỨC DANH */}
            {renderCollapse(
                'Chức danh',
                <div className="px-1">
                    <Select
                        mode="multiple"
                        allowClear
                        className="w-full"
                        placeholder="Chọn chức danh"
                        value={selectedRole}
                        onChange={handleRoleChange}
                        options={[
                            { label: 'Quản lý', value: 'manager' },
                            { label: 'Lễ tân', value: 'receptionist' },
                            { label: 'Phục vụ', value: 'waiter' },
                            { label: 'Nhà bếp', value: 'kitchenStaff' },
                        ]}
                    />
                </div>
            )}
        </div>
    );
}
