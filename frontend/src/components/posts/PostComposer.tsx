import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { postService } from '../../services/postService';
import { Post } from '../../types';
import { Image, Smile, AlertCircle } from 'lucide-react';

interface PostComposerProps {
  parentPostId?: number;
  placeholder?: string;
  onPostCreated?: (post: Post) => void;
  isReply?: boolean;
}

export const PostComposer: React.FC<PostComposerProps> = ({
  parentPostId,
  placeholder = "What is happening?!",
  onPostCreated,
  isReply = false,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxChars = 280;
  const charsRemaining = maxChars - content.length;
  const isOverLimit = charsRemaining < 0;
  const isEmpty = content.trim().length === 0;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isEmpty || isOverLimit || isSubmitting) return;

    if (!isAuthenticated) {
      setError('Please log in to post');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const newPost = await postService.createPost(content.trim(), parentPostId);
      setContent('');
      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const getCharCountColor = () => {
    if (charsRemaining < 0) return 'text-red-500 font-bold';
    if (charsRemaining <= 20) return 'text-yellow-500';
    return 'text-twitter-textMuted';
  };

  return (
    <div className={`p-4 border-b border-twitter-border flex gap-3 ${isReply ? 'pt-2' : ''}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.displayName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-gray-200">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'X'}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="flex-1 min-w-0">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={isReply ? 2 : 3}
          className="w-full bg-transparent text-gray-100 text-lg placeholder-twitter-textMuted resize-none outline-none focus:ring-0 leading-relaxed"
        />

        {error && (
          <div className="flex items-center gap-1 text-red-500 text-sm mb-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-neutral-900 mt-1">
          {/* Action icons */}
          <div className="flex items-center gap-2 text-twitter-blue">
            <button
              type="button"
              className="p-2 hover:bg-twitter-blue/10 rounded-full transition-colors"
              title="Media upload placeholder"
            >
              <Image className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 hover:bg-twitter-blue/10 rounded-full transition-colors"
              title="Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          {/* Right actions: count & submit */}
          <div className="flex items-center gap-3">
            {content.length > 0 && (
              <span className={`text-xs ${getCharCountColor()}`}>
                {charsRemaining}
              </span>
            )}

            <button
              onClick={() => handleSubmit()}
              disabled={isEmpty || isOverLimit || isSubmitting}
              className={`px-4 py-1.5 rounded-full font-bold text-sm transition-all duration-150 ${
                isEmpty || isOverLimit || isSubmitting
                  ? 'bg-twitter-blue/50 text-white/50 cursor-not-allowed'
                  : 'bg-twitter-blue hover:bg-twitter-hover text-white shadow'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Posting...
                </span>
              ) : isReply ? (
                'Reply'
              ) : (
                'Post'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
