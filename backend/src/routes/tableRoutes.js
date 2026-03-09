import express from "express";
import {
  createTable,
  getTables,
  getTable,
  updateTable,
  toggleTableStatus,
} from "../controllers/tableController.js";

import { validate } from "../middlewares/validateMiddleware.js";
import {
  createTableSchema,
  updateTableSchema,
} from "../validators/tableValidator.js";

const router = express.Router();

router.post("/", validate(createTableSchema), createTable);

router.get("/", getTables);

router.get("/:id", getTable);

router.put("/:id", validate(updateTableSchema), updateTable);

router.patch("/:id/status", toggleTableStatus);

export default router;
