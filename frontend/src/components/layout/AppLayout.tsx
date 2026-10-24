import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { RightSidebar } from './RightSidebar';
import { MobileNav } from './MobileNav';
import { PostComposer } from '../posts/PostComposer';
import { X } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [isComposerModalOpen, setIsComposerModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-gray-100 flex justify-center">
      <div className="flex w-full max-w-7xl justify-center">
        {/* Left Desktop Sidebar */}
        <div className="hidden sm:block">
          <Sidebar onOpenComposerModal={() => setIsComposerModalOpen(true)} />
        </div>

        {/* Center Main Content Feed */}
        <main className="w-full sm:max-w-[600px] min-h-screen border-r sm:border-x border-twitter-border pb-16 sm:pb-0">
          <MobileNav onOpenComposerModal={() => setIsComposerModalOpen(true)} />
          <Outlet />
        </main>

        {/* Right Sidebar (Trends, Recommendations) */}
        <RightSidebar />
      </div>

      {/* Global Post Composer Modal */}
      {isComposerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm p-4">
          <div
            className="bg-black border border-twitter-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-twitter-border">
              <button
                onClick={() => setIsComposerModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-100 hover:bg-neutral-900 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="font-bold text-sm text-gray-300">Create Post</span>
              <div className="w-6" />
            </div>

            <PostComposer
              placeholder="What is happening?!"
              onPostCreated={() => {
                setIsComposerModalOpen(false);
                window.location.reload();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
