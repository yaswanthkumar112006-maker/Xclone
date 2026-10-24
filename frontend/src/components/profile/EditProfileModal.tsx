import React, { useState } from 'react';
import { User, UpdateProfilePayload } from '../../types';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { X, Camera } from 'lucide-react';

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: (updatedUser: User) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onProfileUpdated,
}) => {
  const { updateUser } = useAuth();
  const [formData, setFormData] = useState<UpdateProfilePayload>({
    displayName: user.displayName || '',
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
    avatarUrl: user.avatarUrl || '',
    headerUrl: user.headerUrl || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.displayName?.trim()) {
      setError('Display name cannot be empty');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      const updated = await userService.updateProfile(formData);
      updateUser(updated);
      onProfileUpdated(updated);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className="bg-black border border-twitter-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-twitter-border">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-100 hover:bg-neutral-900 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-gray-100">Edit profile</h2>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-1.5 bg-gray-100 hover:bg-white text-black font-bold text-sm rounded-full transition-all disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 text-red-400 text-sm border-b border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Header Banner Preview */}
          <div className="relative h-28 bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700">
            {formData.headerUrl ? (
              <img
                src={formData.headerUrl}
                alt="Header Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-900 to-indigo-900 flex items-center justify-center text-xs text-gray-400">
                No Header Image
              </div>
            )}
          </div>

          {/* Header Image URL */}
          <div>
            <label className="block text-xs font-medium text-twitter-textMuted mb-1">
              Header Image URL
            </label>
            <input
              type="url"
              value={formData.headerUrl}
              onChange={(e) => setFormData({ ...formData, headerUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-transparent border border-twitter-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-twitter-blue"
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-xs font-medium text-twitter-textMuted mb-1">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-transparent border border-twitter-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-twitter-blue"
            />
          </div>

          {/* Display Name */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-twitter-textMuted">Name</label>
              <span className="text-xs text-twitter-textMuted">
                {formData.displayName?.length || 0} / 50
              </span>
            </div>
            <input
              type="text"
              required
              maxLength={50}
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full bg-transparent border border-twitter-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-twitter-blue"
            />
          </div>

          {/* Bio */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-twitter-textMuted">Bio</label>
              <span className="text-xs text-twitter-textMuted">
                {formData.bio?.length || 0} / 160
              </span>
            </div>
            <textarea
              maxLength={160}
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell the world about yourself"
              className="w-full bg-transparent border border-twitter-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-twitter-blue resize-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-medium text-twitter-textMuted mb-1">
              Location
            </label>
            <input
              type="text"
              maxLength={30}
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. San Francisco, CA"
              className="w-full bg-transparent border border-twitter-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-twitter-blue"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-xs font-medium text-twitter-textMuted mb-1">
              Website
            </label>
            <input
              type="text"
              maxLength={100}
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://yourportfolio.dev"
              className="w-full bg-transparent border border-twitter-border rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-twitter-blue"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
