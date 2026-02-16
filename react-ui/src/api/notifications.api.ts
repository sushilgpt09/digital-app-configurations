import api from './axios';
import { ApiResponse, PagedResponse } from '../types/api.types';
import { NotificationTemplate, NotificationTemplateRequest } from '../types/notification.types';

export const notificationsApi = {
  getAll: (params: { page?: number; size?: number; search?: string; type?: string; status?: string }) =>
    api.get<ApiResponse<PagedResponse<NotificationTemplate>>>('/notification-templates', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<NotificationTemplate>>(`/notification-templates/${id}`),

  create: (data: NotificationTemplateRequest) =>
    api.post<ApiResponse<NotificationTemplate>>('/notification-templates', data),

  update: (id: string, data: NotificationTemplateRequest) =>
    api.put<ApiResponse<NotificationTemplate>>(`/notification-templates/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/notification-templates/${id}`),
};
