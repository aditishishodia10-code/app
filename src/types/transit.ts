/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LineCode = 'NS' | 'EW' | 'NE' | 'CC' | 'DT' | 'TE' | 'LRT';

export interface MRTLine {
  code: LineCode;
  name: string;
  fullName: string;
  color: string;
  textColor: string;
}

export type BusLoad = 'SEA' | 'SDA' | 'LSD'; // Seats Available, Standing Available, Limited Standing
export type BusVehicleType = 'SD' | 'DD' | 'BD'; // Single Deck, Double Deck, Bendy

export interface LiveBusArrival {
  estimatedMinutes: number; // 0 means 'Arr'
  load: BusLoad;
  type: BusVehicleType;
  isWheelchairAccessible: boolean;
}

export interface BusArrivalData {
  serviceNo: string;
  nextArrivals: LiveBusArrival[];
  lastUpdated: number;
}

export interface BusStop {
  code: string; // 5-digit code e.g. "09048"
  name: string; // e.g. "Orchard Stn/Lucky Plaza"
  roadName: string; // e.g. "Orchard Rd"
  lat: number;
  lng: number;
  buses: string[]; // List of bus numbers e.g. ["7", "14", "16", "36", "65", ...]
  distanceMeters?: number;
  walkingMinutes?: number;
}

export interface StationExit {
  id: string; // e.g. "Exit 1" or "Exit A"
  label: string;
  landmarks: string[]; // e.g. ["Lucky Plaza", "ION Orchard", "Mount Elizabeth"]
  accessibilityNotes?: string; // e.g. "Escalator & Lift accessible, Sheltered linkway"
  busStops: BusStop[];
}

export interface TransitStation {
  id: string; // e.g. "orchard"
  name: string; // e.g. "Orchard"
  stationCodes: string[]; // e.g. ["NS22", "TE14"]
  lines: LineCode[];
  type: 'MRT' | 'LRT' | 'MRT & LRT';
  overview: string;
  exits: StationExit[];
  hasLiftAccess?: boolean;
}
