# PoisonGuard Hero Prototypes

## 1. Approved image-based hero — PROMOTED TO PRODUCTION

The approved-image review hero that used to live here has been promoted to a
production component:

| Now (production) | Was (prototype) |
| --- | --- |
| `src/components/PoisonGuardHeroReview.jsx` | `PoisonGuardHeroReview.prototype.jsx` |
| `src/components/PoisonGuardHeroReview.css` | `PoisonGuardHeroReview.prototype.css` |
| `public/images/products/poisonguard/poisonguard-hero-approved-v1.png` | `public/prototypes/poisonguard/poisonguard-hero-approved-v1.png` |

It renders the PoisonGuard page hero (`?page=poisonguard`) via
`src/pages/PoisonGuard.jsx`. Source concept image:
`design-exports/poisonguard-hero-concept/poisonguard-hero-approved-v1.png`.

- **Base visual = the approved PNG** (cropped to the right ~70%; baked-in left
  text clipped out and replaced by real HTML copy). Frameless — an all-edge mask
  feathers the scene into the hero background.
- **Real HTML left column:** eyebrow, headline, subtext, real Join Waitlist /
  Safety Resources buttons, and the Families / Pets / Schools benefits.
- **Animated overlays** (`mix-blend-mode: screen`): emerald scan rings + beam,
  leaf breeze, amber base warning lights, per-card glow, hologrid shimmer,
  ambient emerald/amber breathing, drifting particles, and a lens/logo/core glow
  that parallaxes toward the cursor.
- React + CSS only, scoped under `.pgr-hero`, responsive,
  `prefers-reduced-motion` aware.

The temporary `?page=poisonguard-hero-review` preview route has been removed.

## 2. Archived CSS animation (reference)

`PoisonGuardHero.prototype.{jsx,css}` — an earlier CSS-only animated hero
snapshot (scoped under `.poison-guard-hero`), kept for reference. Not routed.

## Not production

The archived CSS animation (section 2) is reference-only. Do not swap it into the
live PoisonGuard page without an explicit, reviewed branch.
