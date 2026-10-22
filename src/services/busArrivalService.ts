/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BusArrivalData, LiveBusArrival, BusLoad, BusVehicleType } from '../types/transit';

/**
 * Deterministic pseudo-random number generator for realistic Singapore LTA-style bus arrivals.
 * Uses bus stop code + bus service number + 2-minute cycle seed so countdowns decrease naturally.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateBusArrivals(
  stopCode: string,
  serviceNo: string,
  baseTimeMs: number = Date.now()
): BusArrivalData {
  const seed = hashString(`${stopCode}_${serviceNo}`);
  
  // Base intervals vary per bus line (feeder vs trunk)
  const isTrunk = serviceNo.length <= 2 || parseInt(serviceNo, 10) > 100;
  const intervalBase = isTrunk ? 7 : 11;
  const jitter = (seed % 5) + 3; // 3 to 7 min offset

  // Current cycle position based on current minute
  const minuteNow = Math.floor(baseTimeMs / 60000);
  const cycleIndex = (minuteNow + (seed % 17)) % (intervalBase + jitter);
  
  // Next arrival in minutes (0 means 'Arr')
  const arr1Min = Math.max(0, cycleIndex);
  const arr2Min = arr1Min + intervalBase + ((seed >> 2) % 4);
  const arr3Min = arr2Min + intervalBase + ((seed >> 4) % 5);

  const loads: BusLoad[] = ['SEA', 'SEA', 'SDA', 'SEA', 'SDA', 'LSD'];
  const types: BusVehicleType[] = ['DD', 'SD', 'DD', 'DD', 'SD', 'BD'];

  const arrivals: LiveBusArrival[] = [
    {
      estimatedMinutes: arr1Min,
      load: loads[(seed + minuteNow) % loads.length],
      type: types[(seed + 1) % types.length],
      isWheelchairAccessible: true,
    },
    {
      estimatedMinutes: arr2Min,
      load: loads[(seed + minuteNow + 2) % loads.length],
      type: types[(seed + 3) % types.length],
      isWheelchairAccessible: true,
    },
    {
      estimatedMinutes: arr3Min,
      load: loads[(seed + minuteNow + 4) % loads.length],
      type: types[(seed + 5) % types.length],
      isWheelchairAccessible: (seed % 10) !== 0,
    },
  ];

  return {
    serviceNo,
    nextArrivals: arrivals,
    lastUpdated: baseTimeMs,
  };
}

/**
 * Fetch simulated real-time arrivals for all buses at a specific bus stop code.
 */
export function getStopArrivals(stopCode: string, busList: string[]): Record<string, BusArrivalData> {
  const result: Record<string, BusArrivalData> = {};
  const now = Date.now();
  busList.forEach((bus) => {
    result[bus] = generateBusArrivals(stopCode, bus, now);
  });
  return result;
}

export function formatArrivalDisplay(min: number): { text: string; isArriving: boolean } {
  if (min <= 0) {
    return { text: 'Arr', isArriving: true };
  }
  if (min === 1) {
    return { text: '1 min', isArriving: true };
  }
  return { text: `${min} min`, isArriving: false };
}

export function getLoadBadgeDetails(load: BusLoad): { label: string; short: string; colorClass: string; bgClass: string; dotClass: string } {
  switch (load) {
    case 'SEA':
      return {
        label: 'Seats Available',
        short: 'Seats',
        colorClass: 'text-emerald-700 dark:text-emerald-400',
        bgClass: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        dotClass: 'bg-emerald-500',
      };
    case 'SDA':
      return {
        label: 'Standing Available',
        short: 'Standing',
        colorClass: 'text-amber-700 dark:text-amber-400',
        bgClass: 'bg-amber-50 border-amber-200 text-amber-800',
        dotClass: 'bg-amber-500',
      };
    case 'LSD':
      return {
        label: 'Limited Standing',
        short: 'Crowded',
        colorClass: 'text-rose-700 dark:text-rose-400',
        bgClass: 'bg-rose-50 border-rose-200 text-rose-800',
        dotClass: 'bg-rose-500',
      };
  }
}
