import { Router } from "express";
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import upload from "../middlewares/uploadMiddleware.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import checkDemoMode from "../middlewares/checkDemoMode.js";

const router = Router();
router.use(verifyToken);
router.use(authorizeRoles("manager"));

router.post("/", checkDemoMode,  upload.single("photo"), createEmployee);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", checkDemoMode, upload.single("photo"), updateEmployee);
router.delete("/:id", checkDemoMode, deleteEmployee);

export default router;
