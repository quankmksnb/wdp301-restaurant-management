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

const router = express.Router();

router.post("/", createCategory);
router.post("/parent", createParentCategory);
router.get("/", getAllCategories);
router.get("/tree", getCategoryTree);
router.get("/children", getChildCategories);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;