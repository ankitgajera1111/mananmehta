# Site icons

Everything in `public/` is derived from two hand-edited SVGs. The PNG/ICO files
are build outputs that happen to be committed (the CRA build just copies
`public/` verbatim, so there is no step that could generate them at deploy
time). This file lives outside `public/` so it does not get deployed with them.

## Sources — edit these

| File                | Shape                            | Used for                        |
| ------------------- | -------------------------------- | ------------------------------- |
| `favicon.svg`       | Amber disc, transparent corners  | Browser tab, and `favicon.ico`  |
| `icon-maskable.svg` | Full-bleed dark square + disc    | All the PNG app icons           |

The square version exists because iOS and Android draw their own shape around
the icon: a floating circle on a transparent background ends up as a circle
inside a rounded rectangle. The disc is 80% of the canvas, which is Android's
maskable safe zone, so nothing important gets cropped.

## Generated — do not hand-edit

| File                   | From                | Referenced by                  |
| ---------------------- | ------------------- | ------------------------------ |
| `favicon.ico`          | `favicon.svg`       | `index.html` (16/32/48 frames) |
| `apple-touch-icon.png` | `icon-maskable.svg` | `index.html` (180×180, opaque) |
| `icon-192.png`         | `icon-maskable.svg` | `site.webmanifest`             |
| `icon-512.png`         | `icon-maskable.svg` | `site.webmanifest`             |

## Regenerating

After editing either SVG, from `frontend/public/`:

```sh
pip install pillow cairosvg
python3 - <<'PY'
import io
import cairosvg
from PIL import Image

def render(svg, size):
    png = cairosvg.svg2png(url=svg, output_width=size, output_height=size)
    return Image.open(io.BytesIO(png)).convert("RGBA")

sizes = [16, 32, 48]
render("favicon.svg", 48).save(
    "favicon.ico", sizes=[(s, s) for s in sizes]
)
# iOS wants no alpha channel, so flatten this one to RGB.
render("icon-maskable.svg", 180).convert("RGB").save(
    "apple-touch-icon.png", optimize=True
)
for s in (192, 512):
    render("icon-maskable.svg", s).save(f"icon-{s}.png", optimize=True)
PY
```

Check the 16×16 frame of `favicon.ico` afterwards — it is the size that breaks
first if the note's strokes get any thinner.
