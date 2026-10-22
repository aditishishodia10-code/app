/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, BookOpen, Star, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'all' | 'favorites' | 'guide';
  setActiveTab: (tab: 'all' | 'favorites' | 'guide') => void;
  favoritesCount: number;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  favoritesCount,
  onOpenGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Brand Zone */}
        <button
          onClick={() => setActiveTab('all')}
          className="flex items-center gap-2.5 text-left group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                SG Transit Navigator
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-red-100 text-red-700 rounded">
                MRT · Bus
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block whitespace-nowrap">
              MRT & LRT Exits to Singapore Buses
            </p>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('all')}
            className={`whitespace-nowrap transition-colors ${
              activeTab === 'all'
                ? 'text-red-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Stations & Exits
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'favorites'
                ? 'text-red-600 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <span>Saved Stations</span>
            {favoritesCount > 0 && (
              <span className="px-1.5 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-800 rounded-full tabular-nums">
                {favoritesCount}
              </span>
            )}
          </button>
          <button
            onClick={onOpenGuide}
            className="whitespace-nowrap flex items-center gap-1 hover:text-slate-900 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Transit Tips</span>
          </button>
        </nav>

        {/* Primary Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenGuide}
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 transition-all rounded-lg flex items-center gap-1.5 shadow-sm whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Newcomer Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
};
