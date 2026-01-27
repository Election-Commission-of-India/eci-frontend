import axiosInstance from './axiosInstance.js';

// Audit Log APIs based on AuditLogController
export const getAuditLogsByTable = async (tableName) => {
  const response = await axiosInstance.get(`/api/v1/audit-logs?tableName=${encodeURIComponent(tableName)}`);
  return response.data;
};