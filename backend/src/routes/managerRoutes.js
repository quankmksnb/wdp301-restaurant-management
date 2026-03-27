import express from "express";
import {
  getLiveOperationsStatus,
  getRevenueByArea,
  getRevenueChartData,
  getRevenueSummary,
  getTopSellingItems,
} from "../controllers/managerController.js";
import { authorizeRoles, verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);
router.use(authorizeRoles("manager"));
router.get("/revenue-summary", getRevenueSummary);
router.get("/revenue-chart", getRevenueChartData);
router.get("/live-operation", getLiveOperationsStatus);
router.get("/top-selling", getTopSellingItems);
router.get("/revenue-area", getRevenueByArea);

export default router;
