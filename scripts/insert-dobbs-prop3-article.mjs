#!/usr/bin/env node
/**
 * Insert "Michigan Abortion Law After Dobbs and Prop 3" as a DRAFT.
 * Source: writer's Google Doc (AAM Outline 2). Edits applied:
 *
 *   MUST FIX 1 — Prop 3 margin was written as "about 2/3rds"; corrected to
 *     the certified 56.7% / 43.3% split. This matches
 *     data/mi-county-prop3-vote.json and every /cities page, which the
 *     draft would otherwise have contradicted on our own domain.
 *   MUST FIX 2 — "the 1831 law" typo corrected to 1931.
 *
 *   Grammar/typo pass: comma splice after "Dobbs decision", misused
 *     semicolons (zombie-law clause, closing CTA), "their"->"its" for
 *     Michigan, "democrats"->"Democrats", "14th amendment"->"14th
 *     Amendment", courts "passed"->"issued" injunctions, "to be relevant"
 *     -> "to become relevant", commas around a parenthetical clause.
 *
 *   Left alone per instruction: "in just a few years" timeline wording,
 *     the parental-consent description, the 14th Amendment paraphrase.
 *
 * All 10 of the writer's footnote citations are wired as inline links.
 * Section headings added so the piece scans on the site; no body text
 * was rewritten to create them.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '../lib/generated/prisma/index.js';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const line of fs.readFileSync(path.join(REPO_ROOT, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/i);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

// External citation hrefs, keyed to the writer's footnote letters.
const SRC = {
  a: 'https://www.michiganpublic.org/politics-government/2022-06-24/what-you-need-to-know-about-michigans-1931-abortion-law',
  b: 'https://www.supremecourt.gov/opinions/21pdf/19-1392_6j37.pdf',
  c: 'https://www.michigan.gov/whitmer/news/press-releases/2024/06/24/two-years-after-dobbs-decision-governor-whitmer-still-fighting-like-hell',
  d: 'https://www.tuscolacounty.org/elections/2022/11/2022-3%20Full%20Proposal%20Text.pdf',
  e: 'https://www.michigan.gov/sos/-/media/Project/Websites/sos/Election-Results-and-Statistics/Recount-results/Official-22-3-recount-results.pdf?rev=2ea89c4ebd4c4bb4af2e725ac70c0cf7&amp;hash=1872476E84E074453503A4F66CC1B6FC',
  f: 'https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-Act-286-of-2023',
  g: 'https://constitution.congress.gov/constitution/amendment-14/',
};

function ext(key, text) {
  return '<a href="' + SRC[key] + '" target="_blank" rel="noopener noreferrer">' + text + '</a>';
}

const content = [
  '<p>In 2022, Michigan voters cast the most consequential abortion vote in state history. Very few of them can accurately describe what they voted for.</p>',

  '<p>After the Dobbs decision, the Supreme Court ruling that overturned Roe v. Wade and pushed the abortion decision to the states, Michigan overturned its 1931 abortion ban in just a few years by passing an amendment to the state constitution, Prop 3, that enshrined abortion access into state law. Together, Dobbs and Prop 3 changed Michigan&rsquo;s legal landscape but did not touch upon the moral question of personhood for the unborn.</p>',

  '<h2>How Michigan Got Here</h2>',

  '<p>To understand the current legal landscape in Michigan, it is best to understand its history. For a long time, the Michigan public, with its strong Christian tradition, was against abortion. There were laws banning abortions all the way back in the 1800s. In 1931, Michigan ' + ext('a', 'updated its abortion laws') + ' to almost fully ban the practice for both doctors and pregnant mothers, even not allowing abortions in cases of rape and incest, although there was a life of the mother exception.</p>',

  '<p>In 1973, the federal Supreme Court gave the ruling on Roe v. Wade, arguing that there was a right to privacy in the constitution which meant that states could not infringe upon the woman&rsquo;s &ldquo;right&rdquo; to have an abortion. Thus, every law that banned abortions before the third trimester was made unconstitutional, and there were restrictions and exceptions put into place for how a state was to handle third and second trimester abortions. Michigan was one of the states this affected, because its abortion law banned abortions for all trimesters, but that became unconstitutional making the Michigan law a zombie law of sorts: one that was technically still on the books but not able to be enforced at all unless Roe v. Wade was ever overturned.</p>',

  '<h2>What Dobbs Actually Did</h2>',

  '<p>In 2022, the ' + ext('b', 'Dobbs decision') + ' overturned Roe v. Wade (as well as Planned Parenthood v. Casey) which caused the 1931 Michigan law to become relevant again. <strong>The Dobbs decision did not ban abortion. It did not declare the unborn to be legal persons.</strong> All it did was remove federal restrictions on how states could regulate abortion, thus making it possible for states to either completely ban abortion or completely allow abortion, or anything in between. After 2022, states like Michigan who had laws banning abortions were now allowed to enforce those laws, and other states could write new laws basically however they wanted.</p>',

  '<h2>What Prop 3 Actually Did</h2>',

  '<p>In Michigan, the 1931 law banning abortions should have started to be enforced again in 2022 as it was no longer unconstitutional; however, at the urging of Governor Gretchen Whitmer, state courts ' + ext('c', 'issued injunctions') + ' pausing the law from ever being acted on. As she did this, Democrats quickly worked on a proposal that would make the old law unconstitutional by enshrining abortion rights into the state constitution: ' + ext('d', 'Proposal 3') + '.</p>',

  '<p>Prop 3 was worded in a way that made it seem quite desirable to those who did not look into what it actually meant, as it said it would &ldquo;allow the state to regulate abortion in some cases&rdquo; but also that it would &ldquo;establish new individual right to reproductive freedom.&rdquo; This intentionally vague and positive language gave the masses exactly what they wanted: &ldquo;reproductive freedom&rdquo; (abortion) with a few restrictions to appeal to the moderates. The proposition was ' + ext('e', 'passed by a majority') + ' with 56.7% of the voters voting &ldquo;yes&rdquo; on changing the state constitution, against 43.3% voting &ldquo;no.&rdquo; After the change, the constitution officially established a &ldquo;fundamental right to reproductive freedom&rdquo; which, as the amendment stated, included the right to an abortion. This &ldquo;fundamental right&rdquo; would not be denied by any state regulations or restrictions until after viability.</p>',

  '<h2>The Reproductive Health Act</h2>',

  '<p>Shortly after, Michigan passed the ' + ext('f', 'Reproductive Health Act') + '. This act officially repealed the 1931 ban by clarifying, strengthening, and implementing ways to enact what Prop 3 established. It was a package of bills that did the following:</p>',

  '<ul>',
  '  <li>Repealed regulations specific to abortion clinics</li>',
  '  <li>Abolished any penalties for medical abortions (the ones imposed by the 1931 law)</li>',
  '  <li>Allowed healthcare insurance providers to include abortion coverage without an additional premium</li>',
  '</ul>',

  '<p>Basically, it codified abortion in the state constitution. According to the Center for Reproductive Rights, a legal guardian or judge must consent to a minor&rsquo;s abortion in Michigan (except for a medical emergency), so that is one extremely minor restriction that is still allowed. However, while the act itself did not successfully address this at first, judges later ruled that a 24 hour waiting period and mandatory information (like seeing an ultrasound first) are no longer required for an abortion, which is why the Center for Reproductive Rights calls abortion in Michigan heavily protected. Prop 3 and the RHA not only allow for abortion, but heavily limit any attempts to restrict or regulate it in any way.</p>',

  '<h2>What Was Never Settled: Personhood</h2>',

  '<p>To an anti-abortion individual, these developments are very disheartening, but there is still hope for a future Michigan where murdering children is actually treated like it should be: <strong>the fact that none of these decisions, amendments, and acts addressed the question of personhood.</strong></p>',

  '<p>The ' + ext('g', '14th Amendment') + ' of the US constitution says that the right to life shall not be infringed upon for all persons. It also provides equal protection of the law for all persons within the US. Right now, in order to be compliant with the constitution, abortion protections in states like Michigan must deny the personhood of the unborn (as abortion denies the right to life of the unborn as well as equal legal protection). Because the recent legislation did not touch on unborn personhood, a bill of equal protection could be passed in Michigan that clarifies the legal personhood status of the unborn. This bill would show the recent legislation to be unconstitutional, and because &ldquo;reproductive freedom&rdquo; does not include stripping away the rights of others by being able to legally murder them, the bill would fully ban abortion. The laws as they stand currently are contradictory, as all persons have rights yet the rights for a particular class are ignored in favor of the faux freedom legalized by Prop 3. <strong>As the Dred Scott case showed Americans a long time ago, the state cannot vote a class of persons into non-personhood.</strong></p>',

  '<h2>What You Can Do</h2>',

  '<p>To establish equal protection and equal justice in Michigan as the unborn deserve under their 14th Amendment rights, rights that are currently being denied, <a href="/the-petition">sign our petition</a>. Check out <a href="/cities">your city</a> and <a href="/legislators">your legislator</a> so you can contact your representatives and present them with this information, letting them know that there is a quickly growing number of Michigan citizens that will stand up for the rights of all persons. Finally, pray and vote for a bill of equal protection in Michigan. <strong>The passage of Prop 3 is not &lsquo;game over&rsquo; for those who care for all living human beings.</strong></p>',
].join('\n\n');

const article = {
  slug: 'michigan-abortion-law-after-dobbs-prop3',
  title: 'Michigan Abortion Law After Dobbs and Prop 3: What Actually Changed',
  excerpt: "Dobbs returned abortion to the states in 2022. Michigan's Proposal 3 passed months later. Here is what actually changed under Michigan law, and what did not.",
  content,
  image: null,
  published: false,
  auto_post_to_social: true,
};

const prisma = new PrismaClient();
try {
  const existing = await prisma.newsArticle.findUnique({ where: { slug: article.slug } });
  const row = existing
    ? await prisma.newsArticle.update({ where: { slug: article.slug }, data: article })
    : await prisma.newsArticle.create({ data: article });

  console.log((existing ? 'UPDATED' : 'CREATED') + ' draft');
  console.log('  id:         ' + row.id);
  console.log('  slug:       ' + row.slug);
  console.log('  title:      ' + row.title);
  console.log('  published:  ' + row.published + '   (draft)');
  console.log('  contentLen: ' + row.content.length + ' chars');
  console.log('  links:      ' + (row.content.match(/<a /g) || []).length);
  console.log('  external:   ' + (row.content.match(/target="_blank"/g) || []).length);
} finally {
  await prisma.$disconnect();
}
