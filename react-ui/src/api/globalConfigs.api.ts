import api from './axios';
import { ApiResponse, PagedResponse } from '../types/api.types';
import { GlobalConfig, GlobalConfigRequest } from '../types/globalConfig.types';

export const globalConfigsApi = {
  getAll: (params: { page?: number; size?: number; search?: string; platform?: string; status?: string }) =>
    api.get<ApiResponse<PagedResponse<GlobalConfig>>>('/global-configs', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<GlobalConfig>>(`/global-configs/${id}`),

  create: (data: GlobalConfigRequest) =>
    api.post<ApiResponse<GlobalConfig>>('/global-configs', data),

  update: (id: string, data: GlobalConfigRequest) =>
    api.put<ApiResponse<GlobalConfig>>(`/global-configs/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/global-configs/${id}`),
};
