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
} from "../controllers/tableController.js";

import { validate } from "../middlewares/validateMiddleware.js";
import {
  createTableSchema,
  updateTableSchema,
} from "../validators/tableValidator.js";

const router = express.Router();

router.get("/all", getAllTables);

router.post("/", validate(createTableSchema), createTable);

router.get("/", getTables);

router.get("/by-area", getTableByArea);

router.get("/:id", getTable);

router.put("/:id", validate(updateTableSchema), updateTable);

router.patch("/:id/status", toggleTableStatus);

router.delete("/:id", deleteTable);

export default router;
