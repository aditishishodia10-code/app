/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Star, BookOpen, Clock } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'all' | 'favorites' | 'guide';
  setActiveTab: (tab: 'all' | 'favorites' | 'guide') => void;
  favoritesCount: number;
  showLiveArrivals: boolean;
  setShowLiveArrivals: (val: boolean) => void;
  onOpenGuide: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  favoritesCount,
  showLiveArrivals,
  setShowLiveArrivals,
  onOpenGuide,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe">
      <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto px-2">
        {/* Tab 1: Stations */}
        <button
          onClick={() => setActiveTab('all')}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeTab === 'all' ? 'text-red-600' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Stations and Exits"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-tight mt-1">Stations</span>
        </button>

        {/* Tab 2: Favorites */}
        <button
          onClick={() => setActiveTab('favorites')}
          className={`min-h-[44px] relative flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeTab === 'favorites' ? 'text-amber-500 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Favorite Stations"
        >
          <div className="relative">
            <Star className={`w-5 h-5 ${activeTab === 'favorites' ? 'fill-amber-400' : ''}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center tabular-nums shadow-2xs">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight mt-1">Favorites</span>
        </button>

        {/* Tab 3: Live Timings Toggle */}
        <button
          onClick={() => setShowLiveArrivals(!showLiveArrivals)}
          className={`min-h-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            showLiveArrivals ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Toggle live bus timings"
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-tight mt-1">
            {showLiveArrivals ? 'Live: ON' : 'Live: OFF'}
          </span>
        </button>

        {/* Tab 4: Guide */}
        <button
          onClick={onOpenGuide}
          className="min-h-[44px] flex flex-col items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          aria-label="Transit Newcomer Guide"
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-semibold tracking-tight mt-1">Guide</span>
        </button>
      </div>
    </div>
  );
};
