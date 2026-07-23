/**
 * Typed access to the Michigan abolitionist church directory —
 * publicly-abolitionist (or nearest-adjacent Reformed / postmillennial)
 * churches, curated from Dustin's NXR church directory
 * (C:/Users/Dustina/Websites/church-directory).
 *
 * The `city` field is the join key with lib/data/cities.ts. When a
 * city page loads, it calls getChurchesByCity(city.name); if the
 * result is empty we render the "not aware of any yet" callout
 * instead of an empty list.
 */

import raw from '@/data/abolitionist-churches.json';

export interface AbolitionistChurch {
  id: string;
  name: string;
  denomination: string;
  address: string;
  city: string;
  website: string | null;
  phone: string | null;
  pastor: string | null;
  notes: string | null;
}

interface RawData {
  note: string;
  churches: AbolitionistChurch[];
}

const DATA = raw as RawData;

export function getAllChurches(): AbolitionistChurch[] {
  return DATA.churches;
}

export function getChurchesByCity(cityName: string): AbolitionistChurch[] {
  const needle = cityName.trim().toLowerCase();
  return DATA.churches.filter((c) => c.city.trim().toLowerCase() === needle);
}
