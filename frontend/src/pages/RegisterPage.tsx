import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !displayName.trim() || !email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await register({
        username: username.trim().toLowerCase(),
        displayName: displayName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
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

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 text-center mb-6">
          Create your account
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
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. johndoe"
              className="w-full bg-neutral-900 border border-twitter-border rounded-lg px-4 py-2.5 text-sm text-gray-100 placeholder-twitter-textMuted focus:outline-none focus:border-twitter-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-twitter-textMuted mb-1">
              Display Name
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-neutral-900 border border-twitter-border rounded-lg px-4 py-2.5 text-sm text-gray-100 placeholder-twitter-textMuted focus:outline-none focus:border-twitter-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-twitter-textMuted mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full bg-neutral-900 border border-twitter-border rounded-lg px-4 py-2.5 text-sm text-gray-100 placeholder-twitter-textMuted focus:outline-none focus:border-twitter-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-twitter-textMuted mb-1">
              Password (min 6 characters)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-900 border border-twitter-border rounded-lg px-4 py-2.5 text-sm text-gray-100 placeholder-twitter-textMuted focus:outline-none focus:border-twitter-blue pr-10"
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
            className="w-full mt-4 py-3 bg-twitter-blue hover:bg-twitter-hover text-white font-bold text-sm rounded-full transition-all disabled:opacity-50 shadow-lg shadow-twitter-blue/20"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-twitter-textMuted">
          Already have an account?{' '}
          <Link to="/login" className="text-twitter-blue hover:underline font-bold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
