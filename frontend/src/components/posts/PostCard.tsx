import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Post } from '../../types';
import { formatPostDate } from '../../utils/formatDate';
import { useAuth } from '../../context/AuthContext';
import { likeService } from '../../services/likeService';
import { postService } from '../../services/postService';
import {
  MessageCircle,
  Repeat2,
  Heart,
  Share,
  MoreHorizontal,
  Trash2,
  Edit2,
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  onPostDeleted?: (postId: number) => void;
  onPostUpdated?: (updatedPost: Post) => void;
  onReplyClick?: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPostDeleted,
  onPostUpdated,
  onReplyClick,
}) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(post.likedByCurrentUser);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [isLiking, setIsLiking] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const isAuthor = user?.id === post.author.id;

  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isLiking) return;

    // Optimistic toggle
    const newLikedState = !isLiked;
    const newCount = newLikedState ? likeCount + 1 : Math.max(0, likeCount - 1);
    setIsLiked(newLikedState);
    setLikeCount(newCount);
    setIsLiking(true);

    try {
      if (newLikedState) {
        await likeService.likePost(post.id);
      } else {
        await likeService.unlikePost(post.id);
      }
    } catch (err) {
      // Revert if error
      setIsLiked(!newLikedState);
      setLikeCount(likeCount);
      console.error('Like action failed:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      setIsDeleting(true);
      await postService.deletePost(post.id);
      setShowMenu(false);
      if (onPostDeleted) {
        onPostDeleted(post.id);
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Could not delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    try {
      const updated = await postService.updatePost(post.id, editContent.trim());
      setIsEditing(false);
      setShowMenu(false);
      if (onPostUpdated) {
        onPostUpdated(updated);
      }
    } catch (err) {
      console.error('Failed to edit post:', err);
      alert('Could not update post');
    }
  };

  const handleCardClick = () => {
    navigate(`/post/${post.id}`);
  };

  return (
    <article
      onClick={handleCardClick}
      className="p-4 border-b border-twitter-border hover:bg-neutral-950/60 transition-colors cursor-pointer relative"
    >
      <div className="flex gap-3">
        {/* Author Avatar */}
        <Link
          to={`/profile/${post.author.username}`}
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0"
        >
          {post.author.avatarUrl ? (
            <img
              src={post.author.avatarUrl}
              alt={post.author.displayName}
              className="w-10 h-10 rounded-full object-cover hover:opacity-90 transition-opacity"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-gray-200 hover:border-neutral-600 transition-colors">
              {post.author.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </Link>

        {/* Post Content & Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <Link
                to={`/profile/${post.author.username}`}
                onClick={(e) => e.stopPropagation()}
                className="font-bold text-gray-100 hover:underline truncate text-sm sm:text-base"
              >
                {post.author.displayName}
              </Link>
              <Link
                to={`/profile/${post.author.username}`}
                onClick={(e) => e.stopPropagation()}
                className="text-twitter-textMuted text-xs sm:text-sm truncate"
              >
                @{post.author.username}
              </Link>
              <span className="text-twitter-textMuted text-xs">·</span>
              <span className="text-twitter-textMuted text-xs sm:text-sm hover:underline">
                {formatPostDate(post.createdAt)}
              </span>
            </div>

            {/* Menu button for author */}
            {isAuthor && (
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 text-twitter-textMuted hover:text-twitter-blue hover:bg-twitter-blue/10 rounded-full transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 w-36 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl py-1 z-20">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-neutral-800 flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4 text-blue-400" />
                      Edit Post
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Replying indicator */}
          {post.parentPostAuthorUsername && (
            <div className="text-xs text-twitter-textMuted mt-0.5 mb-1">
              Replying to{' '}
              <Link
                to={`/profile/${post.parentPostAuthorUsername}`}
                onClick={(e) => e.stopPropagation()}
                className="text-twitter-blue hover:underline"
              >
                @{post.parentPostAuthorUsername}
              </Link>
            </div>
          )}

          {/* Edit mode or Content display */}
          {isEditing ? (
            <form onSubmit={handleSaveEdit} onClick={(e) => e.stopPropagation()} className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                maxLength={280}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-gray-100 text-sm outline-none focus:border-twitter-blue"
                rows={3}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-xs rounded-full border border-neutral-700 hover:bg-neutral-800 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs rounded-full bg-twitter-blue hover:bg-twitter-hover text-white font-bold"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <p className="mt-1 text-gray-200 text-sm sm:text-[15px] leading-relaxed break-words whitespace-pre-line">
              {post.content}
            </p>
          )}

          {/* Interaction Bar */}
          <div className="flex items-center justify-between mt-3 max-w-md text-twitter-textMuted">
            {/* Reply */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onReplyClick) {
                  onReplyClick(post);
                } else {
                  navigate(`/post/${post.id}`);
                }
              }}
              className="flex items-center gap-1.5 hover:text-twitter-blue group transition-colors"
            >
              <div className="p-2 rounded-full group-hover:bg-twitter-blue/10 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-xs">{post.replyCount > 0 ? post.replyCount : ''}</span>
            </button>

            {/* Repost (placeholder) */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 hover:text-green-500 group transition-colors"
              title="Repost"
            >
              <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors">
                <Repeat2 className="w-4 h-4" />
              </div>
            </button>

            {/* Like */}
            <button
              onClick={handleLikeToggle}
              className={`flex items-center gap-1.5 group transition-colors ${
                isLiked ? 'text-pink-600' : 'hover:text-pink-600'
              }`}
            >
              <div className="p-2 rounded-full group-hover:bg-pink-600/10 transition-colors">
                <Heart
                  className={`w-4 h-4 transition-transform ${
                    isLiked ? 'fill-pink-600 scale-110' : 'group-hover:scale-110'
                  }`}
                />
              </div>
              <span className={`text-xs ${isLiked ? 'text-pink-600 font-semibold' : ''}`}>
                {likeCount > 0 ? likeCount : ''}
              </span>
            </button>

            {/* Share */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard?.writeText(window.location.origin + `/post/${post.id}`);
                alert('Post link copied to clipboard!');
              }}
              className="flex items-center gap-1.5 hover:text-twitter-blue group transition-colors"
              title="Copy Link"
            >
              <div className="p-2 rounded-full group-hover:bg-twitter-blue/10 transition-colors">
                <Share className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
