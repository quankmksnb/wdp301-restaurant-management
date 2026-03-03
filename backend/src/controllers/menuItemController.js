import MenuItem from "../models/MenuItem.js";
import MenuCategory from "../models/MenuCategory.js";

// CREATE MENU ITEM
export const createMenuItem = async (req, res) => {
    try {
        const {
            itemName,
            productCode,
            price,
            costPrice,
            description,
            availabilityStatus,
            images,
            category,
        } = req.body;

        // VALIDATE CATEGORY
        if (!category) {
            return res.status(400).json({ message: "Vui lòng chọn danh mục" });
        }

        const categoryExists = await MenuCategory.findById(category);

        if (!categoryExists) {
            return res.status(400).json({ message: "Danh mục không tồn tại" });
        }

        if (!categoryExists.parentId) {
            return res.status(400).json({
                message: "Không thể gắn sản phẩm vào danh mục cha",
            });
        }

        if (categoryExists.status !== "active") {
            return res.status(400).json({
                message: "Danh mục đang bị khóa",
            });
        }

        // VALIDATE PRODUCT CODE
        if (!productCode) {
            return res.status(400).json({ message: "Vui lòng nhập mã sản phẩm" });
        }

        const trimmedCode = productCode.trim();

        const existingCode = await MenuItem.findOne({
            productCode: trimmedCode,
        });

        if (existingCode) {
            return res.status(400).json({
                message: "Mã sản phẩm đã tồn tại",
            });
        }

        // VALIDATE PRICE
        if (!price || price <= 0) {
            return res.status(400).json({
                message: "Giá bán phải lớn hơn 0",
            });
        }

        if (costPrice && costPrice < 0) {
            return res.status(400).json({
                message: "Giá vốn không hợp lệ",
            });
        }

        // CREATE ITEM
        const item = await MenuItem.create({
            itemName,
            productCode: trimmedCode,
            price,
            costPrice,
            description,
            availabilityStatus,
            images,
            category,
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ALL MENU ITEMS (search + filter + pagination)
export const getAllMenuItems = async (req, res) => {
    try {
        const { search, category, status, page = 1, limit = 10 } = req.query;

        const currentPage = Math.max(parseInt(page) || 1, 1);
        const pageSize = Math.max(parseInt(limit) || 10, 1);

        let filter = {};

        // SEARCH
        if (search) {
            filter.$or = [
                { itemName: { $regex: search, $options: "i" } },
                { productCode: { $regex: search, $options: "i" } },
            ];
        }

        // FILTER CATEGORY (cha hoặc con)
        if (category) {
            const currentCategory = await MenuCategory.findById(category);

            if (!currentCategory) {
                return res.status(400).json({
                    message: "Danh mục không tồn tại",
                });
            }

            // Nếu là category cha
            if (!currentCategory.parentId) {
                const children = await MenuCategory.find({
                    parentId: currentCategory._id,
                });

                const childIds = children.map((c) => c._id);

                filter.category = { $in: childIds };
            } else {
                filter.category = category;
            }
        }

        // FILTER STATUS
        if (status) {
            filter.availabilityStatus = status;
        }

        const totalItems = await MenuItem.countDocuments(filter);

        const items = await MenuItem.find(filter)
            .populate("category", "categoryName parentId")
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize);

        res.json({
            data: items,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / pageSize),
                currentPage,
                pageSize,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//GET MENU ITEM BY ID
export const getMenuItemById = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id)
            .populate("category", "categoryName parentId");

        if (!item) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm",
            });
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//UPDATE MENU ITEM
export const updateMenuItem = async (req, res) => {
    try {
        const {
            itemName,
            productCode,
            price,
            costPrice,
            description,
            availabilityStatus,
            images,
            category,
        } = req.body;

        let updateData = {
            itemName,
            productCode,
            price,
            costPrice,
            description,
            availabilityStatus,
            images,
        };

        // Nếu có thay đổi category thì validate
        if (category) {
            const categoryExists = await MenuCategory.findById(category);

            if (!categoryExists) {
                return res.status(400).json({
                    message: "Danh mục không tồn tại",
                });
            }

            if (!categoryExists.parentId) {
                return res.status(400).json({
                    message: "Không thể gắn vào danh mục cha",
                });
            }

            if (categoryExists.status !== "active") {
                return res.status(400).json({
                    message: "Danh mục đang bị khóa",
                });
            }

            updateData.category = category;
        }

        const updated = await MenuItem.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm",
            });
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE MENU ITEM
export const deleteMenuItem = async (req, res) => {
    try {
        const deleted = await MenuItem.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm",
            });
        }

        res.json({ message: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};