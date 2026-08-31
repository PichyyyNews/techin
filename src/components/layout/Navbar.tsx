import React from 'react';
import { Play } from 'lucide-react';

interface NavbarProps {
  mode?: 'frame' | 'pixelpush';
  onToggleMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ mode = 'frame', onToggleMode }) => {
  if (mode === 'pixelpush') {
    return (
      <header className="w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-black/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={onToggleMode}>
            <div className="w-6 h-6 bg-neutral-950 dark:bg-white flex items-center justify-center rounded-xs text-white dark:text-neutral-950">
              <Play className="w-3 h-3 fill-current" />
            </div>
            <span className="font-bold tracking-tight text-base text-neutral-900 dark:text-white">
              Pixelpush
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
            <a href="#features" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#showcase" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
              Showcase
            </a>
            <a href="#resources" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
              Resources
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <a
              href="#login"
              className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white px-2 py-1"
            >
              Log in
            </a>
            <button className="hidden sm:inline-flex text-sm font-medium border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 rounded-full px-4 py-1.5 text-neutral-800 dark:text-neutral-200 transition-colors">
              Book a demo
            </button>
            <button className="text-sm font-medium bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-full px-4 py-1.5 transition-colors shadow-xs">
              Start for free
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Default: Frame Style Floating Capsule Nav
  return (
    <header className="w-full max-w-6xl mx-auto px-6 pt-6 pb-2 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={onToggleMode}>
        <div className="w-5 h-5 bg-neutral-950 dark:bg-white rounded-xs" />
        <span className="font-bold tracking-tight text-base text-neutral-950 dark:text-white">
          Frame
        </span>
      </div>

      {/* Floating Pill Nav */}
      <nav className="hidden md:flex items-center gap-1 bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800/80 rounded-full px-3 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 shadow-2xs backdrop-blur-md">
        <a
          href="#layouts"
          className="px-3 py-1 rounded-full hover:text-neutral-950 dark:hover:text-white transition-colors"
        >
          Layouts
        </a>
        <a
          href="#system"
          className="px-3 py-1 rounded-full hover:text-neutral-950 dark:hover:text-white transition-colors"
        >
          System
        </a>
        <a
          href="#docs"
          className="px-3 py-1 rounded-full hover:text-neutral-950 dark:hover:text-white transition-colors"
        >
          Docs
        </a>
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <a
          href="#signin"
          className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
        >
          Sign In
        </a>
        <button className="text-xs sm:text-sm font-medium bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700/80 rounded-full px-3.5 py-1.5 transition-colors">
          Open Frame
        </button>
      </div>
    </header>
  );
};
