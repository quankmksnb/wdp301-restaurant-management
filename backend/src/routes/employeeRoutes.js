import { Router } from "express";
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = Router();

router.post("/", upload.single("photo"), createEmployee);
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", upload.single("photo"), updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
