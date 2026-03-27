import MenuCategory from "../models/MenuCategory.js";
import MenuItem from "../models/MenuItem.js";
import mongoose from "mongoose";

// Tạo danh mục con mới
export const createCategory = async (req, res) => {
    try {
        let { categoryName, description, parentId, status } = req.body;

        // 1. Validate input
        if (!categoryName || !categoryName.trim()) {
            return res.status(400).json({
                success: false,
                message: "Tên danh mục là bắt buộc",
            });
        }

        if (!parentId) {
            return res.status(400).json({
                success: false,
                message: "Chỉ được tạo danh mục con",
            });
        }

        // normalize
        categoryName = categoryName.trim();
        description = description?.trim() || "";

        // 2. Check parent tồn tại + chỉ 2 cấp
        const parent = await MenuCategory.findById(parentId).lean();

        if (!parent) {
            return res.status(400).json({
                success: false,
                message: "Danh mục cha không tồn tại",
            });
        }

        if (parent.parentId) {
            return res.status(400).json({
                success: false,
                message: "Chỉ cho phép 2 cấp danh mục",
            });
        }

        // 3. Check trùng tên trong cùng parent
        const existing = await MenuCategory.findOne({
            parentId,
            categoryName: {
                $regex: new RegExp(`^${categoryName}$`, "i"),
            },
        }).lean();

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Danh mục đã tồn tại trong nhóm này",
            });
        }

        // 4. Create
        const newCategory = await MenuCategory.create({
            categoryName,
            description,
            parentId,
            status: status || "active",
        });

        return res.status(201).json({
            success: true,
            data: newCategory,
        });
    } catch (error) {
        console.error("Create category error:", error);

        return res.status(500).json({
            success: false,
            message: "Lỗi server",
        });
    }
};

// Tạo danh mục cha mới
export const createParentCategory = async (req, res) => {
    try {
        const { categoryName, description } = req.body;

        // 1. Validate
        if (!categoryName) {
            return res.status(400).json({
                success: false,
                message: "Tên danh mục là bắt buộc",
            });
        }

        // 2. Check trùng tên 
        const existing = await MenuCategory.findOne({
            categoryName,
            parentId: null,
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Danh mục cha đã tồn tại",
            });
        }

        const newCategory = await MenuCategory.create({
            categoryName,
            description,
            parentId: null,
        });

        return res.status(201).json({
            success: true,
            data: newCategory,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server",
        });
    }
};

// Lấy tất cả danh mục với filter và phân trang
export const getAllCategories = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const currentPage = parseInt(page);
        const pageSize = parseInt(limit);

        let filter = {};

        if (status) {
            filter.status = status;
        }

        const total = await MenuCategory.countDocuments(filter);

        const categories = await MenuCategory.find(filter)
            .populate("parentId", "categoryName")
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize);

        res.json({
            data: categories,
            pagination: {
                total,
                totalPages: Math.ceil(total / pageSize),
                currentPage,
                pageSize,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy cây danh mục (danh mục cha + con)
export const getCategoryTree = async (req, res) => {
    try {
        const categories = await MenuCategory.find();

        const parents = categories.filter(c => !c.parentId);

        const result = parents.map(parent => ({
            ...parent.toObject(),
            children: categories.filter(
                c => c.parentId && c.parentId.toString() === parent._id.toString()
            )
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật danh mục
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        let { categoryName, description, status, parentId } = req.body;

        const category = await MenuCategory.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy danh mục",
            });
        }

        // normalize
        if (categoryName) categoryName = categoryName.trim();
        if (description) description = description.trim();

        // xác định parent mới (nếu có thay đổi)
        const newParentId =
            parentId !== undefined ? (parentId || null) : category.parentId;

        // Nếu có đổi parent → validate
        if (parentId !== undefined) {
            if (newParentId) {
                const parent = await MenuCategory.findById(newParentId).lean();

                if (!parent) {
                    return res.status(400).json({
                        success: false,
                        message: "Danh mục cha không tồn tại",
                    });
                }

                if (parent.parentId) {
                    return res.status(400).json({
                        success: false,
                        message: "Chỉ cho phép 2 cấp danh mục",
                    });
                }
            }
        }

        // Check trùng tên trong cùng parent
        if (categoryName) {
            const existing = await MenuCategory.findOne({
                _id: { $ne: id }, // 👈 loại trừ chính nó
                parentId: newParentId,
                categoryName: {
                    $regex: new RegExp(`^${escapeRegex(categoryName)}$`, "i"),
                },
            }).lean();

            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: "Danh mục đã tồn tại trong nhóm này",
                });
            }
        }

        // Update thông tin 
        if (categoryName) category.categoryName = categoryName;
        if (description !== undefined) category.description = description;
        if (parentId !== undefined) category.parentId = newParentId;

        let categoryIdsToUpdate = [];

        // Nếu status thay đổi → cascade
        if (status && status !== category.status) {
            category.status = status;

            categoryIdsToUpdate.push(category._id);

            // Nếu là category CHA → update tất cả con
            if (!category.parentId) {
                const childCategories = await MenuCategory.find(
                    { parentId: category._id },
                    { _id: 1 }
                ).lean();

                const childIds = childCategories.map((c) => c._id);

                if (childIds.length) {
                    await MenuCategory.updateMany(
                        { _id: { $in: childIds } },
                        { $set: { status } }
                    );

                    categoryIdsToUpdate.push(...childIds);
                }
            }

            // Update item theo category
            const itemStatus =
                status === "inactive" ? "unavailable" : "available";

            await MenuItem.updateMany(
                { category: { $in: categoryIdsToUpdate } },
                { $set: { availabilityStatus: itemStatus } }
            );
        }

        await category.save();

        return res.json({
            success: true,
            data: category,
        });
    } catch (error) {
        console.error("Update category error:", error);

        return res.status(500).json({
            success: false,
            message: "Lỗi server",
        });
    }
};

// Xóa danh mục
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await MenuCategory.findById(id);

        if (!category) {
            return res.status(404).json({ message: "Không tìm thấy danh mục" });
        }

        // Không cho xóa danh mục cha
        if (!category.parentId) {
            return res.status(400).json({
                message: "Không được xóa danh mục cha",
            });
        }

        // Kiểm tra còn menu item không
        const itemExists = await MenuItem.exists({ category: id });

        if (itemExists) {
            return res.status(400).json({
                message: "Không thể xóa vì còn sản phẩm thuộc danh mục",
            });
        }

        await category.deleteOne();

        res.json({ message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách category con theo parentId
export const getChildCategories = async (req, res) => {
    try {
        const { parentId } = req.query;

        const filter = {
            parentId: { $ne: null }, // chỉ lấy category con
            status: "active"
        };

        // nếu truyền parentId thì chỉ lấy con của category đó
        if (parentId) {
            filter.parentId = parentId;
        }

        const categories = await MenuCategory.find(filter)
            .populate("parentId", "categoryName")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const escapeRegex = (text) =>
    text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");