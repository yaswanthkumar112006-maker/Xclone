import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await login({
        usernameOrEmail: usernameOrEmail.trim(),
        password,
      });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black border border-twitter-border rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* X Logo */}
        <div className="flex justify-center mb-6">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-10 h-10 fill-white">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 text-center mb-8">
          Sign in to XClone
        </h1>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-twitter-textMuted mb-1">
              Username or Email
            </label>
            <input
              type="text"
              required
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="e.g. johndoe"
              className="w-full bg-neutral-900 border border-twitter-border rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-twitter-textMuted focus:outline-none focus:border-twitter-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-twitter-textMuted mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-900 border border-twitter-border rounded-lg px-4 py-3 text-sm text-gray-100 placeholder-twitter-textMuted focus:outline-none focus:border-twitter-blue pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-twitter-textMuted hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-gray-100 hover:bg-white text-black font-bold text-sm rounded-full transition-all disabled:opacity-50 shadow-lg"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-twitter-textMuted">
          Don't have an account?{' '}
          <Link to="/register" className="text-twitter-blue hover:underline font-bold">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};
