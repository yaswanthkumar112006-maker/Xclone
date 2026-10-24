import { api } from './api';
import { ApiResponse } from '../types';

export const likeService = {
  async likePost(postId: number): Promise<void> {
    await api.post(`/api/v1/posts/${postId}/like`);
  },

  async unlikePost(postId: number): Promise<void> {
    await api.delete(`/api/v1/posts/${postId}/like`);
  },
};
