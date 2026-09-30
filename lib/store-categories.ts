/** Store departments, in the order the mockup shows them. Safe to import from client code. */
export const STORE_CATEGORIES = [
  {
    slug: 'clothing',
    title: 'Clothing',
    tagline: 'Bold messages for everyday opportunities.',
    body: 'T-shirts, hoodies, hats and more to help you start conversations and stand for truth wherever you go.',
    cta: 'Shop Clothing',
  },
  {
    slug: 'stickers',
    title: 'Stickers, Pins & More',
    tagline: 'Small items. Big conversations.',
    body: 'Stickers, pins, patches, wristbands and other accessories to share the message of life and the hope of the Gospel.',
    cta: 'Shop Stickers & More',
  },
  {
    slug: 'signs',
    title: 'Signs & Activism Gear',
    tagline: 'Be prepared. Be equipped.',
    body: 'Yard signs, handheld signs, banners, buttons and other gear to help you engage your community with clarity and boldness.',
    cta: 'Shop Signs & Gear',
  },
  {
    slug: 'materials',
    title: 'Materials, Pamphlets & More',
    tagline: 'Share truth. Change hearts.',
    body: 'Gospel resources, abolitionist literature, pamphlets, and educational materials to help you have meaningful conversations and point people to Christ.',
    cta: 'Shop Materials',
  },
] as const;

export type StoreCategory = (typeof STORE_CATEGORIES)[number]['slug'];

export const isStoreCategory = (s: string | null | undefined): s is StoreCategory =>
  STORE_CATEGORIES.some((c) => c.slug === s);

export const storeCategory = (slug: string) => STORE_CATEGORIES.find((c) => c.slug === slug);
