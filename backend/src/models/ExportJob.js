import mongoose from "mongoose";

const exportJobSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ["processing", "completed", "failed"],
            default: "processing",
        },
        filters: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        filePath: {
            type: String,
            default: null,
        },
        fileName: {
            type: String,
            default: null,
        },
        error: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

// Auto-delete old jobs and files after 1 hour
exportJobSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

const ExportJob = mongoose.model("ExportJob", exportJobSchema);

export default ExportJob;
