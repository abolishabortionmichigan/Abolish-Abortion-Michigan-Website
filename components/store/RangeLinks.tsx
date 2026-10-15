import Link from 'next/link';

export interface RangeLinksProps {
  /** The product type without its front — "Tee", not "Tee (chest mark)". */
  baseType: string;
  /** Slug of the product being viewed, so it renders as current, not a link. */
  current: string;
  siblings: { slug: string; design: string }[];
  styles: { slug: string; style: string }[];
  extras: { slug: string; decorations: string[] }[];
}

/** The add-on combination in plain words, matching ExtrasPicker's vocabulary. */
function describeExtras(decorations: string[]): string {
  if (decorations.length === 0) return 'Plain';
  const order = ['left sleeve', 'right sleeve', 'neck'];
  const sorted = [...decorations].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  const text = sorted.join(' + ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Crawlable links to the rest of the range.
 *
 * The Design/Front/Add-on pickers in the header are <select> elements that
 * navigate in an onChange handler. A crawler never fires a change event, so it
 * sees no outbound links at all — which left 684 of 702 product pages with
 * nothing anywhere on the site pointing at them. Google had downloaded the
 * sitemap and still never fetched a single product page: URL Inspection
 * reported lastCrawlTime "never" on every one sampled (2026-10-14), and the
 * store had earned zero search impressions in 90 days.
 *
 * These are real <a href>s to the same destinations the pickers reach, so the
 * catalogue is now reachable by following links. They also read better than the
 * pickers for browsing — a fifty-entry dropdown is a poor index of the slogans.
 */
export default function RangeLinks({
  baseType,
  current,
  siblings,
  styles,
  extras,
}: RangeLinksProps) {
  const blocks = [
    {
      id: 'designs',
      heading: `Every design on this ${baseType.toLowerCase()}`,
      items: siblings.map((s) => ({ slug: s.slug, label: s.design })),
    },
    {
      id: 'fronts',
      heading: 'This design on other fronts',
      items: styles.map((s) => ({ slug: s.slug, label: s.style })),
    },
    {
      id: 'addons',
      heading: 'Other add-on combinations',
      items: extras.map((e) => ({ slug: e.slug, label: describeExtras(e.decorations) })),
    },
    // A single entry is just the product already on screen.
  ].filter((b) => b.items.length > 1);

  if (blocks.length === 0) return null;

  return (
    <nav aria-label="More in this range" className="mt-8 border-t border-gray-200 pt-6">
      {blocks.map((b) => (
        <section key={b.id} className="mb-6 last:mb-0">
          <h2 className="mb-3 text-lg font-bold text-gray-900">{b.heading}</h2>
          <ul className="gap-x-6 text-sm sm:columns-2 lg:columns-3">
            {b.items.map((it) => (
              <li key={it.slug} className="mb-1 break-inside-avoid">
                {it.slug === current ? (
                  <span aria-current="page" className="font-bold text-gray-900">
                    {it.label}
                  </span>
                ) : (
                  <Link
                    href={`/store/product/${it.slug}`}
                    className="text-gray-700 underline underline-offset-2 hover:text-red-700"
                  >
                    {it.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
