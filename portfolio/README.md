# Portfolio assets

Screenshots and case-study copy for presenting this project on
ankitgajera.com. Not part of the website. `.vercelignore` keeps this folder out
of deployments.

```
CASE_STUDY.md           Copy for every field of the "Add project" form, plus
                        caption / alt text / explanation for each image
screenshots/final/      Edited images to upload (2400×1500 JPG, 16:10)
  01-cover.jpg … 11-film-detail.jpg
  og-image-1200x630.jpg Open Graph image (SEO → Image)
screenshots/raw/        Unedited captures at 2× (1440×900 desktop, 390×844 phone)
                        *-full.png are full-page captures
tools/capture.mjs       Takes the raw screenshots from a locally running site
tools/compose.mjs       Frames raw shots into the final images
```

## Regenerating

1. Start the site locally (see the root `README.md`): backend on `:8001` with
   `USE_MEMORY_DB=1`, frontend `yarn start` on `:3000`. Restart the backend
   before each capture so the in-memory inbox starts empty.
2. From the repository root, with Playwright available (`npm i -D playwright`
   somewhere on the module path):

   ```bash
   node portfolio/tools/capture.mjs     # → screenshots/raw
   node portfolio/tools/compose.mjs     # → screenshots/final
   node portfolio/tools/compose.mjs 07  # just one composition
   ```

   To shoot the public pages from the **live site** instead (real content and
   artwork), set `PUBLIC_URL`; the admin panel and sample enquiries stay local:

   ```bash
   PUBLIC_URL=https://manankmehta.com node portfolio/tools/capture.mjs
   ```

`capture.mjs` posts three clearly labelled **sample** enquiries
(“Sample: …”, `@example.com`) so the Messages screens aren't empty.

### Posters

Film posters and ad thumbnails are hot-linked from filmfare.wwmindia.com,
m.media-amazon.com, image.tmdb.org, img.youtube.com and
customer-assets.emergentagent.com. When a host can't be reached, the capture
swaps in a dark gradient and lists the affected URLs in
`screenshots/raw/_placeholders.txt`. The current set was captured without
access to those hosts. Re-run both scripts on a normal connection to get the
real artwork in `10-work-pages`, `11-film-detail` and the banner thumbnails.

If Google Fonts is unreachable, point `LOCAL_FONTS` at a directory where
`@fontsource/oswald`, `@fontsource/inter`, `@fontsource/jetbrains-mono` and
`@fontsource/instrument-serif` are installed.
