import Activity from "../models/Activity.js";

export const logActivity = async (userId, content, type) => {
  try {
    await Activity.create({ user: userId, content, type });
  } catch (error) {
    console.error("Lỗi ghi log hoạt động:", error);
  }
};
