import api from './axios';
import { ApiResponse, PagedResponse, PaginationParams } from '../types/api.types';
import { WingLocation, WingLocationRequest } from '../types/wing.types';

export const wingLocationsApi = {
  getAll: (params: PaginationParams) =>
    api.get<ApiResponse<PagedResponse<WingLocation>>>('/wing/locations', { params }),
  getById: (id: string) =>
    api.get<ApiResponse<WingLocation>>(`/wing/locations/${id}`),
  create: (data: WingLocationRequest) =>
    api.post<ApiResponse<WingLocation>>('/wing/locations', data),
  update: (id: string, data: WingLocationRequest) =>
    api.put<ApiResponse<WingLocation>>(`/wing/locations/${id}`, data),
  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/wing/locations/${id}`),
};
