import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Compass,
  Search,
  User as UserIcon,
  LogOut,
  LogIn,
  UserPlus,
  Feather,
  MoreHorizontal,
} from 'lucide-react';

interface SidebarProps {
  onOpenComposerModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenComposerModal }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-4 px-4 py-3 rounded-full text-xl hover:bg-neutral-900 transition-colors ${
      isActive ? 'font-bold text-gray-100' : 'text-gray-300'
    }`;

  return (
    <aside className="w-20 xl:w-64 h-screen sticky top-0 flex flex-col justify-between p-3 border-r border-twitter-border flex-shrink-0 select-none">
      {/* Top section: Logo & Nav */}
      <div className="flex flex-col gap-2">
        {/* X Logo */}
        <NavLink
          to="/"
          className="w-12 h-12 flex items-center justify-center hover:bg-neutral-900 rounded-full transition-colors mb-1 text-gray-100"
          title="XClone Home"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-8 h-8 fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </NavLink>

        {/* Navigation items */}
        <nav className="flex flex-col gap-1">
          <NavLink to="/" className={navItemClass}>
            <Home className="w-7 h-7" />
            <span className="hidden xl:inline">Home</span>
          </NavLink>

          <NavLink to="/explore" className={navItemClass}>
            <Compass className="w-7 h-7" />
            <span className="hidden xl:inline">Explore</span>
          </NavLink>

          <NavLink to="/search" className={navItemClass}>
            <Search className="w-7 h-7" />
            <span className="hidden xl:inline">Search</span>
          </NavLink>

          {isAuthenticated && user && (
            <NavLink to={`/profile/${user.username}`} className={navItemClass}>
              <UserIcon className="w-7 h-7" />
              <span className="hidden xl:inline">Profile</span>
            </NavLink>
          )}

          {!isAuthenticated && (
            <>
              <NavLink to="/login" className={navItemClass}>
                <LogIn className="w-7 h-7" />
                <span className="hidden xl:inline">Sign In</span>
              </NavLink>

              <NavLink to="/register" className={navItemClass}>
                <UserPlus className="w-7 h-7" />
                <span className="hidden xl:inline">Create Account</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Big Post Button */}
        {isAuthenticated && (
          <button
            onClick={() => {
              if (onOpenComposerModal) {
                onOpenComposerModal();
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="mt-4 w-12 h-12 xl:w-full xl:h-auto xl:py-3.5 bg-twitter-blue hover:bg-twitter-hover text-white font-bold rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-twitter-blue/20"
          >
            <Feather className="w-6 h-6 xl:hidden" />
            <span className="hidden xl:inline text-base font-bold">Post</span>
          </button>
        )}
      </div>

      {/* Bottom User Section */}
      {isAuthenticated && user ? (
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center justify-between p-3 rounded-full hover:bg-neutral-900 transition-colors text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-gray-200">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="hidden xl:block min-w-0">
                <div className="font-bold text-sm text-gray-100 truncate">{user.displayName}</div>
                <div className="text-twitter-textMuted text-xs truncate">@{user.username}</div>
              </div>
            </div>

            <MoreHorizontal className="hidden xl:block w-5 h-5 text-twitter-textMuted" />
          </button>

          {/* User Popover Menu */}
          {showUserMenu && (
            <div className="absolute bottom-full left-0 mb-2 w-64 bg-black border border-twitter-border rounded-2xl shadow-2xl py-2 z-30">
              <div className="px-4 py-2 border-b border-neutral-900">
                <div className="font-bold text-sm text-gray-100">{user.displayName}</div>
                <div className="text-twitter-textMuted text-xs">@{user.username}</div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-neutral-900 flex items-center gap-2 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                Log out @{user.username}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-2 hidden xl:block">
          <NavLink
            to="/login"
            className="w-full block py-2 px-4 text-center rounded-full border border-neutral-700 hover:bg-neutral-900 text-sm font-bold text-gray-200 transition-colors"
          >
            Log In
          </NavLink>
        </div>
      )}
    </aside>
  );
};
