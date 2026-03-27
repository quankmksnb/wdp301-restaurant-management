import User from "../../models/User.js";
import { registerExporter } from "../exportService.js";

/**
 * Employee exporter configuration.
 * Registers itself with the generic export service.
 */

const roleLabels = {
    waiter: "Phục vụ",
    receptionist: "Lễ tân",
    kitchenStaff: "Nhà bếp",
    manager: "Quản lý",
};

const statusLabels = {
    active: "Đang làm việc",
    inactive: "Đã nghỉ",
};

const employeeExporter = {
    sheetName: "Danh sách nhân viên",

    columns: [
        { header: "STT", key: "stt", width: 6 },
        { header: "Mã nhân viên", key: "code", width: 16 },
        { header: "Tên nhân viên", key: "fullName", width: 25 },
        { header: "Số điện thoại", key: "phone", width: 16 },
        { header: "Email", key: "email", width: 28 },
        { header: "Số CMND/CCCD", key: "idNumber", width: 18 },
        { header: "Giới tính", key: "gender", width: 12 },
        { header: "Ngày sinh", key: "birthDate", width: 14 },
        { header: "Vai trò", key: "role", width: 14 },
        { header: "Ngày bắt đầu", key: "startDate", width: 14 },
        { header: "Địa chỉ", key: "address", width: 30 },
        { header: "Trạng thái", key: "status", width: 16 },
    ],

    async fetchData(filters = {}) {
        const query = {};

        if (filters.search) {
            query.$or = [
                { fullName: { $regex: filters.search, $options: "i" } },
                { code: { $regex: filters.search, $options: "i" } },
                { phone: { $regex: filters.search, $options: "i" } },
            ];
        }

        if (filters.status) {
            query.status = filters.status;
        }

        const employees = await User.find(query)
            .select("-password")
            .sort({ createdAt: -1 });

        return employees.map((emp, index) => ({
            stt: index + 1,
            code: emp.code || "",
            fullName: emp.fullName || "",
            phone: emp.phone || "",
            email: emp.email || "",
            idNumber: emp.idNumber || "",
            gender: emp.gender || "",
            birthDate: emp.birthDate
                ? new Date(emp.birthDate).toLocaleDateString("vi-VN")
                : "",
            role: roleLabels[emp.role] || emp.role || "",
            startDate: emp.startDate
                ? new Date(emp.startDate).toLocaleDateString("vi-VN")
                : "",
            address: emp.address || "",
            status: statusLabels[emp.status] || emp.status || "",
        }));
    },
};

// Register with the export service
registerExporter("employees", employeeExporter);

export default employeeExporter;
