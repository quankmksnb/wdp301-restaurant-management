import express from "express";
import {
  createTable,
  deleteTable,
  getAllTables,
  getTable,
  getTableByArea,
  getTables,
  toggleTableStatus,
  updateTable,
  getAllActiveTables,
} from "../controllers/tableController.js";

import { validate } from "../middlewares/validateMiddleware.js";
import {
  createTableSchema,
  updateTableSchema,
} from "../validators/tableValidator.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/all", verifyToken, getAllTables);
router.get("/active", verifyToken, getAllActiveTables);
router.post(
  "/",
  verifyToken,
  authorizeRoles("manager"),
  validate(createTableSchema),
  createTable,
);

router.get("/", verifyToken, getTables);

router.get("/by-area", verifyToken, getTableByArea);

router.get("/:id", verifyToken, getTable);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("manager"),
  validate(updateTableSchema),
  updateTable,
);

router.patch(
  "/:id/status",
  verifyToken,
  authorizeRoles("manager"),
  toggleTableStatus,
);

router.delete("/:id", verifyToken, authorizeRoles("manager"), deleteTable);

export default router;
