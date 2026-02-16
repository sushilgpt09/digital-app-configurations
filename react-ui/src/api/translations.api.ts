import api from './axios';
import { ApiResponse, PagedResponse } from '../types/api.types';
import { Translation, TranslationRequest } from '../types/translation.types';

export const translationsApi = {
  getAll: (params: { page?: number; size?: number; search?: string; module?: string; platform?: string }) =>
    api.get<ApiResponse<PagedResponse<Translation>>>('/translations', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Translation>>(`/translations/${id}`),

  create: (data: TranslationRequest) =>
    api.post<ApiResponse<Translation>>('/translations', data),

  update: (id: string, data: TranslationRequest) =>
    api.put<ApiResponse<Translation>>(`/translations/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/translations/${id}`),
};
