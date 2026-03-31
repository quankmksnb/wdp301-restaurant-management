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
  updateArea,
);

router.patch(
  "/:id/status",
  verifyToken,
  authorizeRoles("manager"),
  toggleAreaStatus,
);

export default router;
