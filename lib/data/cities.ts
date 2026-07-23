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

export interface CityFaq {
  q: string;
  /** Plain-text answer — used in FAQPage JSON-LD, must not contain HTML. */
  a: string;
  /** Optional set of {phrase → href} that turn matching phrases in
   *  the answer into clickable links when rendered. The plain-text
   *  `a` stays intact for the schema. */
  links?: Array<{ phrase: string; href: string }>;
}

export interface CityConfig {
  slug: string;
  name: string;
  region: string;                // e.g. "Wayne County"
  populationLabel: string;       // human-readable, e.g. "~633,000 residents"
  /** For sorting the city index by size + for future map dot-size. */
  population: number;
  /** City centroid — mean of ZIP centroids inside city limits. Used by
   * the "nearby cities" strip on each city page and by the /cities
   * interactive map. */
  latitude: number;
  longitude: number;
  houseDistricts: number[];
  senateDistricts: number[];
  /**
   * Two-paragraph hero + history section written specifically for
   * this city. Real content — not templated — so search treats each
   * city page as substantively distinct.
   */
  historyParagraphs: string[];
  /**
   * Intro sentence(s) before the clinic list. Sets the framing for
   * *why* the clinic count matters (voter context, provider
   * concentration, etc). Kept factual — abolition case is made in
   * the site-wide messaging. The clinics themselves are pulled from
   * data/abortion-mills.json by matching on `city === name`.
   */
  abortionLandscapeIntro: string;
  /** Any post-list note — e.g. voter context, ballot-measure history. */
  abortionLandscapeOutro?: string;
  faqs: CityFaq[];
}

