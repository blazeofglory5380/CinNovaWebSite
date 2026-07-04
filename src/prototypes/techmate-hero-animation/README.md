# TechMate AI Hero Animation — Prototype

An animated hero for the TechMate AI product page built on the **approved concept
image** `design-exports/techmate-hero-concept/techmate-hero-approved-v1.png`.

- **Prototype / reference only** — **not wired into production.** The live
  TechMate page still uses `ProductHero3D`.
- **Base visual = the actual approved PNG** (served from
  `public/prototypes/techmate/techmate-hero-approved-v1.png`), not a CSS
  recreation.
- **Animated overlays** are layered on top with `mix-blend-mode: screen`, so they
  only add light (glow/shimmer) without obscuring the baked-in headline or desk.
- React + CSS only. No external libraries, no video, no 3D. Scoped under
  `.tmx-hero`; keyframes `tmx-`-prefixed. Responsive + honors
  `prefers-reduced-motion`.

## Contents

| File | Purpose |
| --- | --- |
| `TechMateHero.prototype.jsx` | The hero component (`<TechMateHero />`) |
| `TechMateHero.prototype.css` | Base-image layout + animated glow overlays |

The image must be present at `public/prototypes/techmate/techmate-hero-approved-v1.png`
(served at `/prototypes/techmate/techmate-hero-approved-v1.png`).

## Usage

```jsx
import TechMateHero from "./prototypes/techmate-hero-animation/TechMateHero.prototype.jsx";

<TechMateHero primaryHref="#waitlist" secondaryHref="#waitlist" />
```

Props `primaryHref` / `secondaryHref` wire the transparent hotspots over the
image's "Get TechMate AI" and "Join Waitlist" buttons.

## What's animated (overlays on the image)

- Blue + purple ambient glow pulses; a soft light shimmer sweeping the scene.
- AI-core / orb glow and a brighter, blinking **robot eye glow**.
- Expanding energy rings from the core (reads as pulsing connection lines).
- Floating status-card glow; laptop "System Scan" and phone "Device Care" screen
  glow; a pulsing **purple desk-edge glow**.

Because the source art is flattened, the robot head is **not** moved — glow,
shimmer, eye pulse, and light motion are used instead (per the brief).

## Not production

The production TechMate hero is `src/pages/TechMateAI.jsx` → `ProductHero3D`
(`productHero3D.js` `techmate` config). Do not swap this prototype in without an
explicit, reviewed branch. Preview route (experiment branch only):
`?page=techmate-hero-prototype`.
