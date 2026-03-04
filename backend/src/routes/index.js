import express from "express";
import userRoutes from "./userRoutes.js";

const router = express.Router();

// base path: /api/users
router.use("/users", userRoutes);

export default router;