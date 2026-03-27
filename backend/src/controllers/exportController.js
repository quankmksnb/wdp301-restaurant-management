import {
    createExportJob,
    getJobStatus,
    getJobFilePath,
    getRegisteredTypes,
} from "../services/exportService.js";

/**
 * POST /api/export
 * Create a new export job
 * Body: { type: "employees", filters: { search, status } }
 */
export const createExport = async (req, res) => {
    try {
        const { type, filters = {} } = req.body;

        if (!type) {
            return res.status(400).json({ message: "Vui lòng chỉ định loại xuất file (type)" });
        }

        const registeredTypes = getRegisteredTypes();
        if (!registeredTypes.includes(type)) {
            return res.status(400).json({
                message: `Loại "${type}" không hợp lệ. Các loại hỗ trợ: ${registeredTypes.join(", ")}`,
            });
        }

        const jobId = await createExportJob(type, filters);

        res.status(201).json({
            message: "Đang xử lý xuất file",
            jobId,
        });
    } catch (error) {
        console.error("Create export error:", error);
        res.status(500).json({ message: "Lỗi tạo export job", error: error.message });
    }
};

/**
 * GET /api/export/:id
 * Get export job status
 */
export const getExportStatus = async (req, res) => {
    try {
        const job = await getJobStatus(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Không tìm thấy export job" });
        }

        res.json(job);
    } catch (error) {
        console.error("Get export status error:", error);
        res.status(500).json({ message: "Lỗi lấy trạng thái export", error: error.message });
    }
};

/**
 * GET /api/export/:id/download
 * Download the exported file
 */
export const downloadExport = async (req, res) => {
    try {
        const result = await getJobFilePath(req.params.id);

        if (!result) {
            return res.status(404).json({ message: "File không tồn tại hoặc chưa sẵn sàng" });
        }

        res.download(result.filePath, result.fileName);
    } catch (error) {
        console.error("Download export error:", error);
        res.status(500).json({ message: "Lỗi tải file", error: error.message });
    }
};
