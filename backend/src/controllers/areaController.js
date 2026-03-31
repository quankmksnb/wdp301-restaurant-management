import Area from "../models/Area.js";
import Table from "../models/Table.js";
import Reservation from "../models/Reservation.js";

export const createArea = async (req, res) => {
  try {
    const { areaName, description } = req.body;

    // Check trùng tên, bỏ qua hoa/thường và khoảng trắng thừa
    const existed = await Area.findOne({
      areaName: { $regex: `^${areaName.trim()}$`, $options: "i" },
    });

    if (existed) {
      return res.status(400).json({
        success: false,
        message: "Khu vực đã tồn tại",
      });
    }

    const area = await Area.create({
      areaName: areaName.trim(),
      description,
      createdBy: req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: "Tạo khu vực thành công",
      data: area,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo khu vực",
      error: error.message,
    });
  }
};

export const getAreas = async (req, res) => {
  try {
    const areas = await Area.find().populate("createdBy", "fullName email");

    res.json({
      success: true,
      total: areas.length,
      data: areas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách khu vực",
    });
  }
};

export const getAreaById = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id).populate(
      "createdBy",
      "fullName email",
    );

    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khu vực",
      });
    }

    res.json({
      success: true,
      data: area,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy khu vực",
    });
  }
};

export const updateArea = async (req, res) => {
  try {
    const { areaName, description } = req.body;
    const area = await Area.findById(req.params.id);

    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khu vực",
      });
    }

    if (areaName !== undefined) {
      // Check trùng tên với area khác, bỏ qua hoa/thường và khoảng trắng
      const existed = await Area.findOne({
        areaName: { $regex: `^${areaName.trim()}$`, $options: "i" },
        _id: { $ne: req.params.id },
      });

      if (existed) {
        return res.status(400).json({
          success: false,
          message: "Tên khu vực đã tồn tại",
        });
      }

      area.areaName = areaName.trim();
    }

    if (description !== undefined) area.description = description;

    await area.save();

    res.json({
      success: true,
      message: "Cập nhật khu vực thành công",
      data: area,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật khu vực",
      error: error.message,
    });
  }
};

export const toggleAreaStatus = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);

    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khu vực",
      });
    }

    const isDeactivating = area.areaStatus === "active";

    if (isDeactivating) {
      // Lấy tất cả bàn active trong khu vực
      const activeTables = await Table.find({
        area: area._id,
        tableStatus: "active",
      });

      const tableIds = activeTables.map((t) => t._id);

      // Kiểm tra có bàn nào đang có reservation confirmed/seated không
      if (tableIds.length > 0) {
        const blockedReservation = await Reservation.findOne({
          tables: { $in: tableIds },
          status: { $in: ["confirmed", "seated"] },
        });

        if (blockedReservation) {
          return res.status(400).json({
            success: false,
            message:
              "Khu vực này đang có bàn với đặt chỗ chưa hoàn thành, không thể ngừng hoạt động",
          });
        }
      }

      // Không bị block → inactive toàn bộ bàn trong khu vực
      await Table.updateMany(
        { area: area._id, tableStatus: "active" },
        { $set: { tableStatus: "inactive" } },
      );

      area.areaStatus = "inactive";
    } else {
      // Kích hoạt lại khu vực — không tự active lại bàn
      area.areaStatus = "active";
    }

    await area.save();

    res.json({
      success: true,
      message: isDeactivating
        ? "Đã ngừng hoạt động khu vực và toàn bộ bàn trong khu vực"
        : "Đã kích hoạt lại khu vực (các bàn cần mở lại thủ công)",
      data: area,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật trạng thái khu vực",
      error: error.message,
    });
  }
};
