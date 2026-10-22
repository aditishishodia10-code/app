/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, MapPin, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { TransitStation, BusStop } from '../types/transit';
import { StationCard } from './StationCard';

interface FavoritesViewProps {
  favoriteStations: TransitStation[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onClearFavorites: () => void;
  showLiveArrivals: boolean;
  onSelectBus: (busNo: string, stop: BusStop, stationName: string) => void;
  onAddSampleFavorites: () => void;
  onBrowseAll: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteStations,
  isFavorite,
  onToggleFavorite,
  onClearFavorites,
  showLiveArrivals,
  onSelectBus,
  onAddSampleFavorites,
  onBrowseAll,
}) => {
  if (favoriteStations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto my-6 shadow-xs">
        <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100 shadow-xs">
          <Star className="w-7 h-7 fill-amber-200 text-amber-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          No Favorite Stations Saved Yet
        </h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Tap the star icon on any MRT or LRT station card to pin your hotel, daily interchange, or frequently visited stops for fast one-tap navigation!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onAddSampleFavorites}
            className="w-full sm:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Add Orchard & Dhoby Ghaut</span>
          </button>
          <button
            onClick={onBrowseAll}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Browse All Stations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Favorites Banner / Header */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Star className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-amber-950">
              Saved Stations ({favoriteStations.length})
            </h2>
            <p className="text-xs text-amber-800">
              Instant access to your bookmarked MRT and LRT exit hubs
            </p>
          </div>
        </div>

        <button
          onClick={onClearFavorites}
          className="text-xs text-amber-800 hover:text-red-600 px-3 py-1.5 rounded-lg border border-amber-200 bg-white/70 hover:bg-white transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All Favorites</span>
        </button>
      </div>

      {/* List of Favorite Stations */}
      <div className="space-y-4">
        {favoriteStations.map((station) => (
          <StationCard
            key={station.id}
            station={station}
            isFavorite={isFavorite(station.id)}
            onToggleFavorite={onToggleFavorite}
            showLiveArrivals={showLiveArrivals}
            onSelectBus={onSelectBus}
          />
        ))}
      </div>
    </div>
  );
};
