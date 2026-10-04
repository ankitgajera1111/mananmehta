// Captures raw screenshots of the public site and the admin panel.
//
// Prereqs: backend on :8001 (USE_MEMORY_DB=1) and `yarn start` on :3000.
// Run:     node portfolio/tools/capture.mjs
//          PUBLIC_URL=https://manankmehta.com node portfolio/tools/capture.mjs
//            shoots the public pages from the live site (real content and
//            artwork); the admin panel and sample enquiries stay local, so
//            nothing is ever posted to production.
//
// Remote artwork (posters, YouTube thumbnails) is fetched normally. If a host
// is unreachable, a neutral title card is served in its place and the shot is
// listed in raw/_placeholders.txt so it can be re-captured later.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const PUBLIC = (process.env.PUBLIC_URL || BASE).replace(/\/$/, '');
const OUT = path.resolve('portfolio/screenshots/raw');
const EMAIL = process.env.ADMIN_EMAIL || 'admin@manankmehta.com';
const PASSWORD = process.env.ADMIN_PASSWORD || 'changeme123';
fs.mkdirSync(OUT, { recursive: true });

const placeholderSvg = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1400" viewBox="0 0 1000 1400">
<defs><radialGradient id="g" cx="30%" cy="25%" r="90%"><stop offset="0" stop-color="#3a2a12"/><stop offset=".55" stop-color="#161210"/><stop offset="1" stop-color="#0a0a0a"/></radialGradient></defs>
<rect width="1000" height="1400" fill="url(#g)"/></svg>`;

const placeholdered = new Set();

// Optional: serve the site's Google Fonts from local @fontsource packages
// (LOCAL_FONTS=<dir containing node_modules/@fontsource>) when fonts.gstatic.com
// is unreachable from the browser.
const LOCAL_FONTS = process.env.LOCAL_FONTS;
const FONT_FILES = {
  Oswald: ['oswald', [400, 500, 600, 700]],
  Inter: ['inter', [300, 400, 500, 600]],
  'JetBrains Mono': ['jetbrains-mono', [400, 500]],
};
const localFontCss = () => Object.entries(FONT_FILES).flatMap(([family, [pkg, weights]]) =>
  weights.map((w) => `@font-face{font-family:'${family}';font-style:normal;font-weight:${w};font-display:block;src:url(http://local.fonts/${pkg}/${pkg}-latin-${w}-normal.woff2) format('woff2');}`)
).join('\n');

async function newContext(browser, viewport, scale = 2) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: scale, colorScheme: 'dark' });
  if (LOCAL_FONTS) {
    await ctx.route(/fonts\.googleapis\.com/, (route) => route.fulfill({ contentType: 'text/css', body: localFontCss() }));
    await ctx.route(/^http:\/\/local\.fonts\//, (route) => {
      const [pkg, file] = new URL(route.request().url()).pathname.slice(1).split('/');
      route.fulfill({ contentType: 'font/woff2', body: fs.readFileSync(path.join(LOCAL_FONTS, 'node_modules/@fontsource', pkg, 'files', file)) });
    });
  }
  await ctx.route(/^https?:\/\/(?!localhost|127\.0\.0\.1|local\.fonts|fonts\.googleapis)/, async (route) => {
    const req = route.request();
    if (req.url().startsWith(PUBLIC)) return route.continue();
    if (req.resourceType() !== 'image') return route.abort();
    try {
      const res = await route.fetch({ timeout: 8000 });
      if (res.ok()) return route.fulfill({ response: res });
      throw new Error(String(res.status()));
    } catch {
      placeholdered.add(req.url());
      return route.fulfill({ status: 200, contentType: 'image/svg+xml', body: placeholderSvg() });
    }
  });
  return ctx;
}

async function settle(page) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  // Pages fade/slide in on scroll; walk the page so every section is revealed.
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
}

const shots = [];
async function shot(page, name, opts = {}) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, ...opts });
  shots.push(name);
  console.log('captured', name);
}

// Chromium ignores HTTPS_PROXY; pass it through when the machine needs one.
const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
const browser = await chromium.launch(proxy ? { proxy: { server: proxy, bypass: 'localhost,127.0.0.1' } } : {});

