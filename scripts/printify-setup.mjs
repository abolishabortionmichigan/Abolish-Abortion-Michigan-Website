// One-time Printify setup helper. Never prints the token.
//
//   node scripts/printify-setup.mjs shops      list the account's shops → pick PRINTIFY_SHOP_ID
//   node scripts/printify-setup.mjs webhooks   register (or list) the order webhooks for this site
//
// Reads PRINTIFY_API_TOKEN, PRINTIFY_SHOP_ID, PRINTIFY_WEBHOOK_SECRET and
// NEXT_PUBLIC_SITE_URL from the environment, e.g.
//   set -a; . ./.env.prod; set +a; node scripts/printify-setup.mjs shops
// PRINTIFY_WEBHOOK_SECRET: generate one with `openssl rand -hex 20` and put the
// SAME value in Vercel before running `webhooks`.

const BASE = (process.env.PRINTIFY_API_BASE || 'https://api.printify.com/v1').replace(/\/$/, '');
const TOPICS = ['order:updated', 'order:sent-to-production', 'order:shipment:created', 'order:shipment:delivered'];
const token = process.env.PRINTIFY_API_TOKEN;
if (!token) {
  console.error('PRINTIFY_API_TOKEN is not set.');
  process.exit(1);
}

async function api(path, init = {}) {
  const res = await fetch(`${BASE}/${path}`, {
    method: init.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'AbolishAbortionMichigan-Store/1.0',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Printify ${res.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
}

const cmd = process.argv[2];
if (cmd === 'shops') {
  const shops = await api('shops.json');
  if (!shops.length) console.log('No shops yet. In Printify: My stores → Add new store → connect via API.');
  for (const s of shops) console.log(`${s.id}\t${s.title}\t(sales channel: ${s.sales_channel})`);
} else if (cmd === 'webhooks') {
  const shop = process.env.PRINTIFY_SHOP_ID;
  const secret = process.env.PRINTIFY_WEBHOOK_SECRET;
  const site = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
  if (!shop || !secret || !site.startsWith('https://')) {
    console.error('Needs PRINTIFY_SHOP_ID, PRINTIFY_WEBHOOK_SECRET and an https NEXT_PUBLIC_SITE_URL.');
    process.exit(1);
  }
  const url = `${site}/api/printify/webhook`;
  const existing = await api(`shops/${shop}/webhooks.json`);
  for (const topic of TOPICS) {
    const have = existing.find((w) => w.topic === topic && w.url === url);
    if (have) {
      console.log(`already registered: ${topic}`);
      continue;
    }
    const created = await api(`shops/${shop}/webhooks.json`, { method: 'POST', body: { topic, url, secret } });
    console.log(`registered: ${topic} → ${url} (${created.id})`);
  }
} else {
  console.log('Usage: node scripts/printify-setup.mjs shops | webhooks');
}
