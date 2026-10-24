import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { Post, Page } from '../types';
import { PostComposer } from '../components/posts/PostComposer';
import { PostCard } from '../components/posts/PostCard';
import { ReplyModal } from '../components/posts/ReplyModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Sparkles, MessageSquare } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'forYou' | 'following'>('forYou');
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reply modal state
  const [replyPost, setReplyPost] = useState<Post | null>(null);

  const fetchFeed = async (pageNum = 0, isInitial = false) => {
    try {
      if (isInitial) setIsLoading(true);
      else setIsLoadingMore(true);
      setError(null);

      let data: Page<Post>;
      if (activeTab === 'following' && isAuthenticated) {
        data = await postService.getHomeFeed(pageNum, 20);
      } else {
        data = await postService.getExploreFeed(pageNum, 20);
      }

      if (pageNum === 0) {
        setPosts(data.content);
      } else {
        setPosts((prev) => [...prev, ...data.content]);
      }

      setHasMore(!data.last);
      setPage(pageNum);
    } catch (err: any) {
      console.error('Failed to load feed:', err);
      setError(err.message || 'Failed to load posts');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchFeed(0, true);
  }, [activeTab, isAuthenticated]);

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = (postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  return (
    <div className="min-h-screen">
      {/* Sticky Tab Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-twitter-border z-20">
        <div className="px-4 py-3 font-bold text-xl text-gray-100 hidden sm:block">Home</div>

        <div className="flex border-t sm:border-t-0 border-neutral-900">
          <button
            onClick={() => setActiveTab('forYou')}
            className={`flex-1 py-3 text-center text-sm font-bold relative transition-colors ${
              activeTab === 'forYou' ? 'text-gray-100' : 'text-twitter-textMuted hover:bg-neutral-900/50'
            }`}
          >
            For you
            {activeTab === 'forYou' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-twitter-blue rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              if (!isAuthenticated) {
                alert('Please sign in to see posts from accounts you follow');
                return;
              }
              setActiveTab('following');
            }}
            className={`flex-1 py-3 text-center text-sm font-bold relative transition-colors ${
              activeTab === 'following' ? 'text-gray-100' : 'text-twitter-textMuted hover:bg-neutral-900/50'
            }`}
          >
            Following
            {activeTab === 'following' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-twitter-blue rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Top Post Composer for logged-in users */}
      {isAuthenticated && (
        <PostComposer onPostCreated={handlePostCreated} placeholder="What is happening?!" />
      )}

      {/* Feed Content */}
      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : error ? (
        <div className="p-8 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => fetchFeed(0, true)}
            className="px-4 py-2 bg-twitter-blue text-white rounded-full text-sm font-bold"
          >
            Retry
          </button>
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="w-12 h-12" />}
          title={activeTab === 'following' ? 'Welcome to your timeline!' : 'No posts yet'}
          description={
            activeTab === 'following'
              ? 'When you follow people, their posts will show up here. Check out the "For you" tab or explore new accounts to follow!'
              : 'Be the first to share something with the world!'
          }
        />
      ) : (
        <div className="divide-y divide-twitter-border">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPostDeleted={handlePostDeleted}
              onPostUpdated={handlePostUpdated}
              onReplyClick={(p) => setReplyPost(p)}
            />
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="p-4 text-center">
              <button
                onClick={() => fetchFeed(page + 1, false)}
                disabled={isLoadingMore}
                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-twitter-blue font-bold text-sm rounded-full transition-colors border border-twitter-border disabled:opacity-50"
              >
                {isLoadingMore ? 'Loading more...' : 'Load more posts'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reply Modal */}
      <ReplyModal
        post={replyPost}
        isOpen={!!replyPost}
        onClose={() => setReplyPost(null)}
        onReplySuccess={() => {
          fetchFeed(0, false);
        }}
      />
    </div>
  );
};
