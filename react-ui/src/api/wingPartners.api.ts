import api from './axios';
import { ApiResponse, PagedResponse, PaginationParams } from '../types/api.types';
import { WingPartner, WingPartnerRequest } from '../types/wing.types';

export const wingPartnersApi = {
  getAll: (params: PaginationParams) =>
    api.get<ApiResponse<PagedResponse<WingPartner>>>('/wing/partners', { params }),
  getById: (id: string) =>
    api.get<ApiResponse<WingPartner>>(`/wing/partners/${id}`),
  create: (data: WingPartnerRequest) =>
    api.post<ApiResponse<WingPartner>>('/wing/partners', data),
  update: (id: string, data: WingPartnerRequest) =>
    api.put<ApiResponse<WingPartner>>(`/wing/partners/${id}`, data),
  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/wing/partners/${id}`),
};
