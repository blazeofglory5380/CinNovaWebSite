# PoisonGuard Hero Prototypes — experiment branch only

Two isolated PoisonGuard hero prototypes live here. **Neither is wired into
production** — the live PoisonGuard page uses the 3D `ProductHero3D` hero
(`src/data/productHero3D.js` `poisonguard` config, rendered by
`src/pages/PoisonGuard.jsx`).

## 1. Approved-image review hero (current)

Built from the approved concept image
`design-exports/poisonguard-hero-concept/poisonguard-hero-approved-v1.png`
(copied to `public/prototypes/poisonguard/poisonguard-hero-approved-v1.png`,
served at `/prototypes/poisonguard/...`).

| File | Purpose |
| --- | --- |
| `PoisonGuardHeroReview.prototype.jsx` | Hero component (`<PoisonGuardHeroReview />`) |
| `PoisonGuardHeroReview.prototype.css` | Cropped-image layout + animated overlays |

- **Base visual = the actual approved PNG** (cropped to the right ~68% so the
  baked-in left text is clipped out and replaced by real HTML copy).
- **Real HTML left column:** eyebrow, headline, subtext, real Join Waitlist /
  Safety Resources buttons, and the Families / Pets / Schools benefits.
- **Animated overlays** (`mix-blend-mode: screen`, additive light): emerald scan
  rings + beam, leaf pulse, amber base warning lights, per-card glow, hologrid
  shimmer, ambient emerald/amber breathing, and a lens/core glow that parallaxes
  toward the cursor.
- React + CSS only, scoped under `.pgr-hero`, responsive,
  `prefers-reduced-motion` aware.

Preview route (experiment branch only): **`?page=poisonguard-hero-review`**

```jsx
import PoisonGuardHeroReview from "./prototypes/poisonguard-hero-animation/PoisonGuardHeroReview.prototype.jsx";

<PoisonGuardHeroReview primaryHref="#waitlist" secondaryHref="/?page=resources" />
```

## 2. Archived CSS animation (reference)

`PoisonGuardHero.prototype.{jsx,css}` — an earlier CSS-only animated hero
snapshot (scoped under `.poison-guard-hero`), kept for reference. Not routed.

## Not production

Do not swap either prototype into the live PoisonGuard page without an explicit,
reviewed branch.
