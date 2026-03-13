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
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post(
    "/",
    upload.array("images", 1),
    createMenuItem
);
router.get("/:id", getMenuItemById);
router.get("/", getAllMenuItems);
router.get("/by-child-category", getMenuItemsByChildCategory);
router.put(
    "/:id",
    upload.array("images", 1),
    updateMenuItem
);
router.delete("/:id", deleteMenuItem);
router.patch("/:id/toggle-status", toggleAvailabilityStatus);

export default router;