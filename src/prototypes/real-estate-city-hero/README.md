# Real Estate AI City Hero — review prototype (experiment branch only)

A **review-only** full-bleed hero for the Real Estate AI product, built from the
approved moonlit-city concept image. **Not wired into production** — the live
Real Estate page keeps its 3D `ProductHero3D` hero.

## Files

| File | Purpose |
| --- | --- |
| `RealEstateCityHeroReview.prototype.jsx` | Hero component (`<RealEstateCityHeroReview />`) |
| `RealEstateCityHeroReview.prototype.css` | Full-bleed layout + cinematic overlays |

Base image: `design-exports/real-estate-hero-concept/real-estate-ai-city-hero-approved-v1.png`
(copied to `public/prototypes/real-estate/real-estate-ai-city-hero-approved-v1.png`,
served at `/prototypes/real-estate/...`).

## Design

- **The approved image is the entire hero background** (`object-fit: cover`,
  full width/height — never boxed). A left-weighted dark scrim keeps the real
  HTML copy readable.
- **Real HTML left column:** eyebrow (CinNova Real Estate AI), headline, sub,
  real "Explore Real Estate AI" / "View Dashboard" buttons, and the
  Market Signals / Deal Scoring / Investment Insights proof points.
- **Floating intelligence cards** (lower-right): Market Heat · Deal Score ·
  Rent Potential · Risk Level.
- **Subtle cinematic overlays** (`mix-blend-mode: screen`): moon + moonlit-water
  breathing glow, right-bridge + car-trail glow, city-light shimmer sweep, a
  faint AI grid, pulsing market nodes, and slow scanning arcs from the central
  tower.
- React + CSS only, scoped under `.rex-hero`, responsive,
  `prefers-reduced-motion` aware.

Preview route (experiment branch only): **`?page=real-estate-hero-review`**

```jsx
import RealEstateCityHeroReview from "./prototypes/real-estate-city-hero/RealEstateCityHeroReview.prototype.jsx";

<RealEstateCityHeroReview primaryHref="#" secondaryHref="#" />
```

## Not production

Do not swap this prototype into the live Real Estate page without an explicit,
reviewed branch.
