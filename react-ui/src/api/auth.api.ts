import api from './axios';
import { ApiResponse } from '../types/api.types';
import { LoginRequest, LoginResponse, RefreshTokenRequest } from '../types/auth.types';

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<LoginResponse>>('/auth/login', data),

  refresh: (data: RefreshTokenRequest) =>
    api.post<ApiResponse<LoginResponse>>('/auth/refresh', data),
};
