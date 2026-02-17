import api from './axios';
import { ApiResponse, PagedResponse, PaginationParams } from '../types/api.types';
import { AppLanguage, AppLanguageRequest } from '../types/appLanguage.types';

export const appLanguagesApi = {
  getAll: (params: PaginationParams) =>
    api.get<ApiResponse<PagedResponse<AppLanguage>>>('/app-languages', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<AppLanguage>>(`/app-languages/${id}`),

  create: (data: AppLanguageRequest) =>
    api.post<ApiResponse<AppLanguage>>('/app-languages', data),

  update: (id: string, data: AppLanguageRequest) =>
    api.put<ApiResponse<AppLanguage>>(`/app-languages/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/app-languages/${id}`),
};
