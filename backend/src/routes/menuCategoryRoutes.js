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


const router = express.Router();

router.post("/", verifyToken, authorizeRoles("manager"), createCategory);
router.post("/parent", verifyToken, authorizeRoles("manager"), createParentCategory);
router.get("/", getAllCategories);
router.get("/tree", getCategoryTree);
router.get("/children", getChildCategories);
router.put("/:id", verifyToken, authorizeRoles("manager"), updateCategory);
router.delete("/:id", verifyToken, authorizeRoles("manager"), deleteCategory);

export default router;