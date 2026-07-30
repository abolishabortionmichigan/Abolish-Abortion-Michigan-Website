// Campaign plan — translated from docs/google-ads-campaign-plan.md into
// structured data the builder script can execute. Edit here to change what
// the builder creates; the .md doc remains the human-readable narrative.
//
// Ad Grants rules encoded here:
//   - Max CPC 2.00 USD (Google rejects higher)
//   - Manual CPC bidding (Maximize Conversions requires historical data)
//   - Search network only, no partners
//   - Michigan geo-target (looked up at runtime from the geo_target_constant table)
//   - No single-word keywords, no plain "abortion" — filtered in the builder

export const ACCOUNT = {
  currencyCode: 'USD',
  geoTargetName: 'Michigan', // resolved to a geo_target_constant ID at runtime
};

export const CAMPAIGNS = [
  {
    name: 'AAM — Petition',
    dailyBudgetUsd: 200, // ~60% of monthly credit
    adGroups: [
      {
        name: 'Branded + brand-adjacent',
        cpcBidUsd: 2.0,
        keywords: [
          { text: 'abolish abortion michigan',           match: 'EXACT' },
          { text: 'abolish abortion michigan',           match: 'PHRASE' },
          { text: 'aam petition',                        match: 'EXACT' },
          { text: 'abolition of abortion michigan',      match: 'PHRASE' },
          { text: 'michigan abolitionist petition',      match: 'PHRASE' },
          { text: 'end abortion michigan petition',      match: 'PHRASE' },
          { text: 'abolish abortion michigan sign',      match: 'PHRASE' },
          { text: 'aam michigan',                        match: 'PHRASE' },
        ],
      },
      {
        name: 'Sign petition (action intent)',
        cpcBidUsd: 2.0,
        keywords: [
          { text: 'sign abortion petition michigan',     match: 'PHRASE' },
          { text: 'michigan pro life petition',          match: 'PHRASE' },
          { text: 'sign petition end abortion michigan', match: 'PHRASE' },
          { text: 'abortion abolition petition',         match: 'PHRASE' },
          { text: 'petition to abolish abortion',        match: 'PHRASE' },
          { text: 'anti abortion petition michigan',     match: 'PHRASE' },
          { text: 'sign petition abolish abortion',      match: 'EXACT' },
          { text: 'stop abortion petition michigan',     match: 'PHRASE' },
        ],
      },
      {
        name: 'End abortion Michigan (outcome intent)',
        cpcBidUsd: 2.0,
        keywords: [
          { text: 'how to end abortion in michigan',     match: 'PHRASE' },
          { text: 'stop abortion in michigan',           match: 'PHRASE' },
          { text: 'michigan abortion ban',               match: 'PHRASE' },
          { text: 'end abortion michigan',               match: 'PHRASE' },
          { text: 'outlaw abortion michigan',            match: 'PHRASE' },
          { text: 'criminalize abortion michigan',       match: 'PHRASE' },
          { text: 'end abortion in michigan',            match: 'EXACT' },
        ],
      },
    ],
    // One RSA reused across all three ad groups in this campaign
    responsiveSearchAd: {
      finalUrl: 'https://www.abolishabortionmichigan.com/the-petition',
      // ≤ 15 headlines, each ≤ 30 chars
      headlines: [
        'Abolish Abortion in Michigan',
        'Sign the Petition Today',
        'Equal Protection for Preborn',
        'Michigan Abolitionist Petition',
        'End Abortion, No Exceptions',
        'Add Your Name — Michigan',
        'For Justice, For the Preborn',
        'Made in God’s Image',
        'No Compromise. No Delay.',
        'Stand for the Preborn in MI',
        'Sign the AAM Petition',
        'Michigan: Abolish Abortion',
        'Immediate, Not Gradual',
        'Join the Movement',
        'Christian Abolition in MI',
      ],
      // ≤ 4 descriptions, each ≤ 90 chars
      descriptions: [
        'Add your name to the petition calling on Michigan to abolish abortion completely.',
        'Every preborn human bears God’s image and deserves equal protection under the law.',
        'Not regulation. Not reduction. The immediate and total abolition of abortion in MI.',
        'Join Michigan abolitionists calling on the Legislature to criminalize abortion now.',
      ],
      path1: 'sign',
      path2: 'petition',
    },
  },
  {
    name: 'AAM — Educational',
    dailyBudgetUsd: 80,
    adGroups: [
      {
        name: 'Abolitionist vs pro-life',
        cpcBidUsd: 2.0,
        finalUrl: 'https://www.abolishabortionmichigan.com/what-we-believe/abolitionist-not-pro-life',
        keywords: [
          { text: 'abolitionist vs pro life',      match: 'PHRASE' },
          { text: 'difference abolitionist pro life', match: 'PHRASE' },
          { text: 'abolition vs pro life movement', match: 'PHRASE' },
          { text: 'why abolition not pro life',     match: 'PHRASE' },
          { text: 'pro life movement problems',     match: 'PHRASE' },
          { text: 'abolitionist christianity',      match: 'PHRASE' },
          { text: 'biblical abolition abortion',    match: 'PHRASE' },
        ],
      },
      {
        name: 'Michigan abortion law',
        cpcBidUsd: 2.0,
        finalUrl: 'https://www.abolishabortionmichigan.com/abolition-bills',
        keywords: [
          { text: 'michigan abortion law 2026',       match: 'PHRASE' },
          { text: 'michigan abortion law after dobbs', match: 'PHRASE' },
          { text: 'michigan proposal 3 abortion',     match: 'PHRASE' },
          { text: 'is abortion legal in michigan',    match: 'PHRASE' },
          { text: 'michigan abortion legislation',    match: 'PHRASE' },
          { text: 'michigan abortion bill',           match: 'PHRASE' },
          { text: 'who is my michigan state rep',     match: 'PHRASE' },
          { text: 'michigan legislature abortion',    match: 'PHRASE' },
        ],
      },
      {
        name: 'Christian abolition',
        cpcBidUsd: 2.0,
        finalUrl: 'https://www.abolishabortionmichigan.com/the-gospel',
        keywords: [
          { text: 'christian view on abortion',     match: 'PHRASE' },
          { text: 'biblical case against abortion', match: 'PHRASE' },
          { text: 'gospel and abortion',            match: 'PHRASE' },
          { text: 'church response to abortion',    match: 'PHRASE' },
          { text: 'christian abolitionism',         match: 'PHRASE' },
          { text: 'how should christians end abortion', match: 'PHRASE' },
          { text: 'pastor sermon abortion',         match: 'PHRASE' },
        ],
      },
      {
        name: 'Deep-dive (long-tail educational)',
        cpcBidUsd: 2.0,
        finalUrl: 'https://www.abolishabortionmichigan.com/abolition-bills/components',
        keywords: [
          { text: 'what is a bill of abolition',    match: 'PHRASE' },
          { text: 'components of abolition bill',   match: 'PHRASE' },
          { text: 'criminalizing abortion legislation', match: 'PHRASE' },
          { text: 'no exceptions abortion law',     match: 'PHRASE' },
          { text: 'how to write abortion abolition law', match: 'PHRASE' },
        ],
      },
    ],
    responsiveSearchAd: {
      // finalUrl is per-ad-group here; the builder passes each ad group's finalUrl
      // through to a per-ad-group RSA (same copy, different landing page).
      headlines: [
        'Abolitionist, Not Pro-Life',
        'Biblical Case for Abolition',
        'Michigan Abortion Law',
        'Ignore Roe: The Case',
        'What Is a Bill of Abolition?',
        'Justice for the Preborn',
        'Christian Abolition in 2026',
        'No Exceptions: Here’s Why',
        'Learn the Difference',
        'Michigan Legislation Tracker',
        'Read the Full Case',
        'The Gospel & Abolition',
      ],
      descriptions: [
        'The pro-life movement isn’t enough. Learn why total abolition is the only faithful stand.',
        'Every human being — from fertilization — bears God’s image. Read the biblical case.',
        'Michigan needs a real abolition bill. Learn what makes one different from a pro-life bill.',
        'Straight answers on Michigan’s abortion law after Dobbs. Written for Michiganders.',
      ],
      path1: 'learn',
      path2: 'abolition',
    },
  },
  {
    name: 'AAM — Donations',
    dailyBudgetUsd: 50,
    adGroups: [
      {
        name: 'Donate to pro-life / abolition',
        cpcBidUsd: 2.0,
        keywords: [
          { text: 'donate pro life michigan',        match: 'PHRASE' },
          { text: 'support abortion abolition',      match: 'PHRASE' },
          { text: 'give to end abortion',            match: 'PHRASE' },
          { text: 'christian pro life donation',     match: 'PHRASE' },
          { text: 'support pro life nonprofit michigan', match: 'PHRASE' },
          { text: 'donate abolish abortion',         match: 'PHRASE' },
          { text: 'support abolition michigan',      match: 'EXACT' },
        ],
      },
      {
        name: 'Michigan advocacy support',
        cpcBidUsd: 2.0,
        keywords: [
          { text: 'michigan pro life organization donate', match: 'PHRASE' },
          { text: 'give to michigan abolition',      match: 'PHRASE' },
          { text: 'support the preborn michigan',    match: 'PHRASE' },
          { text: 'pro life 501c3 donate michigan',  match: 'PHRASE' },
        ],
      },
    ],
    responsiveSearchAd: {
      finalUrl: 'https://www.abolishabortionmichigan.com/donate',
      headlines: [
        'Support Michigan Abolition',
        '100% Goes to the Mission',
        'Fund the End of Abortion',
        'Give Monthly, Fight Weekly',
        'Donate to AAM Today',
        'No Fees — Zeffy Processing',
        'Michigan 501(c)(3) Nonprofit',
        'Stand With the Preborn',
      ],
      descriptions: [
        '100% of your gift funds the movement to abolish abortion in Michigan. No processing fees.',
        'Support education, legislative advocacy, and outreach across the state of Michigan.',
        'Give once or become a monthly partner. Zeffy processing — every dollar goes further.',
      ],
      path1: 'donate',
      path2: 'aam',
    },
  },
];
