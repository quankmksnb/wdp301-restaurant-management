const checkDemoMode = (req, res, next) => {
  console.log(req.user.isDemo);
  if (req.user && req.user.isDemo) {
    const forbiddenMethods = ["POST", "PUT", "PATCH", "DELETE"];

    if (forbiddenMethods.includes(req.method)) {
      return res.status(403).json({
        message:
          "Đây là tài khoản Demo. Bạn không có quyền thực hiện thao tác chỉnh sửa dữ liệu để bảo vệ hệ thống.",
      });
    }
  }
  next();
};
export default checkDemoMode;
