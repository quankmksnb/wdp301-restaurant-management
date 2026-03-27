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

const router = express.Router();

router.post(
    "/",
    upload.array("images", 1),
    createMenuItem
);
router.get("/by-child-category", getMenuItemsByChildCategory);
router.get("/:id", getMenuItemById);
router.get("/", getAllMenuItems);

router.put(
    "/:id",
    upload.array("images", 1),
    updateMenuItem
);
router.delete("/:id", deleteMenuItem);
router.patch("/:id/toggle-status", toggleAvailabilityStatus);

export default router;