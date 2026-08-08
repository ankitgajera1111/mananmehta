# Manan Mehta — Composer Portfolio

A React portfolio site backed by a FastAPI + MongoDB CMS, so all content is
edited from an admin panel instead of in code.

- **Public site** — `/`
- **Admin panel** — `/admin`

---

## What the client can edit

| Admin screen | Controls |
|---|---|
| Home & Banner | Which projects rotate in the hero, their order, rotation speed, and every piece of text on the home page |
| Films | Feature films, documentaries, shorts — including SoundCloud tracks |
| Ads | Commercial work, brands, YouTube video IDs |
| Credits | The filmography table (page counters recalculate themselves) |
| About | Biography, achievements, skills, process steps |
| Contact | Headings, enquiry-form dropdown options, FAQ |
| Messages | Enquiries from the contact form, with read/unread and reply |
| Settings | Name, email, social links, SEO text, and the admin password |

Every item has a **hide** toggle (the eye icon) — a way to take something off the
site without deleting it. Images accept **either a file upload or a pasted URL**.

---

## Running locally

Two terminals.

**Backend**

```bash
cd backend && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt && .venv/bin/uvicorn server:app --reload --port 8001
```

**Frontend**

```bash
cd frontend && yarn install && yarn start
```

Open http://localhost:3000 — the admin panel is at http://localhost:3000/admin.

### The local database

`backend/.env` ships with `USE_MEMORY_DB=1`, an in-process stand-in for MongoDB
so the project runs with nothing else installed. It is **RAM-only**: every
restart starts empty and re-seeds from `backend/app/seed_data.py`, and the login
is `admin@manankmehta.com` / `changeme123`.

To use a real database, set `USE_MEMORY_DB=0`, point `MONGO_URL` at it, and seed:

```bash
cd backend && .venv/bin/python seed.py
```

`seed.py` is idempotent — it upserts on stable ids and leaves existing documents
alone, so re-running never duplicates rows or overwrites the client's edits.
Use `--reset` to deliberately wipe and reload.

---

## Deploying to Vercel

### 1. Create the three free accounts

| Service | Free tier | What you need |
|---|---|---|
| [MongoDB Atlas](https://mongodb.com/atlas) | M0, 512 MB | Connection string |
| [Cloudinary](https://cloudinary.com) | 25 credits/mo | Cloud name, API key, API secret |
| [Resend](https://resend.com) | 3,000/mo, 100/day | API key + a verified sender domain |

In Atlas, add `0.0.0.0/0` to Network Access — Vercel's functions have no fixed IPs.

Cloudinary and Resend are both optional. Without Cloudinary the admin panel still
accepts pasted image URLs; without Resend, messages are still stored and readable
in the inbox, just not emailed.

### 2. Import the repository into Vercel

Leave the framework preset as **Other** — `vercel.json` already specifies the
build command, output directory and routing.

### 3. Set the environment variables

In *Project → Settings → Environment Variables* (full list in
`backend/.env.example`):

```
MONGO_URL              mongodb+srv://…
DB_NAME                manan_portfolio
JWT_SECRET             a long random string
ADMIN_EMAIL            the client's login email
CLOUDINARY_CLOUD_NAME  …
CLOUDINARY_API_KEY     …
CLOUDINARY_API_SECRET  …
RESEND_API_KEY         …
MAIL_FROM              noreply@yourdomain.com
CONTACT_NOTIFY_EMAIL   where enquiries should land
SITE_URL               https://manankmehta.com  (only if the domain changes)
```

Generate the secret with:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(48))"
```

The app **refuses to start** in production if `JWT_SECRET` is left at its
development default.

### 4. Seed production and create the login

Run once from your machine, pointed at Atlas:

```bash
cd backend && MONGO_URL="your-atlas-string" DB_NAME="manan_portfolio" USE_MEMORY_DB=0 .venv/bin/python seed.py
```

It prompts for the admin password rather than taking it on the command line, so
it stays out of your shell history. Afterwards the client can change it under
*Settings → Your login*.

---

## How it fits together

```
frontend/          React (CRA + craco), built to static files
  src/context/     ContentContext — fetches /api/content once, caches it
  src/admin/       The CMS. Code-split, so visitors never download it
backend/app/       FastAPI application
  routers/         public.py, auth.py, admin.py
  seed_data.py     Starting content (transcribed from the original mock.js)
api/index.py       Vercel entrypoint — serves the whole API as one function
vercel.json        Build, routing and caching
```

**One request for content.** The public site fetches `GET /api/content` — every
page, project and setting in a single response — and caches it in
`localStorage`. Repeat visitors paint instantly from that cache while it
revalidates in the background, which hides Vercel's Python cold start. If the
database is unreachable, visitors keep seeing cached content instead of an error.

**Images.** The browser uploads straight to Cloudinary using a signature minted
by the API, so image bytes never pass through the function. That sidesteps
Vercel's 4.5 MB request-body limit and 10 s timeout. Each image is stored as
`{url, publicId}`; `publicId` exists only for files we uploaded, which is how
deleting a project knows whether it may also delete the asset — a pasted URL may
be someone else's image and is never touched.

**Auth.** JWT in a `Secure`, `httpOnly` cookie — unreadable from JavaScript, so a
cross-site scripting bug cannot steal the session. Failed logins run a full
bcrypt comparison against a dummy hash, so a wrong email and a wrong password
take the same time and reveal nothing about which accounts exist.

---

## Known constraints

- **Vercel Hobby is non-commercial** per Vercel's terms. A portfolio that sells
  nothing is a grey area; if the site ever takes payments, it needs Pro.
- **Cold starts.** The first request after idle waits ~1–2 s for Python to boot.
  The single-request content design plus the localStorage cache keeps this off
  the critical path for returning visitors.
- **SEO.** Content arrives via JavaScript, so crawlers see an empty shell on
  first byte. Google renders JS and will index the site, but if search ranking
  becomes a priority the real fix is a Next.js migration.
- **`PressPage.jsx` is not routed** and still reads the old `src/data/mock.js`.
  Both are dead code, kept in case press coverage is wanted later. Everything
  else reads from the API.
- **`src/setupProxy.js` exists for a reason.** The `visual-edits` dev plugin
  installs `express.json()` on the dev server, which consumes request bodies
  before a simple `"proxy"` field can forward them, hanging every POST. That file
  restores the body. Development only — production needs no proxy.
