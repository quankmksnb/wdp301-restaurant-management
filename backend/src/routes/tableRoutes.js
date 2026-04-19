import express from "express";
import {
  createTable,
  deleteTable,
  getAllActiveTables,
  getAllTables,
  getTableByArea,
  getTableById,
  getTables,
  toggleTableStatus,
  updateTable,
} from "../controllers/tableController.js";

import { authorizeRoles, verifyToken } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  createTableSchema,
  updateTableSchema,
} from "../validators/tableValidator.js";
import checkDemoMode from "../middlewares/checkDemoMode.js";

const router = express.Router();

router.get("/all", verifyToken, getAllTables);
router.get("/active", verifyToken, getAllActiveTables);
router.post(
  "/",
  verifyToken,
  authorizeRoles("manager"),
  checkDemoMode,
  validate(createTableSchema),
  createTable,
);

router.get("/", verifyToken, getTables);

router.get("/by-area", verifyToken, getTableByArea);

router.get("/:id", verifyToken, getTableById);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("manager"),
  checkDemoMode,
  validate(updateTableSchema),
  updateTable,
);

router.patch(
  "/:id/status",
  verifyToken,
  checkDemoMode,
  authorizeRoles("manager"),
  toggleTableStatus,
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("manager"),
  checkDemoMode,
  deleteTable,
);

export default router;
