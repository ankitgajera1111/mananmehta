// Copies the live site's published content into the LOCAL in-memory backend,
// so admin screenshots show the same films, ads and text as the live pages.
//
// Read-only against the live site: it only GETs /api/content. Every write
// goes to the local API, which must be running with USE_MEMORY_DB=1.
//
// Run: LIVE_URL=https://manankmehta.com node portfolio/tools/sync-live.mjs
//  or: curl -s https://manankmehta.com/api/content > live.json
//      LIVE_JSON=live.json node portfolio/tools/sync-live.mjs
//      (for machines where Node's fetch can't use the outbound proxy)
const LIVE = (process.env.LIVE_URL || 'https://manankmehta.com').replace(/\/$/, '');
const LOCAL = process.env.LOCAL_API || 'http://127.0.0.1:8001';
const EMAIL = process.env.ADMIN_EMAIL || 'admin@manankmehta.com';
const PASSWORD = process.env.ADMIN_PASSWORD || 'changeme123';

if (!/^http:\/\/(127\.0\.0\.1|localhost)/.test(LOCAL)) throw new Error('LOCAL_API must be a local address');

import fs from 'node:fs';
const live = process.env.LIVE_JSON
  ? JSON.parse(fs.readFileSync(process.env.LIVE_JSON, 'utf8'))
  : await (await fetch(`${LIVE}/api/content`)).json();

const login = await fetch(`${LOCAL}/api/admin/login`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
});
if (!login.ok) throw new Error(`local login failed: ${login.status}`);
const cookie = login.headers.get('set-cookie').split(';')[0];

const api = async (method, path, body) => {
  const res = await fetch(`${LOCAL}/api/admin${path}`, {
    method,
    headers: { cookie, 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path}: ${res.status} ${await res.text()}`);
  return res.json();
};

// Singleton pages: public key -> admin key.
const PAGES = {
  settings: 'site_settings', home: 'home_page', about: 'about_page', contact: 'contact_page',
  filmsPage: 'films_page', adsPage: 'ads_page', creditsPage: 'credits_page', pageVisibility: 'page_visibility',
};
for (const [pub, key] of Object.entries(PAGES)) {
  if (live[pub]) await api('PUT', `/pages/${key}`, live[pub]);
}

// Lists: replace local rows with the live ones, keeping ids so the home
// banner's references resolve. publicId is dropped so the local copy can
// never be mistaken for the owner of a Cloudinary asset.
for (const resource of ['films', 'ads', 'credits']) {
  for (const row of await api('GET', `/content/${resource}`)) await api('DELETE', `/content/${resource}/${row.id}`);
  for (const row of live[resource] || []) {
    const copy = structuredClone(row);
    if (copy.coverImage) copy.coverImage.publicId = null;
    await api('POST', `/content/${resource}`, copy);
  }
  await api('PUT', `/content/${resource}/reorder`, { ids: (live[resource] || []).map((r) => r.id) });
  console.log(`${resource}: ${live[resource]?.length ?? 0}`);
}
console.log('Local backend now mirrors', process.env.LIVE_JSON || LIVE);
