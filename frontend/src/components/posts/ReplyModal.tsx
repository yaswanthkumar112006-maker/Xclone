import React from 'react';
import { Post } from '../../types';
import { PostComposer } from './PostComposer';
import { formatPostDate } from '../../utils/formatDate';
import { X } from 'lucide-react';

interface ReplyModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onReplySuccess: (reply: Post) => void;
}

export const ReplyModal: React.FC<ReplyModalProps> = ({
  post,
  isOpen,
  onClose,
  onReplySuccess,
}) => {
  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/60 backdrop-blur-sm p-4">
      <div
        className="bg-black border border-twitter-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-twitter-border">
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-100 hover:bg-neutral-900 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm text-gray-300">Reply</span>
          <div className="w-7" />
        </div>

        {/* Original Post Preview */}
        <div className="p-4 flex gap-3 relative pb-2">
          {/* Thread Line */}
          <div className="absolute left-[34px] top-14 bottom-0 w-0.5 bg-neutral-800" />

          {/* Avatar */}
          <div className="flex-shrink-0 z-10">
            {post.author.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                alt={post.author.displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-gray-200">
                {post.author.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-100 text-sm">{post.author.displayName}</span>
              <span className="text-twitter-textMuted text-xs">@{post.author.username}</span>
              <span className="text-twitter-textMuted text-xs">·</span>
              <span className="text-twitter-textMuted text-xs">{formatPostDate(post.createdAt)}</span>
            </div>
            <p className="text-gray-300 text-sm mt-1 leading-relaxed">{post.content}</p>
            <div className="text-xs text-twitter-textMuted mt-2">
              Replying to <span className="text-twitter-blue">@{post.author.username}</span>
            </div>
          </div>
        </div>

        {/* Reply Composer */}
        <div className="border-t border-neutral-900">
          <PostComposer
            parentPostId={post.id}
            placeholder="Post your reply"
            isReply={true}
            onPostCreated={(reply) => {
              onReplySuccess(reply);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};
