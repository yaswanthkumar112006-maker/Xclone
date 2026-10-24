import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postService } from '../services/postService';
import { likeService } from '../services/likeService';
import { Post } from '../types';
import { PostComposer } from '../components/posts/PostComposer';
import { PostCard } from '../components/posts/PostCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatFullDate } from '../utils/formatDate';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Heart, MessageCircle, Repeat2, Share, Trash2 } from 'lucide-react';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postId = id ? parseInt(id, 10) : null;

  const loadThread = async () => {
    if (!postId) return;
    try {
      setIsLoading(true);
      setError(null);
      const postData = await postService.getPostById(postId);
      const repliesData = await postService.getReplies(postId, 0, 50);
      setPost(postData);
      setReplies(repliesData.content);
    } catch (err: any) {
      console.error('Failed to load thread:', err);
      setError(err.message || 'Post not found');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadThread();
  }, [id]);

  const handleLikeToggle = async () => {
    if (!post || !isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isLiking) return;

    const newLiked = !post.likedByCurrentUser;
    const newCount = newLiked ? post.likeCount + 1 : Math.max(0, post.likeCount - 1);

    setPost({
      ...post,
      likedByCurrentUser: newLiked,
      likeCount: newCount,
    });
    setIsLiking(true);

    try {
      if (newLiked) {
        await likeService.likePost(post.id);
      } else {
        await likeService.unlikePost(post.id);
      }
    } catch (err) {
      // Revert on error
      setPost({
        ...post,
        likedByCurrentUser: !newLiked,
        likeCount: post.likeCount,
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;
    if (!window.confirm('Delete this post?')) return;
    try {
      await postService.deletePost(post.id);
      navigate(-1);
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="py-20" />;
  }

  if (error || !post) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-400 mb-4">{error || 'Post not found'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-twitter-blue text-white rounded-full text-sm font-bold"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const isAuthor = user?.id === post.author.id;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-twitter-border z-20 px-4 py-3 flex items-center gap-6">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 hover:bg-neutral-900 rounded-full text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-lg text-gray-100">Post</h1>
      </div>

      {/* Main Post Expanded View */}
      <div className="p-4 border-b border-twitter-border">
        {/* Author info */}
        <div className="flex items-center justify-between mb-3">
          <Link to={`/profile/${post.author.username}`} className="flex items-center gap-3">
            {post.author.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                alt={post.author.displayName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-lg text-gray-200">
                {post.author.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="font-bold text-gray-100 hover:underline">{post.author.displayName}</div>
              <div className="text-twitter-textMuted text-sm">@{post.author.username}</div>
            </div>
          </Link>

          {isAuthor && (
            <button
              onClick={handleDeletePost}
              className="p-2 text-twitter-textMuted hover:text-red-500 rounded-full hover:bg-red-500/10 transition-colors"
              title="Delete post"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <p className="text-xl sm:text-2xl text-gray-100 leading-relaxed break-words whitespace-pre-line my-4">
          {post.content}
        </p>

        {/* Timestamp */}
        <div className="py-3 border-y border-neutral-900 text-twitter-textMuted text-sm">
          {formatFullDate(post.createdAt)}
        </div>

        {/* Stats */}
        <div className="py-3 border-b border-neutral-900 flex items-center gap-6 text-sm">
          <div>
            <span className="font-bold text-gray-100">{post.likeCount}</span>{' '}
            <span className="text-twitter-textMuted">Likes</span>
          </div>
          <div>
            <span className="font-bold text-gray-100">{post.replyCount}</span>{' '}
            <span className="text-twitter-textMuted">Replies</span>
          </div>
        </div>

        {/* Action icons bar */}
        <div className="flex items-center justify-around py-2 border-b border-neutral-900 text-twitter-textMuted">
          <button className="p-2 hover:text-twitter-blue hover:bg-twitter-blue/10 rounded-full transition-colors">
            <MessageCircle className="w-5 h-5" />
          </button>
          <button className="p-2 hover:text-green-500 hover:bg-green-500/10 rounded-full transition-colors">
            <Repeat2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleLikeToggle}
            className={`p-2 rounded-full transition-colors ${
              post.likedByCurrentUser
                ? 'text-pink-600 hover:bg-pink-600/10'
                : 'hover:text-pink-600 hover:bg-pink-600/10'
            }`}
          >
            <Heart
              className={`w-5 h-5 ${post.likedByCurrentUser ? 'fill-pink-600' : ''}`}
            />
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }}
            className="p-2 hover:text-twitter-blue hover:bg-twitter-blue/10 rounded-full transition-colors"
          >
            <Share className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Reply Composer */}
      {isAuthenticated ? (
        <PostComposer
          parentPostId={post.id}
          placeholder="Post your reply"
          isReply={true}
          onPostCreated={(reply) => {
            setReplies((prev) => [...prev, reply]);
            setPost({ ...post, replyCount: post.replyCount + 1 });
          }}
        />
      ) : (
        <div className="p-4 border-b border-twitter-border text-center text-sm text-twitter-textMuted">
          <Link to="/login" className="text-twitter-blue hover:underline font-bold">
            Sign in
          </Link>{' '}
          to reply to this post.
        </div>
      )}

      {/* Replies Thread */}
      <div className="divide-y divide-twitter-border">
        {replies.map((reply) => (
          <PostCard
            key={reply.id}
            post={reply}
            onPostDeleted={(deletedId) =>
              setReplies((prev) => prev.filter((r) => r.id !== deletedId))
            }
          />
        ))}
      </div>
    </div>
  );
};
