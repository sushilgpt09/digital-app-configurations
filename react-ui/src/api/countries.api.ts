import api from './axios';
import { ApiResponse, PagedResponse, PaginationParams } from '../types/api.types';
import { Country, CountryRequest } from '../types/country.types';

export const countriesApi = {
  getAll: (params: PaginationParams) =>
    api.get<ApiResponse<PagedResponse<Country>>>('/countries', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Country>>(`/countries/${id}`),

  create: (data: CountryRequest) =>
    api.post<ApiResponse<Country>>('/countries', data),

  update: (id: string, data: CountryRequest) =>
    api.put<ApiResponse<Country>>(`/countries/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/countries/${id}`),
};
