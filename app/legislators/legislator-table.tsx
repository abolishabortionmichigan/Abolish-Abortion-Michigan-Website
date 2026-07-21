'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  chamberLabel,
  partyLabel,
  stanceBadgeClass,
  type Legislator,
} from '@/lib/data/legislators';

type SortKey = 'name' | 'district' | 'stance' | 'party' | 'chamber' | 'rtl_donations_total' | 'ppac_donations_total';

/**
 * Client-side sortable/filterable table of every Michigan legislator with
 * their abortion-relevant stance, votes, and campaign finance. Uses a `q`
 * URL query param so it works with the Sitelinks Searchbox (`/legislators?q=`)
 * declared in the WebSite JSON-LD.
 */
export default function LegislatorTable({ legislators }: { legislators: Legislator[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [q, setQ] = useState<string>(searchParams?.get('q') ?? '');
  const [chamber, setChamber] = useState<'All' | 'House' | 'Senate'>('All');
  const [stance, setStance] = useState<'All' | 'Incrementalist (Pro-Life)' | 'Pro-Choice'>('All');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Sync `q` back to URL for sharability + Sitelinks Searchbox.
  useMemo(() => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (q) params.set('q', q); else params.delete('q');
    const qs = params.toString();
    router.replace(qs ? `/legislators?${qs}` : '/legislators', { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let rows = legislators;
    if (needle) {
      rows = rows.filter(
        (l) =>
          l.name.toLowerCase().includes(needle) ||
          String(l.district).includes(needle) ||
          (l.committees ?? '').toLowerCase().includes(needle) ||
          l.stance.toLowerCase().includes(needle),
      );
    }
    if (chamber !== 'All') rows = rows.filter((l) => l.chamber === chamber);
    if (stance !== 'All') rows = rows.filter((l) => l.stance === stance);
    rows = [...rows].sort((a, b) => cmp(a, b, sortKey, sortDir));
    return rows;
  }, [legislators, q, chamber, stance, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'name' || key === 'district' || key === 'chamber' ? 'asc' : 'desc');
    }
  }

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <input
          type="search"
          placeholder="Search name, district, committee..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search legislators"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        <select
          value={chamber}
          onChange={(e) => setChamber(e.target.value as 'All' | 'House' | 'Senate')}
          aria-label="Filter by chamber"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="All">All chambers</option>
          <option value="House">House only</option>
          <option value="Senate">Senate only</option>
        </select>
        <select
          value={stance}
          onChange={(e) => setStance(e.target.value as typeof stance)}
          aria-label="Filter by stance"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="All">All positions</option>
          <option value="Incrementalist (Pro-Life)">Pro-Life (Incrementalist)</option>
          <option value="Pro-Choice">Pro-Choice</option>
        </select>
        <div className="flex items-center text-sm text-gray-600">
          Showing <span className="font-semibold mx-1">{filtered.length}</span> of {legislators.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <Th onClick={() => toggleSort('name')} active={sortKey === 'name'} dir={sortDir}>
                Name
              </Th>
              <Th onClick={() => toggleSort('chamber')} active={sortKey === 'chamber'} dir={sortDir}>
                Chamber
              </Th>
              <Th onClick={() => toggleSort('district')} active={sortKey === 'district'} dir={sortDir}>
                District
              </Th>
              <Th onClick={() => toggleSort('party')} active={sortKey === 'party'} dir={sortDir}>
                Party
              </Th>
              <Th onClick={() => toggleSort('stance')} active={sortKey === 'stance'} dir={sortDir}>
                Stance
              </Th>
              <Th
                onClick={() => toggleSort('rtl_donations_total')}
                active={sortKey === 'rtl_donations_total'}
                dir={sortDir}
                className="hidden md:table-cell text-right"
              >
                RTL $
              </Th>
              <Th
                onClick={() => toggleSort('ppac_donations_total')}
                active={sortKey === 'ppac_donations_total'}
                dir={sortDir}
                className="hidden md:table-cell text-right"
              >
                PP $
              </Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.slug} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-3 py-2 font-semibold">
                  <Link href={`/legislators/${l.slug}`} className="text-red-700 hover:underline">
                    {l.name}
                  </Link>
                </td>
                <td className="px-3 py-2 text-gray-700">{chamberLabel(l.chamber)}</td>
                <td className="px-3 py-2 text-gray-700">{l.district}</td>
                <td className="px-3 py-2 text-gray-700">{partyLabel(l.party)}</td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${stanceBadgeClass(l.stance)}`}
                  >
                    {l.stance}
                  </span>
                </td>
                <td className="px-3 py-2 text-right hidden md:table-cell tabular-nums">
                  {l.rtl_donations_total > 0 ? `$${l.rtl_donations_total.toLocaleString()}` : '—'}
                </td>
                <td className="px-3 py-2 text-right hidden md:table-cell tabular-nums">
                  {l.ppac_donations_total > 0 ? `$${l.ppac_donations_total.toLocaleString()}` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No legislators match your filters.{' '}
          <button
            className="text-red-700 underline hover:no-underline"
            onClick={() => {
              setQ('');
              setChamber('All');
              setStance('All');
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

function Th({
  children,
  onClick,
  active,
  dir,
  className = '',
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  dir: 'asc' | 'desc';
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={`px-3 py-2 text-left font-semibold text-gray-700 cursor-pointer select-none ${className}`}
    >
      <button onClick={onClick} className="inline-flex items-center gap-1">
        {children}
        {active && <span aria-hidden="true">{dir === 'asc' ? '▲' : '▼'}</span>}
      </button>
    </th>
  );
}

function cmp(a: Legislator, b: Legislator, key: SortKey, dir: 'asc' | 'desc'): number {
  const av = (a[key] ?? '') as string | number;
  const bv = (b[key] ?? '') as string | number;
  let r = 0;
  if (typeof av === 'number' && typeof bv === 'number') r = av - bv;
  else r = String(av).localeCompare(String(bv));
  return dir === 'asc' ? r : -r;
}
