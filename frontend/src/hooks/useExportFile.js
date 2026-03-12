'use client';

import { useState, useCallback } from 'react';
import { message } from 'antd';
import { createExportJob, getExportStatus, getExportDownloadUrl } from '@/services/exportFileService';

export default function useExportFile(type) {
    const [exporting, setExporting] = useState(false);

    const exportFile = useCallback(async (filters = {}) => {
        if (exporting) return;

        setExporting(true);
        const hideLoading = message.loading('Đang xuất file, vui lòng đợi...', 0);

        try {
            // 1. Create export job
            const res = await createExportJob(type, filters);
            const { jobId } = res.data;

            // 2. Poll for completion
            const maxAttempts = 60; // 60 seconds max
            let attempts = 0;

            const poll = () => new Promise((resolve, reject) => {
                const interval = setInterval(async () => {
                    attempts++;
                    try {
                        const statusRes = await getExportStatus(jobId);
                        const job = statusRes.data;

                        if (job.status === 'completed') {
                            clearInterval(interval);
                            resolve(job);
                        } else if (job.status === 'failed') {
                            clearInterval(interval);
                            reject(new Error(job.error || 'Xuất file thất bại'));
                        } else if (attempts >= maxAttempts) {
                            clearInterval(interval);
                            reject(new Error('Quá thời gian chờ xuất file'));
                        }
                    } catch (err) {
                        clearInterval(interval);
                        reject(err);
                    }
                }, 1000);
            });

            await poll();

            // 3. Trigger download
            const downloadUrl = getExportDownloadUrl(jobId);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            message.success('Xuất file thành công!');
        } catch (error) {
            console.error('Export error:', error);
            message.error(error.message || 'Có lỗi xảy ra khi xuất file');
        } finally {
            hideLoading();
            setExporting(false);
        }
    }, [type, exporting]);

    return { exporting, exportFile };
}
