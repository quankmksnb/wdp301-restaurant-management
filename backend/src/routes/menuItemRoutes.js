import express from "express";
import {
    createMenuItem,
    deleteMenuItem,
    getAllMenuItems,
    getMenuItemById,
    updateMenuItem
} from "../controllers/menuItemController.js";

const router = express.Router();

router.post("/", createMenuItem);
router.get("/", getAllMenuItems);
router.get("/:id", getMenuItemById);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router;