export const CITIES: CityConfig[] = [
  {
    slug: 'detroit',
    name: 'Detroit',
    region: 'Wayne County',
    populationLabel: '~633,000 residents',
    population: 633000,
    latitude: 42.3314,
    longitude: -83.0458,
    houseDistricts: [1, 4, 5, 7, 8, 9, 10, 11, 16, 17],
    senateDistricts: [1, 2, 3, 6, 8, 10],
    historyParagraphs: [
      'Detroit sits at the northern terminus of the Underground Railroad. Second Baptist Church, founded in 1836 by thirteen freed African-Americans, sheltered an estimated 5,000 people fleeing slavery across the Detroit River into Windsor, Canada. William Lambert, George DeBaptiste, and the Detroit Vigilance Committee ran the "Midnight" station house that made those crossings possible.',
      'The abolitionists who built that network refused the "gradualist" argument that slavery would fade with time if you regulated it, taxed it, or waited for public opinion. They insisted on immediate, total abolition — codified in law and enforced by government. Abolish Abortion Michigan stands in that same tradition. The preborn are the same class of person the antebellum abolitionists fought for: image-bearers of God whose right to live is denied by law and defended only if we insist, immediately and totally, that the law protect them.',
    ],
    abortionLandscapeIntro:
      'In a city of ~633,000 residents, Detroit has one of the highest per-capita abortion-provider densities in Michigan. The facilities operating inside Detroit city limits:',
    abortionLandscapeOutro:
      'Michigan’s 2022 Reproductive Freedom for All ballot measure (Proposal 3) constitutionalized abortion access statewide. Wayne County voted 68% in favor. That vote was not the end of the abolitionist argument — it was the beginning of the case that abortion is a matter of biblical and constitutional equal-protection, not popular vote. Every Detroit-area state legislator listed below is on record voting to expand abortion access.',
    faqs: [
      {
        q: 'Is there an abolitionist group in Detroit?',
        a: 'Abolish Abortion Michigan (AAM) covers Detroit alongside the rest of the state. There is no separate Detroit-only coalition; visit our partners page for the national and state-by-state network we work alongside, or contact us to help us start local Detroit-area work.',
        links: [
          { phrase: 'partners page', href: '/partners' },
          { phrase: 'contact us', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Detroit?',
        a: 'Detroit is served by ten state House districts and six state Senate districts. Use our Find-my-legislator tool on the scorecard page — enter your Detroit ZIP code (or full address for a precise match) and it will return your specific House and Senate representative with their voting record.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Detroit?',
        a: 'Sign the Michigan abolition petition, contact your Detroit state representative through the scorecard, join our Signal group to connect with other Detroit-area abolitionists, share our resources with your church, and — if your church would consider adopting an abolitionist resolution — reach out to us. We can send you the model resolution and walk your pastor through it.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. That is distinct from the mainstream pro-life position, which is willing to accept exceptions (rape, incest, life of the mother) and to reduce abortion incrementally through waiting periods, regulations, and viability bans. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Grand Rapids ------------------------------------------------
  {
    slug: 'grand-rapids',
    name: 'Grand Rapids',
    region: 'Kent County',
    populationLabel: '~199,000 residents',
    population: 199000,
    latitude: 42.9369,
    longitude: -85.6318,
    houseDistricts: [80, 81, 82, 83, 84],
    senateDistricts: [29, 30],
    historyParagraphs: [
      'Grand Rapids is the historic center of Dutch Reformed Christianity in America. The Reformed Church in America (RCA) and Christian Reformed Church in North America (CRCNA) — both born out of the 19th-century Dutch immigration to West Michigan — have their denominational headquarters here. It\'s a city where confessional Protestantism has shaped civic life for six generations, and where the theological categories that undergird abolitionism (image-of-God anthropology, the imprecatory Psalms, magisterial responsibility to protect the innocent) are already in the water.',
      'That inheritance is what makes the modern Grand Rapids abortion picture so striking. A city whose sanctuaries are full of the confession that human life is a gift from God is a city that still hosts an active Planned Parenthood facility three blocks from Heritage Hill. Abolition of abortion is the logical downstream of the theology that built this city — the gap between confession and civil law is the gap this movement exists to close.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates inside Grand Rapids city limits — the only one in West Michigan north of Kalamazoo:',
    abortionLandscapeOutro:
      'Kent County voted 62% in favor of Proposal 3 in 2022. That vote sits in tension with the county\'s deeply-Reformed institutional churches, which almost uniformly teach against abortion. Abolition is what closes the gap.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Grand Rapids?',
        a: 'We\'re not yet aware of any publicly-abolitionist Reformed churches inside Grand Rapids city limits, though the city is home to hundreds of RCA / CRCNA / URC / OPC / PCA congregations. If your Grand Rapids church has adopted an abolition resolution, reach out — we\'ll list them here.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Grand Rapids?',
        a: 'Grand Rapids is served by five state House districts and two state Senate districts. Use the Find-my-legislator tool on the scorecard page — enter your Grand Rapids ZIP code (or full address) to get your specific reps.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Grand Rapids?',
        a: 'Sign the Michigan abolition petition, contact your Grand Rapids state representative through the scorecard, join our Signal group to connect with other West Michigan abolitionists, and — if your church would consider adopting the abolition resolution — reach out to us.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. That is distinct from the mainstream pro-life position, which is willing to accept exceptions and to reduce abortion incrementally. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Warren ------------------------------------------------------
  {
    slug: 'warren',
    name: 'Warren',
    region: 'Macomb County',
    populationLabel: '~138,000 residents',
    population: 138000,
    latitude: 42.4958,
    longitude: -83.0202,
    houseDistricts: [11, 13, 14],
    senateDistricts: [3, 10],
    historyParagraphs: [
      'Warren is Michigan\'s third-largest city and Macomb County\'s civic anchor — a post-war industrial suburb built by the Big Three auto boom. It is the home of the U.S. Army Detroit Arsenal, General Motors Technical Center, and a working-class electorate that has voted Republican in every presidential election since 2016 while also sending Democrats to the state Legislature.',
      'The politically-mixed profile of Warren makes it a strategically important abolition city. Unlike deep-blue Detroit or deep-red Ottawa County, Macomb is a persuadable place. The abolitionist argument — that abortion is homicide and must be treated as such under law — has more room to work in a district where voters split tickets and are unafraid of the moral case, if it\'s made plainly.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates inside Warren city limits, serving the broader Macomb County market:',
    abortionLandscapeOutro:
      'Macomb County voted 55% in favor of Proposal 3 in 2022 — narrower than Wayne or Washtenaw, and one of the closer margins in southeast Michigan. That closeness is the wedge for a serious abolition case here.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Warren?',
        a: 'We\'re not aware of any publicly-abolitionist Reformed churches inside Warren city limits at this time. If yours has taken a public stand for abolition, reach out and we\'ll add them.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Warren?',
        a: 'Warren is served by three state House districts and two state Senate districts. Use our Find-my-legislator tool on the scorecard page to get yours by Warren ZIP or address.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Warren?',
        a: 'Sign the Michigan abolition petition, contact your Warren state representative through the scorecard, join our Signal group, and if your church would consider adopting the abolition resolution — reach out to us.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. That is distinct from the mainstream pro-life position, which accepts exceptions and pursues incremental restrictions. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Sterling Heights -------------------------------------------
  {
    slug: 'sterling-heights',
    name: 'Sterling Heights',
    region: 'Macomb County',
    populationLabel: '~133,000 residents',
    population: 133000,
    latitude: 42.5842,
    longitude: -83.0268,
    houseDistricts: [57, 58, 61],
    senateDistricts: [9, 10],
    historyParagraphs: [
      'Sterling Heights is Michigan\'s fourth-largest city, a postwar Macomb County suburb built on the assembly-line prosperity of the Detroit auto industry. It is now one of the most ethnically diverse cities in the state — home to the largest Chaldean (Iraqi Christian) population outside of the Middle East, alongside significant Assyrian, Albanian, Bosnian, and Polish communities.',
      'The Chaldean population in particular carries an ancient Christian witness — a church that has confessed the humanity of the preborn from Nicaea forward. Sterling Heights sits at the intersection of that historic Christian anthropology and one of the highest abortion-provider densities in the Detroit metro area — two facilities within four miles of each other. Closing that gap is the local abolitionist work.',
    ],
    abortionLandscapeIntro:
      'Two abortion facilities operate inside Sterling Heights city limits — one of the highest concentrations of any suburban city in Michigan:',
    abortionLandscapeOutro:
      'Macomb County voted 55% in favor of Proposal 3 in 2022. The Chaldean and Assyrian Catholic communities voted against it in significant numbers — a reminder that historically-Christian minority communities in Sterling Heights are natural coalition partners for the abolition case.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Sterling Heights?',
        a: 'We\'re not yet aware of any publicly-abolitionist Reformed churches inside Sterling Heights city limits. If your Sterling Heights church — Reformed, Chaldean Catholic, Assyrian, or otherwise — has taken a public stand for the abolition of abortion, reach out and we\'ll add them.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Sterling Heights?',
        a: 'Sterling Heights is served by three state House districts and two state Senate districts. Use our Find-my-legislator tool on the scorecard page to look yours up by ZIP or address.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Sterling Heights?',
        a: 'Sign the Michigan abolition petition, contact your Sterling Heights state representative through the scorecard, join our Signal group, and reach out to us if your church would consider adopting the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Ann Arbor ---------------------------------------------------
  {
    slug: 'ann-arbor',
    name: 'Ann Arbor',
    region: 'Washtenaw County',
    populationLabel: '~122,000 residents',
    population: 122000,
    latitude: 42.2724,
    longitude: -83.7263,
    houseDistricts: [23, 33, 47, 48],
    senateDistricts: [14, 15],
    historyParagraphs: [
      'Ann Arbor was a hub of the antebellum abolitionist movement. The Michigan State Anti-Slavery Society met here in 1841, and the University of Michigan\'s Society of Inquiry hosted abolitionist speakers throughout the 1830s and 40s. Reverend Guy Beckley — a Wesleyan Methodist minister and Underground Railroad conductor — pastored in Ann Arbor and edited the state\'s leading abolitionist newspaper. Beckley\'s house on Pontiac Trail sheltered escaped slaves; it still stands today.',
      'Modern Ann Arbor is one of the most politically progressive cities in Michigan and hosts the state\'s only abortion facility that performs procedures up to nearly 20 weeks. The tension is exactly what it was in 1841: a university town proud of its abolitionist inheritance, running an institution that denies personhood to the smallest class of human beings. Beckley\'s question to his 1840s congregation was whether their theology matched their politics. It\'s the same question today.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates inside Ann Arbor city limits — with the latest gestational cutoff of any provider in Michigan:',
    abortionLandscapeOutro:
      'Washtenaw County voted 77% in favor of Proposal 3 in 2022 — the strongest pro-abortion-access margin in the state. The abolitionist case here is a minority case, but it is a real one, with a real historical inheritance to draw on.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Ann Arbor?',
        a: 'We\'re not yet aware of any publicly-abolitionist Reformed churches inside Ann Arbor city limits. Ann Arbor is home to strong PCA, OPC, and URC congregations — if any have taken a public stand for the abolition of abortion, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Ann Arbor?',
        a: 'Ann Arbor is served by four state House districts and two state Senate districts. Use our Find-my-legislator tool on the scorecard page to look yours up.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Ann Arbor?',
        a: 'Sign the Michigan abolition petition, contact your Ann Arbor state representative through the scorecard, join our Signal group to connect with other Ann Arbor-area abolitionists, and — if your church would adopt the abolition resolution — reach out to us.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
      },
    ],
  },

  // -------- Lansing -----------------------------------------------------
  {
    slug: 'lansing',
    name: 'Lansing',
    region: 'Ingham County',
    populationLabel: '~111,000 residents',
    population: 111000,
    latitude: 42.7273,
    longitude: -84.5658,
    houseDistricts: [74, 76, 77],
    senateDistricts: [21, 28],
    historyParagraphs: [
      'Lansing is Michigan\'s state capital and the seat of the state Legislature — the building where every abolition bill that has ever been introduced in this state was written, sponsored, and voted on. The Capitol on Michigan Avenue is where House Bill 4670 (the 2025 equal-protection abolition bill) died in committee. It is where Right to Life of Michigan\'s lobby is headquartered and where Planned Parenthood Advocates does its influence work.',
      'That makes Lansing the most strategically important abolition city in Michigan. Every legislator we grade on the scorecard has a Lansing office. Every rally, every hearing, every committee meeting worth attending happens here. The abolitionist argument doesn\'t win in the abstract — it wins because Christians show up in the capital and press for equal protection until it becomes law.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates inside Lansing city limits, serving the Michigan State University community and the mid-Michigan region:',
    abortionLandscapeOutro:
      'Ingham County voted 72% in favor of Proposal 3 in 2022. That vote is downstream of MSU\'s cultural gravity — and the university itself is the ministry field for every campus outreach in the state.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Lansing?',
        a: 'We\'re not yet aware of any publicly-abolitionist Reformed churches inside Lansing city limits. If your Lansing- or East-Lansing-area church has adopted an abolition resolution, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Lansing?',
        a: 'Lansing is served by three state House districts and two state Senate districts. Use our Find-my-legislator tool on the scorecard page. All of your Lansing legislators also work out of the Michigan Capitol just south of downtown.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Lansing?',
        a: 'Lansing is the most action-heavy city in the state. Sign the Michigan abolition petition, contact your Lansing state representative through the scorecard, join our Signal group for capitol rally coordination, and reach out to us if your church would consider adopting the abolition resolution.',
        links: [
          { phrase: 'Michigan abolition petition', href: '/the-petition' },
          { phrase: 'the scorecard', href: '/legislators' },
          { phrase: 'Signal group', href: 'signal:group' },
          { phrase: 'reach out to us', href: '/contact' },
        ],
      },
      {
        q: 'What is the abolitionist position on abortion?',
        a: 'Abolition of abortion means the immediate, total end of abortion, criminalized as homicide, with no exceptions, from the moment of fertilization. See our What we believe section for the biblical and constitutional case.',
        links: [
          { phrase: 'What we believe', href: '/what-we-believe' },
          { phrase: 'immediate, total end of abortion', href: '/what-we-believe/immediate-not-gradual' },
          { phrase: 'no exceptions', href: '/what-we-believe/no-exceptions' },
          { phrase: 'criminalized as homicide', href: '/what-we-believe/criminalization' },
        ],
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

/**
 * Great-circle distance in miles between two lat/lng points. Used by
 * the "nearby cities" strip.
 */
function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3959; // earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Nearest N cities to the given one, sorted by distance ascending.
 * We deliberately don't cap by radius — with a small covered set,
 * "everywhere in MI" is a better next-click than dead space. Once
 * the dataset grows past ~30 cities we can add a distance cap.
 */
export function getNearbyCities(fromSlug: string, limit = 5): Array<CityConfig & { distanceMiles: number }> {
  const from = getCityBySlug(fromSlug);
  if (!from) return [];
  return CITIES.filter((c) => c.slug !== fromSlug)
    .map((c) => ({ ...c, distanceMiles: haversineMiles(from.latitude, from.longitude, c.latitude, c.longitude) }))
    .sort((a, b) => a.distanceMiles - b.distanceMiles)
    .slice(0, limit);
}
