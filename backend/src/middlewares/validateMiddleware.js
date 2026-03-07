export const validate = (schema) => (req, res, next) => {
  try {
    const data = schema.parse(req.body);
    req.body = data;
    next();
  } catch (error) {
    const errors = error.errors.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors,
    });
  }
};
