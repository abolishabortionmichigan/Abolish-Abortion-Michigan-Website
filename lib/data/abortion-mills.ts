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
  /** Public email, when the facility publishes one. Many don't
   * (Planned Parenthood + Summit route all contact through phone
   * or web-form only) — leave `null` in that case. */
  email: string | null;
  latitude: number;
  longitude: number;
  notes: string | null;
  url?: string | null;
  /** Direct URL to the Google Business Profile / Google Maps
   * place listing. When absent we fall back to a `/maps/search/`
   * URL built from name + address, which reliably resolves to
   * the same place profile. Populate explicitly whenever we have
   * a canonical CID URL, so the click count feeds the profile's
   * engagement stats directly. */
  googleBusinessUrl?: string | null;
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
