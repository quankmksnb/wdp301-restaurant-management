'use client';

import { useState } from 'react';
import { Button, Input } from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import EmployeeFilters from './components/EmployeeFilters';
import EmployeeList from './components/EmployeeList';
import AddEmployeeModal from './components/AddEmployeeModal';
import EmployeeDetailDrawer from './components/EmployeeDetailDrawer';

export default function EmployeePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleRowClick = (employee) => {
        setSelectedEmployee(employee);
        setIsDetailOpen(true);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold">Danh sách nhân viên</h1>
                        <p className="text-sm text-gray-500">
                            Có tổng <span className="font-medium">1 nhân viên</span> với <span className="text-blue-500 cursor-pointer hover:underline">Danh sách</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Input
                            placeholder="Tìm theo mã, tên nhân viên"
                            prefix={<SearchOutlined />}
                            className="w-64"
                        />
                        <Button
                            type="primary"
                            icon={<UserAddOutlined />}
                            onClick={() => setIsModalOpen(true)}
                        >
                            Nhân viên
                        </Button>
                        <Button>...</Button>
                        <Button>≡</Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                <EmployeeFilters />
                <EmployeeList onRowClick={handleRowClick} />
            </div>

            {/* Add Employee Modal */}
            <AddEmployeeModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(data) => {
                    console.log('Saving employee:', data);
                    setIsModalOpen(false);
                }}
            />

            {/* Employee Detail Drawer */}
            <EmployeeDetailDrawer
                open={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                employee={selectedEmployee}
            />
        </div>
    );
}