// ---------- Public site, desktop ----------
{
  const ctx = await newContext(browser, { width: 1440, height: 900 });
  const page = await ctx.newPage();
  const pages = [
    ['home', '/'], ['films', '/films'], ['ads', '/ads'],
    ['about', '/about'], ['credits', '/credits'], ['contact', '/contact'],
  ];
  for (const [name, url] of pages) {
    await page.goto(PUBLIC + url);
    await settle(page);
    await shot(page, `public-${name}-hero`);
    await shot(page, `public-${name}-full`, { fullPage: true });
  }
  // Film detail modal with the track list.
  await page.goto(PUBLIC + '/films');
  await settle(page);
  const card = page.locator('[data-testid^="film-card"], article, .group').filter({ hasText: /jigra/i }).first();
  if (await card.count()) {
    await card.click().catch(() => {});
    await page.waitForTimeout(1200);
    await shot(page, 'public-films-detail');
    await page.keyboard.press('Escape');
  }
  await ctx.close();
}

// ---------- Public site, mobile ----------
{
  const ctx = await newContext(browser, { width: 390, height: 844 }, 3);
  const page = await ctx.newPage();
  for (const [name, url] of [['home', '/'], ['films', '/films'], ['ads', '/ads'], ['contact', '/contact']]) {
    await page.goto(PUBLIC + url);
    await settle(page);
    await shot(page, `mobile-${name}`);
  }
  await ctx.close();
}

// ---------- Sample enquiries so the inbox is not empty ----------
for (const m of [
  { name: 'Sample: Riya Kapoor', email: 'riya@example.com', projectType: 'Short Film', message: 'We are a small team shooting a 20-minute drama in Pune this winter and would love an original score. Are you free from December?' },
  { name: 'Sample: Northwind Studio', email: 'hello@example.com', projectType: 'Commercial / Advertising', message: 'Looking for a 30-second sonic logo and two cut-downs for a fintech launch campaign. Can you share your rates?' },
  { name: 'Sample: Arjun Desai', email: 'arjun@example.com', projectType: 'Documentary', message: 'Feature-length wildlife documentary, rough cut is locked. Need ambient, orchestral textures. Happy to send a private link.' },
]) {
  await fetch(`${BASE}/api/contact`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(m) });
}

// ---------- Admin panel ----------
{
  const ctx = await newContext(browser, { width: 1440, height: 900 });
  const page = await ctx.newPage();
  await page.goto(BASE + '/admin/login');
  await settle(page);
  await shot(page, 'admin-login');
  await page.locator('input[type="email"]').fill(EMAIL);
  await page.locator('input[type="password"]').fill(PASSWORD);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(/\/admin\/?$/);
  await settle(page);

  const admin = [
    ['dashboard', '/admin'], ['home', '/admin/home'], ['films', '/admin/films'],
    ['ads', '/admin/ads'], ['credits', '/admin/credits'], ['about', '/admin/about'],
    ['contact', '/admin/contact'], ['messages', '/admin/messages'],
    ['visibility', '/admin/visibility'], ['settings', '/admin/settings'],
  ];
  for (const [name, url] of admin) {
    await page.goto(BASE + url);
    await settle(page);
    await shot(page, `admin-${name}`);
    await shot(page, `admin-${name}-full`, { fullPage: true });
  }

  // Edit dialogs: open the first item's editor on Films and Ads.
  for (const name of ['films', 'ads']) {
    await page.goto(BASE + `/admin/${name}`);
    await settle(page);
    await page.getByLabel('Edit').first().click();
    await page.waitForTimeout(900);
    await shot(page, `admin-${name}-edit`);
    await page.keyboard.press('Escape');
  }

  // Open the first message.
  await page.goto(BASE + '/admin/messages');
  await settle(page);
  const msg = page.getByText(/Sample:/).first();
  if (await msg.count()) {
    await msg.click();
    await page.waitForTimeout(700);
    await shot(page, 'admin-messages-open');
  }
  await ctx.close();
}

await browser.close();
fs.writeFileSync(path.join(OUT, '_placeholders.txt'), [...placeholdered].join('\n') + '\n');
console.log(`\n${shots.length} shots; ${placeholdered.size} remote images replaced by placeholders.`);
