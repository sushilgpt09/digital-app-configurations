import api from './axios';
import { ApiResponse, PagedResponse } from '../types/api.types';
import { ApiMessageItem, ApiMessageRequest } from '../types/message.types';

export const messagesApi = {
  getAll: (params: { page?: number; size?: number; search?: string; type?: string }) =>
    api.get<ApiResponse<PagedResponse<ApiMessageItem>>>('/messages', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<ApiMessageItem>>(`/messages/${id}`),

  create: (data: ApiMessageRequest) =>
    api.post<ApiResponse<ApiMessageItem>>('/messages', data),

  update: (id: string, data: ApiMessageRequest) =>
    api.put<ApiResponse<ApiMessageItem>>(`/messages/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/messages/${id}`),
};
