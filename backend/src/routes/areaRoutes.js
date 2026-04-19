import express from "express";
import {
  createArea,
  getAreaById,
  getAreas,
  toggleAreaStatus,
  updateArea,
} from "../controllers/areaController.js";

import { authorizeRoles, verifyToken } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {
  createAreaSchema,
  updateAreaSchema,
} from "../validators/areaValidator.js";
import checkDemoMode from "../middlewares/checkDemoMode.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  authorizeRoles("manager"),
  validate(createAreaSchema),
  createArea,
);

router.get("/", verifyToken, getAreas);

router.get("/:id", verifyToken, getAreaById);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("manager"),
  validate(updateAreaSchema),
  checkDemoMode,
  updateArea,
);

router.patch(
  "/:id/status",
  verifyToken,
  authorizeRoles("manager"),
  checkDemoMode,
  toggleAreaStatus,
);

export default router;
