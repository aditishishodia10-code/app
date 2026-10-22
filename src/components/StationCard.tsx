/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Star,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Bus,
  Footprints,
  Copy,
  Check,
  Accessibility,
} from 'lucide-react';
import { TransitStation, BusStop, StationExit } from '../types/transit';
import { MRT_LINES } from '../data/transitData';
import {
  generateBusArrivals,
  formatArrivalDisplay,
  getLoadBadgeDetails,
} from '../services/busArrivalService';

interface StationCardProps {
  station: TransitStation;
  isFavorite: boolean;
  onToggleFavorite: (stationId: string) => void;
  showLiveArrivals: boolean;
  searchQuery?: string;
  onSelectBus: (busNo: string, stop: BusStop, stationName: string) => void;
}

export const StationCard: React.FC<StationCardProps> = ({
  station,
  isFavorite,
  onToggleFavorite,
  showLiveArrivals,
  searchQuery = '',
  onSelectBus,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedStopCode, setCopiedStopCode] = useState<string | null>(null);
  const [refreshTimestamp, setRefreshTimestamp] = useState<number>(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshTimestamp(Date.now());
      setIsRefreshing(false);
    }, 400);
  };

  const handleCopyCode = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedStopCode(code);
    setTimeout(() => setCopiedStopCode(null), 2000);
  };

  // Google Maps walking navigation handler
  const handleOpenWalkingMap = (e: React.MouseEvent, stop: BusStop) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}&travelmode=walking`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Check if exit or bus stop matches search
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filterExits = (exits: StationExit[]) => {
    if (!normalizedQuery) return exits;
    return exits.filter((exit) => {
      const exitMatches =
        exit.id.toLowerCase().includes(normalizedQuery) ||
        exit.label.toLowerCase().includes(normalizedQuery) ||
        exit.landmarks.some((lm) => lm.toLowerCase().includes(normalizedQuery));

      const stopMatches = exit.busStops.some((stop) => {
        return (
          stop.code.includes(normalizedQuery) ||
          stop.name.toLowerCase().includes(normalizedQuery) ||
          stop.roadName.toLowerCase().includes(normalizedQuery) ||
          stop.buses.some((b) => b.toLowerCase() === normalizedQuery || b.includes(normalizedQuery))
        );
      });

      return exitMatches || stopMatches;
    });
  };

  const visibleExits = filterExits(station.exits);
  const displayExits = visibleExits.length > 0 ? visibleExits : station.exits;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden mb-5">
      {/* Station Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Station Codes & Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              {station.stationCodes.map((code) => {
                const prefix = code.replace(/[0-9]/g, '') as keyof typeof MRT_LINES;
                const lineInfo = MRT_LINES[prefix] || MRT_LINES.NS;
                return (
                  <span
                    key={code}
                    style={{ backgroundColor: lineInfo.color, color: lineInfo.textColor }}
                    className="px-2 py-0.5 rounded text-xs font-bold tracking-wider uppercase tabular-nums shadow-xs"
                  >
                    {code}
                  </span>
                );
              })}
              <span className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase px-1.5 py-0.5 bg-slate-200/80 rounded">
                {station.type}
              </span>
              {station.hasLiftAccess && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                  <Accessibility className="w-3 h-3" />
                  <span className="hidden sm:inline">Barrier-Free</span>
                </span>
              )}
            </div>

            {/* Station Name */}
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 truncate">
                {station.name}
              </h2>
            </div>

            <p className="text-xs text-slate-500 line-clamp-1">{station.overview}</p>
          </div>

          {/* Action buttons on header */}
          <div className="flex items-center gap-1 shrink-0 pt-0.5">
            {/* Live refresh button */}
            <button
              onClick={handleRefresh}
              title="Refresh live bus timings"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
              aria-label="Refresh live arrivals"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-slate-900' : ''}`}
              />
            </button>

            {/* Favorite Star Button */}
            <button
              onClick={() => onToggleFavorite(station.id)}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-amber-50 text-amber-500 hover:bg-amber-100'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-200/70'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Star
                className={`w-5 h-5 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`}
              />
            </button>

            {/* Collapse / Expand toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
              aria-label={isExpanded ? 'Collapse station' : 'Expand station'}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Exits Container */}
      {isExpanded && (
        <div className="divide-y divide-slate-100">
          {displayExits.map((exit) => (
            <div key={exit.id} className="p-4 sm:p-5 hover:bg-slate-50/40 transition-colors">
              {/* Exit Header & Walking Landmark Notes */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center min-w-[56px] px-2.5 py-1 text-xs font-bold bg-slate-900 text-white rounded-lg shadow-xs">
                    {exit.label}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <Footprints className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Towards {exit.landmarks.slice(0, 2).join(', ')}</span>
                    {exit.landmarks.length > 2 && (
                      <span className="text-slate-400">+{exit.landmarks.length - 2} more</span>
                    )}
                  </div>
                </div>

                {exit.accessibilityNotes && (
                  <span className="text-[11px] text-slate-500 bg-slate-100/90 px-2 py-0.5 rounded-md self-start sm:self-auto">
                    {exit.accessibilityNotes}
                  </span>
                )}
              </div>

              {/* Landmark tags row */}
              <div className="flex flex-wrap gap-1.5 mb-3.5">
                {exit.landmarks.map((landmark, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                  >
                    {landmark}
                  </span>
                ))}
              </div>

              {/* Associated Bus Stops */}
              <div className="space-y-3">
                {exit.busStops.map((stop) => (
                  <div
                    key={stop.code}
                    className="p-3.5 sm:p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all shadow-xs"
                  >
                    {/* Bus Stop Info Row */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm sm:text-base text-slate-900">
                            {stop.name}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{stop.roadName}</p>
                      </div>

                      {/* Prominent Clickable 5-Digit Bus Stop Code -> Opens Google Maps Walking Navigation */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={(e) => handleCopyCode(e, stop.code)}
                          title="Copy 5-digit bus stop code"
                          className="px-2 py-1.5 text-xs font-mono text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {copiedStopCode === stop.code ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-[11px] text-emerald-600 font-sans">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-[11px]">Copy Code</span>
                            </>
                          )}
                        </button>

                        {/* Core requirement #3: Prominent 5-digit button opening Google Maps walking directions */}
                        <button
                          onClick={(e) => handleOpenWalkingMap(e, stop)}
                          title="Open Google Maps Walking Directions"
                          className="group px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-mono font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5 text-emerald-200 group-hover:scale-110 transition-transform" />
                          <span>Stop #{stop.code}</span>
                          <span className="hidden sm:inline font-sans font-normal text-[11px] text-emerald-100 border-l border-emerald-500/80 pl-1.5">
                            Walk {stop.walkingMinutes || 1}m
                          </span>
                          <ExternalLink className="w-3 h-3 text-emerald-200 opacity-80" />
                        </button>
                      </div>
                    </div>

                    {/* Connecting Bus Services Header */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Bus className="w-3.5 h-3.5 text-slate-400" />
                        <span>Connecting Buses ({stop.buses.length})</span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {showLiveArrivals ? 'Live countdown shown below' : 'Tap bus for live arrivals'}
                      </span>
                    </div>

                    {/* Connecting Bus Services Display */}
                    {showLiveArrivals ? (
                      /* Detailed Real-Time Bus Arrival Information System */
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                        {stop.buses.map((busNo) => {
                          const arrivalData = generateBusArrivals(
                            stop.code,
                            busNo,
                            refreshTimestamp
                          );
                          const next3 = arrivalData.nextArrivals.slice(0, 3);
                          const nextArr = next3[0];
                          const nextArrDisplay = formatArrivalDisplay(nextArr.estimatedMinutes);
                          const loadInfo = getLoadBadgeDetails(nextArr.load);

                          return (
                            <button
                              key={busNo}
                              onClick={() => onSelectBus(busNo, stop, station.name)}
                              className="text-left p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
                            >
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                {/* Bus Number Pill */}
                                <div className="flex items-center gap-1.5">
                                  <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-slate-900 text-white group-hover:bg-red-600 transition-colors tabular-nums">
                                    {busNo}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {nextArr.type}
                                  </span>
                                </div>

                                {/* Load status indicator */}
                                <div
                                  className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${loadInfo.bgClass}`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${loadInfo.dotClass}`} />
                                  <span>{loadInfo.short}</span>
                                </div>
                              </div>

                              {/* Next 2-3 Estimated Arrivals */}
                              <div className="flex items-center gap-2 text-xs">
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-slate-400">Next:</span>
                                  <span
                                    className={`font-bold tabular-nums ${
                                      nextArrDisplay.isArriving
                                        ? 'text-emerald-600 animate-pulse font-extrabold'
                                        : 'text-slate-800'
                                    }`}
                                  >
                                    {nextArrDisplay.text}
                                  </span>
                                </div>

                                {next3.slice(1).map((arr, i) => {
                                  const disp = formatArrivalDisplay(arr.estimatedMinutes);
                                  return (
                                    <span
                                      key={i}
                                      className="text-slate-500 text-[11px] tabular-nums"
                                    >
                                      · {disp.text}
                                    </span>
                                  );
                                })}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      /* Compact Bus Service Pills */
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {stop.buses.map((busNo) => {
                          const isMatch =
                            normalizedQuery &&
                            (busNo === normalizedQuery || busNo.startsWith(normalizedQuery));

                          return (
                            <button
                              key={busNo}
                              onClick={() => onSelectBus(busNo, stop, station.name)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer tabular-nums shadow-2xs ${
                                isMatch
                                  ? 'bg-red-600 text-white ring-2 ring-red-400 scale-105'
                                  : 'bg-slate-100 hover:bg-slate-900 text-slate-800 hover:text-white'
                              }`}
                            >
                              {busNo}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
