import { api } from './api';

export const followService = {
  async followUser(username: string): Promise<void> {
    await api.post(`/api/v1/users/${username}/follow`);
  },

  async unfollowUser(username: string): Promise<void> {
    await api.delete(`/api/v1/users/${username}/follow`);
  },
};
