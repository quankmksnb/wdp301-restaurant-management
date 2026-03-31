import { Router } from "express";
import {
    createExport,
    getExportStatus,
    downloadExport,
} from "../controllers/exportController.js";

const router = Router();

router.post("/", createExport);
router.get("/:id", getExportStatus);
router.get("/:id/download", downloadExport);

export default router;
