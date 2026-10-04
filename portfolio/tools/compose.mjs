// Turns raw screenshots into finished portfolio images.
//
// Each composition is a small HTML page (browser/phone frames on a warm
// canvas) rendered by Playwright at 2× — 2400×1500 for case-study images and
// 1200×630 for the Open Graph image.
//
// Run: node portfolio/tools/compose.mjs
// Optional LOCAL_FONTS=<dir with node_modules/@fontsource> when Google Fonts
// is unreachable.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const RAW = path.resolve('portfolio/screenshots/raw');
const OUT = path.resolve('portfolio/screenshots/final');
fs.mkdirSync(OUT, { recursive: true });
const raw = (name) => pathToFileURL(path.join(RAW, `${name}.png`)).href;

const LOCAL_FONTS = process.env.LOCAL_FONTS;
const fontCss = LOCAL_FONTS
  ? [
      ['Instrument Serif', 'instrument-serif', 400],
      ['Inter', 'inter', 400], ['Inter', 'inter', 500], ['Inter', 'inter', 600],
      ['JetBrains Mono', 'jetbrains-mono', 400], ['JetBrains Mono', 'jetbrains-mono', 500],
    ].map(([family, pkg, w]) => `@font-face{font-family:'${family}';font-weight:${w};src:url(${pathToFileURL(path.join(LOCAL_FONTS, 'node_modules/@fontsource', pkg, 'files', `${pkg}-latin-${w}-normal.woff2`)).href}) format('woff2');}`).join('\n')
  : `@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=block');`;

// ---------- building blocks ----------

/** A desktop browser window showing `shot`, cropped to `ratio` from `pos`. */
const browser = ({ shot, url, width, ratio = 1440 / 900, pos = 'top', style = '', dark = false }) => `
<div class="browser ${dark ? 'dark' : ''}" style="width:${width}px;${style}">
  <div class="bar"><i></i><i></i><i></i><span class="url">${url}</span></div>
  <div class="view" style="aspect-ratio:${ratio};background-image:url('${raw(shot)}');background-position:center ${pos};"></div>
</div>`;

/** A phone outline showing a 390×844 shot. */
const phone = ({ shot, width = 250, style = '' }) => `
<div class="phone" style="width:${width}px;${style}">
  <div class="screen" style="background-image:url('${raw(shot)}')"></div>
</div>`;

const copy = ({ eyebrow, title, body, style = '' }) => `
<div class="copy" style="${style}">
  <p class="eyebrow">${eyebrow}</p>
  <h1>${title}</h1>
  ${body ? `<p class="body">${body}</p>` : ''}
</div>`;

const page = (inner, { w = 1200, h = 750, theme = 'light' } = {}) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
${fontCss}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${w}px;height:${h}px;overflow:hidden}
body{font-family:Inter,system-ui,sans-serif;position:relative;
  background:${theme === 'dark'
    ? 'radial-gradient(120% 90% at 85% 10%,#2a1c08 0%,#0d0b09 45%,#080808 100%)'
    : 'radial-gradient(90% 80% at 80% 20%,#f6e7cf 0%,#f4f0ea 45%,#efebe4 100%)'};
  color:${theme === 'dark' ? '#f5f5f0' : '#1c1a17'}}
body::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.035;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E")}
.abs{position:absolute}
.browser{position:absolute;border-radius:12px;overflow:hidden;background:#fff;
  box-shadow:0 1px 0 rgba(255,255,255,.6) inset,0 30px 60px -20px rgba(40,25,5,.35),0 12px 24px -12px rgba(40,25,5,.25),0 0 0 1px rgba(30,20,5,.08)}
