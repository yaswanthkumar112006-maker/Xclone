import { api } from './api';
import { ApiResponse, Page, UpdateProfilePayload, User, UserProfile } from '../types';

export const userService = {
  async getUserProfile(username: string): Promise<UserProfile> {
    const res = await api.get<ApiResponse<UserProfile>>(`/api/v1/users/${username}`);
    return res.data.data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const res = await api.put<ApiResponse<User>>('/api/v1/users/profile', payload);
    return res.data.data;
  },

  async searchUsers(query: string, page = 0, size = 20): Promise<Page<User>> {
    const res = await api.get<ApiResponse<Page<User>>>('/api/v1/users/search', {
      params: { q: query, page, size },
    });
    return res.data.data;
  },

  async getFollowers(username: string, page = 0, size = 20): Promise<Page<User>> {
    const res = await api.get<ApiResponse<Page<User>>>(`/api/v1/users/${username}/followers`, {
      params: { page, size },
    });
    return res.data.data;
  },

  async getFollowing(username: string, page = 0, size = 20): Promise<Page<User>> {
    const res = await api.get<ApiResponse<Page<User>>>(`/api/v1/users/${username}/following`, {
      params: { page, size },
    });
    return res.data.data;
  },
};
