# Case study copy — Manan Mehta composer portfolio

Ready-to-paste content for **ankitgajera.com → Admin → Portfolio → Projects → Add project**.
Fields are listed in the order the form shows them. Images live in
`portfolio/screenshots/final/`.

Public-site images are taken from the live site, https://manankmehta.com. Admin
images come from a local copy of the CMS loaded with the live site's content
(the real admin needs Manan's login), so the films, ads and text match.

> Items marked **✎ confirm** are facts only you know (dates, scope). Change them
> before publishing; your form's own rule is “never imply more than you did”.

---

## Main column

### Title *
```
Manan Mehta — Composer Portfolio & CMS
```

### Summary * (146 / 160 characters)
```
A cinematic portfolio and custom CMS for Mumbai film composer Manan Mehta, so he can update films, ads, credits and enquiries without a developer.
```

### Card Images * (upload in this order — the first is the static cover)

| # | File | Why it's here |
|---|---|---|
| 1 | `01-cover.jpg` | Cover. Live hero (Jigra), CMS and phone in one frame. |
| 2 | `03-home-work.jpg` | The posters — the most eye-catching frame. |
| 3 | `06-admin-banner.jpg` | Strongest admin screen: the banner picker. |
| 4 | `10-work-pages.jpg` | Films and Ads pages full of real artwork. |
| 5 | `07-admin-edit-film.jpg` | The list and edit dialog: how content gets in. |
| 6 | `04-enquiries.jpg` | Contact form → inbox, front and back together. |
| 7 | `09-mobile.jpg` | Responsive proof. |
| 8 | `05-admin-dashboard.jpg` | CMS overview. |

`02-public-site.jpg`, `08-admin-control.jpg` and `11-film-detail.jpg` are used
in the case-study body below.

All are 2400 × 1500 (16:10) JPEGs, each showing a different screen, so the
hover sequence never repeats itself.

### Year
```
2026
```

### Client
```
Manan Mehta
```

### Role
```
UI/UX design, front-end and back-end development, CMS and deployment
```
✎ confirm: the repo history shows the first public-site screens were
scaffolded with Emergent before you rebuilt them. If you want to be precise,
use: `Design refinement, full-stack development, custom CMS and deployment`.

### Duration
```
✎ confirm — e.g. 6 weeks
```
(The repository's history runs from March to August 2026, but that includes
gaps and later change requests, so put your actual working time here.)

### Tools (add one per row)
```
React
Tailwind CSS
shadcn/ui
FastAPI
MongoDB Atlas
Cloudinary
Resend
Vercel
```
Optional, if you want to be transparent about the starting point: `Emergent`.

### Live site URL
```
https://manankmehta.com
```

### Repository URL
Leave blank. It's the client's private repository.

---

## Blocks (the case-study body)

Add these in order. Each section says which block to use: a text block for
the copy, an image block for the screenshot. Adapt to the block types your
“Add Block” menu offers. Image captions are in the **Screenshot guide** below.

### 1 · Text — Overview
**Heading:** The brief

Manan Mehta is a Mumbai-based film and advertising composer whose credits
include *Jigra* (2024) and *Happy Patel: Khatarnak Jasoos* (2026). He needed a
site that felt like his music sounds — dark, cinematic, confident — and one he
could keep current on his own. New films, ad campaigns and credits arrive
every few months, and a portfolio that needs a developer for every update
goes stale fast.

So the brief had two halves: a public site that presents film scores and
commercials the way a trailer would, and a private admin panel that puts every
word, image and track in his hands.

### 2 · Image — `02-public-site.jpg`

### 3 · Text — The public site
**Heading:** A dark, cinematic stage

The site uses a near-black canvas with a single amber accent, condensed Oswald
headlines and monospaced captions, so the posters and video stills supply the
colour. Five pages are live, plus a sixth (Credits) that is built and
currently switched off from the admin panel:

- **Home** — a full-screen hero that rotates through hand-picked films and
  ads, then sections for film scores, advertising work and a closing call to
  action.
- **Films** — filterable by type (Feature Film, Documentary, Short Film), with
  grid and list views. Each film opens a detail view with the director, genre
  and SoundCloud tracks, so a visitor can hear the score without leaving the
  page.
- **Ads** — a strip of the brands he has scored for (Volvo, Samsung,
  Squarespace, Lay's, Lakmé, Tropicana, Durex, Torrent Electricals and more)
  and brand filters, with each spot playing from YouTube in a pop-up player.
- **About** — biography, achievements, skills and a four-step process.
- **Contact** — an enquiry form, cards for email, phone, WhatsApp and
  Instagram, and an FAQ.
- **Credits** *(built, currently hidden)* — the filmography grouped by year,
  with counters calculated from the rows.

### 4 · Image — `03-home-work.jpg`

### 5 · Image — `11-film-detail.jpg`

### 6 · Text — Why a custom CMS
**Heading:** Every word on the site, editable

Instead of hard-coding content, I built a small CMS behind `/admin`. Everything
a visitor sees comes from it: the hero rotation, page headings, every film,
ad and credit, the biography, the FAQ, contact details and SEO text.

It's deliberately simple, with ten screens written in plain language: “Seconds
per slide”, “Word to highlight”, “Leave blank to hide the badge”. A composer
can learn it in an afternoon and doesn't need a manual.

### 7 · Image — `05-admin-dashboard.jpg`

### 8 · Image — `06-admin-banner.jpg`

### 9 · Text — How content is managed
**Heading:** Add, reorder, hide — never lose work

- **Films, Ads and Credits** share one consistent editor. Every row can be
  reordered with arrows, edited in a dialog, deleted with a confirmation, or
  **hidden** with the eye icon, which takes it off the site without deleting it.
- **Images** accept either an upload or a pasted URL. Uploads go straight from
  the browser to Cloudinary, so large files never hit the server's limits.
- **The home banner** stores references to projects rather than copies, so
  editing a film updates its slide automatically. A deleted or hidden project
  drops out of the rotation on its own.
- **Page visibility** can switch a whole page off. It leaves the menu, stops
  resolving, and drops out of the generated sitemap.

### 10 · Image — `07-admin-edit-film.jpg`

### 11 · Image — `08-admin-control.jpg`

### 12 · Text — Enquiries
**Heading:** From the contact form to the inbox

Enquiries are stored in the admin inbox, with read/unread state and one-click
reply, and are also emailed to Manan through Resend or SMTP. The form's
“Project type” options are editable too, so they match the work he wants.
Rate limiting keeps spam bots from flooding it.

### 13 · Image — `04-enquiries.jpg`

### 14 · Text — Built to be fast and safe
**Heading:** Under the hood

- **One request for all content.** The site fetches every page, project and
  setting in a single call and caches it in the browser, so repeat visitors
  see the page instantly while it refreshes in the background. This also
  hides the serverless cold start.
- **Resilient by default.** If the database is unreachable, visitors keep
  seeing the cached site instead of an error.
- **Secure admin.** Sessions use an httpOnly, Secure cookie that JavaScript
  can't read. Login checks take the same time whether the email exists or not,
  and the API has rate limiting and strict CORS.
- **Cheap to run.** Vercel, MongoDB Atlas, Cloudinary and Resend all run on
  free tiers.
- **SEO basics.** Per-page titles, a canonical domain, `robots.txt`, a
  generated `sitemap.xml` and Search Console verification.

### 15 · Image — `09-mobile.jpg`

### 16 · Image — `10-work-pages.jpg`

### 17 · Text — Outcome
**Heading:** Outcome

manankmehta.com is live, and Manan maintains it himself: adding films and
campaigns, reordering the hero and answering enquiries from the admin panel.
✎ confirm / add a real result if you have one (e.g. “first enquiry within
X weeks”, a client quote). Leave this line out if not.

---

## SEO

| Field | Value |
|---|---|
| **Title** (49 / 60) | `Manan Mehta Composer Portfolio & CMS — Case Study` |
| **Description** (154 / 155) | `How I designed and built manankmehta.com: a dark, cinematic portfolio for a Mumbai film composer, with a custom CMS for films, ads, credits and enquiries.` |
| **Image** | `og-image-1200x630.jpg` (1200 × 630, dark treatment as your form asks) |
| **Noindex** | Leave unchecked |

## Sidebar

| Field | Value |
|---|---|
| **Slug** | `manan-mehta-composer-portfolio` |
| **Category** * | Web Design & Development |
| **Featured** | ✓ (it's a real, live client build with a CMS, which makes it a strong home-page piece) |
| **Order** * | `1` (or wherever it ranks among your projects) |
| **Published At** | The day you publish |

---

## Screenshot guide

A caption (short, for under the image), alt text (for accessibility and SEO)
and a fuller explanation for every image, so you can use whichever fits the
block.

### 01-cover.jpg
- **Caption:** The live site and its CMS, side by side.
- **Alt:** The manankmehta.com home page with the Jigra poster behind the composer's name, overlapped by the admin panel's banner editor and the mobile home page.
- **Explanation:** The project in one frame. On the left, the live home page:
  the composer's name set large in Oswald over a rotating banner of his films
  and ads, here the *Jigra* poster. On the right, the admin screen that
  controls that banner, and the same home page on a phone.

### 02-public-site.jpg
- **Caption:** Films, Ads and About share one dark, amber-accented system.
- **Alt:** Three pages of manankmehta.com — Film & TV, Advertising and About — layered in browser windows on a warm background.
- **Explanation:** Each page opens the same way: a small amber label, a
  condensed headline and a short introduction, then the work. That consistency
  is what makes a poster grid, a brand reel and a biography feel like one site.

### 03-home-work.jpg
- **Caption:** Below the hero, the work does the talking.
- **Alt:** The Film Scores section of the manankmehta.com home page showing posters for Jigra, Happy Patel: Khatarnak Jasoos, Raftaar, RBI Unlocked, Aakhri Ride and Bombay Mon Amour.
- **Explanation:** The home page's "Film Scores" section shows each film as its
  full poster with a role badge (e.g. *Additional Music*), type, year and a
  one-line description, with "View all films" leading to the Films page. The
  advertising section follows the same pattern with video stills.

### 04-enquiries.jpg
- **Caption:** A visitor's brief, and where it lands.
- **Alt:** The public contact form beside the admin Messages inbox showing an opened enquiry with Reply, Mark unread and Delete actions.
- **Explanation:** The live Contact page pairs the form with cards for email,
  phone, WhatsApp and Instagram, all edited from Settings. The form asks for
  name, email, project type and a brief. Each submission is saved to the admin inbox (unread ones get an amber
  dot and a count in the sidebar) and emailed to the client. Opening a message
  shows the project type, and **Reply** opens a pre-addressed email. *The
  enquiries shown are sample data.*

### 05-admin-dashboard.jpg
- **Caption:** The admin dashboard: counts, unread enquiries and a quick guide.
- **Alt:** The Manan Mehta content manager dashboard showing counts for films, ads, credits and unread messages, and a quick guide.
- **Explanation:** The first screen after login. Four tiles link to Films &
  TV (7), Ads (9), Credits (15) and Messages and show how many of each exist. The quick
  guide below explains what every section controls, in one line each. The
  sidebar lists all ten screens: Dashboard, Home & Banner, Films, Ads, Credits,
  About Page, Contact Page, Messages, Page Visibility and Settings.

### 06-admin-banner.jpg
- **Caption:** Choosing which films and ads play behind the hero.
- **Alt:** The Home page editor's Banner section, listing five selected projects with reorder arrows and a grid of all films and ads to add or remove.
- **Explanation:** The **Banner** section lists the projects currently in
  the hero (Jigra, Happy Patel: Khatarnak Jasoos, Sports Bag – Fuwo World,
  Aakhri Ride and the Volvo C40 Recharge spot), with up/down arrows to
  reorder and × to remove. Below,
  every film and ad appears as a tile, and clicking one adds or removes it.
  “Seconds per slide” sets the rotation speed. Further down the same screen
  are **Hero text** (small heading, tagline, both button labels),
  **Introduction** (two-line heading with the amber second line, body, button,
  service cards), **Section headings** and the **Closing call to action**.

### 07-admin-edit-film.jpg
- **Caption:** Every film in one list; every detail in one dialog.
- **Alt:** The Films & TV admin list with reorder, visibility, edit and delete controls, and the Edit film dialog open for Jigra.
- **Explanation:** The list (left) shows each film's cover, title, type and
  year, with arrows to reorder, an eye to hide, a pencil to edit and a bin to
  delete. The **Edit film** dialog (right) holds Title, Type, Year, Director,
  Genre, **Your role** (e.g. “Additional Music”; leave it blank to hide the
  badge), Description, a **Cover image** (upload or paste a URL; it's also the
  banner background if featured), a SoundCloud playlist URL, a list of Tracks
  and a Visible switch. Ads use the same pattern with Brand, Type, Duration
  and a YouTube video ID. Credits add Role and Director, without images.

### 08-admin-control.jpg
- **Caption:** Switch pages off, and manage contact, social and SEO details.
- **Alt:** The Page Visibility screen with toggles for Films, Ads, About, Credits and Contact, overlapped by the Settings screen.
- **Explanation:** **Page Visibility** has one switch per page. Turning one
  off removes it from the menu, makes its URL redirect home and takes it out
  of the sitemap, while its content stays editable. The home page is always
  on. It's in real use: Manan currently has Credits switched off, which is
  why that page doesn't appear on the live site. **Settings** groups Identity (name, title, tagline), Contact details
  (email, location, phone, and WhatsApp with a country-code hint), Social links
  (Instagram, Spotify, IMDb), Search engines (page title and description) and
  Your login (change password).

### 09-mobile.jpg
- **Caption:** The same site at phone width.
- **Alt:** Three phones showing the Home, Film & TV and Contact pages of manankmehta.com.
- **Explanation:** At 390 px the navigation collapses into a menu button, the
  headlines scale down without losing their weight, posters run full width,
  the filters become a swipeable row of chips, and the contact details stack
  into large cards: tap the phone number to call, or WhatsApp to chat.

### 10-work-pages.jpg
- **Caption:** Films and Ads: filterable grids of posters and video stills.
- **Alt:** The Films & TV poster grid and the Advertising page's brand strip and video stills on manankmehta.com.
- **Explanation:** Films filter by type and switch between grid and list.
  Ads add a brand strip and brand filters, and each card opens its YouTube
  spot in a player without leaving the page.

### 11-film-detail.jpg
- **Caption:** Each film opens with its score, ready to play.
- **Alt:** The Jigra detail view on manankmehta.com: poster banner, type, year, genre, director, description and a two-track Original Score list.
- **Explanation:** Clicking a film opens a detail view with its type, year,
  genre, director and description, followed by the **Original Score** track
  list and a link to the full SoundCloud playlist.

### og-image-1200x630.jpg
- **Use:** SEO → Image (Open Graph). Dark background, as your form asks,
  because link previews have no theme context.

---

## Note

Every image is final. One ad ("Khushiyon Ka Check") has its thumbnail on
Cloudinary, which the capture environment couldn't reach; that card isn't
visible in any of the final crops.
