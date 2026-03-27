import { Router } from "express";
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import upload from "../middlewares/uploadMiddleware.js";
import {authorizeRoles} from "../middlewares/authMiddleware.js";

const router = Router();
router.use(authorizeRoles( "admin"));

router.post("/", upload.single("photo"), createEmployee);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", upload.single("photo"), updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
