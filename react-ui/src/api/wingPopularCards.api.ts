import api from './axios';
import { ApiResponse, PagedResponse, PaginationParams } from '../types/api.types';
import { WingPopularCard, WingPopularCardRequest } from '../types/wing.types';

export const wingPopularCardsApi = {
  getAll: (params: PaginationParams) =>
    api.get<ApiResponse<PagedResponse<WingPopularCard>>>('/wing/popular-cards', { params }),
  getById: (id: string) =>
    api.get<ApiResponse<WingPopularCard>>(`/wing/popular-cards/${id}`),
  create: (data: WingPopularCardRequest) =>
    api.post<ApiResponse<WingPopularCard>>('/wing/popular-cards', data),
  update: (id: string, data: WingPopularCardRequest) =>
    api.put<ApiResponse<WingPopularCard>>(`/wing/popular-cards/${id}`, data),
  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/wing/popular-cards/${id}`),
};
