import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-extrabold text-gray-100 mb-2">Hmm... this page doesn’t exist.</h2>
      <p className="text-twitter-textMuted text-sm mb-6">
        Try searching for something else, or head back to your home feed.
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 bg-twitter-blue hover:bg-twitter-hover text-white font-bold text-sm rounded-full transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
};