.browser .bar{height:30px;display:flex;align-items:center;gap:6px;padding:0 12px;background:#f1eee9;border-bottom:1px solid #e4dfd7}
.browser.dark .bar{background:#1a1816;border-color:#2a2622}
.browser .bar i{width:9px;height:9px;border-radius:50%;background:#d9d3ca}
.browser.dark .bar i{background:#3a3631}
.browser .url{margin:0 auto;transform:translateX(-18px);font:500 10.5px 'JetBrains Mono',monospace;color:#7a7268;
  background:#fff;border:1px solid #e4dfd7;padding:3px 14px;border-radius:999px;min-width:220px;text-align:center}
.browser.dark .url{background:#0f0e0c;border-color:#2a2622;color:#9a9086}
.view{width:100%;background-size:100% auto;background-repeat:no-repeat;background-color:#0a0a0a}
.phone{position:absolute;aspect-ratio:390/844;border-radius:38px;padding:9px;background:#141210;
  box-shadow:0 0 0 1.5px #3a342c inset,0 40px 70px -25px rgba(40,25,5,.45),0 0 0 1px rgba(0,0,0,.2)}
.phone .screen{width:100%;height:100%;border-radius:30px;background-size:cover;background-position:top}
.copy{position:absolute}
.eyebrow{font:500 11px 'JetBrains Mono',monospace;letter-spacing:.22em;text-transform:uppercase;color:#b4530e;margin-bottom:16px}
body.dark .eyebrow{color:#f59e0b}
h1{font-family:'Instrument Serif',Georgia,serif;font-weight:400;font-size:52px;line-height:1.02;letter-spacing:-.01em}
.body{margin-top:18px;font-size:15px;line-height:1.6;color:#5c554c;max-width:330px}
body.dark .body{color:#a39a8f}
.tag{position:absolute;font:500 10px 'JetBrains Mono',monospace;letter-spacing:.14em;text-transform:uppercase;
  background:#1c1a17;color:#f4f0ea;padding:7px 12px;border-radius:999px;box-shadow:0 8px 20px -8px rgba(0,0,0,.4)}
.tag b{color:#f59e0b;font-weight:500}
.mark{position:absolute;font-family:'Instrument Serif',serif;font-size:22px}
</style></head><body class="${theme}">${inner}</body></html>`;

// ---------- compositions ----------
const SITE = 'manankmehta.com';
const comps = {
  // 1 — Card cover: public site + CMS + phone, no copy.
  '01-cover': page(`
    ${browser({ shot: 'public-home-hero', url: SITE, width: 820, style: 'left:70px;top:70px' })}
    ${browser({ shot: 'admin-home', url: `${SITE}/admin/home`, width: 600, style: 'left:520px;top:330px', dark: true })}
    ${phone({ shot: 'mobile-home', width: 190, style: 'left:960px;top:150px' })}
    <span class="tag" style="left:70px;top:640px"><b>●</b> Public site</span>
    <span class="tag" style="left:520px;top:290px"><b>●</b> Admin CMS</span>`),

  // 2 — The public site, three pages fanned.
  '02-public-site': page(`
    ${copy({ eyebrow: 'Public site', title: 'A dark, cinematic<br>stage for the score', body: 'Six pages — Home, Films, Ads, About, Credits, Contact — in black and amber, with condensed Oswald headlines and mono captions.', style: 'left:70px;top:90px' })}
    ${browser({ shot: 'public-about-hero', url: `${SITE}/about`, width: 560, style: 'left:470px;top:60px' })}
    ${browser({ shot: 'public-credits-hero', url: `${SITE}/credits`, width: 560, style: 'left:560px;top:250px' })}
    ${browser({ shot: 'public-contact-hero', url: `${SITE}/contact`, width: 560, style: 'left:650px;top:440px' })}`),

  // 3 — Credits page: counters computed from rows.
  '03-credits': page(`
    ${copy({ eyebrow: 'Credits', title: 'A filmography that<br>counts itself', body: 'The totals — credits, feature films, commercials, active years — are calculated from the rows in the CMS, so they never drift out of date.', style: 'left:70px;top:110px' })}
    ${browser({ shot: 'public-credits-full', url: `${SITE}/credits`, width: 720, ratio: 1440 / 1300, style: 'left:430px;top:60px' })}`),

  // 4 — Enquiry form to inbox.
  '04-enquiries': page(`
    ${browser({ shot: 'public-contact-hero', url: `${SITE}/contact`, width: 660, style: 'left:60px;top:70px' })}
    ${browser({ shot: 'admin-messages-open', url: `${SITE}/admin/messages`, width: 600, style: 'left:540px;top:300px', dark: true })}
    <span class="tag" style="left:60px;top:500px"><b>01</b> Visitor sends a brief</span>
    <span class="tag" style="left:540px;top:262px"><b>02</b> It lands in the inbox — and by email</span>`),

  // 5 — Admin dashboard.
  '05-admin-dashboard': page(`
    ${copy({ eyebrow: 'Admin panel', title: 'Every word on the<br>site, editable', body: 'A private CMS at /admin. The dashboard counts films, ads, credits and unread enquiries, and a quick guide explains what each screen controls.', style: 'left:70px;top:110px' })}
    ${browser({ shot: 'admin-dashboard', url: `${SITE}/admin`, width: 760, style: 'left:410px;top:110px', dark: true })}`),

  // 6 — Home banner picker.
  '06-admin-banner': page(`
    ${copy({ eyebrow: 'Home & Banner', title: 'Choose what plays<br>behind the hero', body: 'Pick any film or ad for the rotating banner, reorder it with the arrows, and set seconds per slide. Slides reference projects, so edits flow through.', style: 'left:70px;top:110px' })}
    ${browser({ shot: 'admin-home-full', url: `${SITE}/admin/home`, width: 760, ratio: 1440 / 1000, style: 'left:410px;top:90px', dark: true })}`),

  // 7 — Editing a film.
  '07-admin-edit-film': page(`
    ${browser({ shot: 'admin-films', url: `${SITE}/admin/films`, width: 640, style: 'left:60px;top:60px', dark: true })}
    ${browser({ shot: 'admin-films-edit', url: `${SITE}/admin/films`, width: 640, ratio: 1440 / 900, style: 'left:500px;top:250px', dark: true })}
    <span class="tag" style="left:60px;top:510px"><b>●</b> Reorder · hide · edit · delete</span>
    <span class="tag" style="left:500px;top:212px"><b>●</b> One dialog per project</span>`),

  // 8 — Visibility + settings.
  '08-admin-control': page(`
    ${browser({ shot: 'admin-visibility', url: `${SITE}/admin/visibility`, width: 600, style: 'left:60px;top:80px', dark: true })}
    ${browser({ shot: 'admin-settings-full', url: `${SITE}/admin/settings`, width: 600, ratio: 1440 / 1100, style: 'left:540px;top:220px', dark: true })}
    <span class="tag" style="left:60px;top:48px"><b>●</b> Switch whole pages off — they leave the menu and the sitemap</span>
    <span class="tag" style="left:780px;top:690px"><b>●</b> Contact, social & SEO settings</span>`),

  // 9 — Mobile.
  '09-mobile': page(`
    ${copy({ eyebrow: 'Responsive', title: 'Built phone-first', body: 'The same pages at 390px: a collapsible menu, swipeable filter chips and stacked contact cards.', style: 'left:70px;top:110px' })}
    ${phone({ shot: 'mobile-home', width: 200, style: 'left:420px;top:100px' })}
    ${phone({ shot: 'mobile-ads', width: 200, style: 'left:640px;top:60px' })}
    ${phone({ shot: 'mobile-contact', width: 200, style: 'left:860px;top:140px' })}`),

  // 10 — Films and Ads (need the real posters — see README).
  '10-work-pages': page(`
    ${browser({ shot: 'public-films-full', url: `${SITE}/films`, width: 640, ratio: 1440 / 1100, style: 'left:60px;top:60px' })}
    ${browser({ shot: 'public-ads-full', url: `${SITE}/ads`, width: 640, ratio: 1440 / 1100, style: 'left:500px;top:220px' })}`),

  // 11 — Film detail dialog with tracklist.
  '11-film-detail': page(`
    ${copy({ eyebrow: 'Films', title: 'Hear the score<br>without leaving', body: 'Each film opens a detail view with director, genre and the tracks embedded from SoundCloud.', style: 'left:70px;top:110px' })}
    ${browser({ shot: 'public-films-detail', url: `${SITE}/films`, width: 760, style: 'left:410px;top:110px' })}`),
};

const og = page(`
  <div class="copy" style="left:56px;top:70px">
    <p class="eyebrow">Case study · Web design & development</p>
    <h1 style="font-size:60px;color:#f5f5f0">Manan Mehta<br>composer portfolio</h1>
    <p class="body" style="max-width:300px">A cinematic site with its own CMS — every film, ad and credit editable.</p>
  </div>
  ${browser({ shot: 'public-home-hero', url: SITE, width: 540, style: 'left:580px;top:60px', dark: true })}
  ${browser({ shot: 'admin-home', url: `${SITE}/admin/home`, width: 400, style: 'left:740px;top:300px', dark: true })}
`, { w: 1200, h: 630, theme: 'dark' });

// ---------- render ----------
const b = await chromium.launch();
const render = async (name, html, w, h, scale = 2, ext = 'jpg') => {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  const p = await ctx.newPage();
  const tmp = path.join(OUT, `.${name}.html`);
  fs.writeFileSync(tmp, html);
  await p.goto(pathToFileURL(tmp).href);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(OUT, `${name}.${ext}`), type: ext === 'jpg' ? 'jpeg' : 'png', quality: ext === 'jpg' ? 90 : undefined });
  fs.unlinkSync(tmp);
  await ctx.close();
  console.log('composed', name);
};
const only = process.argv[2];
for (const [name, html] of Object.entries(comps)) if (!only || name.startsWith(only)) await render(name, html, 1200, 750);
if (!only || only === 'og') await render('og-image-1200x630', og, 1200, 630, 1);
await b.close();
