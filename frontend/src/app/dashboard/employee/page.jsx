'use client';

import { useState, useEffect, useCallback } from 'react';
import { Col, Row, message } from 'antd';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '@/services/api';
import EmployeeFilters from './components/EmployeeFilters';
import EmployeeList from './components/EmployeeList';
import EmployeeFormModal from './components/AddEmployeeModal';

export default function EmployeePage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('active');

    // ---- Column visibility ----
    const [visibleColumns, setVisibleColumns] = useState(
        ['photo', 'code', 'workerCode', 'name', 'phone', 'idNumber', 'branch']
    );

    const handleToggleColumn = (key) => {
        setVisibleColumns((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };

    // ---- Role to Position mapping ----
    const getPositionByRole = (role) => {
        const roles = {
            manager: 'Quản lý',
            receptionist: 'Lễ tân',
            waiter: 'Phục vụ',
            kitchenStaff: 'Nhà bếp',
        };
        return roles[role] || role;
    };

    // ---- Fetch employees from API ----
    const fetchEmployees = useCallback(async (page = 1, limit = 20, search = '', status = 'active') => {
        setLoading(true);
        try {
            const params = { page, limit };
            if (search) params.search = search;
            if (status) params.status = status;

            const res = await getEmployees(params);
            const json = res.data;

            const mapped = json.data.map((emp) => ({
                key: emp._id,
                _id: emp._id,
                photo: emp.photo || '',
                code: emp.code || '',
                workerCode: '',
                name: emp.fullName,
                phone: emp.phone || '',
                idNumber: emp.idNumber || '',
                debt: '0',
                branch: '',
                birthDate: emp.birthDate ? new Date(emp.birthDate).toLocaleDateString('vi-VN') : '',
                gender: emp.gender || '',
                position: getPositionByRole(emp.role),
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
        fetchEmployees(pagination.page, pagination.limit, searchText, statusFilter);
    }, []);

    // ---- Filter change from EmployeeFilters ----
    const handleFilterChange = (newFilters) => {
        setSearchText(newFilters.search || '');
        if (newFilters.status !== undefined) {
            setStatusFilter(newFilters.status);
        }
    };

    // ---- Search with debounce ----
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEmployees(1, pagination.limit, searchText, statusFilter);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchText, statusFilter]);

    // ---- Pagination change ----
    const handlePageChange = (page, pageSize) => {
        fetchEmployees(page, pageSize, searchText, statusFilter);
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
                await updateEmployee(editingEmployee._id, data);
                message.success('Cập nhật nhân viên thành công!');
            } else {
                await createEmployee(data);
                message.success('Thêm nhân viên thành công!');
            }
            setIsModalOpen(false);
            setEditingEmployee(null);
            fetchEmployees(pagination.page, pagination.limit, searchText, statusFilter);
        } catch (err) {
            message.error(err.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    // ---- Deactivate Employee via API (soft delete) ----
    const handleDeactivateEmployee = async (key) => {
        try {
            const emp = employees.find((e) => e.key === key);
            if (!emp) return;

            await deleteEmployee(emp._id);
            message.success('Đã cho nhân viên ngừng làm việc!');

            fetchEmployees(pagination.page, pagination.limit, searchText, statusFilter);
        } catch (err) {
            message.error(err.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    return (
        <div className="min-h-screen py-6">
            <div className="max-w-[80vw] mx-auto h-full">
                <Row gutter={24} className="h-full">
                    {/* LEFT FILTER */}
                    <Col span={5} className="h-full overflow-y-auto">
                        <EmployeeFilters onFilterChange={handleFilterChange} />
                    </Col>

                    {/* RIGHT CONTENT */}
                    <Col span={19} className="h-full">
                        <div className="bg-white rounded-lg shadow-sm h-full flex flex-col overflow-hidden">
                            <EmployeeList
                                employees={employees}
                                visibleColumns={visibleColumns}
                                onEdit={handleEditEmployee}
                                onDelete={handleDeactivateEmployee}
                                onOpenAddModal={handleOpenAddModal}
                                onToggleColumn={handleToggleColumn}
                                loading={loading}
                                pagination={pagination}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </Col>
                </Row>
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
        </div>
    );
}
