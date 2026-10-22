/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Bus,
  MapPin,
  Navigation,
  RefreshCw,
  ExternalLink,
  Search,
  Clock,
  Accessibility,
  Footprints,
} from 'lucide-react';
import { BusStop } from '../types/transit';
import {
  generateBusArrivals,
  formatArrivalDisplay,
  getLoadBadgeDetails,
} from '../services/busArrivalService';

interface BusArrivalModalProps {
  busNo: string | null;
  stop: BusStop | null;
  stationName: string | null;
  onClose: () => void;
  onFilterByBus: (busNo: string) => void;
}

export const BusArrivalModal: React.FC<BusArrivalModalProps> = ({
  busNo,
  stop,
  stationName,
  onClose,
  onFilterByBus,
}) => {
  const [refreshSeed, setRefreshSeed] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!busNo || !stop) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshSeed(Date.now());
      setIsRefreshing(false);
    }, 350);
  };

  const arrivalData = generateBusArrivals(stop.code, busNo, refreshSeed);
  const arrivals = arrivalData.nextArrivals;

  const handleOpenWalkingMap = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}&travelmode=walking`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Mobile Grab Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg tabular-nums shadow-xs">
              {busNo}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
                  Bus Service Details
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-mono">#{stop.code}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Bus {busNo} at {stop.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleRefresh}
              title="Refresh timings"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Estimated Next 3 Arrivals Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Next 3 Estimated Arrivals</span>
              </span>
              <span className="text-[11px] text-slate-400 tabular-nums">
                Updated just now
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {arrivals.map((arr, idx) => {
                const disp = formatArrivalDisplay(arr.estimatedMinutes);
                const loadDetails = getLoadBadgeDetails(arr.load);
                return (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-slate-200 text-center shadow-xs flex flex-col justify-between"
                  >
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      {idx === 0 ? '1st Bus' : idx === 1 ? '2nd Bus' : '3rd Bus'}
                    </span>
                    <div
                      className={`text-xl font-bold my-1 tabular-nums ${
                        disp.isArriving
                          ? 'text-emerald-600 animate-pulse font-extrabold'
                          : 'text-slate-900'
                      }`}
                    >
                      {disp.text}
                    </div>
                    <div className="space-y-1">
                      <span
                        className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${loadDetails.bgClass}`}
                      >
                        {loadDetails.short}
                      </span>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {arr.type === 'DD' ? 'Double Deck' : 'Single Deck'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bus Stop Details & Walking Route */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Bus Stop Location
                </span>
                <h4 className="font-semibold text-slate-900 text-sm">{stop.name}</h4>
                <p className="text-xs text-slate-500">{stop.roadName}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold px-2 py-1 bg-slate-100 rounded text-slate-700">
                  #{stop.code}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
              <Footprints className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Approx. <strong>{stop.walkingMinutes || 1} min walk</strong> from{' '}
                {stationName} exit (~{stop.distanceMeters || 60}m)
              </span>
            </div>

            {/* Google Maps Walking Navigation button */}
            <button
              onClick={handleOpenWalkingMap}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-emerald-200" />
              <span>Open Walking Directions in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
            </button>
          </div>

          {/* Action to Filter by this Bus across all stations */}
          <div className="pt-1">
            <button
              onClick={() => {
                onFilterByBus(busNo);
                onClose();
              }}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Find all MRT / LRT exits connecting to Bus {busNo}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
