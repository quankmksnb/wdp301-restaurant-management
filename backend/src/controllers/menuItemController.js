import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import MenuItem from "../models/MenuItem.js";
import MenuCategory from "../models/MenuCategory.js";
import Order from "../models/Order.js";
import { url } from "inspector";
import {
  getPublicIdFromUrl,
  uploadMultipleToCloudinary,
} from "../utils/cloudinaryUpload.js";
import cloudinary from "../configs/cloudinary.js";

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
      category,
    } = req.body;

    /* ================= VALIDATE CATEGORY ================= */

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

    /* ================= VALIDATE PRODUCT CODE ================= */

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

    /* ================= VALIDATE PRICE ================= */

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

    /* ================= HANDLE IMAGE UPLOAD ================= */

    // let imagePaths = [];

    // if (req.files && req.files.length > 0) {
    //     imagePaths = req.files.map(
    //         (file) => `/uploads/${file.filename}`
    //     );
    // }

    // By cloundinary
    let images = [];

    if (req.files && req.files.length > 0) {
      const uploadResults = await uploadMultipleToCloudinary(
        req.files,
        "rms/menu-items",
      );

      images = uploadResults.map((item) => item.secure_url);
    }

    /* ================= CREATE ITEM ================= */

    const item = await MenuItem.create({
      itemName,
      productCode: trimmedCode,
      price,
      costPrice,
      description,
      availabilityStatus,
      images: images,
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
    const item = await MenuItem.findById(req.params.id).populate(
      "category",
      "categoryName parentId",
    );

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
      category,
    } = req.body;

    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    /* ================= VALIDATE PRODUCT CODE ================= */

    if (productCode && productCode.trim() !== item.productCode) {
      const existingCode = await MenuItem.findOne({
        productCode: productCode.trim(),
      });

      if (existingCode) {
        return res.status(400).json({
          message: "Mã sản phẩm đã tồn tại",
        });
      }

      item.productCode = productCode.trim();
    }

    /* ================= VALIDATE CATEGORY ================= */

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

      item.category = category;
    }

    /* ================= HANDLE IMAGE UPDATE ================= */

    // if (req.files && req.files.length > 0) {
    //     // XÓA ẢNH CŨ
    //     if (item.images && item.images.length > 0) {
    //         item.images.forEach((imgPath) => {
    //             const fullPath = path.join(
    //                 process.cwd(),
    //                 imgPath
    //             );

    //             if (fs.existsSync(fullPath)) {
    //                 fs.unlinkSync(fullPath);
    //             }
    //         });
    //     }

    //     // LƯU ẢNH MỚI
    //     item.images = req.files.map(
    //         (file) => `/uploads/${file.filename}`
    //     );
    // }

    // Cloudinay
    if (req.files && req.files.length > 0) {
      try {
        // A. Xóa ảnh cũ trên Cloudinary (nếu có)
        if (item.images && item.images.length > 0) {
          const deletePromises = item.images.map((url) => {
            const publicId = getPublicIdFromUrl(url, "rms/menu-items");
            return cloudinary.uploader.destroy(publicId);
          });
          await Promise.all(deletePromises);
        }

        // B. Tải ảnh mới lên Cloudinary
        const uploadResults = await uploadMultipleToCloudinary(
          req.files,
          "rms/menu-items",
        );

        // C. Cập nhật mảng images mới vào object item
        item.images = uploadResults.map((result) => result.secure_url);
      } catch (uploadError) {
        return res.status(500).json({
          message: "Lỗi khi xử lý hình ảnh: " + uploadError.message,
        });
      }
    }

    /* ================= UPDATE OTHER FIELDS ================= */

    if (itemName) item.itemName = itemName;
    if (price) item.price = price;
    if (costPrice >= 0) item.costPrice = costPrice;
    if (description) item.description = description;
    if (availabilityStatus) item.availabilityStatus = availabilityStatus;

    await item.save();

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE MENU ITEM
export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    // XÓA FILE ẢNH
    // if (item.images && item.images.length > 0) {
    //     item.images.forEach((imgPath) => {
    //         const fullPath = path.join(
    //             process.cwd(),
    //             imgPath
    //         );

    //         if (fs.existsSync(fullPath)) {
    //             fs.unlinkSync(fullPath);
    //         }
    //     });
    // }

    /* ================= XÓA ẢNH TRÊN CLOUDINARY ================= */
    // Kiểm tra nếu sản phẩm có mảng images và mảng không rỗng
    if (item.images && item.images.length > 0) {
      const deletePromises = item.images.map((url) => {
        const publicId = getPublicIdFromUrl(url, "rms/menu-items");
        return cloudinary.uploader.destroy(publicId);
      });
      await Promise.all(deletePromises);
    }

    await item.deleteOne();

    res.json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TOGGLE AVAILABILITY STATUS
export const toggleAvailabilityStatus = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate("category");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    const newStatus =
      item.availabilityStatus === "available" ? "unavailable" : "available";

    // ✅ Nếu muốn tắt available (unavailable), check order
    if (newStatus === "unavailable") {
      // Tìm orders đang pre-order hoặc active có chứa item này
      const activeOrders = await Order.findOne({
        orderStatus: { $in: ["pre-order", "active"] },
        "subOrders.items.menuItem": item._id,
        "subOrders.items.status": { $nin: ["cancelled", "out_of_stock"] },
      });

      if (activeOrders) {
        return res.status(400).json({
          success: false,
          message:
            "Không thể ngừng bán món này vì còn đơn hàng đang xử lý chứa sản phẩm này",
          data: item,
        });
      }
    }

    // ✅ Nếu muốn bật available nhưng category inactive
    if (newStatus === "available" && item.category.status === "inactive") {
      return res.status(400).json({
        success: false,
        message: "Danh mục đang bị khóa, không thể bật bán sản phẩm",
        data: item,
      });
    }

    item.availabilityStatus = newStatus;
    await item.save();

    res.json({
      success: true,
      message: `Đã chuyển trạng thái sang "${item.availabilityStatus}"`,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// lấy item theo category con
export const getMenuItemsByChildCategory = async (req, res) => {
  try {
    const { category, search } = req.query;

    const filter = {};

    // lọc theo category con
    if (category) {
      filter.category = new mongoose.Types.ObjectId(category);
    }

    // chỉ lấy món đang bán
    filter.availabilityStatus = { $ne: "unavailable" };

    // search theo tên món
    if (search) {
      filter.itemName = { $regex: search, $options: "i" };
    }

    const items = await MenuItem.find(filter)
      .populate("category", "categoryName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
