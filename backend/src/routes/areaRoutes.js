import express from "express";
import {
  createArea,
  getAreas,
  getArea,
  updateArea,
  deleteArea,
} from "../controllers/areaController.js";

import { validate } from "../middlewares/validateMiddleware.js";
import {
  createAreaSchema,
  updateAreaSchema,
} from "../validators/areaValidator.js";

const router = express.Router();

router.post("/", validate(createAreaSchema), createArea);

router.get("/", getAreas);

router.get("/:id", getArea);

router.put("/:id", validate(updateAreaSchema), updateArea);

router.delete("/:id", deleteArea);

export default router;
