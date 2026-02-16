import api from './axios';
import { ApiResponse, PagedResponse } from '../types/api.types';
import { AuditLog } from '../types/auditLog.types';

export const auditLogsApi = {
  getAll: (params: {
    page?: number;
    size?: number;
    search?: string;
    entityType?: string;
    action?: string;
    from?: string;
    to?: string;
  }) => api.get<ApiResponse<PagedResponse<AuditLog>>>('/audit-logs', { params }),
};
