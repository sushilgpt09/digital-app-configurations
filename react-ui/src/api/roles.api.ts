import api from './axios';
import { ApiResponse, PagedResponse, PaginationParams } from '../types/api.types';
import { Role, RoleRequest } from '../types/role.types';

export const rolesApi = {
  getAll: (params: PaginationParams) =>
    api.get<ApiResponse<PagedResponse<Role>>>('/roles', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Role>>(`/roles/${id}`),

  create: (data: RoleRequest) =>
    api.post<ApiResponse<Role>>('/roles', data),

  update: (id: string, data: RoleRequest) =>
    api.put<ApiResponse<Role>>(`/roles/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/roles/${id}`),
};
