# Kiddo Character Library

Production-ready character portraits for the Kiddo landing page and future product UI.

## Add finished PNGs here

| File | Character |
|------|-----------|
| `kiki.png` | Kiki |
| `spark.png` | Spark |
| `byte.png` | Byte (Pixel Fox) |
| `professor-hoot.png` | Professor Hoot |
| `penny-panda.png` | Penny Panda |
| `captain-leo.png` | Captain Leo |
| `splash.png` | Splash |
| `nova.png` | Nova |

## Guidelines

- **Format:** PNG with transparent background (or full-bleed portrait on solid color matching the card)
- **Do not** use placeholder SVGs, auto-crops, or wireframe exports as final assets
- **Reference only:** approved concept sheets live in `../concept/` — export dedicated portraits from design tools
- **Suggested size:** at least 512×512 px (displayed at 96×96 px in circular frames on the landing page)

## Landing page mapping

The Meet the Characters section uses five cards today. Asset paths are wired in `src/data/kiddoAssets.js`:

| Page card | Library file |
|-----------|----------------|
| Luna | `kiki.png` |
| Oliver | `professor-hoot.png` |
| Nova | `nova.png` |
| Coral | `splash.png` |
| Max | `penny-panda.png |

`spark.png`, `byte.png`, and `captain-leo.png` are registered in the library for upcoming sections and product UI. Missing files show a graceful on-page fallback until each PNG is added.
