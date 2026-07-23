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
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Grand Rapids city limits, though the city is home to hundreds of RCA / CRCNA / URC / OPC / PCA congregations. If your Grand Rapids church has adopted an abolition resolution, reach out — we\'ll list them here.',
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
        a: 'We\'re not aware of any publicly-abolitionist churches inside Warren city limits at this time. If yours has taken a public stand for abolition, reach out and we\'ll add them.',
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
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Sterling Heights city limits. If your Sterling Heights church — Reformed, Chaldean Catholic, Assyrian, or otherwise — has taken a public stand for the abolition of abortion, reach out and we\'ll add them.',
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
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Ann Arbor city limits. Ann Arbor is home to strong PCA, OPC, and URC congregations — if any have taken a public stand for the abolition of abortion, reach out.',
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
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Lansing city limits. If your Lansing- or East-Lansing-area church has adopted an abolition resolution, reach out.',
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

  // -------- Dearborn ----------------------------------------------------
  {
    slug: 'dearborn',
    name: 'Dearborn',
    region: 'Wayne County',
    populationLabel: '~109,000 residents',
    population: 109000,
    latitude: 42.3136,
    longitude: -83.2161,
    houseDistricts: [3, 15],
    senateDistricts: [2],
    historyParagraphs: [
      'Dearborn is home to Henry Ford Museum, the Ford Motor Company world headquarters, and the largest Arab-American population in the United States. Ford recruited Lebanese laborers to the Rouge plant in the 1910s; today Dearborn is majority-Arab, with sizable Lebanese, Iraqi, Yemeni, and Palestinian communities. Islamic, Chaldean Catholic, and Maronite Christian congregations sit blocks from one another on Warren Avenue.',
      'That religious composition matters for abolition. The historic Christian teaching on abortion — that the preborn are ensouled human beings from conception — is shared by every ancient Christian tradition represented in Dearborn. Islamic teaching on abortion, though not identical, also grants human status to the fetus early. Dearborn is a city where the argument that abortion takes a human life is already the majority religious position; the abolitionist step is to insist the civil law reflect that consensus.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Dearborn city limits. The closest providers to Dearborn residents are in neighboring Detroit and Livonia (see the nearby-cities strip below).',
    abortionLandscapeOutro:
      'Wayne County voted 68% in favor of Proposal 3 in 2022. The dominant conservative religious ethics of Dearborn\'s Arab-American Christian and Muslim communities suggest a persuadable audience for the abolitionist argument that the state has misread its constitutional obligation to protect the preborn.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Dearborn?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Dearborn city limits. Dearborn is home to Chaldean Catholic, Maronite, Antiochian Orthodox, and Reformed Protestant congregations — if yours has adopted an abolition resolution, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Dearborn?',
        a: 'Dearborn is served by two state House districts and one state Senate district. Use our Find-my-legislator tool on the scorecard page to look yours up by ZIP or address.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Dearborn?',
        a: 'Sign the Michigan abolition petition, contact your Dearborn state representative through the scorecard, join our Signal group, and reach out to us if your church would consider adopting the abolition resolution.',
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

  // -------- Livonia -----------------------------------------------------
  {
    slug: 'livonia',
    name: 'Livonia',
    region: 'Wayne County',
    populationLabel: '~93,000 residents',
    population: 93000,
    latitude: 42.3944,
    longitude: -83.3686,
    houseDistricts: [17, 22],
    senateDistricts: [5, 6],
    historyParagraphs: [
      'Livonia is a large Detroit suburb — the ninth-largest city in Michigan — built out during the postwar auto-industry boom. Its residents work overwhelmingly at Ford, GM, and their supplier network; its politics have historically been Republican-leaning even as neighboring Wayne County cities have shifted Democratic. Livonia\'s civic identity is small-town suburban despite its size: family-owned businesses, dense church attendance, and a strong Catholic parish network.',
      'Livonia sits at the political fault line where an abolitionist case can actually move votes. Its residents span the Reagan-Democrat lane that split on Proposal 3 in 2022, and the Livonia-area religious infrastructure — from St. Aidan and St. Michael to independent Bible churches — is broad and dense. The abolitionist argument here has a real audience.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates inside Livonia city limits, on the boundary between Farmington and Plymouth Roads:',
    abortionLandscapeOutro:
      'Wayne County voted 68% in favor of Proposal 3 in 2022, but Livonia\'s specific precincts split more evenly — the city is on the boundary between Wayne County\'s pro-Prop-3 core and Oakland/Washtenaw\'s split suburbs.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Livonia?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Livonia city limits. Livonia has a dense Catholic parish network + independent Bible churches — if yours has taken a public stand for abolition, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Livonia?',
        a: 'Livonia is served by two state House districts and two state Senate districts. Use our Find-my-legislator tool on the scorecard page to look yours up.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Livonia?',
        a: 'Sign the Michigan abolition petition, contact your Livonia state representative through the scorecard, join our Signal group, and reach out to us if your church would consider adopting the abolition resolution.',
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

  // -------- Troy --------------------------------------------------------
  {
    slug: 'troy',
    name: 'Troy',
    region: 'Oakland County',
    populationLabel: '~87,000 residents',
    population: 87000,
    latitude: 42.5805,
    longitude: -83.1481,
    houseDistricts: [56],
    senateDistricts: [9],
    historyParagraphs: [
      'Troy is one of the wealthiest cities in Michigan, an Oakland County suburb built around the Somerset Collection, Kellogg Park, and a Big-Three engineering-and-management workforce. Its residents include large Chaldean Christian, Indian Hindu and Christian, and Chinese communities, along with a well-established secular professional class. Politically it has trended purple in recent cycles: Democratic in presidential races, Republican for local council seats.',
      'Troy\'s religious composition mirrors Sterling Heights\' Chaldean strength — several of the largest Chaldean Catholic parishes in the diaspora meet here. The Chaldean church\'s ancient position on abortion (against, without exception) puts a large fraction of Troy\'s Christian residents in natural sympathy with the abolition case, even where their political voting has diverged from that theology.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Troy city limits. The closest providers to Troy residents are in Sterling Heights and Warren (see the nearby-cities strip below).',
    abortionLandscapeOutro:
      'Oakland County voted 62% in favor of Proposal 3 in 2022. Troy specifically was closer to 55%, one of the more competitive suburbs in the county — an audience with room for a serious abolition argument.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Troy?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Troy city limits. Troy hosts several of the largest Chaldean Catholic parishes in the country — if any have taken a public stand for abolition, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Troy?',
        a: 'Troy is served by one state House district and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Troy?',
        a: 'Sign the Michigan abolition petition, contact your Troy state representative through the scorecard, join our Signal group, and reach out to us if your church would consider adopting the abolition resolution.',
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

  // -------- Westland ----------------------------------------------------
  {
    slug: 'westland',
    name: 'Westland',
    region: 'Wayne County',
    populationLabel: '~84,000 residents',
    population: 84000,
    latitude: 42.3124,
    longitude: -83.3766,
    houseDistricts: [25, 26],
    senateDistricts: [5],
    historyParagraphs: [
      'Westland is a working-class Detroit suburb west of Dearborn, part of the postwar auto-industry ring. Named after the Westland Center shopping mall when it incorporated in 1966, the city has a large Union-Democrat electorate that has trended Republican in national races since 2016. Its churches lean evangelical, Catholic, and Missouri-Synod Lutheran — theologically-conservative traditions that hold historic pro-life positions.',
      'Westland is home to Northland Family Planning\'s Westland location on Ford Road — one of the highest-volume abortion facilities in metro Detroit. That the city hosts a major abortion provider despite its working-class Christian composition is exactly the pattern the abolitionist argument exists to answer: private conviction and public law have diverged, and the law needs to be brought back into line.',
    ],
    abortionLandscapeIntro:
      'One high-volume abortion facility operates inside Westland city limits:',
    abortionLandscapeOutro:
      'Wayne County voted 68% in favor of Proposal 3 in 2022 — a vote that put the constitutional protection of preborn Michiganders out of reach through the ordinary democratic process. Abolition insists that some questions of justice are prior to the ballot.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Westland?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Westland city limits. Westland has a dense Catholic + LCMS + evangelical church network — if yours has taken a public stand for abolition, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Westland?',
        a: 'Westland is served by two state House districts and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Westland?',
        a: 'Sign the Michigan abolition petition, contact your Westland state representative through the scorecard, join our Signal group, and reach out to us if your church would consider adopting the abolition resolution.',
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

  // -------- Farmington Hills -------------------------------------------
  {
    slug: 'farmington-hills',
    name: 'Farmington Hills',
    region: 'Oakland County',
    populationLabel: '~83,000 residents',
    population: 83000,
    latitude: 42.4847,
    longitude: -83.3812,
    houseDistricts: [18, 19, 21],
    senateDistricts: [6, 13],
    historyParagraphs: [
      'Farmington Hills is a well-established Oakland County suburb, one of the wealthiest cities in Michigan by median household income. It hosts a substantial Jewish community with several major synagogues, along with strong Catholic, mainline Protestant, and Reformed congregations. Its politics lean Democratic in most cycles, with Republican pockets in the older-development neighborhoods.',
      'The Jewish teaching on abortion in Farmington Hills is not monolithic — the Orthodox community is unambiguously pro-life, while the Conservative and Reform movements have taken varying positions. The abolitionist argument in Farmington Hills is a religious one — an insistence that a preborn Jewish, Christian, or Muslim life is a life the civil law must protect — and it finds real theological allies here even where the political tide runs against it.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Farmington Hills city limits. The closest providers are in Livonia, Southfield-adjacent (WCM), and Sterling Heights (see the nearby-cities strip below).',
    abortionLandscapeOutro:
      'Oakland County voted 62% in favor of Proposal 3 in 2022. Farmington Hills was slightly above the county average — a challenging environment for the abolitionist argument, but one where the strong Orthodox Jewish and confessional-Christian pockets make the case still worth pressing.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Farmington Hills?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Farmington Hills city limits. If your Farmington Hills church has adopted an abolition resolution, reach out — we\'d also welcome contact from Orthodox Jewish congregations aligned with this cause.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Farmington Hills?',
        a: 'Farmington Hills is served by three state House districts and two state Senate districts. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Farmington Hills?',
        a: 'Sign the Michigan abolition petition, contact your Farmington Hills state representative through the scorecard, join our Signal group, and reach out to us if your church would consider adopting the abolition resolution.',
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

  // -------- Flint -------------------------------------------------------
  {
    slug: 'flint',
    name: 'Flint',
    region: 'Genesee County',
    populationLabel: '~79,000 residents',
    population: 79000,
    latitude: 43.0362,
    longitude: -83.7013,
    houseDistricts: [69, 70],
    senateDistricts: [27],
    historyParagraphs: [
      'Flint is the birthplace of General Motors and — for most of the 20th century — one of the wealthiest per-capita cities in America. The post-war collapse of the auto industry hollowed out its economy; the 2014 water crisis, in which Governor Snyder\'s emergency manager switched Flint\'s municipal water source to the untreated Flint River and lead leached into 100,000 residents\' drinking water, cemented the city as a case study in how the state can fail its most vulnerable.',
      'That history matters for abolition. Flint is a majority-Black, working-class city whose residents have felt firsthand what happens when the state decides some lives are cheaper to lose than to protect. The abolitionist case for the preborn is a case for equal protection under the law — the same principle Flint has spent a decade demanding for its own children. Abortion facilities disproportionately locate in and serve communities like Flint\'s. Ending abortion is a justice issue for Flint specifically.',
    ],
    abortionLandscapeIntro:
      'Two abortion facilities operate inside Flint city limits — a high provider density for a city of its size:',
    abortionLandscapeOutro:
      'Genesee County voted 63% in favor of Proposal 3 in 2022. Flint\'s Black-majority Christian churches — historically the most theologically-conservative constituency on abortion in Michigan — are a natural coalition audience for the abolitionist argument.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Flint?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Flint city limits. Flint has a large Black-Baptist / AME / COGIC network — if your Flint-area church has taken a public stand for abolition, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Flint?',
        a: 'Flint is served by two state House districts and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Flint?',
        a: 'Sign the Michigan abolition petition, contact your Flint state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Wyoming -----------------------------------------------------
  {
    slug: 'wyoming',
    name: 'Wyoming',
    region: 'Kent County',
    populationLabel: '~78,000 residents',
    population: 78000,
    latitude: 42.8897,
    longitude: -85.7090,
    houseDistricts: [80, 83, 84],
    senateDistricts: [29],
    historyParagraphs: [
      'Wyoming is the largest suburb of Grand Rapids, sitting directly south of the city and sharing its Dutch Reformed civic inheritance. Its neighborhoods run from working-class near 28th Street to the leafy affluence of the Byron Center border. The Christian Reformed Church of North America (CRC) and Reformed Church in America (RCA) both maintain a dense congregational presence throughout the city.',
      'Wyoming\'s religious identity carries the historic Reformed teaching that human life begins at conception and is a gift of God. The gap between that teaching and Michigan\'s post-Proposal-3 constitutional protection of abortion is the exact gap the abolitionist argument exists to close. In a city where nearly every neighborhood has a CRC or RCA church within walking distance, abolition is a natural next-step for a movement already latent in the pulpits.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Wyoming city limits. The closest provider is Planned Parenthood\'s Irwin/Martin Health Center on Cherry Street in neighboring Grand Rapids (see the nearby-cities strip below).',
    abortionLandscapeOutro:
      'Kent County voted 62% in favor of Proposal 3 in 2022. Wyoming\'s precincts specifically split more evenly than the county as a whole — the city\'s dense Reformed and working-class Catholic churches are a persuadable audience.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Wyoming?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Wyoming city limits, though the city is home to many CRC/RCA congregations. If your Wyoming church has adopted an abolition resolution, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Wyoming?',
        a: 'Wyoming is served by three state House districts and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Wyoming?',
        a: 'Sign the Michigan abolition petition, contact your Wyoming state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Southfield --------------------------------------------------
  {
    slug: 'southfield',
    name: 'Southfield',
    region: 'Oakland County',
    populationLabel: '~76,000 residents',
    population: 76000,
    latitude: 42.4828,
    longitude: -83.2541,
    houseDistricts: [18, 19],
    senateDistricts: [7],
    historyParagraphs: [
      'Southfield is the corporate anchor of Oakland County — home to the world headquarters of Lear, Learjet\'s namesake fleet lessor Federal-Mogul, and dozens of Fortune-500 regional offices. It is also home to a strong Black professional class, one of the largest Chaldean populations in Michigan, and a substantial Orthodox Jewish community centered around Congregation Shomrey Emunah and Adat Shalom.',
      'That religious diversity concentrates natural allies for the abolition case. The Chaldean and Orthodox Jewish communities are theologically unambiguous that human life begins at conception. The Black-Baptist and Reformed Presbyterian congregations across the city hold the same position. Southfield hosts the largest single-provider abortion facility in the state (Northland Family Planning) — the exact concentration of religious anti-abortion witness and industrial-scale abortion provision that makes it a strategic abolition city.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates inside Southfield city limits — the largest single-provider abortion facility in the state of Michigan:',
    abortionLandscapeOutro:
      'Oakland County voted 62% in favor of Proposal 3 in 2022. Southfield\'s Chaldean Catholic and Orthodox Jewish communities voted against it in significant numbers — a reminder that the historic religious traditions represented in Southfield are natural coalition partners for abolition.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Southfield?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Southfield city limits. Southfield hosts Southfield Reformed Presbyterian Church (RPCNA), several Chaldean Catholic parishes, and Orthodox Jewish congregations. If yours has taken a public stand for the abolition of abortion, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Southfield?',
        a: 'Southfield is served by two state House districts and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Southfield?',
        a: 'Sign the Michigan abolition petition, contact your Southfield state representative through the scorecard, join our Signal group, and reach out to us if your church would consider adopting the abolition resolution.',
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

  // -------- Rochester Hills --------------------------------------------
  {
    slug: 'rochester-hills',
    name: 'Rochester Hills',
    region: 'Oakland County',
    populationLabel: '~76,000 residents',
    population: 76000,
    latitude: 42.6827,
    longitude: -83.1543,
    houseDistricts: [55, 66],
    senateDistricts: [9],
    historyParagraphs: [
      'Rochester Hills is a wealthy, historically-Republican Oakland County suburb — a bedroom community for the auto-industry engineering class and the professional families of Rochester and Auburn Hills. Home to Oakland University\'s campus and a dense network of confessional Reformed, evangelical, and Catholic congregations, its civic identity mixes engineering, education, and old-line Midwest Protestantism.',
      'Rochester Hills\' political character has drifted more purple in recent cycles but its religious institutions remain among the most theologically-anti-abortion in southeast Michigan. Its OPC/PCA/URCNA churches, the RC parishes of the Rochester deanery, and the LCMS congregations all hold pro-life doctrine as core teaching. Abolition is the logical step from that doctrine into civil law — and the argument has a real audience here.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Rochester Hills city limits. The closest providers to Rochester Hills residents are in Sterling Heights and Warren (see the nearby-cities strip below).',
    abortionLandscapeOutro:
      'Oakland County voted 62% in favor of Proposal 3 in 2022. Rochester Hills specifically was closer to 55% — one of the more persuadable suburbs in the county.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Rochester Hills?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Rochester Hills city limits. If your Rochester Hills church has taken a public stand for the abolition of abortion, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Rochester Hills?',
        a: 'Rochester Hills is served by two state House districts and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Rochester Hills?',
        a: 'Sign the Michigan abolition petition, contact your Rochester Hills state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Kalamazoo ---------------------------------------------------
  {
    slug: 'kalamazoo',
    name: 'Kalamazoo',
    region: 'Kalamazoo County',
    populationLabel: '~74,000 residents',
    population: 74000,
    latitude: 42.2884,
    longitude: -85.5963,
    houseDistricts: [40, 41, 42],
    senateDistricts: [19],
    historyParagraphs: [
      'Kalamazoo is home to Western Michigan University, Kalamazoo College, and the Kalamazoo Promise — the anonymously-funded scholarship that pays college tuition for every graduate of Kalamazoo Public Schools. Its civic identity blends college-town liberalism with a deep vein of confessional Reformed Christianity through the Christian Reformed Church and the Bible-Baptist network across Portage and Comstock.',
      'Kalamazoo\'s dual identity — WMU\'s pro-choice mainstream and the CRC-Bible-church coalition\'s historic anti-abortion witness — makes it one of Michigan\'s more polarized cities on this question. The abolitionist argument here has to speak into a genuinely-divided audience, which is exactly the audience where the biblical and constitutional case makes the most difference.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates inside Kalamazoo city limits, serving the Kalamazoo/Battle Creek region:',
    abortionLandscapeOutro:
      'Kalamazoo County voted 68% in favor of Proposal 3 in 2022 — one of the higher pro-Prop-3 margins in West Michigan, driven by WMU\'s student population.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Kalamazoo?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Kalamazoo city limits. CityGate Church in nearby Portage is on the postmillennial abolitionist network — see the partners page for the national coalition. If your Kalamazoo church has taken a public stand, reach out.',
        links: [
          { phrase: 'partners page', href: '/partners' },
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Kalamazoo?',
        a: 'Kalamazoo is served by three state House districts and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Kalamazoo?',
        a: 'Sign the Michigan abolition petition, contact your Kalamazoo state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Novi --------------------------------------------------------
  {
    slug: 'novi',
    name: 'Novi',
    region: 'Oakland County',
    populationLabel: '~67,000 residents',
    population: 67000,
    latitude: 42.4777,
    longitude: -83.4858,
    houseDistricts: [21],
    senateDistricts: [13],
    historyParagraphs: [
      'Novi is the fastest-growing city in Oakland County — a Twelve-Mile-corridor suburb that grew from a rural township of 10,000 in 1970 to a wealthy commercial hub of nearly 70,000 today. It hosts Twelve Oaks Mall, the Suburban Collection Showplace, and the largest Muslim-American population in Michigan outside of Dearborn, along with substantial Indian-American, Korean, and Chinese communities.',
      'Novi\'s religious composition is a mosaic — Islamic Center of Detroit-Novi, several major Hindu temples, Korean and Chinese Presbyterian churches, Catholic parishes, and evangelical mega-churches. The historic pro-life teaching in Islam, Hinduism, Catholicism, and confessional Protestantism all converge here, making Novi a strategically important city for coalition-building on abolition.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Novi city limits. The closest providers to Novi residents are in Southfield, Livonia, and Farmington Hills-adjacent (see the nearby-cities strip below).',
    abortionLandscapeOutro:
      'Oakland County voted 62% in favor of Proposal 3 in 2022. Novi specifically was around 60% — persuadable, especially given the diverse religious traditions represented in the city that all teach against abortion.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Novi?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Novi city limits. If your Novi church has adopted an abolition resolution, reach out — we\'d also welcome contact from Novi\'s Islamic, Hindu, and Reformed congregations aligned with this cause.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Novi?',
        a: 'Novi is served by one state House district and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Novi?',
        a: 'Sign the Michigan abolition petition, contact your Novi state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Taylor ------------------------------------------------------
  {
    slug: 'taylor',
    name: 'Taylor',
    region: 'Wayne County',
    populationLabel: '~63,000 residents',
    population: 63000,
    latitude: 42.2317,
    longitude: -83.2673,
    houseDistricts: [29],
    senateDistricts: [1],
    historyParagraphs: [
      'Taylor is a downriver Detroit suburb — one of the classic postwar working-class cities south of the Rouge River, populated by generations of Ford Motor Company assembly-line families. Politically it swings; culturally it is unabashedly Reagan-Democrat: union households that vote Republican for president and Democrat for local government. Its churches are predominantly Catholic, LCMS Lutheran, and evangelical Baptist.',
      'Downriver Wayne County — Taylor especially — is exactly the kind of place where the abolitionist argument has to be made in plain, working-class terms. The people here have never accepted the pro-choice framework; what they have accepted is the mainstream pro-life strategy of incremental restrictions. The abolitionist case invites them to something further: the recognition that abortion is homicide and must be treated as such.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Taylor city limits. The closest providers to Taylor residents are in Westland (Northland) and Detroit (see the nearby-cities strip below).',
    abortionLandscapeOutro:
      'Wayne County voted 68% in favor of Proposal 3 in 2022. Downriver precincts (including Taylor) voted closer to 60% — one of the more persuadable pockets of Wayne County.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Taylor?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Taylor city limits. Zion Baptist Church in Taylor is on the NXR confessional Reformed directory but has not (as far as we know) publicly adopted an abolition resolution. If your Taylor-area church has, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Taylor?',
        a: 'Taylor is served by one state House district and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Taylor?',
        a: 'Sign the Michigan abolition petition, contact your Taylor state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Dearborn Heights -------------------------------------------
  {
    slug: 'dearborn-heights',
    name: 'Dearborn Heights',
    region: 'Wayne County',
    populationLabel: '~63,000 residents',
    population: 63000,
    latitude: 42.3060,
    longitude: -83.2735,
    houseDistricts: [15],
    senateDistricts: [2],
    historyParagraphs: [
      'Dearborn Heights sits west of Dearborn along Ford Road and Warren Avenue — a working- and middle-class suburb built alongside the auto-industry boom of the 1950s and 60s. Its population today is roughly a third Arab-American (Lebanese, Iraqi Chaldean, and Yemeni), with substantial Polish-Catholic, Ukrainian-Orthodox, and evangelical Protestant communities.',
      'The historic Christian and Islamic teachings on abortion converge in Dearborn Heights: the preborn are ensouled human beings deserving of protection. The abolitionist argument is that civil law must reflect this shared moral conviction rather than defer to an atomistic "right to choose" framework alien to every ancient tradition present in the city.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Dearborn Heights city limits. The closest providers are in Detroit, Livonia, and Westland (see the nearby-cities strip below).',
    abortionLandscapeOutro:
      'Wayne County voted 68% in favor of Proposal 3 in 2022. Dearborn Heights split closer to the Wayne County average, with Arab-American precincts voting more against Prop 3 than Wayne County as a whole.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Dearborn Heights?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Dearborn Heights city limits. If your Dearborn Heights church — Catholic, Orthodox, evangelical, or otherwise — has adopted an abolition resolution, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Dearborn Heights?',
        a: 'Dearborn Heights is served by one state House district and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Dearborn Heights?',
        a: 'Sign the Michigan abolition petition, contact your Dearborn Heights state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Pontiac -----------------------------------------------------
  {
    slug: 'pontiac',
    name: 'Pontiac',
    region: 'Oakland County',
    populationLabel: '~61,000 residents',
    population: 61000,
    latitude: 42.6471,
    longitude: -83.2909,
    houseDistricts: [53],
    senateDistricts: [7],
    historyParagraphs: [
      'Pontiac was, for the better part of the 20th century, the manufacturing heart of General Motors — home to the Pontiac division, Fisher Body, and the enormous factories that employed 90,000 people at their peak. The industry\'s collapse left Pontiac one of Michigan\'s poorest cities per capita, with a majority-Black population, a shrinking tax base, and a churn of state-imposed emergency managers throughout the 2010s.',
      'Pontiac\'s Black church network — historic AME, COGIC, and Baptist congregations dating back to the Great Migration — has always held that abortion disproportionately harms Black communities and Black babies. The abolitionist framing, that abortion is homicide and Black lives are equally protected by law, is the natural theological and civil-rights extension of that conviction.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Pontiac city limits. The closest providers to Pontiac residents are in Southfield (Northland) and Sterling Heights (see the nearby-cities strip below).',
    abortionLandscapeOutro:
      'Oakland County voted 62% in favor of Proposal 3 in 2022. Pontiac\'s Black-majority precincts split closer to 55% — the Black-church network\'s historic opposition to abortion is visible in that number.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Pontiac?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Pontiac city limits. Pontiac has a large historic Black-Baptist / AME / COGIC network — if your Pontiac church has adopted an abolition resolution, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Pontiac?',
        a: 'Pontiac is served by one state House district and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Pontiac?',
        a: 'Sign the Michigan abolition petition, contact your Pontiac state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Royal Oak ---------------------------------------------------
  {
    slug: 'royal-oak',
    name: 'Royal Oak',
    region: 'Oakland County',
    populationLabel: '~59,000 residents',
    population: 59000,
    latitude: 42.5048,
    longitude: -83.1468,
    houseDistricts: [6, 56],
    senateDistricts: [8],
    historyParagraphs: [
      'Royal Oak is Woodward Corridor\'s hip nightlife center — a dense, walkable, historically-artist-and-professional suburb where the Detroit Zoo has stood since 1928 and the annual Woodward Dream Cruise rolls past 40,000-strong crowds every August. Its politics run steadily Democratic; its churches are a mix of Catholic (Shrine of the Little Flower — Fr. Charles Coughlin\'s controversial 1930s radio parish), mainline Protestant (Royal Oak First United Methodist), and PCA-adjacent (New City Presbyterian).',
      'Royal Oak\'s dominant political direction is not naturally friendly to the abolitionist argument. But the confessional Christian congregations here have never accepted the pro-choice framework, and New City Presbyterian in particular has a track record of clear pro-life teaching. The abolition case in Royal Oak is a case for the church against the culture.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Royal Oak city limits. The closest provider is Northland Family Planning in neighboring Southfield (see the nearby-cities strip below).',
    abortionLandscapeOutro:
      'Oakland County voted 62% in favor of Proposal 3 in 2022. Royal Oak specifically voted much higher — around 78% — one of the most pro-Prop-3 cities outside Ann Arbor and Ypsilanti.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Royal Oak?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Royal Oak city limits. Royal Oak hosts New City Presbyterian Church (PCA) and Shrine of the Little Flower (Catholic) — if your Royal Oak church has adopted an abolition resolution, reach out.',
        links: [{ phrase: 'reach out', href: '/contact' }],
      },
      {
        q: 'Who is my state representative in Royal Oak?',
        a: 'Royal Oak is served by two state House districts and one state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Royal Oak?',
        a: 'Sign the Michigan abolition petition, contact your Royal Oak state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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
