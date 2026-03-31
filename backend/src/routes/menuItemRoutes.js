import express from "express";
import {
    createMenuItem,
    deleteMenuItem,
    getAllMenuItems,
    getMenuItemById,
    updateMenuItem,
    toggleAvailabilityStatus,
    getMenuItemsByChildCategory,
} from "../controllers/menuItemController.js";
import upload from "../middlewares/uploadMiddleware.js";
import { authorizeRoles, verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
    "/",
    verifyToken,
    authorizeRoles("manager"),
    upload.array("images", 1),
    createMenuItem
);
router.get("/by-child-category", getMenuItemsByChildCategory);
router.get("/:id", getMenuItemById);
router.get("/", getAllMenuItems);

router.put(
    "/:id",
    verifyToken,
    authorizeRoles("manager"),

    upload.array("images", 1),
    updateMenuItem
);

router.delete("/:id", verifyToken, authorizeRoles("manager"), deleteMenuItem);
router.patch("/:id/toggle-status", verifyToken, authorizeRoles("manager"), toggleAvailabilityStatus);

export default router;