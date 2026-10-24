import { api } from './api';
import { ApiResponse, AuthResponse, LoginPayload, RegisterPayload, User } from '../types';

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await api.post<ApiResponse<AuthResponse>>('/api/v1/auth/register', payload);
    return res.data.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await api.post<ApiResponse<AuthResponse>>('/api/v1/auth/login', payload);
    return res.data.data;
  },

  async getCurrentUser(): Promise<User> {
    const res = await api.get<ApiResponse<User>>('/api/v1/auth/me');
    return res.data.data;
  },
};
