import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Compass, Search, User as UserIcon, LogIn, Feather } from 'lucide-react';

interface MobileNavProps {
  onOpenComposerModal?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenComposerModal }) => {
  const { user, isAuthenticated } = useAuth();

  return (
    <>
      {/* Mobile Top Header */}
      <header className="sm:hidden sticky top-0 bg-black/80 backdrop-blur-md border-b border-twitter-border z-30 flex items-center justify-between px-4 py-2.5">
        <Link to={user ? `/profile/${user.username}` : '/login'}>
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-xs text-gray-200">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
          )}
        </Link>

        {/* X Logo */}
        <Link to="/" className="text-gray-100">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </Link>

        <div className="w-8" />
      </header>

      {/* Floating Action Button for Mobile Post */}
      {isAuthenticated && (
        <button
          onClick={onOpenComposerModal}
          className="sm:hidden fixed right-4 bottom-16 w-12 h-12 bg-twitter-blue hover:bg-twitter-hover text-white rounded-full flex items-center justify-center shadow-2xl z-40"
          title="Create post"
        >
          <Feather className="w-6 h-6" />
        </button>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-twitter-border flex items-center justify-around py-2 z-30">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `p-2 rounded-full ${isActive ? 'text-twitter-blue' : 'text-gray-400'}`
          }
        >
          <Home className="w-6 h-6" />
        </NavLink>

        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `p-2 rounded-full ${isActive ? 'text-twitter-blue' : 'text-gray-400'}`
          }
        >
          <Compass className="w-6 h-6" />
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            `p-2 rounded-full ${isActive ? 'text-twitter-blue' : 'text-gray-400'}`
          }
        >
          <Search className="w-6 h-6" />
        </NavLink>

        {isAuthenticated && user ? (
          <NavLink
            to={`/profile/${user.username}`}
            className={({ isActive }) =>
              `p-2 rounded-full ${isActive ? 'text-twitter-blue' : 'text-gray-400'}`
            }
          >
            <UserIcon className="w-6 h-6" />
          </NavLink>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `p-2 rounded-full ${isActive ? 'text-twitter-blue' : 'text-gray-400'}`
            }
          >
            <LogIn className="w-6 h-6" />
          </NavLink>
        )}
      </nav>
    </>
  );
};
