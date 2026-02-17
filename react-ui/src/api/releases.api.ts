import api from './axios';
import { ApiResponse, PagedResponse, PaginationParams } from '../types/api.types';
import { AppRelease, AppReleaseRequest } from '../types/release.types';

export const releasesApi = {
  getAll: (params: PaginationParams & { platform?: string }) =>
    api.get<ApiResponse<PagedResponse<AppRelease>>>('/app-releases', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<AppRelease>>(`/app-releases/${id}`),

  create: (data: AppReleaseRequest) =>
    api.post<ApiResponse<AppRelease>>('/app-releases', data),

  update: (id: string, data: AppReleaseRequest) =>
    api.put<ApiResponse<AppRelease>>(`/app-releases/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/app-releases/${id}`),
};
