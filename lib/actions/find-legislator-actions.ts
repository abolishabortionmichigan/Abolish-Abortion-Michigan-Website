'use server';

import { getLegislatorByDistrict } from '@/lib/data/legislators';

/**
 * Resolve a Michigan address (street + city or ZIP) to that address's
 * state House + state Senate legislator, using the free US Census
 * Bureau geocoder API (no key, no rate limit for reasonable use).
 *
 * The geocoder returns the census-block containing the address plus
 * whichever geography layers we ask for. Layer 54 is SLDL (State
 * Legislative District Lower / House) and layer 55 is SLDU (Upper /
 * Senate). Those are keyed by the same integer district numbers we
 * use in legislators.json, so we can look them up directly.
 *
 * ZIP-only lookup: the geocoder needs a street + city too. If the
 * caller only gives us a ZIP we resolve it to a city via the free
 * zippopotam.us API first, then geocode the ZIP's centroid using
 * the first-line "1 Main St" convention (which the census geocoder
 * accepts as a rough centroid lookup for the given city+state+zip).
 * That's an approximation — ZIPs on district boundaries can span
 * two districts. The UI surfaces this caveat.
 */

export interface FinderInput {
  address?: string;
  city?: string;
  zip?: string;
}

export interface FinderResult {
  ok: true;
  matched: {
    display: string;
    houseSlug: string | null;
    houseDistrict: number | null;
    senateSlug: string | null;
    senateDistrict: number | null;
  };
}

export interface FinderError {
  ok: false;
  error: string;
}

interface CensusGeocoderMatch {
  matchedAddress: string;
  // Keys are vintage-dependent — the newest vintage prefixes with a
  // year (e.g. "2024 State Legislative Districts - Lower"). We match
  // any key that contains "State Legislative Districts - Lower/Upper"
  // so a vintage bump doesn't silently break the lookup.
  geographies?: Record<string, Array<{ NAME?: string; SLDL?: string; SLDU?: string }>>;
}

interface CensusGeocoderResponse {
  result: {
    addressMatches: CensusGeocoderMatch[];
  };
}

async function censusGeocode(street: string, city: string | undefined, zip: string | undefined): Promise<CensusGeocoderMatch | null> {
  const params = new URLSearchParams({
    street,
    state: 'MI',
    benchmark: 'Public_AR_Current',
    // ACS2025_Current is the newest vintage that exposes the 2024
    // state-legislative-district maps (MI's 2022 redistricting takes
    // effect in the 2024-vintage data). Older vintages return only
    // pre-redistricting 2018 districts, which no longer match our
    // legislator dataset.
    vintage: 'ACS2025_Current',
    format: 'json',
  });
  if (city) params.set('city', city);
  if (zip) params.set('zip', zip);

  const url = `https://geocoding.geo.census.gov/geocoder/geographies/address?${params.toString()}`;
  const res = await fetch(url, {
    // 8-second timeout via AbortController — the Census geocoder is
    // usually fast but occasionally slow enough to trip the default
    // Next.js server-action timeout.
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as CensusGeocoderResponse;
  const first = data.result.addressMatches[0];
  return first || null;
}

async function zipToCity(zip: string): Promise<{ city: string } | null> {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { places?: Array<{ 'place name': string; state: string }> };
    const p = data.places?.[0];
    if (!p || p.state !== 'Michigan') return null;
    return { city: p['place name'] };
  } catch {
    return null;
  }
}

export async function findLegislatorsForAddress(input: FinderInput): Promise<FinderResult | FinderError> {
  const address = (input.address || '').trim();
  const zip = (input.zip || '').trim();
  const city = (input.city || '').trim();

  // Require at least a ZIP or a street+city
  if (!zip && !(address && city)) {
    return { ok: false, error: 'Enter a Michigan ZIP code, or a street address + city.' };
  }
  if (zip && !/^\d{5}$/.test(zip)) {
    return { ok: false, error: 'ZIP code must be 5 digits.' };
  }

  // If ZIP-only, resolve to a representative city name via zippopotam.
  let street = address;
  let effectiveCity = city;
  let effectiveZip = zip;

  if (!street && zip) {
    const info = await zipToCity(zip);
    if (!info) {
      return { ok: false, error: 'That ZIP code doesn’t appear to be in Michigan.' };
    }
    effectiveCity = info.city;
    // Give the geocoder a plausible centroid-ish street. Real
    // addresses always give better matches; ZIP-only is a fallback.
    street = '100 Main St';
  }

  let match: CensusGeocoderMatch | null = null;
  try {
    match = await censusGeocode(street, effectiveCity, effectiveZip || undefined);
  } catch {
    return { ok: false, error: 'The address lookup service is temporarily unavailable. Please try again.' };
  }

  if (!match) {
    return { ok: false, error: 'Address not found. Try including the street number and city.' };
  }

  const geos = match.geographies || {};
  const houseKey = Object.keys(geos).find((k) => /State Legislative Districts - Lower/.test(k));
  const senateKey = Object.keys(geos).find((k) => /State Legislative Districts - Upper/.test(k));
  const houseGeo = houseKey ? geos[houseKey]?.[0] : undefined;
  const senateGeo = senateKey ? geos[senateKey]?.[0] : undefined;

  const houseDistrictStr = houseGeo?.SLDL;
  const senateDistrictStr = senateGeo?.SLDU;

  // SLDL/SLDU come back as zero-padded strings ("003"); coerce to int
  // for our (chamber, district) lookup which uses plain numbers.
  const houseDistrict = houseDistrictStr ? parseInt(houseDistrictStr, 10) : null;
  const senateDistrict = senateDistrictStr ? parseInt(senateDistrictStr, 10) : null;

  const houseLeg = houseDistrict !== null ? getLegislatorByDistrict('House', houseDistrict) : undefined;
  const senateLeg = senateDistrict !== null ? getLegislatorByDistrict('Senate', senateDistrict) : undefined;

  if (!houseLeg && !senateLeg) {
    return { ok: false, error: 'Located that address, but couldn’t match it to a Michigan legislative district.' };
  }

  return {
    ok: true,
    matched: {
      display: match.matchedAddress,
      houseSlug: houseLeg?.slug ?? null,
      houseDistrict: houseDistrict,
      senateSlug: senateLeg?.slug ?? null,
      senateDistrict: senateDistrict,
    },
  };
}
