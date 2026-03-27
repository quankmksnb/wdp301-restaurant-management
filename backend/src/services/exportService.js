import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import ExportJob from "../models/ExportJob.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXPORTS_DIR = path.join(__dirname, "../../exports");

// Ensure exports directory exists
if (!fs.existsSync(EXPORTS_DIR)) {
    fs.mkdirSync(EXPORTS_DIR, { recursive: true });
}

const exporterRegistry = {};

export function registerExporter(type, exporter) {
    exporterRegistry[type] = exporter;
}

export function getRegisteredTypes() {
    return Object.keys(exporterRegistry);
}

export async function createExportJob(type, filters = {}) {
    const exporter = exporterRegistry[type];
    if (!exporter) {
        throw new Error(`Không tìm thấy exporter cho loại: ${type}`);
    }

    // Create job record
    const job = await ExportJob.create({ type, filters, status: "processing" });

    // Process in background (don't await)
    processExport(job._id, exporter, filters).catch((err) => {
        console.error(`Export job ${job._id} failed:`, err);
    });

    return job._id;
}

async function processExport(jobId, exporter, filters) {
    try {
        // 1. Fetch data
        const data = await exporter.fetchData(filters);

        // 2. Build Excel workbook
        const workbook = new ExcelJS.Workbook();
        workbook.creator = "ThanHoa Restaurant";
        workbook.created = new Date();

        const sheetName = exporter.sheetName || "Sheet1";
        const worksheet = workbook.addWorksheet(sheetName);

        // Set columns
        worksheet.columns = exporter.columns;

        // Style header row
        worksheet.getRow(1).font = { bold: true, size: 12 };
        worksheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF4472C4" },
        };
        worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
        worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
        worksheet.getRow(1).height = 30;

        // Add data rows
        data.forEach((item, index) => {
            const row = worksheet.addRow(item);
            // Alternate row colors
            if (index % 2 === 1) {
                row.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFD9E2F3" },
                };
            }
        });

        // Add borders to all cells
        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });
        });

        // 3. Save to file
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `${exporter.sheetName || type}_${timestamp}.xlsx`;
        const filePath = path.join(EXPORTS_DIR, fileName);

        await workbook.xlsx.writeFile(filePath);

        // 4. Update job as completed
        await ExportJob.findByIdAndUpdate(jobId, {
            status: "completed",
            filePath,
            fileName,
        });
    } catch (error) {
        console.error("Export processing error:", error);
        await ExportJob.findByIdAndUpdate(jobId, {
            status: "failed",
            error: error.message,
        });
    }
}

/**
 * Get job status by ID.
 */
export async function getJobStatus(jobId) {
    const job = await ExportJob.findById(jobId);
    if (!job) return null;
    return {
        id: job._id,
        type: job.type,
        status: job.status,
        fileName: job.fileName,
        error: job.error,
        createdAt: job.createdAt,
    };
}

/**
 * Get the file path for a completed job.
 */
export async function getJobFilePath(jobId) {
    const job = await ExportJob.findById(jobId);
    if (!job || job.status !== "completed" || !job.filePath) return null;
    return { filePath: job.filePath, fileName: job.fileName };
}

// ==========================================
// CRONJOB: TỰ ĐỘNG DỌN DẸP Ổ CỨNG FILE EXCEL
// ==========================================
setInterval(() => {
    try {
        if (!fs.existsSync(EXPORTS_DIR)) return;

        const files = fs.readdirSync(EXPORTS_DIR);
        const now = Date.now();
        const ONE_HOUR = 60 * 60 * 1000;

        files.forEach((file) => {
            // Cẩn thận chỉ quét file excel
            if (!file.endsWith(".xlsx")) return;

            const filePath = path.join(EXPORTS_DIR, file);
            const stats = fs.statSync(filePath);

            // Nếu file này sinh ra cách đây hơn 1 giờ -> Xóa file cứng
            if (now - stats.mtimeMs > ONE_HOUR) {
                fs.unlinkSync(filePath);
                console.log(`🧹 [Cronjob] Đã tự động xóa file export cũ: ${file}`);
            }
        });
    } catch (error) {
        console.error("🗑️ Lỗi dọn dẹp file exports:", error);
    }
}, 15 * 60 * 1000); // Chạy mỗi 15 phút
