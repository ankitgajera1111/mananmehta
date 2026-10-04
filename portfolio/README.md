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
screenshots/screens/    Every unedited screen as JPG, at 2× (1440×900 desktop,
                        390×844 phone), for case-study blocks that want a
                        plain screenshot. public-* and mobile-* come from the
                        live site, admin-* from a local copy loaded with live
                        content; *-full are full-page captures
screenshots/raw/        PNG working files the scripts write (git-ignored)
tools/sync-live.mjs     Loads the live site's content into the local backend
tools/capture.mjs       Takes the raw screenshots
tools/compose.mjs       Frames raw shots into the final images
```

## Regenerating

1. Start the site locally (see the root `README.md`): backend on `:8001` with
   `USE_MEMORY_DB=1`, frontend `yarn start` on `:3000`. Restart the backend
   before each admin capture so the in-memory inbox starts empty.
2. From the repository root, with Playwright available (`npm i -D playwright`
   somewhere on the module path):

   ```bash
   node portfolio/tools/sync-live.mjs                              # local admin ← live content
   PUBLIC_URL=https://manankmehta.com node portfolio/tools/capture.mjs
   node portfolio/tools/compose.mjs                                # → screenshots/final
   node portfolio/tools/compose.mjs 07                             # just one composition
   ```

   `ONLY=public` or `ONLY=admin` re-shoots one half. Without `PUBLIC_URL` the
   public pages are shot from the local copy instead.

Nothing is ever written to the live site: `sync-live.mjs` only reads its
`/api/content`, and the three clearly labelled **sample** enquiries
("Sample: …", `@example.com`) that fill the Messages screens go to the local
API.

Remote images that can't be fetched are replaced by a dark gradient and listed
in `screenshots/raw/_placeholders.txt`. In the current set that's one ad
thumbnail hosted on Cloudinary, which doesn't appear in any final image.

If Google Fonts is unreachable, point `LOCAL_FONTS` at a directory where
`@fontsource/oswald`, `@fontsource/inter`, `@fontsource/jetbrains-mono` and
`@fontsource/instrument-serif` are installed.
