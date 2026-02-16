import api from './axios';
import { ApiResponse, PagedResponse, PaginationParams } from '../types/api.types';
import { User, UserRequest } from '../types/user.types';

export const usersApi = {
  getAll: (params: PaginationParams) =>
    api.get<ApiResponse<PagedResponse<User>>>('/users', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<User>>(`/users/${id}`),

  create: (data: UserRequest) =>
    api.post<ApiResponse<User>>('/users', data),

  update: (id: string, data: UserRequest) =>
    api.put<ApiResponse<User>>(`/users/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/users/${id}`),

  assignRoles: (id: string, roleIds: string[]) =>
    api.put<ApiResponse<User>>(`/users/${id}/roles`, { roleIds }),
};
