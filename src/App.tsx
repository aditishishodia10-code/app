/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Compass,
  Bus,
  MapPin,
  Star,
  BookOpen,
  Sparkles,
  RotateCcw,
  Footprints,
  Info,
  Layers,
} from 'lucide-react';
import { TRANSIT_STATIONS } from './data/transitData';
import { LineCode, TransitStation, BusStop } from './types/transit';
import { useFavorites } from './hooks/useFavorites';
import { Header } from './components/Header';
import { SearchAndFilter } from './components/SearchAndFilter';
import { StationCard } from './components/StationCard';
import { FavoritesView } from './components/FavoritesView';
import { BusArrivalModal } from './components/BusArrivalModal';
import { NewcomerGuideModal } from './components/NewcomerGuideModal';
import { BottomNav } from './components/BottomNav';

export default function App() {
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'guide'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLine, setSelectedLine] = useState<LineCode | 'ALL'>('ALL');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showLiveArrivals, setShowLiveArrivals] = useState(true);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Selected bus modal state
  const [selectedBus, setSelectedBus] = useState<{
    busNo: string;
    stop: BusStop;
    stationName: string;
  } | null>(null);

  // Favorites hook
  const {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount,
  } = useFavorites();

  // Filter stations based on search query, line filter, and favorites toggle
  const filteredStations = useMemo(() => {
    return TRANSIT_STATIONS.filter((station) => {
      // Favorites filter
      if ((showFavoritesOnly || activeTab === 'favorites') && !favorites.includes(station.id)) {
        return false;
      }

      // Line filter
      if (selectedLine !== 'ALL' && !station.lines.includes(selectedLine)) {
        return false;
      }

      // Search query filter (matches Station Name, Station Code, Exit Identifier, Landmark, Bus Stop Code, or Bus Service No.)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        
        const stationNameMatches = station.name.toLowerCase().includes(query);
        const codeMatches = station.stationCodes.some((code) =>
          code.toLowerCase().includes(query)
        );

        const exitMatches = station.exits.some((exit) => {
          const exitIdMatches =
            exit.id.toLowerCase().includes(query) ||
            exit.label.toLowerCase().includes(query) ||
            exit.landmarks.some((lm) => lm.toLowerCase().includes(query));

          const busMatches = exit.busStops.some((stop) => {
            return (
              stop.code.includes(query) ||
              stop.name.toLowerCase().includes(query) ||
              stop.roadName.toLowerCase().includes(query) ||
              stop.buses.some((b) => b.toLowerCase() === query || b.includes(query))
            );
          });

          return exitIdMatches || busMatches;
        });

        return stationNameMatches || codeMatches || exitMatches;
      }

      return true;
    });
  }, [searchQuery, selectedLine, showFavoritesOnly, activeTab, favorites]);

  // Favorite stations subset
  const favoriteStations = useMemo(() => {
    return TRANSIT_STATIONS.filter((s) => favorites.includes(s.id));
  }, [favorites]);

  // Compute total exits count
  const totalExitsCount = useMemo(() => {
    return filteredStations.reduce((acc, station) => acc + station.exits.length, 0);
  }, [filteredStations]);

  const handleSelectBus = (busNo: string, stop: BusStop, stationName: string) => {
    setSelectedBus({ busNo, stop, stationName });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLine('ALL');
    setShowFavoritesOnly(false);
  };

  const handleAddSampleFavorites = () => {
    if (!favorites.includes('orchard')) toggleFavorite('orchard');
    if (!favorites.includes('dhoby-ghaut')) toggleFavorite('dhoby-ghaut');
    if (!favorites.includes('jurong-east')) toggleFavorite('jurong-east');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased pb-20 md:pb-12">
      {/* Top Bar Contract compliant Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={favoritesCount}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Section Banner */}
        <div className="relative mb-6 sm:mb-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-8 shadow-md overflow-hidden">
          {/* Subtle geometric graphic overlay */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/4 -top-10 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Singapore MRT & LRT to Bus Connect</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Which Exit for Your Bus?
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Find the exact MRT or LRT exit letter, walking route, 5-digit bus stop code, and live bus arrivals so you never wander lost in Singapore stations.
            </p>

            {/* Quick Sample Search Chips */}
            <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium mr-1">Popular hubs:</span>
              {[
                { label: 'Orchard Exit 1', q: 'Orchard Exit 1' },
                { label: 'Jurong East Bus Int', q: 'Jurong East' },
                { label: 'Bus 190 (Chinatown / Orchard)', q: '190' },
                { label: 'Dhoby Ghaut', q: 'Dhoby Ghaut' },
                { label: 'Punggol Waterway', q: 'Punggol' },
                { label: 'Bukit Panjang LRT', q: 'Bukit Panjang' },
              ].map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => {
                    setSearchQuery(chip.q);
                    setActiveTab('all');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 transition-colors cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View Switch: Favorites Tab vs All Stations */}
        {activeTab === 'favorites' ? (
          <FavoritesView
            favoriteStations={favoriteStations}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onClearFavorites={clearFavorites}
            showLiveArrivals={showLiveArrivals}
            onSelectBus={handleSelectBus}
            onAddSampleFavorites={handleAddSampleFavorites}
            onBrowseAll={() => setActiveTab('all')}
          />
        ) : (
          <>
            {/* Search, Filter, and Controls */}
            <SearchAndFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedLine={selectedLine}
              setSelectedLine={setSelectedLine}
              showFavoritesOnly={showFavoritesOnly}
              setShowFavoritesOnly={setShowFavoritesOnly}
              favoritesCount={favoritesCount}
              showLiveArrivals={showLiveArrivals}
              setShowLiveArrivals={setShowLiveArrivals}
              totalResultsCount={filteredStations.length}
              totalExitsCount={totalExitsCount}
            />

            {/* Station Cards Feed */}
            {filteredStations.length > 0 ? (
              <div className="space-y-4">
                {filteredStations.map((station) => (
                  <StationCard
                    key={station.id}
                    station={station}
                    isFavorite={isFavorite(station.id)}
                    onToggleFavorite={toggleFavorite}
                    showLiveArrivals={showLiveArrivals}
                    searchQuery={searchQuery}
                    onSelectBus={handleSelectBus}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search / Filter State */
              <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  No Matching Stations or Buses Found
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-5">
                  We couldn't find any station, bus number, or exit matching{' '}
                  <strong className="text-slate-700">"{searchQuery}"</strong>{' '}
                  {selectedLine !== 'ALL' && `on the ${selectedLine} Line`}.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SG Transit Navigator</span>
            <span>·</span>
            <span>Singapore MRT & LRT Exit Guide</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-slate-900 underline underline-offset-2 cursor-pointer"
            >
              Newcomer Transit Tips
            </button>
            <button
              onClick={() => {
                setActiveTab('favorites');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 underline underline-offset-2 cursor-pointer"
            >
              Saved Stations ({favoritesCount})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Slide-overs */}
      <BusArrivalModal
        busNo={selectedBus?.busNo || null}
        stop={selectedBus?.stop || null}
        stationName={selectedBus?.stationName || null}
        onClose={() => setSelectedBus(null)}
        onFilterByBus={(bus) => setSearchQuery(bus)}
      />

      <NewcomerGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Mobile-First Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={favoritesCount}
        showLiveArrivals={showLiveArrivals}
        setShowLiveArrivals={setShowLiveArrivals}
        onOpenGuide={() => setIsGuideOpen(true)}
      />
    </div>
  );
}
