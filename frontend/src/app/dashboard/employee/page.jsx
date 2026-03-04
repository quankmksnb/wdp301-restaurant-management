'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Input, Popover, Checkbox, message } from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import EmployeeFilters from './components/EmployeeFilters';
import EmployeeList from './components/EmployeeList';
import EmployeeFormModal from './components/AddEmployeeModal';
import EmployeeDetailDrawer from './components/EmployeeDetailDrawer';

const API_BASE = 'http://localhost:5000/api/employees';

export default function EmployeePage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [searchText, setSearchText] = useState('');

    // ---- Column visibility ----
    const allColumns = [
        { key: 'photo', label: 'Ảnh' },
        { key: 'code', label: 'Mã nhân viên' },
        { key: 'workerCode', label: 'Mã chấm công' },
        { key: 'name', label: 'Tên nhân viên' },
        { key: 'phone', label: 'Số điện thoại' },
        { key: 'idNumber', label: 'Số CMND/CCCD' },
        { key: 'branch', label: 'Chi nhánh' },
        { key: 'birthDate', label: 'Ngày sinh' },
        { key: 'gender', label: 'Giới tính' },
        { key: 'email', label: 'Email' },
        { key: 'facebook', label: 'Facebook' },
        { key: 'address', label: 'Địa chỉ' },
        { key: 'position', label: 'Chức danh' },
        { key: 'startDate', label: 'Ngày bắt đầu làm việc' },
    ];
    const [visibleColumns, setVisibleColumns] = useState(
        ['photo', 'code', 'workerCode', 'name', 'phone', 'idNumber', 'branch']
    );

    const handleToggleColumn = (key) => {
        setVisibleColumns((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };

    const columnSelectorContent = (
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 p-1" style={{ minWidth: 320 }}>
            {allColumns.map((col) => (
                <Checkbox
                    key={col.key}
                    checked={visibleColumns.includes(col.key)}
                    onChange={() => handleToggleColumn(col.key)}
                >
                    {col.label}
                </Checkbox>
            ))}
        </div>
    );

    // ---- Fetch employees from API ----
    const fetchEmployees = useCallback(async (page = 1, limit = 20, search = '') => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit });
            if (search) params.set('search', search);

            const res = await fetch(`${API_BASE}?${params}`);
            const json = await res.json();

            // Map API response to table format
            const mapped = json.data.map((emp) => ({
                key: emp._id,
                _id: emp._id,
                code: emp.code || '',
                workerCode: '',
                name: emp.fullName,
                phone: emp.phone || '',
                idNumber: emp.idNumber || '',
                debt: '0',
                branch: '',
                birthDate: emp.birthDate ? new Date(emp.birthDate).toLocaleDateString('vi-VN') : '',
                gender: emp.gender || '',
                department: emp.department || '',
                position: emp.position || '',
                startDate: emp.startDate ? new Date(emp.startDate).toLocaleDateString('vi-VN') : '',
                email: emp.email || '',
                facebook: emp.facebook || '',
                address: emp.address || '',
                city: emp.city || '',
                notes: emp.notes || '',
                role: emp.role || '',
                status: emp.status || '',
            }));

            setEmployees(mapped);
            setPagination(json.pagination);
        } catch (err) {
            console.error('Fetch employees error:', err);
            message.error('Không thể tải danh sách nhân viên');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmployees(pagination.page, pagination.limit, searchText);
    }, []);

    // ---- Search with debounce ----
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEmployees(1, pagination.limit, searchText);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchText]);

    // ---- Pagination change ----
    const handlePageChange = (page, pageSize) => {
        fetchEmployees(page, pageSize, searchText);
    };

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

    // ---- Edit Employee ----
    const handleEditEmployee = (employee) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    // ---- Save (Add or Update) via API ----
    const handleSaveEmployee = async (data) => {
        try {
            if (editingEmployee) {
                // Update
                const res = await fetch(`${API_BASE}/${editingEmployee._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.message);
                }
                message.success('Cập nhật nhân viên thành công!');
            } else {
                // Create
                const res = await fetch(API_BASE, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.message);
                }
                message.success('Thêm nhân viên thành công!');
            }
            setIsModalOpen(false);
            setEditingEmployee(null);
            // Refresh list
            fetchEmployees(pagination.page, pagination.limit, searchText);
        } catch (err) {
            message.error(err.message || 'Có lỗi xảy ra');
        }
    };

    // ---- Delete Employee via API ----
    const handleDeleteEmployee = async (key) => {
        try {
            const emp = employees.find((e) => e.key === key);
            if (!emp) return;

            const res = await fetch(`${API_BASE}/${emp._id}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }
            message.success('Đã ngừng nhân viên thành công!');

            // Close drawer if showing deleted employee
            if (selectedEmployee && selectedEmployee.key === key) {
                setIsDetailOpen(false);
                setSelectedEmployee(null);
            }

            // Refresh list
            fetchEmployees(pagination.page, pagination.limit, searchText);
        } catch (err) {
            message.error(err.message || 'Có lỗi xảy ra');
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-100">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold">Danh sách nhân viên</h1>
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
                        <Popover
                            content={columnSelectorContent}
                            trigger="click"
                            placement="bottomRight"
                        >
                            <Button>≡</Button>
                        </Popover>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden p-3 gap-3">
                <EmployeeFilters />
                <EmployeeList
                    employees={employees}
                    visibleColumns={visibleColumns}
                    onRowClick={handleRowClick}
                    onEdit={handleEditEmployee}
                    onDelete={handleDeleteEmployee}
                    loading={loading}
                    pagination={pagination}
                    onPageChange={handlePageChange}
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
