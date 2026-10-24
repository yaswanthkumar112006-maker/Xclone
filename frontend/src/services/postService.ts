import { api } from './api';
import { ApiResponse, Page, Post } from '../types';

export const postService = {
  async getHomeFeed(page = 0, size = 20): Promise<Page<Post>> {
    const res = await api.get<ApiResponse<Page<Post>>>('/api/v1/feed/home', {
      params: { page, size },
    });
    return res.data.data;
  },

  async getExploreFeed(page = 0, size = 20): Promise<Page<Post>> {
    const res = await api.get<ApiResponse<Page<Post>>>('/api/v1/feed/explore', {
      params: { page, size },
    });
    return res.data.data;
  },

  async getPostById(id: number): Promise<Post> {
    const res = await api.get<ApiResponse<Post>>(`/api/v1/posts/${id}`);
    return res.data.data;
  },

  async createPost(content: string, parentPostId?: number): Promise<Post> {
    const res = await api.post<ApiResponse<Post>>('/api/v1/posts', {
      content,
      parentPostId,
    });
    return res.data.data;
  },

  async updatePost(id: number, content: string): Promise<Post> {
    const res = await api.put<ApiResponse<Post>>(`/api/v1/posts/${id}`, {
      content,
    });
    return res.data.data;
  },

  async deletePost(id: number): Promise<void> {
    await api.delete(`/api/v1/posts/${id}`);
  },

  async getReplies(postId: number, page = 0, size = 20): Promise<Page<Post>> {
    const res = await api.get<ApiResponse<Page<Post>>>(`/api/v1/posts/${postId}/replies`, {
      params: { page, size },
    });
    return res.data.data;
  },

  async getUserPosts(username: string, page = 0, size = 20): Promise<Page<Post>> {
    const res = await api.get<ApiResponse<Page<Post>>>(`/api/v1/posts/user/${username}`, {
      params: { page, size },
    });
    return res.data.data;
  },

  async getUserLikes(username: string, page = 0, size = 20): Promise<Page<Post>> {
    const res = await api.get<ApiResponse<Page<Post>>>(`/api/v1/posts/user/${username}/likes`, {
      params: { page, size },
    });
    return res.data.data;
  },
};
