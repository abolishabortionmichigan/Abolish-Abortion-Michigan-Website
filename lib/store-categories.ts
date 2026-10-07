/*
 * Store departments, in the order the store shows them. Safe to import from
 * client code.
 *
 * "Materials, Pamphlets & More" was removed before launch: Printify prints no
 * tract or pamphlet, so that shelf would have greeted shoppers with "Nothing
 * here yet". Put it back the day AAM has literature to sell, along with the
 * matching rule in CATEGORY_RULES (lib/printify.ts).
 */
export const STORE_CATEGORIES = [
  {
    slug: 'clothing',
    title: 'Clothing',
    tagline: 'Bold messages for everyday opportunities.',
    body: 'T-shirts, hoodies, hats and more to help you start conversations and stand for truth wherever you go.',
    cta: 'Shop Clothing',
  },
  {
    slug: 'drinkware',
    title: 'Mugs & Drinkware',
    tagline: 'A conversation every morning.',
    body: 'Ceramic mugs printed to order. Put it on your desk, in the church kitchen, or in the hands of someone who needs to hear it.',
    cta: 'Shop Drinkware',
  },
  {
    slug: 'stickers',
    title: 'Stickers, Pins & More',
    tagline: 'Small items. Big conversations.',
    body: 'Stickers, pins, patches, wristbands and other accessories to share the message of life and the hope of the Gospel.',
    cta: 'Shop Stickers & More',
  },
  {
    slug: 'accessories',
    title: 'Accessories & More',
    tagline: 'Carry it with you.',
    body: 'Phone cases, Bible covers, bookmarks and other everyday things that put the message where people will see it.',
    cta: 'Shop Accessories',
  },
  {
    slug: 'signs',
    title: 'Signs & Activism Gear',
    tagline: 'Be prepared. Be equipped.',
    body: 'Yard signs, handheld signs, banners, buttons and other gear to help you engage your community with clarity and boldness.',
    cta: 'Shop Signs & Gear',
  },
] as const;

export type StoreCategory = (typeof STORE_CATEGORIES)[number]['slug'];

export const isStoreCategory = (s: string | null | undefined): s is StoreCategory =>
  STORE_CATEGORIES.some((c) => c.slug === s);

export const storeCategory = (slug: string) => STORE_CATEGORIES.find((c) => c.slug === slug);
