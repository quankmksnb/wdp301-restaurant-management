import Table from "../models/Table.js";
import Area from "../models/Area.js";

export const createTable = async (req, res) => {
  try {
    const { tableName, tableNumber, capacity, area, note } = req.body;

    const existed = await Table.findOne({
      tableName,
      area,
    });

    if (existed) {
      return res.status(400).json({
        success: false,
        message: "Tên bàn đã tồn tại trong khu vực này",
      });
    }

    const table = await Table.create({
      tableName,
      tableNumber,
      capacity,
      area,
      note,
    });

    res.status(201).json({
      success: true,
      message: "Tạo bàn thành công",
      data: table,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo bàn",
      error: error.message,
    });
  }
};

export const getTables = async (req, res) => {
  try {
    const { page = 1, limit = 10, area, status, search } = req.query;

    const filter = {};

    // filter area
    if (area && area !== "all") {
      filter.area = area;
    }

    // filter status
    if (status && status !== "all") {
      filter.tableStatus = status;
    }

    // search tableName
    if (search) {
      filter.tableName = {
        $regex: search,
        $options: "i",
      };
    }

    const skip = (page - 1) * limit;

    const tables = await Table.find(filter)
      .populate("area", "areaName")
      .sort({ tableNumber: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Table.countDocuments(filter);

    res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data: tables,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách bàn",
    });
  }
};

export const getTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id).populate(
      "area",
      "areaName",
    );

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bàn",
      });
    }

    res.json({
      success: true,
      data: table,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy bàn",
    });
  }
};

export const updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bàn",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật bàn thành công",
      data: table,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật bàn",
    });
  }
};

export const toggleTableStatus = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bàn",
      });
    }

    table.tableStatus = table.tableStatus === "active" ? "inactive" : "active";

    await table.save();

    res.json({
      success: true,
      message: "Cập nhật trạng thái bàn thành công",
      data: table,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật trạng thái",
    });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bàn",
      });
    }

    await Table.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Xóa bàn thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa bàn",
    });
  }
};
