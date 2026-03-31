import api from './api';

/**
 * Lấy danh sách nhân viên (phân trang + tìm kiếm + lọc)
 * @param {Object} params - { page, limit, search, department, position, status }
 */
export const getEmployees = (params = {}) => {
    return api.get("/employees", { params });
};

/**
 * Lấy chi tiết nhân viên theo ID
 */
export const getEmployeeById = (id) => {
    return api.get(`/employees/${id}`);
};

/**
 * Tạo nhân viên mới
 */
export const createEmployee = (data) => {
    return api.post("/employees", data);
};

/**
 * Cập nhật nhân viên
 */
export const updateEmployee = (id, data) => {
    return api.put(`/employees/${id}`, data);
};

/**
 * Xóa nhân viên (soft delete)
 */
export const deleteEmployee = (id) => {
    return api.delete(`/employees/${id}`);
};
