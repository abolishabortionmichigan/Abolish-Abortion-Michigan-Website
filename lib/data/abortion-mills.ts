/**
 * Typed access to the master Michigan abortion-provider list.
 *
 * Data source: data/abortion-mills.json — hand-curated, one row per
 * physical location. `city` is the join key with the city landing
 * pages (lib/data/cities.ts): each city page pulls the mills where
 * `city === city.name`.
 *
 * Coordinates are stored so the eventual statewide map (`/abortion-mills`)
 * can render without re-geocoding at request time.
 */

import raw from '@/data/abortion-mills.json';

export interface AbortionMill {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string | null;
  latitude: number;
  longitude: number;
  notes: string | null;
  url?: string | null;
}

interface RawData {
  note: string;
  mills: AbortionMill[];
}

const DATA = raw as RawData;

export function getAllMills(): AbortionMill[] {
  return DATA.mills;
}

export function getMillsByCity(cityName: string): AbortionMill[] {
  const needle = cityName.trim().toLowerCase();
  return DATA.mills.filter((m) => m.city.trim().toLowerCase() === needle);
}
