import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { userService } from '../services/userService';
import { api } from '../services/api';
import { followService } from '../services/followService';
import { User, Post, ApiResponse, Page } from '../types';
import { PostCard } from '../components/posts/PostCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';
import { Search, X } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const { user: currentUser, isAuthenticated } = useAuth();

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setUsers([]);
      setPosts([]);
      return;
    }

    try {
      setIsLoading(true);
      if (activeTab === 'users') {
        const res = await userService.searchUsers(searchTerm.trim(), 0, 30);
        setUsers(res.content);
      } else {
        const res = await api.get<ApiResponse<Page<Post>>>('/api/v1/search/posts', {
          params: { q: searchTerm.trim(), page: 0, size: 30 },
        });
        setPosts(res.data.data.content);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        setSearchParams({ q: query.trim() });
        performSearch(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, activeTab]);

  const handleFollowToggle = async (username: string) => {
    if (!isAuthenticated) {
      alert('Please sign in to follow users');
      return;
    }

    const isFollowing = !!followingStates[username];
    setFollowingStates((prev) => ({ ...prev, [username]: !isFollowing }));

    try {
      if (isFollowing) {
        await followService.unfollowUser(username);
      } else {
        await followService.followUser(username);
      }
    } catch (err) {
      setFollowingStates((prev) => ({ ...prev, [username]: isFollowing }));
    }
  };

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-twitter-border z-20 p-3 space-y-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-twitter-textMuted">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords or users"
            className="w-full bg-neutral-900 border border-neutral-800 rounded-full pl-10 pr-10 py-2 text-sm text-gray-100 placeholder-twitter-textMuted focus:outline-none focus:border-twitter-blue focus:bg-black transition-colors"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSearchParams({});
                setUsers([]);
                setPosts([]);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-twitter-textMuted hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Tabs */}
        <div className="flex border-t border-neutral-900 pt-1">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2 text-center text-sm font-bold relative transition-colors ${
              activeTab === 'users' ? 'text-gray-100' : 'text-twitter-textMuted hover:bg-neutral-900/50'
            }`}
          >
            People
            {activeTab === 'users' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-twitter-blue rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-2 text-center text-sm font-bold relative transition-colors ${
              activeTab === 'posts' ? 'text-gray-100' : 'text-twitter-textMuted hover:bg-neutral-900/50'
            }`}
          >
            Posts
            {activeTab === 'posts' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-twitter-blue rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : !query.trim() ? (
        <EmptyState
          icon={<Search className="w-12 h-12" />}
          title="Search XClone"
          description="Find friends, creators, news, and trending discussions across the community."
        />
      ) : activeTab === 'users' ? (
        users.length === 0 ? (
          <EmptyState
            title={`No results for "${query}"`}
            description="Try searching for another username or display name."
          />
        ) : (
          <div className="divide-y divide-twitter-border">
            {users.map((u) => {
              const following = !!followingStates[u.username];
              const isSelf = currentUser?.id === u.id;
              return (
                <div
                  key={u.id}
                  className="p-4 flex items-center justify-between hover:bg-neutral-950/60 transition-colors"
                >
                  <Link
                    to={`/profile/${u.username}`}
                    className="flex items-center gap-3 min-w-0"
                  >
                    {u.avatarUrl ? (
                      <img
                        src={u.avatarUrl}
                        alt={u.displayName}
                        className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-gray-200 text-sm flex-shrink-0">
                        {u.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-gray-100 hover:underline truncate">
                        {u.displayName}
                      </div>
                      <div className="text-twitter-textMuted text-xs truncate">@{u.username}</div>
                      {u.bio && (
                        <p className="text-gray-300 text-xs mt-1 line-clamp-2 max-w-sm">
                          {u.bio}
                        </p>
                      )}
                    </div>
                  </Link>

                  {!isSelf && (
                    <button
                      onClick={() => handleFollowToggle(u.username)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                        following
                          ? 'border border-neutral-600 text-gray-200 hover:border-red-600 hover:text-red-500'
                          : 'bg-gray-100 hover:bg-white text-black'
                      }`}
                    >
                      {following ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : posts.length === 0 ? (
        <EmptyState
          title={`No posts found for "${query}"`}
          description="Try searching for different keywords or hashtags."
        />
      ) : (
        <div className="divide-y divide-twitter-border">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
};
