import api from './axios';
import { ApiResponse, PagedResponse, PaginationParams } from '../types/api.types';
import { WingBanner, WingBannerRequest } from '../types/wing.types';

export const wingBannersApi = {
  getAll: (params: PaginationParams) =>
    api.get<ApiResponse<PagedResponse<WingBanner>>>('/wing/banners', { params }),
  getById: (id: string) =>
    api.get<ApiResponse<WingBanner>>(`/wing/banners/${id}`),
  create: (data: WingBannerRequest) =>
    api.post<ApiResponse<WingBanner>>('/wing/banners', data),
  update: (id: string, data: WingBannerRequest) =>
    api.put<ApiResponse<WingBanner>>(`/wing/banners/${id}`, data),
  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/wing/banners/${id}`),
};
