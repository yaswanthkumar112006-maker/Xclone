export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  headerUrl?: string;
  location?: string;
  website?: string;
  createdAt: string;
}

export interface UserProfile {
  user: User;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  followedByCurrentUser: boolean;
  currentUser: boolean;
}

export interface Post {
  id: number;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  parentPostId?: number | null;
  parentPostAuthorUsername?: string | null;
  likeCount: number;
  replyCount: number;
  likedByCurrentUser: boolean;
  authorUser?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

export interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  displayName: string;
}

export interface UpdateProfilePayload {
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatarUrl?: string;
  headerUrl?: string;
}
