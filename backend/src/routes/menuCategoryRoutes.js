import express from "express";
import {
    createCategory,
    createParentCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
    getCategoryTree,
    getChildCategories,
} from "../controllers/menuCategoryController.js";
import { authorizeRoles, verifyToken } from "../middlewares/authMiddleware.js";
import checkDemoMode from "../middlewares/checkDemoMode.js";


const router = express.Router();

router.post("/", verifyToken, authorizeRoles("manager"), checkDemoMode, createCategory);
router.post("/parent", verifyToken, authorizeRoles("manager"), checkDemoMode, createParentCategory);
router.get("/", getAllCategories);
router.get("/tree", getCategoryTree);
router.get("/children", getChildCategories);
router.put("/:id", verifyToken, authorizeRoles("manager"), checkDemoMode, updateCategory);
router.delete("/:id", verifyToken, authorizeRoles("manager"), checkDemoMode, deleteCategory);

export default router;