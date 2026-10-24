import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { userService } from '../../services/userService';
import { followService } from '../../services/followService';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const RightSidebar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});
  const { user: currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const res = await userService.searchUsers('', 0, 4);
        const filtered = res.content.filter((u) => u.id !== currentUser?.id);
        setSuggestedUsers(filtered);
      } catch (err) {
        console.error('Failed to load user suggestions:', err);
      }
    };

    loadSuggestions();
  }, [currentUser]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleFollowToggle = async (username: string) => {
    if (!isAuthenticated) {
      navigate('/login');
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
      // Revert on failure
      setFollowingStates((prev) => ({ ...prev, [username]: isFollowing }));
      console.error('Follow toggle error:', err);
    }
  };

  return (
    <aside className="w-80 lg:w-88 hidden lg:block p-4 sticky top-0 h-screen overflow-y-auto flex-shrink-0 space-y-4">
      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-twitter-textMuted">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search XClone"
          className="w-full bg-neutral-900 border border-neutral-800 rounded-full pl-10 pr-4 py-2.5 text-sm text-gray-100 placeholder-twitter-textMuted focus:outline-none focus:border-twitter-blue focus:bg-black transition-colors"
        />
      </form>

      {/* Subscribe to Premium Box */}
      <div className="bg-neutral-950 border border-twitter-border rounded-2xl p-4">
        <h3 className="font-bold text-gray-100 text-base mb-1 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-twitter-blue" />
          Subscribe to Premium
        </h3>
        <p className="text-twitter-textMuted text-xs leading-relaxed mb-3">
          Subscribe to unlock new features and if eligible, receive a creator revenue share.
        </p>
        <button
          onClick={() => alert('Premium tier features coming soon!')}
          className="px-4 py-2 bg-twitter-blue hover:bg-twitter-hover text-white font-bold text-sm rounded-full transition-colors"
        >
          Subscribe
        </button>
      </div>

      {/* What's happening */}
      <div className="bg-neutral-950 border border-twitter-border rounded-2xl overflow-hidden">
        <h3 className="font-bold text-gray-100 text-base p-4 pb-2">What's happening</h3>

        <div className="divide-y divide-neutral-900">
          <div className="p-3.5 hover:bg-neutral-900/60 transition-colors cursor-pointer">
            <span className="text-xs text-twitter-textMuted">Technology · Trending</span>
            <div className="font-bold text-sm text-gray-200 mt-0.5">#SpringSecurity</div>
            <span className="text-xs text-twitter-textMuted mt-1 block">48.2K posts</span>
          </div>

          <div className="p-3.5 hover:bg-neutral-900/60 transition-colors cursor-pointer">
            <span className="text-xs text-twitter-textMuted">Programming · Trending</span>
            <div className="font-bold text-sm text-gray-200 mt-0.5">PostgreSQL 17</div>
            <span className="text-xs text-twitter-textMuted mt-1 block">22.4K posts</span>
          </div>

          <div className="p-3.5 hover:bg-neutral-900/60 transition-colors cursor-pointer">
            <span className="text-xs text-twitter-textMuted">Software Engineering · Trending</span>
            <div className="font-bold text-sm text-gray-200 mt-0.5">#React19</div>
            <span className="text-xs text-twitter-textMuted mt-1 block">91.8K posts</span>
          </div>
        </div>
      </div>

      {/* Who to follow recommendations */}
      {suggestedUsers.length > 0 && (
        <div className="bg-neutral-950 border border-twitter-border rounded-2xl overflow-hidden">
          <h3 className="font-bold text-gray-100 text-base p-4 pb-2">Who to follow</h3>

          <div className="divide-y divide-neutral-900">
            {suggestedUsers.map((u) => {
              const following = !!followingStates[u.username];
              return (
                <div
                  key={u.id}
                  className="p-3.5 flex items-center justify-between hover:bg-neutral-900/60 transition-colors"
                >
                  <Link
                    to={`/profile/${u.username}`}
                    className="flex items-center gap-2.5 min-w-0"
                  >
                    {u.avatarUrl ? (
                      <img
                        src={u.avatarUrl}
                        alt={u.displayName}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-gray-200 text-xs flex-shrink-0">
                        {u.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-gray-100 truncate hover:underline">
                        {u.displayName}
                      </div>
                      <div className="text-twitter-textMuted text-xs truncate">@{u.username}</div>
                    </div>
                  </Link>

                  <button
                    onClick={() => handleFollowToggle(u.username)}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                      following
                        ? 'border border-neutral-600 text-gray-200 hover:border-red-600 hover:text-red-500'
                        : 'bg-gray-100 hover:bg-white text-black'
                    }`}
                  >
                    {following ? 'Following' : 'Follow'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer credits */}
      <footer className="text-xs text-twitter-textMuted px-2 space-y-1">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Cookie Policy</a>
          <a href="#" className="hover:underline">Accessibility</a>
        </div>
        <div>© 2026 XClone, Inc.</div>
      </footer>
    </aside>
  );
};
