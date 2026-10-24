import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { followService } from '../services/followService';
import { postService } from '../services/postService';
import { UserProfile, Post } from '../types';
import { PostCard } from '../components/posts/PostCard';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { formatJoinDate } from '../utils/formatDate';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Link as LinkIcon,
  MessageSquare,
  Heart,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'likes'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwner = currentUser?.username?.toLowerCase() === username?.toLowerCase();

  const loadProfile = async () => {
    if (!username) return;
    try {
      setIsLoadingProfile(true);
      setError(null);
      const data = await userService.getUserProfile(username);
      setProfile(data);
      setIsFollowing(data.followedByCurrentUser);
      setFollowersCount(data.followersCount);
    } catch (err: any) {
      console.error('Failed to load profile:', err);
      setError(err.message || 'User not found');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const loadTabContent = async () => {
    if (!username) return;
    try {
      setIsLoadingPosts(true);
      if (activeTab === 'posts') {
        const res = await postService.getUserPosts(username, 0, 30);
        setPosts(res.content);
      } else {
        const res = await postService.getUserLikes(username, 0, 30);
        setLikedPosts(res.content);
      }
    } catch (err) {
      console.error('Failed to load profile posts/likes:', err);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [username]);

  useEffect(() => {
    if (profile) {
      loadTabContent();
    }
  }, [profile, activeTab]);

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!username || isFollowLoading) return;

    const newFollowingState = !isFollowing;
    const newCount = newFollowingState ? followersCount + 1 : Math.max(0, followersCount - 1);

    setIsFollowing(newFollowingState);
    setFollowersCount(newCount);
    setIsFollowLoading(true);

    try {
      if (newFollowingState) {
        await followService.followUser(username);
      } else {
        await followService.unfollowUser(username);
      }
    } catch (err) {
      // Revert on error
      setIsFollowing(!newFollowingState);
      setFollowersCount(followersCount);
      console.error('Follow action failed:', err);
    } finally {
      setIsFollowLoading(false);
    }
  };

  if (isLoadingProfile) {
    return <LoadingSpinner size="lg" className="py-20" />;
  }

  if (error || !profile) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-400 mb-4">{error || 'This account does not exist'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-twitter-blue text-white rounded-full text-sm font-bold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const { user } = profile;

  return (
    <div className="min-h-screen pb-12">
      {/* Top Bar Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-twitter-border z-20 px-4 py-2 flex items-center gap-6">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 hover:bg-neutral-900 rounded-full text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-bold text-lg text-gray-100 leading-tight">{user.displayName}</h1>
          <p className="text-twitter-textMuted text-xs">{profile.postsCount} posts</p>
        </div>
      </div>

      {/* Profile Header Banner */}
      <div className="h-36 sm:h-48 bg-neutral-800 relative">
        {user.headerUrl ? (
          <img
            src={user.headerUrl}
            alt="Header Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-900 via-indigo-950 to-neutral-900" />
        )}
      </div>

      {/* Profile Details Section */}
      <div className="px-4 pb-4">
        {/* Avatar and Action Button */}
        <div className="flex justify-between items-end relative -mt-16 sm:-mt-20 mb-3">
          {/* Avatar */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-black bg-neutral-800 overflow-hidden flex items-center justify-center">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-3xl sm:text-4xl text-gray-200">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Action button: Edit Profile vs Follow/Unfollow */}
          <div>
            {isOwner ? (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-1.5 rounded-full border border-neutral-700 font-bold text-sm text-gray-200 hover:bg-neutral-900 transition-colors"
              >
                Edit profile
              </button>
            ) : (
              <button
                onClick={handleFollowToggle}
                disabled={isFollowLoading}
                className={`px-5 py-1.5 rounded-full font-bold text-sm transition-colors ${
                  isFollowing
                    ? 'border border-neutral-600 text-gray-200 hover:border-red-600 hover:text-red-500'
                    : 'bg-gray-100 hover:bg-white text-black'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        {/* Name and Handle */}
        <div className="mb-3">
          <h2 className="font-extrabold text-xl text-gray-100">{user.displayName}</h2>
          <p className="text-twitter-textMuted text-sm">@{user.username}</p>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-gray-200 text-sm leading-relaxed mb-3 break-words whitespace-pre-line">
            {user.bio}
          </p>
        )}

        {/* Metadata info: Location, Website, Joined Date */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-twitter-textMuted text-xs mb-3">
          {user.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{user.location}</span>
            </div>
          )}

          {user.website && (
            <div className="flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5" />
              <a
                href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                target="_blank"
                rel="noreferrer"
                className="text-twitter-blue hover:underline"
              >
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatJoinDate(user.createdAt)}</span>
          </div>
        </div>

        {/* Follower & Following Counts */}
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="font-bold text-gray-100">{profile.followingCount}</span>{' '}
            <span className="text-twitter-textMuted text-xs">Following</span>
          </div>
          <div>
            <span className="font-bold text-gray-100">{followersCount}</span>{' '}
            <span className="text-twitter-textMuted text-xs">Followers</span>
          </div>
        </div>
      </div>

      {/* Tabs: Posts / Likes */}
      <div className="flex border-b border-twitter-border">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-3 text-center text-sm font-bold relative transition-colors ${
            activeTab === 'posts' ? 'text-gray-100' : 'text-twitter-textMuted hover:bg-neutral-900/50'
          }`}
        >
          Posts
          {activeTab === 'posts' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-twitter-blue rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('likes')}
          className={`flex-1 py-3 text-center text-sm font-bold relative transition-colors ${
            activeTab === 'likes' ? 'text-gray-100' : 'text-twitter-textMuted hover:bg-neutral-900/50'
          }`}
        >
          Likes
          {activeTab === 'likes' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-twitter-blue rounded-full" />
          )}
        </button>
      </div>

      {/* Tab Content List */}
      {isLoadingPosts ? (
        <LoadingSpinner size="md" className="py-12" />
      ) : activeTab === 'posts' ? (
        posts.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-10 h-10" />}
            title="No posts yet"
            description={`@${user.username} hasn't posted yet.`}
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
              />
            ))}
          </div>
        )
      ) : likedPosts.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-10 h-10" />}
          title="No likes yet"
          description={`@${user.username} hasn't liked any posts yet.`}
        />
      ) : (
        <div className="divide-y divide-twitter-border">
          {likedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Edit Profile Modal */}
      {isOwner && (
        <EditProfileModal
          user={user}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onProfileUpdated={(updated) => {
            setProfile({ ...profile, user: updated });
          }}
        />
      )}
    </div>
  );
};
