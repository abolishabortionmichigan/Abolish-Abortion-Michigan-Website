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

  // -------- St. Clair Shores ----------------------------------
  {
    slug: 'st-clair-shores',
    name: 'St. Clair Shores',
    region: 'Macomb County',
    populationLabel: '~58,000 residents',
    population: 58000,
    latitude: 42.4972,
    longitude: -82.8951,
    houseDistricts: [12, 13, 62],
    senateDistricts: [12],
    historyParagraphs: [
      'St. Clair Shores is Michigan\'s ninth-largest city on the Lake St. Clair shoreline — a postwar Macomb County suburb built around the boating industry and named for its 15 miles of lakefront. The city is politically Republican-leaning in local races but sends Democrats to the state Legislature, a classic Reagan-Democrat pattern.',
      'The Catholic parish network here is dense — St. Joan of Arc, St. Isaac Jogues, St. Margaret of Scotland — and holds the historic teaching that abortion is intrinsically evil. The distance between that pulpit teaching and the state\'s post-Prop-3 constitutional protection of abortion is the gap the abolitionist argument exists to close.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside St. Clair Shores city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in St. Clair Shores?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside St. Clair Shores city limits. If your St. Clair Shores-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in St. Clair Shores?',
        a: 'St. Clair Shores is served by 3 state House districts and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in St. Clair Shores?',
        a: 'Sign the Michigan abolition petition, contact your St. Clair Shores state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Kentwood ------------------------------------------
  {
    slug: 'kentwood',
    name: 'Kentwood',
    region: 'Kent County',
    populationLabel: '~54,000 residents',
    population: 54000,
    latitude: 42.9177,
    longitude: -85.5926,
    houseDistricts: [80, 81, 82],
    senateDistricts: [29, 30],
    historyParagraphs: [
      'Kentwood is a Grand Rapids suburb built out through the 1960s-90s auto-industry-adjacent boom, now one of the most ethnically diverse cities in West Michigan with substantial Bosnian, Vietnamese, Congolese, and Nepali populations alongside the historic Dutch Reformed core.',
      'That diversity concentrates ancient Christian anti-abortion witness across denominations — CRC / RCA / Catholic / Orthodox / evangelical — in a city where the pulpit teaching aligns almost universally against abortion. Abolition is the logical civic expression of that shared conviction.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Kentwood city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Kentwood?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Kentwood city limits. If your Kentwood-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Kentwood?',
        a: 'Kentwood is served by 3 state House districts and 2 state Senate districts. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Kentwood?',
        a: 'Sign the Michigan abolition petition, contact your Kentwood state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Battle Creek --------------------------------------
  {
    slug: 'battle-creek',
    name: 'Battle Creek',
    region: 'Calhoun County',
    populationLabel: '~52,000 residents',
    population: 52000,
    latitude: 42.3208,
    longitude: -85.1855,
    houseDistricts: [44, 45],
    senateDistricts: [18],
    historyParagraphs: [
      'Battle Creek is Cereal City — the birthplace of Kellogg\'s and Post, both founded here in the late 1800s by figures with Seventh-day Adventist roots. The Adventist and Methodist traditions in Battle Creek have deep historical influence over the city\'s civic character.',
      'The historic SDA teaching on abortion is that it is contrary to God\'s plan for human life; the mainline Methodist position has drifted, but Battle Creek\'s African Methodist Episcopal (AME) congregations remain strongly pro-life. The abolitionist argument here has an audience across traditions that agree on the personhood of the preborn.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Battle Creek city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Battle Creek?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Battle Creek city limits. If your Battle Creek-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Battle Creek?',
        a: 'Battle Creek is served by 2 state House districts and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Battle Creek?',
        a: 'Sign the Michigan abolition petition, contact your Battle Creek state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Portage -------------------------------------------
  {
    slug: 'portage',
    name: 'Portage',
    region: 'Kalamazoo County',
    populationLabel: '~48,000 residents',
    population: 48000,
    latitude: 42.1956,
    longitude: -85.5917,
    houseDistricts: [40],
    senateDistricts: [19],
    historyParagraphs: [
      'Portage is Kalamazoo\'s largest suburb, home to Stryker Corporation, Pfizer\'s Kalamazoo campus, and the Air Zoo aviation museum. Its churches include CityGate Church (on the postmillennial-network AAM Partners page), several major Reformed congregations, and a strong Catholic parish network.',
      'Portage\'s postmillennial-adjacent CityGate presence is exactly the kind of nucleus around which local abolition coalitions form. See the partners page for the broader national network.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Portage city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Portage?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Portage city limits. If your Portage-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Portage?',
        a: 'Portage is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Portage?',
        a: 'Sign the Michigan abolition petition, contact your Portage state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Roseville -----------------------------------------
  {
    slug: 'roseville',
    name: 'Roseville',
    region: 'Macomb County',
    populationLabel: '~47,000 residents',
    population: 47000,
    latitude: 42.5034,
    longitude: -82.9387,
    houseDistricts: [13],
    senateDistricts: [11],
    historyParagraphs: [
      'Roseville is a working-class Macomb County inner-ring suburb — a Detroit-Metro city built on the auto industry, home to Macomb Community College\'s south campus and the Macomb Mall. Politically it splits — trending Republican in presidential races since 2016, still sending Democrats to Lansing.',
      'The dominant religious traditions in Roseville — Catholic, LCMS Lutheran, and evangelical Baptist — all teach against abortion. The abolitionist case here is a case for aligning private conviction with public law.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Roseville city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Roseville?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Roseville city limits. If your Roseville-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Roseville?',
        a: 'Roseville is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Roseville?',
        a: 'Sign the Michigan abolition petition, contact your Roseville state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- East Lansing --------------------------------------
  {
    slug: 'east-lansing',
    name: 'East Lansing',
    region: 'Ingham County',
    populationLabel: '~47,000 residents',
    population: 47000,
    latitude: 42.7335,
    longitude: -84.4823,
    houseDistricts: [73, 75],
    senateDistricts: [28],
    historyParagraphs: [
      'East Lansing is Michigan State University\'s home — a college town whose politics are shaped by the university\'s 50,000-student population and its progressive Big Ten-flagship faculty. The city\'s dominant political culture runs deep-Democratic, but its confessional-Christian congregations (PCA, LCMS, Catholic) hold the historic pro-life teaching without compromise.',
      'East Lansing is exactly the audience the abolitionist argument was built to reach — university-educated professionals who take theology seriously and hear the biblical case for the personhood of the preborn as a substantive argument rather than a slogan.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside East Lansing city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in East Lansing?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside East Lansing city limits. If your East Lansing-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in East Lansing?',
        a: 'East Lansing is served by 2 state House districts and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in East Lansing?',
        a: 'Sign the Michigan abolition petition, contact your East Lansing state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Saginaw -------------------------------------------
  {
    slug: 'saginaw',
    name: 'Saginaw',
    region: 'Saginaw County',
    populationLabel: '~44,000 residents',
    population: 44000,
    latitude: 43.4392,
    longitude: -83.9606,
    houseDistricts: [94],
    senateDistricts: [35],
    historyParagraphs: [
      'Saginaw was the world\'s leading lumber city in the 1870s and later a major GM manufacturing hub. The industry\'s collapse left it one of the state\'s poorest cities per capita, majority-Black, with a long history of investment from the Black church network — AME, COGIC, Baptist — that anchors its civic life.',
      'Saginaw\'s Black-church coalition has historically held the pro-life position and understood abortion\'s disproportionate impact on Black communities. The abolitionist argument extends that conviction into civil-rights terms: equal protection under the law for the smallest class of Black lives.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates inside Saginaw city limits:',
    faqs: [
      {
        q: 'Are there abolitionist churches in Saginaw?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Saginaw city limits. If your Saginaw-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Saginaw?',
        a: 'Saginaw is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Saginaw?',
        a: 'Sign the Michigan abolition petition, contact your Saginaw state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Midland -------------------------------------------
  {
    slug: 'midland',
    name: 'Midland',
    region: 'Midland County',
    populationLabel: '~42,000 residents',
    population: 42000,
    latitude: 43.6376,
    longitude: -84.233,
    houseDistricts: [95],
    senateDistricts: [35],
    historyParagraphs: [
      'Midland is the world headquarters of Dow Chemical — the city was built by Dow in the early 20th century, and its civic and philanthropic life is still shaped by the company. The Midland Center for the Arts, the Dow Gardens, and the Herbert H. and Grace A. Dow Foundation all descend from that industrial legacy.',
      'Midland is a wealthy, Republican-leaning city with a dense Catholic and evangelical Protestant church network. The abolitionist argument has natural traction here — the theology aligns and the political culture is open to it.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Midland city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Midland?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Midland city limits. If your Midland-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Midland?',
        a: 'Midland is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Midland?',
        a: 'Sign the Michigan abolition petition, contact your Midland state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Muskegon ------------------------------------------
  {
    slug: 'muskegon',
    name: 'Muskegon',
    region: 'Muskegon County',
    populationLabel: '~38,000 residents',
    population: 38000,
    latitude: 43.2272,
    longitude: -86.2379,
    houseDistricts: [87, 89],
    senateDistricts: [32],
    historyParagraphs: [
      'Muskegon is the largest Lake Michigan port on the west side of the state — historically a lumber-and-foundry town, now Michigan\'s Adventure amusement park and the West Michigan cruise ship terminal. The city is majority-white, working-class, and has a strong Reformed / Christian Reformed presence alongside a substantial Black Baptist community.',
      'Muskegon\'s church network — CRC, RCA, Baptist, and Catholic — is uniformly against abortion. What\'s missing is the political coalition that translates that pulpit consensus into civic law. Abolition is the framework that translation requires.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Muskegon city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Muskegon?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Muskegon city limits. If your Muskegon-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Muskegon?',
        a: 'Muskegon is served by 2 state House districts and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Muskegon?',
        a: 'Sign the Michigan abolition petition, contact your Muskegon state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Holland -------------------------------------------
  {
    slug: 'holland',
    name: 'Holland',
    region: 'Ottawa County',
    populationLabel: '~34,000 residents',
    population: 34000,
    latitude: 42.7913,
    longitude: -86.1295,
    houseDistricts: [86],
    senateDistricts: [31],
    historyParagraphs: [
      'Holland is the most densely Dutch-Reformed city in America outside the Netherlands. The Christian Reformed Church, Reformed Church in America, and Netherlands Reformed traditions all have their strongest concentrations here. Hope College (RCA-affiliated) and Western Theological Seminary anchor its intellectual life; Tulip Time festival is its annual civic showpiece.',
      'Holland\'s confessional Reformed theology is unambiguous on the personhood of the preborn from conception. The abolitionist case is the logical extension — that civil law must reflect what the pulpits already teach — and Holland is one of the cities in Michigan where that argument has the deepest theological reception.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Holland city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Holland?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Holland city limits. If your Holland-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Holland?',
        a: 'Holland is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Holland?',
        a: 'Sign the Michigan abolition petition, contact your Holland state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Bay City ------------------------------------------
  {
    slug: 'bay-city',
    name: 'Bay City',
    region: 'Bay County',
    populationLabel: '~32,000 residents',
    population: 32000,
    latitude: 43.5954,
    longitude: -83.9155,
    houseDistricts: [96],
    senateDistricts: [35],
    historyParagraphs: [
      'Bay City is the Saginaw Bay port that made Michigan\'s 19th-century lumber trade possible — a working-class Great Lakes shipping town whose civic identity remains tied to Ford and Dow-Chemical-adjacent manufacturing. Home of Madonna\'s actual birthplace and the annual Bay City Fireworks.',
      'The Catholic parish network here — St. Stanislaus, All Saints, Our Lady of Consolation — is dense and historically strong. The abolitionist argument fits the city\'s working-class Catholic conservatism, where the church has always taught what the state has refused to enact.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Bay City city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Bay City?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Bay City city limits. If your Bay City-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Bay City?',
        a: 'Bay City is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Bay City?',
        a: 'Sign the Michigan abolition petition, contact your Bay City state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Jackson -------------------------------------------
  {
    slug: 'jackson',
    name: 'Jackson',
    region: 'Jackson County',
    populationLabel: '~31,000 residents',
    population: 31000,
    latitude: 42.249,
    longitude: -84.403,
    houseDistricts: [46],
    senateDistricts: [14],
    historyParagraphs: [
      'Jackson is the birthplace of the Republican Party — the first Republican convention was held here in 1854, under the oaks now marked at the corner of 2nd and Franklin. The city was founded on the anti-slavery abolition argument that later carried Lincoln to the presidency. That inheritance is Jackson\'s most important civic identity.',
      'Abolish Abortion Michigan stands in the same tradition that Jackson helped found. The 1854 Republican Party existed because ordinary Michigan Christians refused to accept that slavery was settled law. The abolition of abortion asks the same conviction of Jackson\'s residents today — and no city in Michigan has a stronger historical reason to make that case.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Jackson city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Jackson?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Jackson city limits. If your Jackson-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Jackson?',
        a: 'Jackson is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Jackson?',
        a: 'Sign the Michigan abolition petition, contact your Jackson state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Southgate -----------------------------------------
  {
    slug: 'southgate',
    name: 'Southgate',
    region: 'Wayne County',
    populationLabel: '~30,000 residents',
    population: 30000,
    latitude: 42.2044,
    longitude: -83.1999,
    houseDistricts: [27],
    senateDistricts: [4],
    historyParagraphs: [
      'Southgate is a downriver Detroit suburb built alongside the auto industry — home to Southgate Community Schools, the Southgate Anderson High football tradition, and a working-class Reagan-Democrat electorate similar to Taylor and Wyandotte.',
      'The Catholic and LCMS Lutheran churches here hold the historic pro-life teaching. The abolitionist argument speaks to Southgate residents in the plain-terms working-class case for the personhood of the preborn.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Southgate city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Southgate?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Southgate city limits. If your Southgate-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Southgate?',
        a: 'Southgate is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Southgate?',
        a: 'Sign the Michigan abolition petition, contact your Southgate state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Madison Heights -----------------------------------
  {
    slug: 'madison-heights',
    name: 'Madison Heights',
    region: 'Oakland County',
    populationLabel: '~30,000 residents',
    population: 30000,
    latitude: 42.5016,
    longitude: -83.1027,
    houseDistricts: [14],
    senateDistricts: [3],
    historyParagraphs: [
      'Madison Heights is a small, dense inner-ring Oakland County suburb north of Detroit — home to the Oakland Mall, a strong Vietnamese community centered around John R Road\'s Little Saigon, and a mix of postwar Catholic and evangelical churches.',
      'The Catholic parish network here — including St. Vincent Ferrer — teaches the historic anti-abortion position. Madison Heights\' Vietnamese-American Catholic community adds another confessional voice to the coalition.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Madison Heights city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Madison Heights?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Madison Heights city limits. If your Madison Heights-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Madison Heights?',
        a: 'Madison Heights is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Madison Heights?',
        a: 'Sign the Michigan abolition petition, contact your Madison Heights state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Port Huron ----------------------------------------
  {
    slug: 'port-huron',
    name: 'Port Huron',
    region: 'St. Clair County',
    populationLabel: '~28,000 residents',
    population: 28000,
    latitude: 42.9958,
    longitude: -82.4599,
    houseDistricts: [64],
    senateDistricts: [25],
    historyParagraphs: [
      'Port Huron is the Blue Water Bridge to Canada — Michigan\'s easternmost city, at the mouth of Lake Huron. Its 19th-century identity was as a shipping-and-shipbuilding port; today its economy is mixed retail, tourism, and cross-border trade. The city is historically Republican, with a strong Catholic-and-Methodist church network.',
      'Port Huron\'s political culture is right-leaning enough that the abolitionist argument has room to move votes if the case is made plainly. The mainstream pro-life vote here is a floor to build from, not a ceiling.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Port Huron city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Port Huron?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Port Huron city limits. If your Port Huron-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Port Huron?',
        a: 'Port Huron is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Port Huron?',
        a: 'Sign the Michigan abolition petition, contact your Port Huron state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Mount Pleasant ------------------------------------
  {
    slug: 'mount-pleasant',
    name: 'Mount Pleasant',
    region: 'Isabella County',
    populationLabel: '~26,000 residents',
    population: 26000,
    latitude: 43.6013,
    longitude: -84.7736,
    houseDistricts: [92],
    senateDistricts: [34],
    historyParagraphs: [
      'Mount Pleasant is home to Central Michigan University and the Saginaw Chippewa Indian Tribe\'s Soaring Eagle Casino & Resort — a mid-Michigan college town whose politics reflect the split between CMU\'s student progressivism and Isabella County\'s rural Republican character.',
      'The Catholic and evangelical church network in Mount Pleasant has been consistent in its pro-life witness. The abolitionist argument at CMU is the argument for taking the pro-life conviction seriously as a matter of law, not just personal preference.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Mount Pleasant city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Mount Pleasant?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Mount Pleasant city limits. If your Mount Pleasant-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Mount Pleasant?',
        a: 'Mount Pleasant is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Mount Pleasant?',
        a: 'Sign the Michigan abolition petition, contact your Mount Pleasant state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Wyandotte -----------------------------------------
  {
    slug: 'wyandotte',
    name: 'Wyandotte',
    region: 'Wayne County',
    populationLabel: '~25,000 residents',
    population: 25000,
    latitude: 42.2084,
    longitude: -83.1616,
    houseDistricts: [27],
    senateDistricts: [4],
    historyParagraphs: [
      'Wyandotte is a downriver Detroit suburb on the Detroit River — historically a Polish and Ukrainian Catholic working-class city, its economy shaped by the Wyandotte Chemical Company (now BASF) and Ford\'s downriver plants.',
      'The Polish and Ukrainian Catholic parishes in Wyandotte hold the traditional teaching on abortion without compromise. The abolitionist argument is the natural civil-law expression of that theology.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Wyandotte city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Wyandotte?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Wyandotte city limits. If your Wyandotte-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Wyandotte?',
        a: 'Wyandotte is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Wyandotte?',
        a: 'Sign the Michigan abolition petition, contact your Wyandotte state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Auburn Hills --------------------------------------
  {
    slug: 'auburn-hills',
    name: 'Auburn Hills',
    region: 'Oakland County',
    populationLabel: '~24,000 residents',
    population: 24000,
    latitude: 42.6583,
    longitude: -83.2375,
    houseDistricts: [54],
    senateDistricts: [7],
    historyParagraphs: [
      'Auburn Hills is Oakland County\'s automotive-corporate hub — home to Chrysler\'s world headquarters, the Palace of Auburn Hills (now demolished but the site of Pistons and countless concerts through 2017), and the Oakland University campus.',
      'The Reformed, evangelical, and Catholic churches in Auburn Hills carry the historic pro-life teaching. The abolitionist argument in Auburn Hills is the civil-law extension of that pulpit consensus — a shift from private conviction to public code.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Auburn Hills city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Auburn Hills?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Auburn Hills city limits. If your Auburn Hills-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Auburn Hills?',
        a: 'Auburn Hills is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Auburn Hills?',
        a: 'Sign the Michigan abolition petition, contact your Auburn Hills state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Ferndale ------------------------------------------
  {
    slug: 'ferndale',
    name: 'Ferndale',
    region: 'Oakland County',
    populationLabel: '~20,000 residents',
    population: 20000,
    latitude: 42.4586,
    longitude: -83.1363,
    houseDistricts: [8],
    senateDistricts: [8],
    historyParagraphs: [
      'Ferndale is Woodward Avenue\'s most-progressive Detroit-adjacent suburb — a dense, walkable city with the DIY Street Fair, First Friday art walks, and one of Michigan\'s most active LGBTQ communities. Politically it runs deep-Democratic; culturally it\'s the anti-Royal-Oak (older, weirder, more artistic).',
      'The abolitionist argument in Ferndale is a minority position by design. But the city is home to Planned Parenthood on Woodward — the highest-volume PP in southeast Michigan — and a church network that includes Baptist, Catholic, and traditional Lutheran congregations that have never accepted the pro-choice framework. Abolition here is the case for the church against the culture, made in the city where the culture is most self-consciously secular.',
    ],
    abortionLandscapeIntro:
      'One abortion facility operates inside Ferndale city limits:',
    faqs: [
      {
        q: 'Are there abolitionist churches in Ferndale?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Ferndale city limits. If your Ferndale-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Ferndale?',
        a: 'Ferndale is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Ferndale?',
        a: 'Sign the Michigan abolition petition, contact your Ferndale state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Marquette -----------------------------------------
  {
    slug: 'marquette',
    name: 'Marquette',
    region: 'Marquette County',
    populationLabel: '~20,000 residents',
    population: 20000,
    latitude: 46.5786,
    longitude: -87.4545,
    houseDistricts: [109],
    senateDistricts: [38],
    historyParagraphs: [
      'Marquette is the largest city in the Upper Peninsula, home to Northern Michigan University and the port that historically shipped iron ore from the Marquette Iron Range. Its civic identity is a mix of the UP\'s independent, blue-collar character and NMU\'s college-town liberal streak.',
      'The Catholic and Finnish-Lutheran church traditions dominant in Marquette hold the historic teaching against abortion. The UP\'s political culture is more open to unusual arguments than the lower peninsula\'s; abolition finds a real hearing here.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Marquette city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Marquette?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Marquette city limits. If your Marquette-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Marquette?',
        a: 'Marquette is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Marquette?',
        a: 'Sign the Michigan abolition petition, contact your Marquette state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Ypsilanti -----------------------------------------
  {
    slug: 'ypsilanti',
    name: 'Ypsilanti',
    region: 'Washtenaw County',
    populationLabel: '~20,000 residents',
    population: 20000,
    latitude: 42.2382,
    longitude: -83.6083,
    houseDistricts: [32],
    senateDistricts: [15],
    historyParagraphs: [
      'Ypsilanti is home to Eastern Michigan University and the historic Depot Town district — a college town whose civic identity is inseparable from Ann Arbor\'s. It shares Washtenaw County\'s progressive political character while retaining its own working-class base.',
      'Ypsilanti\'s Black Baptist and Catholic congregations hold the historic pro-life teaching that has always been at odds with the county\'s Prop-3 vote. The abolitionist argument here is that private theology should not remain private when the state votes to constitutionalize what the theology calls sin.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Ypsilanti city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Ypsilanti?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Ypsilanti city limits. If your Ypsilanti-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Ypsilanti?',
        a: 'Ypsilanti is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Ypsilanti?',
        a: 'Sign the Michigan abolition petition, contact your Ypsilanti state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Trenton -------------------------------------------
  {
    slug: 'trenton',
    name: 'Trenton',
    region: 'Wayne County',
    populationLabel: '~18,000 residents',
    population: 18000,
    latitude: 42.1382,
    longitude: -83.2179,
    houseDistricts: [28],
    senateDistricts: [4],
    historyParagraphs: [
      'Trenton is a downriver Detroit suburb on the Detroit River — historically a shipbuilding and industrial city, now a wealthier suburb with the Trenton Historical Museum and Elizabeth Park (Michigan\'s oldest county park).',
      'The Catholic and Methodist church network here holds the historic pro-life teaching. The abolitionist case is the same case as in Southgate, Wyandotte, and Riverview: the theology and the law are misaligned, and the alignment is achievable.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Trenton city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Trenton?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Trenton city limits. If your Trenton-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Trenton?',
        a: 'Trenton is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Trenton?',
        a: 'Sign the Michigan abolition petition, contact your Trenton state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Berkley -------------------------------------------
  {
    slug: 'berkley',
    name: 'Berkley',
    region: 'Oakland County',
    populationLabel: '~15,000 residents',
    population: 15000,
    latitude: 42.5028,
    longitude: -83.1887,
    houseDistricts: [6],
    senateDistricts: [8],
    historyParagraphs: [
      'Berkley is a dense, walkable Oakland County inner-ring suburb between Royal Oak and Ferndale — a family-oriented town with the Berkley Days street festival and a strong local-schools identity.',
      'The Catholic and mainline Protestant churches here are the traditional bearers of the anti-abortion witness. Abolition is the natural next step from that pulpit teaching.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Berkley city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Berkley?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Berkley city limits. If your Berkley-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Berkley?',
        a: 'Berkley is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Berkley?',
        a: 'Sign the Michigan abolition petition, contact your Berkley state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Traverse City -------------------------------------
  {
    slug: 'traverse-city',
    name: 'Traverse City',
    region: 'Grand Traverse County',
    populationLabel: '~15,000 residents',
    population: 15000,
    latitude: 44.7395,
    longitude: -85.5835,
    houseDistricts: [103],
    senateDistricts: [37],
    historyParagraphs: [
      'Traverse City is Michigan\'s cherry capital and the largest city in northwest Lower Michigan — Interlochen, the National Cherry Festival, and the Grand Traverse Bay wine country. Its economy is tourism, agriculture, and a growing tech scene; its politics have trended purple in recent cycles.',
      'The Catholic and evangelical Protestant church network in Traverse City is strong; the confessional Reformed presence is smaller than downstate but growing. The abolitionist argument in a city that has trended purple politically has a real audience.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Traverse City city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Traverse City?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Traverse City city limits. If your Traverse City-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Traverse City?',
        a: 'Traverse City is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Traverse City?',
        a: 'Sign the Michigan abolition petition, contact your Traverse City state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Sault Ste. Marie ----------------------------------
  {
    slug: 'sault-ste-marie',
    name: 'Sault Ste. Marie',
    region: 'Chippewa County',
    populationLabel: '~13,000 residents',
    population: 13000,
    latitude: 46.4151,
    longitude: -84.2854,
    houseDistricts: [107],
    senateDistricts: [37],
    historyParagraphs: [
      'Sault Ste. Marie is Michigan\'s oldest continuously-inhabited European settlement — a Franco-Ojibwe city on the St. Marys River that has been a trading post since 1668. Home to the Soo Locks and Lake Superior State University.',
      'The Catholic parishes here — descendants of the 17th-century Jesuit mission — hold the historic teaching against abortion without compromise. The abolitionist argument in "the Soo" is the argument for civil law to catch up with 350+ years of Catholic teaching.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Sault Ste. Marie city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Sault Ste. Marie?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Sault Ste. Marie city limits. If your Sault Ste. Marie-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Sault Ste. Marie?',
        a: 'Sault Ste. Marie is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Sault Ste. Marie?',
        a: 'Sign the Michigan abolition petition, contact your Sault Ste. Marie state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Rochester -----------------------------------------
  {
    slug: 'rochester',
    name: 'Rochester',
    region: 'Oakland County',
    populationLabel: '~12,000 residents',
    population: 12000,
    latitude: 42.6489,
    longitude: -83.1269,
    houseDistricts: [55],
    senateDistricts: [9],
    historyParagraphs: [
      'Rochester is a small, wealthy Oakland County city bordering Rochester Hills — home to Oakland University\'s original campus, the Rochester Big, Bright Light Show at Christmas, and a walkable downtown.',
      'Rochester\'s church network mirrors Rochester Hills\' — PCA, OPC, LCMS Lutheran, Catholic — all bearing the historic anti-abortion teaching. Abolition is the civic-law extension.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Rochester city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Rochester?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Rochester city limits. If your Rochester-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Rochester?',
        a: 'Rochester is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Rochester?',
        a: 'Sign the Michigan abolition petition, contact your Rochester state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Riverview -----------------------------------------
  {
    slug: 'riverview',
    name: 'Riverview',
    region: 'Wayne County',
    populationLabel: '~12,000 residents',
    population: 12000,
    latitude: 42.1782,
    longitude: -83.2461,
    houseDistricts: [28],
    senateDistricts: [4],
    historyParagraphs: [
      'Riverview is a small downriver Detroit suburb on the Detroit River — a working-class, family-oriented city with the Sibley Landfill (historically) and a golf-course-driven civic identity.',
      'Same downriver Catholic-and-Lutheran pattern as its neighbors Trenton, Wyandotte, and Woodhaven. The abolitionist argument follows the same path.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Riverview city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Riverview?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Riverview city limits. If your Riverview-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Riverview?',
        a: 'Riverview is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Riverview?',
        a: 'Sign the Michigan abolition petition, contact your Riverview state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Woodhaven -----------------------------------------
  {
    slug: 'woodhaven',
    name: 'Woodhaven',
    region: 'Wayne County',
    populationLabel: '~12,000 residents',
    population: 12000,
    latitude: 42.1382,
    longitude: -83.2179,
    houseDistricts: [28],
    senateDistricts: [4],
    historyParagraphs: [
      'Woodhaven is a downriver Detroit suburb on the west side of I-75 — a compact working-class city whose civic identity is tied to the Ford Woodhaven Stamping Plant and neighboring downriver communities.',
      'The Catholic and evangelical churches here hold the traditional pro-life teaching. Abolition is the framework that turns that teaching into civil law.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Woodhaven city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Woodhaven?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Woodhaven city limits. If your Woodhaven-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Woodhaven?',
        a: 'Woodhaven is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Woodhaven?',
        a: 'Sign the Michigan abolition petition, contact your Woodhaven state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Escanaba ------------------------------------------
  {
    slug: 'escanaba',
    name: 'Escanaba',
    region: 'Delta County',
    populationLabel: '~12,000 residents',
    population: 12000,
    latitude: 45.7659,
    longitude: -87.089,
    houseDistricts: [108],
    senateDistricts: [38],
    historyParagraphs: [
      'Escanaba is an Upper Peninsula port on Little Bay de Noc — historically an iron-ore and paper-mill city, still shaped by the UPI (Upper Peninsula Independent) political culture that rejects easy alignment with either lower-peninsula party.',
      'The Catholic and Finnish-Lutheran churches in Escanaba hold the historic teaching against abortion. The UP\'s willingness to consider arguments the lower peninsula has already dismissed makes this a receptive audience for the abolitionist case.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Escanaba city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Escanaba?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Escanaba city limits. If your Escanaba-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Escanaba?',
        a: 'Escanaba is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Escanaba?',
        a: 'Sign the Michigan abolition petition, contact your Escanaba state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Allen Park ----------------------------------------
  {
    slug: 'allen-park',
    name: 'Allen Park',
    region: 'Wayne County',
    populationLabel: '~28,000 residents',
    population: 28000,
    latitude: 42.2522,
    longitude: -83.212,
    houseDistricts: [2],
    senateDistricts: [1],
    historyParagraphs: [
      'Allen Park is a downriver Detroit suburb — one of the classic postwar Wayne County cities named after Lewis Allen, the early-19th-century land grantee. Home to the Detroit Lions\' Allen Park training facility and a working-class civic culture built around Ford\'s downriver plants.',
      'The Catholic and evangelical churches here — Sacred Heart, St. Frances Cabrini, and the community Bible fellowships — hold the historic pro-life teaching. The abolitionist argument in Allen Park is the plain-terms working-class case for the personhood of the preborn.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Allen Park city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Allen Park?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Allen Park city limits. If your Allen Park-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Allen Park?',
        a: 'Allen Park is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Allen Park?',
        a: 'Sign the Michigan abolition petition, contact your Allen Park state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Canton --------------------------------------------
  {
    slug: 'canton',
    name: 'Canton',
    region: 'Wayne County',
    populationLabel: '~98,000 residents',
    population: 98000,
    latitude: 42.332,
    longitude: -83.4695,
    houseDistricts: [24],
    senateDistricts: [5],
    historyParagraphs: [
      'Canton is the largest township in Michigan — home to nearly 100,000 residents, one of the fastest-growing communities in the state, and one of the most religiously and ethnically diverse. Its population is a mix of white professionals, one of the largest Indian-American populations in the Midwest (with major Hindu temples on Ford Road), a substantial Chinese-American community, and a strong Muslim presence anchored by the Muslim Community Association.',
      'That religious diversity concentrates natural allies for the abolition case. Hinduism, Islam, and Christianity all teach that human life begins early in the womb. The abolitionist argument in Canton is that the state law must honor the moral consensus already present in Canton\'s temples, mosques, and churches.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Canton city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Canton?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Canton city limits. If your Canton-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Canton?',
        a: 'Canton is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Canton?',
        a: 'Sign the Michigan abolition petition, contact your Canton state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Van Buren Charter Township ------------------------
  {
    slug: 'van-buren-charter-township',
    name: 'Van Buren Charter Township',
    region: 'Wayne County',
    populationLabel: '~29,000 residents',
    population: 29000,
    latitude: 42.1949,
    longitude: -83.4854,
    houseDistricts: [31],
    senateDistricts: [4],
    historyParagraphs: [
      'Van Buren Charter Township sits west of Wayne along Belleville Lake — a semi-rural community with Belleville at its center. Its civic identity mixes long-standing farming heritage with suburban growth driven by proximity to Ford\'s Rawsonville and Willow Run plants.',
      'The Catholic and Baptist church network in Van Buren is unambiguously pro-life. The abolitionist case here fits the township\'s traditional-values character.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Van Buren Charter Township city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Van Buren Charter Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Van Buren Charter Township city limits. If your Van Buren Charter Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Van Buren Charter Township?',
        a: 'Van Buren Charter Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Van Buren Charter Township?',
        a: 'Sign the Michigan abolition petition, contact your Van Buren Charter Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Adrian --------------------------------------------
  {
    slug: 'adrian',
    name: 'Adrian',
    region: 'Lenawee County',
    populationLabel: '~20,000 residents',
    population: 20000,
    latitude: 41.9005,
    longitude: -84.0446,
    houseDistricts: [34],
    senateDistricts: [16],
    historyParagraphs: [
      'Adrian is the seat of Lenawee County and home to Adrian College and Siena Heights University — both liberal-arts colleges with historic religious affiliations (Methodist and Dominican Catholic, respectively). The city\'s civic identity blends agricultural southeastern Michigan with a small-college intellectual life.',
      'The Catholic and evangelical churches in Adrian carry the historic pro-life teaching without compromise. Adrian\'s Dominican Sisters heritage runs deep — a tradition that has always taught the personhood of the preborn. The abolitionist argument is the civil-law extension of that teaching.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Adrian city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Adrian?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Adrian city limits. If your Adrian-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Adrian?',
        a: 'Adrian is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Adrian?',
        a: 'Sign the Michigan abolition petition, contact your Adrian state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Monroe --------------------------------------------
  {
    slug: 'monroe',
    name: 'Monroe',
    region: 'Monroe County',
    populationLabel: '~19,000 residents',
    population: 19000,
    latitude: 41.908,
    longitude: -83.4719,
    houseDistricts: [30],
    senateDistricts: [16],
    historyParagraphs: [
      'Monroe is the seat of Monroe County — a Lake Erie shore city where the River Raisin meets the lake. Historic site of the War of 1812 River Raisin battles (now a national park). Politically it has trended Republican in recent cycles despite its historically Democratic union heritage.',
      'The Catholic church network — St. Mary\'s, St. John the Baptist, and the IHM Sisters of Charity motherhouse — has been a foundational institution in Monroe since the 1820s. IHM teaching on abortion has been consistent for two centuries: it is intrinsically evil. Abolition is that teaching brought into civil law.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Monroe city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Monroe?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Monroe city limits. If your Monroe-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Monroe?',
        a: 'Monroe is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Monroe?',
        a: 'Sign the Michigan abolition petition, contact your Monroe state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Coldwater -----------------------------------------
  {
    slug: 'coldwater',
    name: 'Coldwater',
    region: 'Branch County',
    populationLabel: '~11,000 residents',
    population: 11000,
    latitude: 41.9255,
    longitude: -85.0057,
    houseDistricts: [35],
    senateDistricts: [17],
    historyParagraphs: [
      'Coldwater is the seat of Branch County — a small southwest Michigan city on the Chicago-Detroit rail corridor, home to Kellogg Community College\'s Grahl Center and a strong rural-manufacturing economy.',
      'The Catholic and Baptist churches in Coldwater hold the historic pro-life teaching. The abolitionist argument fits a rural county whose voters have consistently rejected abortion-rights ballot measures.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Coldwater city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Coldwater?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Coldwater city limits. If your Coldwater-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Coldwater?',
        a: 'Coldwater is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Coldwater?',
        a: 'Sign the Michigan abolition petition, contact your Coldwater state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Niles ---------------------------------------------
  {
    slug: 'niles',
    name: 'Niles',
    region: 'Berrien County',
    populationLabel: '~11,000 residents',
    population: 11000,
    latitude: 41.8202,
    longitude: -86.2368,
    houseDistricts: [37],
    senateDistricts: [17],
    historyParagraphs: [
      'Niles is a southwest Michigan city on the St. Joseph River — home to the Niles Historic District, close to Notre Dame University in South Bend just across the Indiana border. Its civic identity blends Michigan and northern-Indiana Catholic influences.',
      'The Catholic parish network here — deeply shaped by the Notre Dame presence — teaches against abortion. The abolitionist argument extends that theology into civil-rights terms.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Niles city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Niles?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Niles city limits. If your Niles-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Niles?',
        a: 'Niles is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Niles?',
        a: 'Sign the Michigan abolition petition, contact your Niles state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- St. Joseph ----------------------------------------
  {
    slug: 'st-joseph',
    name: 'St. Joseph',
    region: 'Berrien County',
    populationLabel: '~8,000 residents',
    population: 8000,
    latitude: 42.064,
    longitude: -86.4783,
    houseDistricts: [38],
    senateDistricts: [20],
    historyParagraphs: [
      'St. Joseph sits on Lake Michigan at the mouth of the St. Joseph River — a resort-and-manufacturing city, home of Whirlpool Corporation\'s world headquarters and the Silver Beach Carousel. Its civic identity is coastal Michigan blended with corporate Whirlpool influence.',
      'The Catholic and Reformed churches in St. Joseph carry the pro-life teaching that has always been the western-Michigan norm. Abolition is the civil-law expression of that pulpit consensus.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside St. Joseph city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in St. Joseph?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside St. Joseph city limits. If your St. Joseph-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in St. Joseph?',
        a: 'St. Joseph is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in St. Joseph?',
        a: 'Sign the Michigan abolition petition, contact your St. Joseph state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Howell --------------------------------------------
  {
    slug: 'howell',
    name: 'Howell',
    region: 'Livingston County',
    populationLabel: '~10,000 residents',
    population: 10000,
    latitude: 42.6159,
    longitude: -83.9248,
    houseDistricts: [50],
    senateDistricts: [22],
    historyParagraphs: [
      'Howell is the seat of Livingston County — a fast-growing exurb between Ann Arbor and Lansing, home of the Howell Melon Festival and one of the most politically Republican counties in Lower Michigan.',
      'The Catholic and Baptist churches in Howell hold the historic pro-life teaching, and Livingston County\'s political culture is receptive to the abolitionist argument. The gap between what pulpits teach and what state law protects is smaller here than in most of Michigan.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Howell city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Howell?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Howell city limits. If your Howell-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Howell?',
        a: 'Howell is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Howell?',
        a: 'Sign the Michigan abolition petition, contact your Howell state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Clarkston -----------------------------------------
  {
    slug: 'clarkston',
    name: 'Clarkston',
    region: 'Oakland County',
    populationLabel: '~8,000 residents',
    population: 8000,
    latitude: 42.7239,
    longitude: -83.4232,
    houseDistricts: [52],
    senateDistricts: [23],
    historyParagraphs: [
      'Clarkston is a wealthy small city in northern Oakland County — home to the DTE Energy Music Theatre (the busiest outdoor concert venue in the country) and a historic downtown centered on Depot Road. The surrounding Independence Township is a Reagan-Republican bedroom community for the auto-industry executive class.',
      'The Reformed and evangelical churches in the Clarkston-Independence area hold the historic pro-life teaching. The abolitionist argument has natural political traction here.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Clarkston city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Clarkston?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Clarkston city limits. If your Clarkston-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Clarkston?',
        a: 'Clarkston is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Clarkston?',
        a: 'Sign the Michigan abolition petition, contact your Clarkston state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Chesterfield Charter Township ---------------------
  {
    slug: 'chesterfield-charter-township',
    name: 'Chesterfield Charter Township',
    region: 'Macomb County',
    populationLabel: '~46,000 residents',
    population: 46000,
    latitude: 42.673,
    longitude: -82.7753,
    houseDistricts: [63],
    senateDistricts: [12],
    historyParagraphs: [
      'Chesterfield Charter Township is one of the largest municipalities on Lake St. Clair\'s Anchor Bay — a fast-growing northern Macomb community that has doubled in population since 1990. Home to New Baltimore just inside its boundaries and a strong marina-and-boating economy.',
      'The Catholic parishes here (St. Mary Queen of Creation, Sacred Heart) hold the historic teaching against abortion. The abolitionist argument in Chesterfield is the civil-law extension of that pulpit teaching in a growing community with room to shape its civic future.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Chesterfield Charter Township city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Chesterfield Charter Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Chesterfield Charter Township city limits. If your Chesterfield Charter Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Chesterfield Charter Township?',
        a: 'Chesterfield Charter Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Chesterfield Charter Township?',
        a: 'Sign the Michigan abolition petition, contact your Chesterfield Charter Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Macomb Township -----------------------------------
  {
    slug: 'macomb-township',
    name: 'Macomb Township',
    region: 'Macomb County',
    populationLabel: '~91,000 residents',
    population: 91000,
    latitude: 42.6442,
    longitude: -82.8985,
    houseDistricts: [60],
    senateDistricts: [11],
    historyParagraphs: [
      'Macomb Township is Michigan\'s fifth-largest municipality by population — a rapidly-growing northern Macomb community that has nearly quadrupled in size since 1990. Politically it has trended Republican, culturally it is family-suburban Catholic.',
      'The Catholic parish network — including St. Peter Chanel and the many young families anchoring its parish schools — teaches the historic anti-abortion position. Macomb Township\'s growth is exactly the kind of demographic environment where abolition can take institutional root.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Macomb Township city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Macomb Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Macomb Township city limits. If your Macomb Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Macomb Township?',
        a: 'Macomb Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Macomb Township?',
        a: 'Sign the Michigan abolition petition, contact your Macomb Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Shelby Charter Township ---------------------------
  {
    slug: 'shelby-charter-township',
    name: 'Shelby Charter Township',
    region: 'Macomb County',
    populationLabel: '~79,000 residents',
    population: 79000,
    latitude: 42.6413,
    longitude: -83.0504,
    houseDistricts: [59],
    senateDistricts: [24],
    historyParagraphs: [
      'Shelby Charter Township is one of Macomb County\'s wealthiest and largest municipalities — a fast-growing suburb north of Sterling Heights with a strong Catholic parish network, a Reagan-Republican political culture, and Stony Creek Metropark on its northern edge.',
      'Shelby\'s civic character — family-oriented, church-going, politically-conservative — is exactly the audience the abolitionist argument was built for. The theology is already in the pulpits; the argument invites the pews to demand it in law.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Shelby Charter Township city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Shelby Charter Township?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Shelby Charter Township city limits. If your Shelby Charter Township-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Shelby Charter Township?',
        a: 'Shelby Charter Township is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Shelby Charter Township?',
        a: 'Sign the Michigan abolition petition, contact your Shelby Charter Township state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Burton --------------------------------------------
  {
    slug: 'burton',
    name: 'Burton',
    region: 'Genesee County',
    populationLabel: '~30,000 residents',
    population: 30000,
    latitude: 43.0259,
    longitude: -83.6041,
    houseDistricts: [68],
    senateDistricts: [26],
    historyParagraphs: [
      'Burton is a Genesee County suburb adjacent to Flint — historically a working-class GM-employee community, now a somewhat-depressed inner-ring suburb sharing Flint\'s post-industrial economic challenges.',
      'The Catholic and Baptist churches in Burton hold the pro-life teaching that has always been the Genesee County norm. The abolitionist argument in Burton, as in Flint, is the equal-protection case: the state protects some lives and not others, and it should protect all.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Burton city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Burton?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Burton city limits. If your Burton-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Burton?',
        a: 'Burton is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Burton?',
        a: 'Sign the Michigan abolition petition, contact your Burton state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Lapeer --------------------------------------------
  {
    slug: 'lapeer',
    name: 'Lapeer',
    region: 'Lapeer County',
    populationLabel: '~9,000 residents',
    population: 9000,
    latitude: 43.0579,
    longitude: -83.3332,
    houseDistricts: [67],
    senateDistricts: [26],
    historyParagraphs: [
      'Lapeer is the seat of Lapeer County — a rural-suburban Thumb-region city named for the French word for "flint." Its civic identity blends farming heritage with proximity to Flint\'s manufacturing economy.',
      'The Catholic and evangelical Protestant churches in Lapeer hold the historic pro-life teaching. Lapeer County\'s political culture is Republican-leaning and receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Lapeer city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Lapeer?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Lapeer city limits. If your Lapeer-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Lapeer?',
        a: 'Lapeer is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Lapeer?',
        a: 'Sign the Michigan abolition petition, contact your Lapeer state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Fenton --------------------------------------------
  {
    slug: 'fenton',
    name: 'Fenton',
    region: 'Genesee County',
    populationLabel: '~12,000 residents',
    population: 12000,
    latitude: 42.7851,
    longitude: -83.7294,
    houseDistricts: [72],
    senateDistricts: [22],
    historyParagraphs: [
      'Fenton is a small Genesee County city on Lake Fenton — home of the historic Fenton Hotel Tavern & Grille (1856), a downtown revival, and a bedroom-community role for both Flint and Detroit-metro professionals.',
      'The Catholic and Bible-Baptist churches in Fenton hold the historic pro-life teaching. Fenton\'s political culture is Republican, receptive to the abolitionist case.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Fenton city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Fenton?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Fenton city limits. If your Fenton-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Fenton?',
        a: 'Fenton is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Fenton?',
        a: 'Sign the Michigan abolition petition, contact your Fenton state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Ionia ---------------------------------------------
  {
    slug: 'ionia',
    name: 'Ionia',
    region: 'Ionia County',
    populationLabel: '~11,000 residents',
    population: 11000,
    latitude: 42.9859,
    longitude: -85.071,
    houseDistricts: [78],
    senateDistricts: [33],
    historyParagraphs: [
      'Ionia is the seat of Ionia County — a mid-Michigan city along the Grand River, home of the Ionia Free Fair (Michigan\'s largest county fair) and several state correctional facilities that anchor the local economy.',
      'The Catholic and Reformed church network in Ionia County holds the pro-life teaching. The abolitionist argument in rural mid-Michigan works with the grain of a region that has never accepted the pro-choice framework.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Ionia city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Ionia?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Ionia city limits. If your Ionia-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Ionia?',
        a: 'Ionia is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Ionia?',
        a: 'Sign the Michigan abolition petition, contact your Ionia state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Cedar Springs -------------------------------------
  {
    slug: 'cedar-springs',
    name: 'Cedar Springs',
    region: 'Kent County',
    populationLabel: '~4,000 residents',
    population: 4000,
    latitude: 43.2215,
    longitude: -85.5452,
    houseDistricts: [91],
    senateDistricts: [33],
    historyParagraphs: [
      'Cedar Springs is a small Kent County city north of Grand Rapids — the self-proclaimed "Red Flannel Capital of America" for its historic long-underwear manufacturing tradition, and now a bedroom community for greater Grand Rapids.',
      'The Reformed and evangelical churches in Cedar Springs carry the CRC/RCA teaching on the personhood of the preborn. The abolitionist argument here is the natural extension of West Michigan\'s confessional Reformed inheritance.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Cedar Springs city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Cedar Springs?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Cedar Springs city limits. If your Cedar Springs-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Cedar Springs?',
        a: 'Cedar Springs is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Cedar Springs?',
        a: 'Sign the Michigan abolition petition, contact your Cedar Springs state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Grand Haven ---------------------------------------
  {
    slug: 'grand-haven',
    name: 'Grand Haven',
    region: 'Ottawa County',
    populationLabel: '~11,000 residents',
    population: 11000,
    latitude: 43.0378,
    longitude: -86.1912,
    houseDistricts: [88],
    senateDistricts: [31],
    historyParagraphs: [
      'Grand Haven is a Lake Michigan resort city at the mouth of the Grand River — home of the Grand Haven Musical Fountain (the world\'s largest), the annual Coast Guard Festival, and a strong Reformed-Christian civic culture.',
      'Grand Haven\'s Reformed and Christian Reformed church presence is one of the strongest in Michigan outside Holland. The abolitionist argument fits West Michigan\'s confessional theology naturally.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Grand Haven city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Grand Haven?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Grand Haven city limits. If your Grand Haven-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Grand Haven?',
        a: 'Grand Haven is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Grand Haven?',
        a: 'Sign the Michigan abolition petition, contact your Grand Haven state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Rockford ------------------------------------------
  {
    slug: 'rockford',
    name: 'Rockford',
    region: 'Kent County',
    populationLabel: '~6,000 residents',
    population: 6000,
    latitude: 43.1152,
    longitude: -85.5136,
    houseDistricts: [90],
    senateDistricts: [33],
    historyParagraphs: [
      'Rockford is a small city north of Grand Rapids — home of the historic Wolverine World Wide shoe manufacturer (Hush Puppies) and a strong small-town Reformed Christian civic culture.',
      'Rockford\'s Reformed and evangelical churches carry the West Michigan CRC/RCA teaching against abortion. The abolitionist argument extends that theology into civil law.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Rockford city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Rockford?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Rockford city limits. If your Rockford-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Rockford?',
        a: 'Rockford is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Rockford?',
        a: 'Sign the Michigan abolition petition, contact your Rockford state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Caro ----------------------------------------------
  {
    slug: 'caro',
    name: 'Caro',
    region: 'Tuscola County',
    populationLabel: '~4,000 residents',
    population: 4000,
    latitude: 43.4833,
    longitude: -83.3835,
    houseDistricts: [97],
    senateDistricts: [25],
    historyParagraphs: [
      'Caro is the seat of Tuscola County — a small Thumb-region city named after the historic Cairo, Egypt (renamed for pronunciation). Home to Colwood Church and Providence Church, both on the postmillennial-abolitionist network our partners page tracks.',
      'Caro is one of the few MI cities with named churches on the national abolitionist / postmillennial-network directory. That confessional presence is the foundation for the abolitionist argument locally.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Caro city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Caro?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Caro city limits. If your Caro-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Caro?',
        a: 'Caro is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Caro?',
        a: 'Sign the Michigan abolition petition, contact your Caro state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Big Rapids ----------------------------------------
  {
    slug: 'big-rapids',
    name: 'Big Rapids',
    region: 'Mecosta County',
    populationLabel: '~10,000 residents',
    population: 10000,
    latitude: 43.6897,
    longitude: -85.4797,
    houseDistricts: [100],
    senateDistricts: [34],
    historyParagraphs: [
      'Big Rapids is the seat of Mecosta County and home of Ferris State University — a mid-Michigan college city on the Muskegon River. Its civic identity blends Ferris\' 12,000-student population with rural-north Michigan character.',
      'The Catholic and evangelical Protestant churches in Big Rapids hold the historic pro-life teaching. Mecosta County\'s political culture is Republican, receptive to the abolitionist case.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Big Rapids city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Big Rapids?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Big Rapids city limits. If your Big Rapids-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Big Rapids?',
        a: 'Big Rapids is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Big Rapids?',
        a: 'Sign the Michigan abolition petition, contact your Big Rapids state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Cadillac ------------------------------------------
  {
    slug: 'cadillac',
    name: 'Cadillac',
    region: 'Wexford County',
    populationLabel: '~10,000 residents',
    population: 10000,
    latitude: 44.2504,
    longitude: -85.43,
    houseDistricts: [101],
    senateDistricts: [36],
    historyParagraphs: [
      'Cadillac sits on Lake Cadillac in the northwest Lower Peninsula — a rural-north city named after Detroit\'s founder Antoine de la Mothe Cadillac. Home to the Cadillac Country Music Festival and a strong small-city civic tradition.',
      'The Catholic and Bible-Baptist churches in Cadillac hold the traditional pro-life teaching. Northern Michigan\'s political culture is receptive to strong moral arguments made plainly.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Cadillac city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Cadillac?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Cadillac city limits. If your Cadillac-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Cadillac?',
        a: 'Cadillac is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Cadillac?',
        a: 'Sign the Michigan abolition petition, contact your Cadillac state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Ludington -----------------------------------------
  {
    slug: 'ludington',
    name: 'Ludington',
    region: 'Mason County',
    populationLabel: '~8,000 residents',
    population: 8000,
    latitude: 43.9688,
    longitude: -86.4403,
    houseDistricts: [102],
    senateDistricts: [32],
    historyParagraphs: [
      'Ludington sits on Lake Michigan at the mouth of the Pere Marquette River — home of the S.S. Badger car ferry to Manitowoc, Wisconsin (the last coal-fired passenger steamship on the Great Lakes) and a strong tourism-and-maritime economy.',
      'Ludington\'s Catholic and Reformed churches hold the historic pro-life teaching. The city\'s small-town civic culture is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Ludington city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Ludington?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Ludington city limits. If your Ludington-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Ludington?',
        a: 'Ludington is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Ludington?',
        a: 'Sign the Michigan abolition petition, contact your Ludington state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Alpena --------------------------------------------
  {
    slug: 'alpena',
    name: 'Alpena',
    region: 'Alpena County',
    populationLabel: '~10,000 residents',
    population: 10000,
    latitude: 45.079,
    longitude: -83.4602,
    houseDistricts: [106],
    senateDistricts: [36],
    historyParagraphs: [
      'Alpena is the largest city on the Lake Huron shore north of Bay City — a Great Lakes port shaped by cement manufacturing (Lafarge\'s Alpena plant), the annual Brown Trout Festival, and Northeast Michigan\'s independent political character.',
      'The Catholic and Lutheran churches in Alpena hold the historic pro-life teaching. Northeast Michigan\'s political culture is willing to consider arguments the population centers have already dismissed — abolition finds a real hearing here.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Alpena city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Alpena?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Alpena city limits. If your Alpena-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Alpena?',
        a: 'Alpena is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Alpena?',
        a: 'Sign the Michigan abolition petition, contact your Alpena state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Grayling ------------------------------------------
  {
    slug: 'grayling',
    name: 'Grayling',
    region: 'Crawford County',
    populationLabel: '~2,000 residents',
    population: 2000,
    latitude: 44.671,
    longitude: -84.6913,
    houseDistricts: [105],
    senateDistricts: [36],
    historyParagraphs: [
      'Grayling is a small Northern Michigan city on the AuSable River — best known for canoeing, trout fishing, the Michigan Army National Guard\'s Camp Grayling training center (the largest state-owned military training facility east of the Mississippi), and the AuSable River Canoe Marathon.',
      'The Catholic and evangelical churches in Grayling hold the pro-life teaching. Northern Michigan\'s independent political character makes it receptive to arguments the lower peninsula has already tired of.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Grayling city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Grayling?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Grayling city limits. If your Grayling-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Grayling?',
        a: 'Grayling is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Grayling?',
        a: 'Sign the Michigan abolition petition, contact your Grayling state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Iron Mountain -------------------------------------
  {
    slug: 'iron-mountain',
    name: 'Iron Mountain',
    region: 'Dickinson County',
    populationLabel: '~8,000 residents',
    population: 8000,
    latitude: 45.8219,
    longitude: -88.0683,
    houseDistricts: [110],
    senateDistricts: [38],
    historyParagraphs: [
      'Iron Mountain is the largest city in the west-central Upper Peninsula — an iron-ore mining town on the Menominee Range, named for the mountain of hematite that anchored its 19th-century economy. Home to the Cornish Pump Museum and a strong Finnish-American and Italian-American heritage.',
      'The Catholic and Finnish-Lutheran churches in Iron Mountain hold the historic pro-life teaching. The Upper Peninsula\'s political culture is independent and receptive to the abolitionist argument made on its merits.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Iron Mountain city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Iron Mountain?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Iron Mountain city limits. If your Iron Mountain-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Iron Mountain?',
        a: 'Iron Mountain is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Iron Mountain?',
        a: 'Sign the Michigan abolition petition, contact your Iron Mountain state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- West Bloomfield -----------------------------------
  {
    slug: 'west-bloomfield',
    name: 'West Bloomfield',
    region: 'Oakland County',
    populationLabel: '~65,000 residents',
    population: 65000,
    latitude: 42.5461,
    longitude: -83.383,
    houseDistricts: [20],
    senateDistricts: [13],
    historyParagraphs: [
      'West Bloomfield is a wealthy Oakland County township on the Cass Lake / Sylvan Lake corridor — home of one of the largest Jewish populations in Michigan (Adat Shalom, Congregation Beth Ahm, Temple Israel), a substantial Chaldean Catholic community, and a growing Indian-American professional class.',
      'West Bloomfield\'s Orthodox Jewish and Chaldean Catholic communities both teach that human life begins early in the womb. The abolitionist case here finds coalition partners across religious traditions that agree on the core fact.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside West Bloomfield city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in West Bloomfield?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside West Bloomfield city limits. If your West Bloomfield-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in West Bloomfield?',
        a: 'West Bloomfield is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in West Bloomfield?',
        a: 'Sign the Michigan abolition petition, contact your West Bloomfield state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Sturgis -------------------------------------------
  {
    slug: 'sturgis',
    name: 'Sturgis',
    region: 'St. Joseph County',
    populationLabel: '~11,000 residents',
    population: 11000,
    latitude: 41.8089,
    longitude: -85.4264,
    houseDistricts: [36],
    senateDistricts: [17],
    historyParagraphs: [
      'Sturgis is a small St. Joseph County city near the Indiana border — historically the home of the Sturgis-Elkhart RV manufacturing corridor, with a strong small-town evangelical and Catholic church network.',
      'The Catholic and Baptist churches in Sturgis hold the historic pro-life teaching. Rural southwest Michigan\'s political culture is Republican-leaning and receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Sturgis city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Sturgis?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Sturgis city limits. If your Sturgis-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Sturgis?',
        a: 'Sturgis is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Sturgis?',
        a: 'Sign the Michigan abolition petition, contact your Sturgis state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Paw Paw -------------------------------------------
  {
    slug: 'paw-paw',
    name: 'Paw Paw',
    region: 'Van Buren County',
    populationLabel: '~4,000 residents',
    population: 4000,
    latitude: 42.2349,
    longitude: -85.9005,
    houseDistricts: [39],
    senateDistricts: [20],
    historyParagraphs: [
      'Paw Paw is the seat of Van Buren County — Michigan wine country, home of the Warner Vineyards and St. Julian Winery, and the surrounding agricultural region.',
      'The Catholic and evangelical churches in Paw Paw hold the traditional pro-life teaching. Van Buren County\'s rural political culture is receptive to the abolitionist case.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Paw Paw city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Paw Paw?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Paw Paw city limits. If your Paw Paw-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Paw Paw?',
        a: 'Paw Paw is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Paw Paw?',
        a: 'Sign the Michigan abolition petition, contact your Paw Paw state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Whitmore Lake -------------------------------------
  {
    slug: 'whitmore-lake',
    name: 'Whitmore Lake',
    region: 'Washtenaw County',
    populationLabel: '~6,000 residents',
    population: 6000,
    latitude: 42.4289,
    longitude: -83.7828,
    houseDistricts: [49],
    senateDistricts: [22],
    historyParagraphs: [
      'Whitmore Lake is a small Washtenaw County community north of Ann Arbor — a lakeside village whose civic identity is shaped by proximity to the Ann Arbor academic and professional class while retaining a small-town character.',
      'The Catholic and evangelical churches in Whitmore Lake hold the historic pro-life teaching. Whitmore Lake is a persuadable audience — closer to Ann Arbor\'s Prop-3 support than downstate rural counties, but not aligned with the university city\'s dominant culture.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Whitmore Lake city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Whitmore Lake?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Whitmore Lake city limits. If your Whitmore Lake-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Whitmore Lake?',
        a: 'Whitmore Lake is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Whitmore Lake?',
        a: 'Sign the Michigan abolition petition, contact your Whitmore Lake state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Milford -------------------------------------------
  {
    slug: 'milford',
    name: 'Milford',
    region: 'Oakland County',
    populationLabel: '~6,000 residents',
    population: 6000,
    latitude: 42.5758,
    longitude: -83.5924,
    houseDistricts: [51],
    senateDistricts: [23],
    historyParagraphs: [
      'Milford is a wealthy small city in western Oakland County — home to the historic Milford Independence Fest, GM\'s Milford Proving Ground (the largest automotive testing facility in the world), and a strong small-town civic culture.',
      'The Catholic and evangelical Protestant churches in Milford hold the traditional pro-life teaching. Milford\'s demographic character — family, wealthy, Republican-leaning — is receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Milford city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Milford?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Milford city limits. If your Milford-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Milford?',
        a: 'Milford is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Milford?',
        a: 'Sign the Michigan abolition petition, contact your Milford state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Richmond ------------------------------------------
  {
    slug: 'richmond',
    name: 'Richmond',
    region: 'Macomb County',
    populationLabel: '~6,000 residents',
    population: 6000,
    latitude: 42.8389,
    longitude: -82.7996,
    houseDistricts: [65],
    senateDistricts: [25],
    historyParagraphs: [
      'Richmond is a small city in northern Macomb County — the seat of Richmond Township, home of the Good Ol\' Days Festival and a strong agricultural-suburban civic identity.',
      'The Catholic and Baptist churches in Richmond hold the historic pro-life teaching. Northern Macomb\'s rural-conservative political culture is receptive to the abolitionist case.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Richmond city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Richmond?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Richmond city limits. If your Richmond-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Richmond?',
        a: 'Richmond is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Richmond?',
        a: 'Sign the Michigan abolition petition, contact your Richmond state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Durand --------------------------------------------
  {
    slug: 'durand',
    name: 'Durand',
    region: 'Shiawassee County',
    populationLabel: '~4,000 residents',
    population: 4000,
    latitude: 42.9117,
    longitude: -83.9877,
    houseDistricts: [71],
    senateDistricts: [28],
    historyParagraphs: [
      'Durand is a small Shiawassee County city — historically a major railroad hub (the Michigan Railroad History Museum is here) and now a bedroom community for Flint and East Lansing professionals.',
      'The Catholic and Bible-Baptist churches in Durand hold the traditional pro-life teaching. Rural Shiawassee County\'s political culture is Republican-leaning and receptive to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Durand city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Durand?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Durand city limits. If your Durand-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Durand?',
        a: 'Durand is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Durand?',
        a: 'Sign the Michigan abolition petition, contact your Durand state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Zeeland -------------------------------------------
  {
    slug: 'zeeland',
    name: 'Zeeland',
    region: 'Ottawa County',
    populationLabel: '~6,000 residents',
    population: 6000,
    latitude: 42.8256,
    longitude: -86.0104,
    houseDistricts: [85],
    senateDistricts: [31],
    historyParagraphs: [
      'Zeeland is the smaller of West Michigan\'s two Dutch Reformed anchor cities — Holland\'s twin, home to the Zeeland Historical Museum, De Kruif Furniture Company (established 1908), and one of the highest per-capita concentrations of CRC / RCA / URC / Netherlands Reformed congregations anywhere in America.',
      'Zeeland\'s confessional Reformed churches are unambiguous on the personhood of the preborn. The abolitionist argument here is the natural civil-law expression of West Michigan\'s most-densely-Reformed-outside-Holland theological inheritance.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Zeeland city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Zeeland?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Zeeland city limits. If your Zeeland-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Zeeland?',
        a: 'Zeeland is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Zeeland?',
        a: 'Sign the Michigan abolition petition, contact your Zeeland state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Merrill -------------------------------------------
  {
    slug: 'merrill',
    name: 'Merrill',
    region: 'Saginaw County',
    populationLabel: '~1,000 residents',
    population: 1000,
    latitude: 43.4082,
    longitude: -84.3327,
    houseDistricts: [93],
    senateDistricts: [34],
    historyParagraphs: [
      'Merrill is a small village in Saginaw County — a farming community in the rural mid-Michigan corridor between Saginaw and Ithaca.',
      'The Catholic and evangelical churches in Merrill hold the pro-life teaching. Rural mid-Michigan\'s political culture is Republican-leaning and open to the abolitionist argument.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Merrill city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Merrill?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Merrill city limits. If your Merrill-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Merrill?',
        a: 'Merrill is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Merrill?',
        a: 'Sign the Michigan abolition petition, contact your Merrill state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Standish ------------------------------------------
  {
    slug: 'standish',
    name: 'Standish',
    region: 'Arenac County',
    populationLabel: '~1,000 residents',
    population: 1500,
    latitude: 43.9847,
    longitude: -83.9558,
    houseDistricts: [99],
    senateDistricts: [36],
    historyParagraphs: [
      'Standish is the seat of Arenac County — a small Northern Michigan city on the M-13 / I-75 corridor, home of the Standish Prison (Michigan\'s largest men\'s prison) and a rural civic identity.',
      'The Catholic and evangelical churches in Standish hold the historic pro-life teaching. Northeast Michigan\'s rural political culture is receptive to the abolitionist case.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Standish city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Standish?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Standish city limits. If your Standish-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Standish?',
        a: 'Standish is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Standish?',
        a: 'Sign the Michigan abolition petition, contact your Standish state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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

  // -------- Elk Rapids ----------------------------------------
  {
    slug: 'elk-rapids',
    name: 'Elk Rapids',
    region: 'Antrim County',
    populationLabel: '~2,000 residents',
    population: 2000,
    latitude: 44.8945,
    longitude: -85.4147,
    houseDistricts: [104],
    senateDistricts: [37],
    historyParagraphs: [
      'Elk Rapids is a small village on the shore of Elk Lake — one of the postcard-perfect small towns of northwest Lower Michigan wine country, home of the Petobego Dam and a strong tourism economy.',
      'The Catholic and evangelical churches in Elk Rapids hold the traditional pro-life teaching. Northern Michigan\'s independent political culture is receptive to arguments the downstate population centers have already tired of.',
    ],
    abortionLandscapeIntro:
      'We are not currently aware of an abortion facility operating inside Elk Rapids city limits.',
    faqs: [
      {
        q: 'Are there abolitionist churches in Elk Rapids?',
        a: 'We\'re not yet aware of any publicly-abolitionist churches inside Elk Rapids city limits. If your Elk Rapids-area church has adopted an abolition resolution, reach out.',
        links: [
          { phrase: 'reach out', href: '/contact' },
        ],
      },
      {
        q: 'Who is my state representative in Elk Rapids?',
        a: 'Elk Rapids is served by 1 state House district and 1 state Senate district. Use our Find-my-legislator tool on the scorecard page.',
        links: [
          { phrase: 'Find-my-legislator tool', href: '/legislators' },
          { phrase: 'scorecard page', href: '/legislators' },
        ],
      },
      {
        q: 'How can I get involved in the abolition movement in Elk Rapids?',
        a: 'Sign the Michigan abolition petition, contact your Elk Rapids state representative through the scorecard, join our Signal group, and reach out to us if your church would adopt the abolition resolution.',
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
