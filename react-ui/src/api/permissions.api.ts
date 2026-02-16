import api from './axios';
import { ApiResponse, PagedResponse } from '../types/api.types';
import { Permission, PermissionRequest } from '../types/role.types';

export const permissionsApi = {
  getAll: (params: { page?: number; size?: number; search?: string; module?: string }) =>
    api.get<ApiResponse<PagedResponse<Permission>>>('/permissions', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Permission>>(`/permissions/${id}`),

  create: (data: PermissionRequest) =>
    api.post<ApiResponse<Permission>>('/permissions', data),

  update: (id: string, data: PermissionRequest) =>
    api.put<ApiResponse<Permission>>(`/permissions/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/permissions/${id}`),

  getModules: () =>
    api.get<ApiResponse<string[]>>('/permissions/modules'),
};
