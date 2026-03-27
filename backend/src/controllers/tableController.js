import mongoose from "mongoose";
import Table from "../models/Table.js";
import Order from "../models/Order.js";
import Area from "../models/Area.js";
import Reservation from "../models/Reservation.js";

export const createTable = async (req, res) => {
  try {
    const { tableName, tableNumber, capacity, area, note } = req.body;

    const existed = await Table.findOne({
      tableName: { $regex: `^${tableName.trim()}$`, $options: "i" },
      area,
    });

    if (existed) {
      return res.status(400).json({
        success: false,
        message: "Tên bàn đã tồn tại trong khu vực này",
      });
    }

    const table = await Table.create({
      tableName: tableName.trim(),
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
    const { tableName, area, ...rest } = req.body;
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bàn",
      });
    }

    // Nếu có update tableName → check trùng trong cùng khu vực
    if (tableName !== undefined) {
      const targetArea = area ?? table.area;

      const existed = await Table.findOne({
        tableName: { $regex: `^${tableName.trim()}$`, $options: "i" },
        area: targetArea,
        _id: { $ne: table._id },
      });

      if (existed) {
        return res.status(400).json({
          success: false,
          message: "Tên bàn đã tồn tại trong khu vực này",
        });
      }

      table.tableName = tableName.trim();
    }

    if (area !== undefined) table.area = area;

    // Gán các field còn lại
    const allowedFields = ["tableNumber", "capacity", "note"];
    allowedFields.forEach((field) => {
      if (rest[field] !== undefined) table[field] = rest[field];
    });

    await table.save();

    res.json({
      success: true,
      message: "Cập nhật bàn thành công",
      data: table,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật bàn",
      error: error.message,
    });
  }
};

export const toggleTableStatus = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id).populate("area");

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bàn",
      });
    }

    if (
      table.tableStatus === "inactive" &&
      table.area?.areaStatus === "inactive"
    ) {
      return res.status(400).json({
        success: false,
        message: `Khu vực "${table.area.areaName}" đang ngừng hoạt động, không thể kích hoạt lại bàn này`,
      });
    }

    //  Chỉ chặn khi chuyển từ active → inactive
    if (table.tableStatus === "active") {
      const activeReservation = await Reservation.findOne({
        tables: table._id,
        status: { $in: ["confirmed", "seated"] },
      });

      if (activeReservation) {
        return res.status(400).json({
          success: false,
          message:
            "Bàn này đang có đặt chỗ chưa hoàn thành, không thể ngừng hoạt động",
        });
      }
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

// Lấy danh sách bàn theo khu vực
export const getTableByArea = async (req, res) => {
  try {
    const { area } = req.query;

    const filter = {};

    if (area) {
      if (!mongoose.Types.ObjectId.isValid(area)) {
        return res.status(400).json({
          success: false,
          message: "AreaId không hợp lệ",
        });
      }
      filter.area = new mongoose.Types.ObjectId(area);
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const tables = await Table.aggregate([
      { $match: filter },

      // ================== ORDER ==================
      {
        $lookup: {
          from: "orders",
          let: { tableId: "$_id" },
          pipeline: [
            {
              $match: {
                orderStatus: { $in: ["pre-order", "active"] },
              },
            },

            {
              $lookup: {
                from: "reservations",
                localField: "reservation",
                foreignField: "_id",
                as: "reservationData",
              },
            },
            {
              $unwind: {
                path: "$reservationData",
                preserveNullAndEmptyArrays: true,
              },
            },

            { $unwind: "$subOrders" },
            {
              $match: {
                $expr: {
                  $eq: ["$subOrders.table", "$$tableId"],
                },
              },
            },

            {
              $match: {
                $or: [
                  {
                    orderStatus: "active",
                  },

                  {
                    orderStatus: "pre-order",
                    "reservationData.status": "confirmed",
                    "reservationData.reservationDateTime": {
                      $gte: startOfDay,
                      $lte: endOfDay,
                    },
                  },
                ],
              },
            },

            // thêm priority
            {
              $addFields: {
                priority: {
                  $cond: [
                    { $eq: ["$orderStatus", "active"] },
                    0, // active ưu tiên cao nhất
                    1  // pre-order
                  ]
                }
              }
            },

            // sort theo priority trước
            {
              $sort: {
                priority: 1,
                createdAt: -1
              }
            },

            {
              $project: {
                _id: 1,
                orderStatus: 1,
                subOrderId: "$subOrders._id",
                subTotalAmount: "$subOrders.subTotalAmount",
                reservationDateTime: "$reservationData.reservationDateTime",
              },
            },
          ],
          as: "orderData",
        },
      },

      // ================== RESERVATION ONLY ==================
      {
        $lookup: {
          from: "reservations",
          let: { tableId: "$_id" },
          pipeline: [
            {
              $match: {
                reservationDateTime: {
                  $gte: startOfDay,
                  $lte: endOfDay,
                },
                status: { $in: ["confirmed", "seated"] },
              },
            },
            {
              $match: {
                $expr: {
                  $in: ["$$tableId", "$tables"],
                },
              },
            },
            { $sort: { reservationDateTime: 1 } },
          ],
          as: "reservationOnly",
        },
      },

      // ================== MAP ==================
      {
        $addFields: {
          hasOrder: { $gt: [{ $size: "$orderData" }, 0] },
          hasReservationOnly: {
            $gt: [{ $size: "$reservationOnly" }, 0],
          },

          orderId: {
            $ifNull: [{ $arrayElemAt: ["$orderData._id", 0] }, null],
          },
          subOrderId: {
            $ifNull: [{ $arrayElemAt: ["$orderData.subOrderId", 0] }, null],
          },
          subTotalAmount: {
            $ifNull: [{ $arrayElemAt: ["$orderData.subTotalAmount", 0] }, 0],
          },

          reservationDateTime: {
            $ifNull: [
              { $arrayElemAt: ["$orderData.reservationDateTime", 0] },
              {
                $arrayElemAt: ["$reservationOnly.reservationDateTime", 0],
              },
            ],
          },

          orderStatus: {
            $ifNull: [{ $arrayElemAt: ["$orderData.orderStatus", 0] }, null],
          },
        },
      },

      // ================== TABLE STATUS ==================
      {
        $addFields: {
          tableStatus: {
            $cond: [
              "$hasOrder",
              {
                $cond: [
                  { $eq: ["$orderStatus", "pre-order"] },
                  "reserved",
                  "occupied",
                ],
              },
              {
                $cond: ["$hasReservationOnly", "reserved", "empty"],
              },
            ],
          },
        },
      },

      {
        $project: {
          orderData: 0,
          reservationOnly: 0,
        },
      },

      { $sort: { tableNumber: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: tables,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find()
      .populate("area", "areaName")
      .sort({ tableNumber: 1 });

    res.json({
      success: true,
      data: tables,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy tất cả bàn",
    });
  }
};

export const getAllActiveTables = async (req, res) => {
  try {
    const tables = await Table.find({ tableStatus: "active" })
      .populate("area", "areaName")
      .sort({ tableNumber: 1 });

    res.json({
      success: true,
      data: tables,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách bàn active",
    });
  }
};
