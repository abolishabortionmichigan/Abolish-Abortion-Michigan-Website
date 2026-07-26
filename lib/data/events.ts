// Typed access to the statewide-events data file. Each row is a
// recurring Michigan-abolition-calendar observance — see the
// _meta.note in data/events.json for the editorial policy on what
// belongs here.

import raw from '@/data/events.json';

export interface AamEventLocation {
  type: 'VirtualLocation' | 'Place';
  name: string;
  url?: string;
  address?: string;
}

export interface AamEvent {
  id: string;
  name: string;
  eventStatus: string;
  eventAttendanceMode: string;
  /** ISO YYYY-MM-DD */
  startDate: string;
  /** ISO YYYY-MM-DD */
  endDate: string;
  /** Human-readable recurring month/day (e.g. "November 8") — used
   * in the visible copy while startDate carries the next scheduled
   * occurrence for Event JSON-LD. */
  recurringDate?: string;
  location: AamEventLocation;
  shortDescription: string;
  longDescription: string;
  audience: string;
  howToJoin: string;
  organizerName: string;
  organizerUrl: string;
}

interface EventsFile {
  _meta: { note: string; refreshedOn: string };
  events: AamEvent[];
}

const DATA = raw as EventsFile;

export function getAllEvents(): AamEvent[] {
  return DATA.events;
}

export function getEventsRefreshedOn(): string {
  return DATA._meta.refreshedOn;
}

/**
 * Build a schema.org Event JSON-LD object from an AamEvent. Uses
 * VirtualLocation vs Place shape depending on the entry's location
 * type. Kept as a helper (rather than inlined) so the /events page
 * and any individual per-event page emit identical schema.
 */
export function toEventJsonLd(e: AamEvent, baseUrl: string) {
  const location =
    e.location.type === 'VirtualLocation'
      ? {
          '@type': 'VirtualLocation',
          name: e.location.name,
          url: e.location.url,
        }
      : {
          '@type': 'Place',
          name: e.location.name,
          address: e.location.address,
        };
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.name,
    startDate: e.startDate,
    endDate: e.endDate,
    eventStatus: e.eventStatus,
    eventAttendanceMode: e.eventAttendanceMode,
    location,
    description: e.longDescription,
    organizer: {
      '@type': 'Organization',
      name: e.organizerName,
      url: e.organizerUrl,
    },
    url: `${baseUrl}/events#${e.id}`,
  };
}
