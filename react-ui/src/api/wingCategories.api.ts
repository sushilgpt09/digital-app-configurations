import api from './axios';
import { ApiResponse, PagedResponse, PaginationParams } from '../types/api.types';
import { WingCategory, WingCategoryRequest } from '../types/wing.types';

export const wingCategoriesApi = {
  getAll: (params: PaginationParams) =>
    api.get<ApiResponse<PagedResponse<WingCategory>>>('/wing/categories', { params }),
  getById: (id: string) =>
    api.get<ApiResponse<WingCategory>>(`/wing/categories/${id}`),
  create: (data: WingCategoryRequest) =>
    api.post<ApiResponse<WingCategory>>('/wing/categories', data),
  update: (id: string, data: WingCategoryRequest) =>
    api.put<ApiResponse<WingCategory>>(`/wing/categories/${id}`, data),
  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/wing/categories/${id}`),
};
