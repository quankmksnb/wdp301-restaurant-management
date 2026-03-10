import User from "../models/User.js";

/**
 * Generate next employee code: NV000001, NV000002, ...
 */
async function generateEmployeeCode() {
    const lastEmployee = await User.findOne({ code: { $exists: true, $ne: null } })
        .sort({ code: -1 })
        .select("code");

    if (!lastEmployee || !lastEmployee.code) {
        return "NV000001";
    }

    const lastNumber = parseInt(lastEmployee.code.replace("NV", ""), 10);
    const nextNumber = lastNumber + 1;
    return `NV${String(nextNumber).padStart(6, "0")}`;
}

/**
 * POST /api/employees
 * Create a new employee
 */
export const createEmployee = async (req, res) => {
    try {
        const {
            name,
            phone,
            role,
            password,
            code,
            idNumber,
            birthDate,
            gender,
            department,
            position,
            startDate,
            email,
            facebook,
            address,
            city,
            notes,
        } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Tên nhân viên là bắt buộc" });
        }

        // Auto-generate code if not provided
        const employeeCode = code || (await generateEmployeeCode());

        // Check duplicate code
        const existingCode = await User.findOne({ code: employeeCode });
        if (existingCode) {
            return res.status(400).json({ message: `Mã nhân viên ${employeeCode} đã tồn tại` });
        }

        // Check duplicate email
        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: `Email ${email} đã được sử dụng` });
            }
        }

        // Check duplicate phone
        if (phone) {
            const existingPhone = await User.findOne({ phone });
            if (existingPhone) {
                return res.status(400).json({ message: `Số điện thoại ${phone} đã được sử dụng` });
            }
        }

        // Check duplicate idNumber (only if not empty)
        if (idNumber) {
            const existingIdNumber = await User.findOne({ idNumber });
            if (existingIdNumber) {
                return res.status(400).json({ message: `Số CMND/CCCD ${idNumber} đã được sử dụng` });
            }
        }

        // Handle photo upload
        const photo = req.file ? `/uploads/${req.file.filename}` : undefined;

        const employee = new User({
            code: employeeCode,
            fullName: name,
            password: password || "123456",
            role: role || "waiter",
            phone,
            idNumber,
            birthDate: birthDate || undefined,
            gender,
            department,
            position,
            startDate: startDate || undefined,
            email,
            facebook,
            address,
            city,
            notes,
            photo,
        });

        await employee.save();

        // Return without password
        const result = employee.toObject();
        delete result.password;

        res.status(201).json(result);
    } catch (error) {
        console.error("Create employee error:", error);
        res.status(500).json({ message: "Lỗi tạo nhân viên", error: error.message });
    }
};

/**
 * GET /api/employees
 * List employees with pagination, search, and filters
 * Query params: page, limit, search, department, position, status
 */
export const getEmployees = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            search = "",
            department,
            position,
            status,
        } = req.query;

        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));

        // Build filter
        const filter = {};

        if (search) {
            filter.$or = [
                { fullName: { $regex: search, $options: "i" } },
                { code: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ];
        }

        if (department) filter.department = department;
        if (position) filter.position = position;
        if (status) {
            filter.status = status;
        } else {
            filter.status = "active"; // Default: only active employees
        }

        const [employees, total] = await Promise.all([
            User.find(filter)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum),
            User.countDocuments(filter),
        ]);

        res.json({
            data: employees,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        console.error("Get employees error:", error);
        res.status(500).json({ message: "Lỗi lấy danh sách nhân viên", error: error.message });
    }
};

/**
 * GET /api/employees/:id
 * Get single employee detail
 */
export const getEmployeeById = async (req, res) => {
    try {
        const employee = await User.findById(req.params.id).select("-password");
        if (!employee) {
            return res.status(404).json({ message: "Không tìm thấy nhân viên" });
        }
        res.json(employee);
    } catch (error) {
        console.error("Get employee error:", error);
        res.status(500).json({ message: "Lỗi lấy thông tin nhân viên", error: error.message });
    }
};

/**
 * PUT /api/employees/:id
 * Update employee
 */
export const updateEmployee = async (req, res) => {
    try {
        const { name, phone, role, password, idNumber, birthDate, gender, department, position, startDate, facebook, address, city, notes } = req.body;

        const employee = await User.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Không tìm thấy nhân viên" });
        }

        // Check duplicate phone (exclude current employee)
        if (phone !== undefined && phone) {
            const existingPhone = await User.findOne({ phone, _id: { $ne: employee._id } });
            if (existingPhone) {
                return res.status(400).json({ message: `Số điện thoại ${phone} đã được sử dụng` });
            }
        }

        // Check duplicate idNumber (exclude current employee, skip if empty)
        if (idNumber !== undefined && idNumber) {
            const existingIdNumber = await User.findOne({ idNumber, _id: { $ne: employee._id } });
            if (existingIdNumber) {
                return res.status(400).json({ message: `Số CMND/CCCD ${idNumber} đã được sử dụng` });
            }
        }

        // Update fields if provided (email is NOT updatable)
        if (name !== undefined) employee.fullName = name;
        if (phone !== undefined) employee.phone = phone;
        if (role !== undefined) employee.role = role;
        if (password) employee.password = password; // will be hashed by pre-save hook
        if (idNumber !== undefined) employee.idNumber = idNumber;
        if (birthDate !== undefined) employee.birthDate = birthDate || undefined;
        if (gender !== undefined) employee.gender = gender;
        if (department !== undefined) employee.department = department;
        if (position !== undefined) employee.position = position;
        if (startDate !== undefined) employee.startDate = startDate || undefined;
        if (facebook !== undefined) employee.facebook = facebook;
        if (address !== undefined) employee.address = address;
        if (city !== undefined) employee.city = city;
        if (notes !== undefined) employee.notes = notes;

        // Handle photo upload
        if (req.file) {
            employee.photo = `/uploads/${req.file.filename}`;
        }

        await employee.save();

        const result = employee.toObject();
        delete result.password;

        res.json(result);
    } catch (error) {
        console.error("Update employee error:", error);
        res.status(500).json({ message: "Lỗi cập nhật nhân viên", error: error.message });
    }
};

/**
 * DELETE /api/employees/:id
 * Soft delete — set status to inactive
 */
export const deleteEmployee = async (req, res) => {
    try {
        const employee = await User.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Không tìm thấy nhân viên" });
        }

        employee.status = "inactive";
        await employee.save();

        res.json({ message: "Nhân viên đã được ngừng làm việc" });
    } catch (error) {
        console.error("Delete employee error:", error);
        res.status(500).json({ message: "Lỗi xóa nhân viên", error: error.message });
    }
};
