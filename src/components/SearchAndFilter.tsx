/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, X, Star, Clock, Filter, SlidersHorizontal } from 'lucide-react';
import { MRT_LINES } from '../data/transitData';
import { LineCode } from '../types/transit';

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLine: LineCode | 'ALL';
  setSelectedLine: (line: LineCode | 'ALL') => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (val: boolean) => void;
  favoritesCount: number;
  showLiveArrivals: boolean;
  setShowLiveArrivals: (val: boolean) => void;
  totalResultsCount: number;
  totalExitsCount: number;
}

const LINE_KEYS: LineCode[] = ['NS', 'EW', 'NE', 'CC', 'DT', 'TE', 'LRT'];

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedLine,
  setSelectedLine,
  showFavoritesOnly,
  setShowFavoritesOnly,
  favoritesCount,
  showLiveArrivals,
  setShowLiveArrivals,
  totalResultsCount,
  totalExitsCount,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-6 transition-all">
      {/* Search Input Bar */}
      <div className="relative mb-3.5">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Station (e.g. Orchard), Bus No. (e.g. 190), or Exit (e.g. Exit 1)..."
          className="w-full pl-11 pr-10 py-3 text-sm sm:text-base bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 rounded-xl transition-all outline-hidden text-slate-900 placeholder:text-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Line Filter Chips */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter by MRT / LRT Line</span>
          </span>
          <span className="text-xs text-slate-400 tabular-nums">
            {totalResultsCount} stations · {totalExitsCount} exits
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {/* ALL Button */}
          <button
            onClick={() => setSelectedLine('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              selectedLine === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Lines
          </button>

          {/* Line Chips with official colors */}
          {LINE_KEYS.map((code) => {
            const line = MRT_LINES[code];
            const isSelected = selectedLine === code;
            return (
              <button
                key={code}
                onClick={() => setSelectedLine(isSelected ? 'ALL' : code)}
                style={{
                  backgroundColor: isSelected ? line.color : undefined,
                  borderColor: isSelected ? line.color : undefined,
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 border cursor-pointer ${
                  isSelected
                    ? 'text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: isSelected ? '#FFFFFF' : line.color,
                  }}
                />
                <span>{line.code}</span>
                <span className="hidden sm:inline font-normal text-[11px] opacity-90">
                  {line.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Controls Bar: Favorites & Live Arrivals Toggle */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          {/* Favorites Filter Toggle */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              showFavoritesOnly
                ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                showFavoritesOnly
                  ? 'fill-amber-500 text-amber-500'
                  : 'text-slate-400'
              }`}
            />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-white/80 rounded-full tabular-nums">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Live Arrival Mode Toggle */}
          <button
            onClick={() => setShowLiveArrivals(!showLiveArrivals)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              showLiveArrivals
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
            }`}
          >
            <Clock
              className={`w-3.5 h-3.5 ${
                showLiveArrivals ? 'text-emerald-600' : 'text-slate-400'
              }`}
            />
            <span>Live Bus Timings</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                showLiveArrivals
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {showLiveArrivals ? 'Active' : 'Off'}
            </span>
          </button>
        </div>

        {/* Legend / Quick Help Hint */}
        <div className="text-[11px] text-slate-500 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="hidden sm:inline">Seats</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="hidden sm:inline">Standing</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="hidden sm:inline">Crowded</span>
          </span>
        </div>
      </div>
    </div>
  );
};
