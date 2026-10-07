/*
 * Pure helpers for reading Printify's variant labels. No prisma import, so
 * both the server (lib/store.ts) and the browser (AddToCart) can use them and
 * agree on which half of "Charcoal / L" is the colour.
 */

const SIZES = [
  'XXS','XS','S','M','L','XL','2XL','3XL','4XL','5XL','6XL',
  'NB','0-3M','3-6M','6M','6-12M','12M','18M','24M',
];

// A size is either a garment size or a measurement: stickers and magnets are
// labelled '2" x 2" / White', which put the size first and read backwards when
// only garment sizes counted.
//
// Printify is not consistent about inch marks - the bumper sticker uses ", the
// yard sign uses the prime character and the car magnet uses two apostrophes -
// so they are all normalised before the test. Missing one meant the magnet's
// three shapes were read as colours and offered under "Colour".
export const isMeasurement = (v: string) => {
  const t = v.replace(/['\u2019\u2032\u201c\u201d\u2033]/g, '"');
  return /[0-9]\s*(?:"|in\b|oz\b|cm\b|mm\b)/i.test(t) || /[0-9]"*\s*[x\u00d7]\s*"*[0-9]/i.test(t);
};

export const isSizeList = (vals: string[]) =>
  vals.length > 0 && vals.every((v) => SIZES.includes(v.toUpperCase()) || isMeasurement(v));

/**
 * Sizes that do NOT change what the item looks like.
 *
 * A medium shirt photographs the same as a large one. A 10x3 car magnet does
 * not photograph like a 7.5x4.5 one - it is a different shape - so a list of
 * measurements is treated as something the gallery should follow.
 */
export const isGarmentSizeList = (vals: string[]) =>
  vals.length > 0 && vals.every((v) => SIZES.includes(v.toUpperCase()));

/**
 * Split a two-axis variant list into colour and size.
 *
 * Printify labels a two-axis variant "Charcoal / L" - sometimes "L / Charcoal".
 * The size axis is identified by its values, not its position, because the two
 * orders appear on different blueprints.
 */
export function splitAxes<T extends { id: string; label: string }>(variants: T[]) {
  if (!variants.length || !variants.every((v) => v.label.includes(' / '))) return null;
  const a = [...new Set(variants.map((v) => v.label.split(' / ')[0].trim()))];
  const b = [...new Set(variants.map((v) => v.label.split(' / ').slice(1).join(' / ').trim()))];
  if (a.length < 2 && b.length < 2) return null;
  const sizeFirst = isSizeList(a);
  return {
    sizeFirst,
    colours: sizeFirst ? b : a,
    sizes: sizeFirst ? a : b,
    find: (colour: string, size: string) =>
      variants.find((v) => v.label === (sizeFirst ? `${size} / ${colour}` : `${colour} / ${size}`)) ?? null,
  };
}

/** The colour half of one label, given how the whole list is laid out. */
export function colourOf(label: string, sizeFirst: boolean): string | null {
  if (!label.includes(' / ')) return null;
  const parts = label.split(' / ');
  return (sizeFirst ? parts.slice(1).join(' / ') : parts[0]).trim();
}

/** The size half of one label. */
export function sizeOf(label: string, sizeFirst: boolean): string | null {
  if (!label.includes(' / ')) return null;
  const parts = label.split(' / ');
  return (sizeFirst ? parts[0] : parts.slice(1).join(' / ')).trim();
}

/**
 * Which option changes what the product LOOKS like, so photos can be grouped
 * by it: the colour of a shirt, the model of a phone case, the shape of a car
 * magnet. Garment sizes are excluded, because they all photograph the same.
 */
export function imageAxis<T extends { id: string; label: string }>(
  variants: T[],
): { keyOf: (label: string) => string | null; keys: string[] } | null {
  const axes = splitAxes(variants);
  if (axes) {
    if (axes.colours.length > 1) {
      return { keyOf: (l) => colourOf(l, axes.sizeFirst), keys: axes.colours };
    }
    // One colour but several measured sizes - a sticker at 2" and 3" - so the
    // size is the thing that changes the photo.
    if (axes.sizes.length > 1 && !isGarmentSizeList(axes.sizes)) {
      return { keyOf: (l) => sizeOf(l, axes.sizeFirst), keys: axes.sizes };
    }
    return null;
  }
  // A single axis is the only thing telling the variants apart, so it is what
  // the photos follow - even when it reads like a garment size. The Bible
  // cover is sized M to 2XL and Printify shoots each size separately.
  const labels = [...new Set(variants.map((v) => v.label.trim()))];
  if (labels.length < 2) return null;
  return { keyOf: (l) => l.trim(), keys: labels };
}

/**
 * Printify mockup URLs are /mockup/<product>/<variant>/<mockup>/<slug>.jpg, so
 * the variant a photo shows is readable straight off the URL. That is what
 * lets the gallery follow the colour the shopper picked without storing a
 * second table of image-to-variant links.
 */
export function variantIdOfImage(src: string): number | null {
  const m = /\/mockup\/[^/]+\/(\d+)\//.exec(src);
  return m ? Number(m[1]) : null;
}

/*
 * Phone models.
 *
 * Printify lists a phone case's 34 models in the order they were added, so
 * Samsungs end up scattered between iPhone generations. These put the brands
 * together and each brand in generation order.
 */
const PHONE_BRANDS: [RegExp, string][] = [
  [/^iPhone\b/i, 'Apple'],
  [/^(Samsung\s+)?Galaxy\b/i, 'Samsung'],
  [/^(Google\s+)?Pixel\b/i, 'Google'],
];
const BRAND_ORDER = ['Apple', 'Samsung', 'Google'];
// base model first, then the bigger and dearer trims
const TRIM_ORDER = ['', 'mini', 'plus', 'pro', 'pro max', 'ultra'];

export function phoneBrand(label: string): string | null {
  const t = label.trim();
  for (const [re, brand] of PHONE_BRANDS) if (re.test(t)) return brand;
  return null;
}

/** Sort key for one model: brand, then generation, then trim. */
export function phoneOrder(label: string): [number, number, number] | null {
  const t = label.trim();
  const brand = phoneBrand(t);
  if (!brand) return null;
  const generation = Number(/(\d+)/.exec(t)?.[1] ?? 0);
  const trim = t.replace(/^.*?\d+\s*/, '').trim().toLowerCase();
  const ti = TRIM_ORDER.indexOf(trim);
  return [BRAND_ORDER.indexOf(brand), generation, ti < 0 ? 99 : ti];
}

export const isPhoneList = (labels: string[]) =>
  labels.length > 0 && labels.every((l) => phoneBrand(l) !== null);

/** Compare two phone model names for display order. */
export function comparePhones(a: string, b: string): number {
  const A = phoneOrder(a);
  const B = phoneOrder(b);
  if (!A || !B) return a.localeCompare(b);
  return A[0] - B[0] || A[1] - B[1] || A[2] - B[2] || a.localeCompare(b);
}
