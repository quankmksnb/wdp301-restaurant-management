import api from './api';

/**
 * Tạo export job
 */
export const createExportJob = (type, filters = {}) => {
    return api.post("/export", { type, filters });
};

/**
 * Lấy trạng thái export job
 */
export const getExportStatus = (jobId) => {
    return api.get(`/export/${jobId}`);
};

/**
 * Lấy URL download file export
 */
export const getExportDownloadUrl = (jobId) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/export/${jobId}/download`;
};
