import Area from "../models/Area.js";

export const createArea = async (req, res) => {
  try {
    const { areaName, description } = req.body;

    const existed = await Area.findOne({ areaName });

    if (existed) {
      return res.status(400).json({
        success: false,
        message: "Khu vực đã tồn tại",
      });
    }

    const area = await Area.create({
      areaName,
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

export const getArea = async (req, res) => {
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
    const area = await Area.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khu vực",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật khu vực thành công",
      data: area,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật khu vực",
    });
  }
};

export const deleteArea = async (req, res) => {
  try {
    const area = await Area.findByIdAndDelete(req.params.id);

    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khu vực",
      });
    }

    res.json({
      success: true,
      message: "Xóa khu vực thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa khu vực",
    });
  }
};
