# TechMate AI Hero Animation — Prototype

An animated, cinematic hero section for the TechMate AI product page, built from
the approved concept `design-exports/techmate-hero-concept/techmate-hero-approved-v1.png`.

- **Prototype / reference only** — **not wired into production.** Nothing imports
  these files, and the live TechMate page still uses `ProductHero3D`.
- **React + CSS only.** No external libraries, no images, no video, no 3D / GLB /
  model-viewer. The scene is pure CSS + inline SVG.
- Everything is scoped under `.tmx-hero` and every keyframe is `tmx-`-prefixed,
  so it can be dropped anywhere without leaking styles.
- **Responsive** (stacks under ~980px) and honors **`prefers-reduced-motion`**
  (holds a calm, glowing idle state — no looping motion).

## Contents

| File | Purpose |
| --- | --- |
| `TechMateHero.prototype.jsx` | The hero component (`<TechMateHero />`) |
| `TechMateHero.prototype.css` | Its self-contained styles + animations |

## Usage

```jsx
import TechMateHero from "./prototypes/techmate-hero-animation/TechMateHero.prototype.jsx";

<TechMateHero primaryHref="#waitlist" secondaryHref="#waitlist" />
```

Props: `primaryHref`, `secondaryHref` (both default to `"#"`).

## What's animated

- Hero fades in on load.
- Blue/purple/cyan ambient background glows pulse and shimmer.
- Orb rings rotate; the core and inner ring pulse ("powers on").
- The black robot face gently tilts/turns its head; eyes glow and blink subtly;
  it smiles. Eye glow color is cyan (`--tmx-eye`).
- Floating status cards fade in (staggered) and bob gently; connection lines
  pulse with a dashed flow.
- The laptop "System Scan" ring spins and a scan sweep runs; the desk-edge glow
  shimmers in purple/magenta.

## Not production

The production TechMate hero is `src/pages/TechMateAI.jsx` → `ProductHero3D`
(`productHero3D.js` `techmate` config). Do not swap this prototype in without an
explicit, reviewed branch. Navbar, footer, routing, and the rest of the page are
untouched by this prototype.
