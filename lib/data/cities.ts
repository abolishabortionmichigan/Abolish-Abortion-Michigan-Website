/**
 * City-landing-page configs. One entry per city we cover. Kept in a
 * plain data module so a page is a rendered projection of a config —
 * add a new city by adding a new entry, and the route + OG image + all
 * of the JSON-LD wire up automatically.
 *
 * Districts are the union of the MI state House/Senate districts that
 * cover any part of the city. Derived by geocoding a spread of the
 * city's ZIP centroids through the Census /geographies/coordinates
 * endpoint (see scratchpad/probe scripts). District numbers match the
 * 2024 vintage (MI's 2022 redistricting), matching legislators.json.
 */

export interface CityConfig {
  slug: string;
  name: string;
  region: string;                // e.g. "Wayne County"
  populationLabel: string;       // human-readable, e.g. "~633,000 residents"
  houseDistricts: number[];
  senateDistricts: number[];
  /**
   * Two-paragraph hero + history section written specifically for
   * this city. Real content — not templated — so search treats each
   * city page as substantively distinct.
   */
  historyParagraphs: string[];
  /**
   * A concrete, on-the-ground description of the city's abortion
   * landscape: known clinics, health-system providers, or activity.
   * Sourced from the org's own research; kept factual (locations,
   * dates), not editorialized here — the abolition case is made in
   * the site-wide messaging above.
   */
  abortionLandscapeParagraphs: string[];
  /** City-specific FAQs — helps rank for question-format queries. */
  faqs: { q: string; a: string }[];
}

export const CITIES: CityConfig[] = [
  {
    slug: 'detroit',
    name: 'Detroit',
    region: 'Wayne County',
    populationLabel: '~633,000 residents',
    houseDistricts: [1, 4, 5, 7, 8, 9, 10, 11, 16, 17],
    senateDistricts: [1, 2, 3, 6, 8, 10],
    historyParagraphs: [
      'Detroit sits at the northern terminus of the Underground Railroad. Second Baptist Church, founded in 1836 by thirteen freed African-Americans, sheltered an estimated 5,000 people fleeing slavery across the Detroit River into Windsor, Canada. William Lambert, George DeBaptiste, and the Detroit Vigilance Committee ran the "Midnight" station house that made those crossings possible.',
      'The abolitionists who built that network refused the "gradualist" argument that slavery would fade with time if you regulated it, taxed it, or waited for public opinion. They insisted on immediate, total abolition — codified in law and enforced by government. Abolish Abortion Michigan stands in that same tradition. The preborn are the same class of person the antebellum abolitionists fought for: image-bearers of God whose right to live is denied by law and defended only if we insist, immediately and totally, that the law protect them.',
    ],
    abortionLandscapeParagraphs: [
      'Metro Detroit is home to several of Michigan\'s highest-volume abortion facilities. Planned Parenthood of Michigan operates a health center on Woodward Avenue in Ferndale (just north of the Detroit city line) that reports thousands of procedures annually. Northland Family Planning in Southfield is the largest single-provider abortion facility in the state.',
      'Michigan\'s 2022 Reproductive Freedom for All ballot measure (Proposal 3) constitutionalized abortion access statewide. Wayne County voted 68% in favor. That vote was not the end of the abolitionist argument — it was the beginning of the case that abortion is a matter of biblical and constitutional equal-protection, not popular vote. Every Detroit-area state legislator listed below is on record voting to expand abortion access.',
    ],
    faqs: [
      {
        q: 'Is there an abolitionist group in Detroit?',
        a: 'Abolish Abortion Michigan (AAM) covers Detroit alongside the rest of the state. There is no separate Detroit-only coalition; visit our partners page for the national and state-by-state network we work alongside, or contact us to help us start local Detroit-area work.',
      },
      {
        q: 'Who is my state representative in Detroit?',
        a: 'Detroit is served by ten state House districts and six state Senate districts. Use our Find-my-legislator tool on the scorecard page — enter your Detroit ZIP code (or full address for a precise match) and it will return your specific House and Senate representative with their voting record.',
      },
      {
        q: 'How can I get involved in the abolition movement in Detroit?',
        a: 'Sign the Michigan abolition petition, contact your Detroit state representative directly through their profile on our scorecard, share our resources with your church, and — if your church would consider adopting an abolitionist resolution — reach out to us. We can send you the model resolution and walk your pastor through it.',
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. That is distinct from the mainstream "pro-life" position, which is willing to accept exceptions (rape, incest, life of the mother) and to reduce abortion incrementally through waiting periods, regulations, and viability bans. See our "What we believe" section for the biblical and constitutional case.',
      },
    ],
  },
];

export function getCityBySlug(slug: string): CityConfig | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export function getAllCitySlugs(): string[] {
  return CITIES.map((c) => c.slug);
}
