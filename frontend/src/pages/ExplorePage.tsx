import React, { useState, useEffect } from 'react';
import { postService } from '../services/postService';
import { Post } from '../types';
import { PostCard } from '../components/posts/PostCard';
import { ReplyModal } from '../components/posts/ReplyModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Compass, Sparkles } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [replyPost, setReplyPost] = useState<Post | null>(null);

  const fetchPosts = async (pageNum = 0) => {
    try {
      if (pageNum === 0) setIsLoading(true);
      else setIsLoadingMore(true);

      const res = await postService.getExploreFeed(pageNum, 20);
      if (pageNum === 0) {
        setPosts(res.content);
      } else {
        setPosts((prev) => [...prev, ...res.content]);
      }
      setHasMore(!res.last);
      setPage(pageNum);
    } catch (err) {
      console.error('Failed to load explore feed:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(0);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-twitter-border z-20 px-4 py-3 flex items-center justify-between">
        <h1 className="font-bold text-xl text-gray-100 flex items-center gap-2">
          <Compass className="w-5 h-5 text-twitter-blue" />
          Explore
        </h1>
        <Sparkles className="w-5 h-5 text-twitter-textMuted" />
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={<Compass className="w-12 h-12" />}
          title="No posts found"
          description="Check back later for trending conversations and community posts."
        />
      ) : (
        <div className="divide-y divide-twitter-border">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPostDeleted={(id) => setPosts((prev) => prev.filter((p) => p.id !== id))}
              onPostUpdated={(updated) =>
                setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
              }
              onReplyClick={(p) => setReplyPost(p)}
            />
          ))}

          {hasMore && (
            <div className="p-4 text-center">
              <button
                onClick={() => fetchPosts(page + 1)}
                disabled={isLoadingMore}
                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-twitter-blue font-bold text-sm rounded-full transition-colors border border-twitter-border disabled:opacity-50"
              >
                {isLoadingMore ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </div>
      )}

      <ReplyModal
        post={replyPost}
        isOpen={!!replyPost}
        onClose={() => setReplyPost(null)}
        onReplySuccess={() => fetchPosts(0)}
      />
    </div>
  );
};
