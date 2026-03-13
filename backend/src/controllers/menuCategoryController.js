import MenuCategory from "../models/MenuCategory.js";
import MenuItem from "../models/MenuItem.js";


// Tạo danh mục mới
export const createCategory = async (req, res) => {
    try {
        const { categoryName, description, parentId, status } = req.body;

        if (!parentId) {
            return res.status(400).json({
                message: "Chỉ được tạo danh mục con",
            });
        }

        const parent = await MenuCategory.findById(parentId);

        if (!parent) {
            return res.status(400).json({
                message: "Danh mục cha không tồn tại",
            });
        }

        if (parent.parentId) {
            return res.status(400).json({
                message: "Chỉ cho phép 2 cấp danh mục",
            });
        }

        const category = await MenuCategory.create({
            categoryName,
            description,
            parentId,
            status,
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
        const { categoryName, description, status, parentId } = req.body;

        const category = await MenuCategory.findById(id);

        if (!category) {
            return res.status(404).json({ message: "Không tìm thấy danh mục" });
        }

        // update thông tin cơ bản
        category.categoryName = categoryName ?? category.categoryName;
        category.description = description ?? category.description;
        category.parentId =
            parentId !== undefined ? (parentId || null) : category.parentId;

        let categoryIdsToUpdate = [];

        // Nếu status thay đổi
        if (status && status !== category.status) {
            category.status = status;

            // luôn thêm chính nó
            categoryIdsToUpdate.push(category._id);

            // Nếu là category CHA → lấy tất cả con
            if (!category.parentId) {
                const childCategories = await MenuCategory.find(
                    { parentId: category._id },
                    { _id: 1 }
                );

                const childIds = childCategories.map(c => c._id);

                if (childIds.length) {
                    // update status category con
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

        res.json(category);

    } catch (error) {
        res.status(500).json({ message: error.message });
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