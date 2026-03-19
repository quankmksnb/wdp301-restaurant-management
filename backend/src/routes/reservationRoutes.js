import express from "express";

import {
  getAvailableTablesController,
  getReservedTablesController,
  createReservation,
  createReservationWithOrder,
  updateReservationStatus,
  updateReservation,
} from "../controllers/reservationController.js";

import { validate } from "../middlewares/validateMiddleware.js";

import {
  createReservationSchema,
  preOrderReservationSchema,
  updateReservationSchema,
} from "../validators/reservationValidator.js";

const router = express.Router();

router.get("/available-tables", getAvailableTablesController);
router.get("/reserved-tables", getReservedTablesController);

router.post("/", validate(createReservationSchema), createReservation);

router.post(
  "/pre-order",
  validate(preOrderReservationSchema),
  createReservationWithOrder,
);
router.patch("/:id/status", updateReservationStatus);
router.put("/:id", validate(updateReservationSchema), updateReservation);

export default router;
