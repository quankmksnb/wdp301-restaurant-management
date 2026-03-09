import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // ← Nếu body là FormData → xóa Content-Type
        // để browser/axios tự set multipart/form-data + boundary đúng
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor response
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// ===================== Employee API =====================

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
 * @param {Object} data - { name, phone, role, password, code, ... }
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

export default api;