# PoisonGuard Hero Animation — Archived Prototype

This is an **archived Claude Design PoisonGuard hero animation prototype**.

- **It is not wired into production.** Nothing imports these files.
- The **live PoisonGuard page uses `ProductHero3D`** (the 3D scanning-platform
  model hero), not this animation.
- This prototype is **CSS-only** and kept purely for **visual / animation
  reference**.
- **Do not import it into production** without a separate review branch.
- Created from the existing (unwired) `src/components/PoisonGuardHero.jsx` /
  `PoisonGuardHero.css` — the approved Claude Design export.

## Contents

| File | Purpose |
| --- | --- |
| `PoisonGuardHero.prototype.jsx` | Snapshot of the animated hero component |
| `PoisonGuardHero.prototype.css` | Snapshot of its self-contained styles |

The only change from the source component is the CSS import path
(`./PoisonGuardHero.prototype.css`). Everything is scoped under
`.poison-guard-hero`, uses lightweight CSS animations only, and has no external
library requirements.

## Not production

This folder is a reference archive. The production hero lives in
`src/components/ProductHero3D.jsx` and `src/data/productHero3D.js`
(`poisonguard` config), rendered by `src/pages/PoisonGuard.jsx`. Do not change
that setup to use this prototype without an explicit, reviewed branch.
