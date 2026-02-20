import api from './axios';
import { ApiResponse, PagedResponse, PaginationParams } from '../types/api.types';
import { WingService, WingServiceRequest } from '../types/wing.types';

export const wingServicesApi = {
  getAll: (params: PaginationParams) =>
    api.get<ApiResponse<PagedResponse<WingService>>>('/wing/services', { params }),
  getById: (id: string) =>
    api.get<ApiResponse<WingService>>(`/wing/services/${id}`),
  create: (data: WingServiceRequest) =>
    api.post<ApiResponse<WingService>>('/wing/services', data),
  update: (id: string, data: WingServiceRequest) =>
    api.put<ApiResponse<WingService>>(`/wing/services/${id}`, data),
  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/wing/services/${id}`),
};
