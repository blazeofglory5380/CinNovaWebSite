# Real Estate AI City Hero — PROMOTED TO PRODUCTION

The approved full-bleed moonlit-city hero that used to live here has been promoted
to a production component. This folder is kept only as an archival note.

| Now (production) | Was (prototype) |
| --- | --- |
| `src/components/RealEstateCityHero.jsx` | `RealEstateCityHeroReview.prototype.jsx` |
| `src/components/RealEstateCityHero.css` | `RealEstateCityHeroReview.prototype.css` |
| `public/images/products/real-estate/real-estate-ai-city-hero-approved-v1.png` | `public/prototypes/real-estate/real-estate-ai-city-hero-approved-v1.png` |

It renders the Real Estate page hero (`?page=real-estate`) via
`src/pages/RealEstate.jsx`. Source concept image:
`design-exports/real-estate-hero-concept/real-estate-ai-city-hero-approved-v1.png`.

## Design

- **The approved image is the entire hero background** (`object-fit: cover`,
  full width/height — never boxed). A left-weighted dark scrim keeps the real
  HTML copy readable.
- **Real HTML left column:** eyebrow (CinNova Real Estate AI), headline, sub,
  real "Explore Real Estate AI" (→ `#features`) / "View Dashboard" (→ `#tools`)
  buttons, and the Market Signals / Deal Scoring / Investment Insights proof
  points.
- **Floating intelligence cards** (lower-right): Market Heat · Deal Score ·
  Rent Potential · Risk Level.
- **Cinematic overlays** (`mix-blend-mode: screen`): threshold light bloom (every
  light glows in its own colour), slow drifting sky clouds, an alternating
  warm-light "living pulse" (left/right/center zones) with matching warm water
  reflections, moon + blue-white water glow, faint AI grid, pulsing market nodes,
  and scanning arcs.
- React + CSS only, scoped under `.rex-hero`, responsive,
  `prefers-reduced-motion` aware.

The temporary `?page=real-estate-hero-review` preview route has been removed.

`ProductHero3D` and `productHero3DConfigs["real-estate"]` are retained in the
codebase for rollback.
