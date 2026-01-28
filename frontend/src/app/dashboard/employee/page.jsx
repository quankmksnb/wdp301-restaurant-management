'use client';

import { useState } from 'react';
import { Button, Input, message } from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import EmployeeFilters from './components/EmployeeFilters';
import EmployeeList from './components/EmployeeList';
import EmployeeFormModal from './components/AddEmployeeModal';
import EmployeeDetailDrawer from './components/EmployeeDetailDrawer';

// Initial sample data
const initialEmployees = [
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

export default function EmployeePage() {
    const [employees, setEmployees] = useState(initialEmployees);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [searchText, setSearchText] = useState('');

    // ---- Row click → open detail drawer ----
    const handleRowClick = (employee) => {
        setSelectedEmployee(employee);
        setIsDetailOpen(true);
    };

    // ---- Add Employee ----
    const handleOpenAddModal = () => {
        setEditingEmployee(null);
        setIsModalOpen(true);
    };

    // ---- Edit Employee (from table action or drawer) ----
    const handleEditEmployee = (employee) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    // ---- Save (Add or Update) ----
    const handleSaveEmployee = (data) => {
        if (editingEmployee) {
            // Update existing
            setEmployees((prev) =>
                prev.map((emp) => (emp.key === editingEmployee.key ? { ...emp, ...data } : emp))
            );
            // Also update the drawer if it's showing the same employee
            if (selectedEmployee && selectedEmployee.key === editingEmployee.key) {
                setSelectedEmployee({ ...selectedEmployee, ...data });
            }
        } else {
            // Add new
            setEmployees((prev) => [...prev, data]);
        }
        setIsModalOpen(false);
        setEditingEmployee(null);
    };

    // ---- Delete Employee ----
    const handleDeleteEmployee = (key) => {
        setEmployees((prev) => prev.filter((emp) => emp.key !== key));
        message.success('Đã xóa nhân viên thành công!');
        // Close drawer if the deleted employee was selected
        if (selectedEmployee && selectedEmployee.key === key) {
            setIsDetailOpen(false);
            setSelectedEmployee(null);
        }
    };

    // ---- Filter by search text ----
    const filteredEmployees = employees.filter((emp) => {
        if (!searchText) return true;
        const search = searchText.toLowerCase();
        return (
            emp.code.toLowerCase().includes(search) ||
            emp.name.toLowerCase().includes(search)
        );
    });

    return (
        <div className="flex flex-col h-full">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold">Danh sách nhân viên</h1>
                        <p className="text-sm text-gray-500">
                            Có tổng <span className="font-medium">{employees.length} nhân viên</span> với <span className="text-blue-500 cursor-pointer hover:underline">Danh sách</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Input
                            placeholder="Tìm theo mã, tên nhân viên"
                            prefix={<SearchOutlined />}
                            className="w-64"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                        <Button
                            type="primary"
                            icon={<UserAddOutlined />}
                            onClick={handleOpenAddModal}
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
                <EmployeeList
                    employees={filteredEmployees}
                    onRowClick={handleRowClick}
                    onEdit={handleEditEmployee}
                    onDelete={handleDeleteEmployee}
                />
            </div>

            {/* Employee Form Modal (Add / Edit) */}
            <EmployeeFormModal
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingEmployee(null);
                }}
                onSave={handleSaveEmployee}
                employee={editingEmployee}
            />

            {/* Employee Detail Drawer */}
            <EmployeeDetailDrawer
                open={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                employee={selectedEmployee}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
            />
        </div>
    );
}
