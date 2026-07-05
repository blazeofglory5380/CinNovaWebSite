# Meshy Asset Plan

Purpose: connect the external Meshy pipeline (`G:\CinNova Assets\Meshy`) to the in-repo folders under `public/images` and `public/models` without moving or rewiring production assets in this phase.

## Pipeline overview

```
Meshy (generate) → G:\CinNova Assets\Meshy\{Completed|In Progress}\{Project}
                 → optimize (Draco) → public/models/...
                 → poster capture / source PNG → public/images/...
                 → wire in src/data/*.js (separate phase)
```

## Meshy workspace (external — source of truth for WIP)

| Location | Contents |
|----------|----------|
| `G:\CinNova Assets\Meshy\Completed\` | Finished assets by project (Real Estate AI, StudyNest, PoisonGuard, etc.) |
| `G:\CinNova Assets\Meshy\Completed\Brand DNA\` | AI Core, tokens, materials, logos |
| `G:\CinNova Assets\Meshy\In Progress\` | Active generation sessions |
| `G:\CinNova Assets\Meshy\Exports\` | GLB, FBX, OBJ, USDZ, textures |
| `G:\CinNova Assets\Meshy\Prompt Library\` | Reusable prompts |

## In-repo drop zones (this phase)

| Repo folder | Meshy project | Status |
|-------------|---------------|--------|
| `public/models/cinnova-core/` | Brand DNA → AI Core | **Production** — Home hero |
| `public/models/product-heroes/` | Per-product hero scenes | **Production** — StudyNest, PoisonGuard, Real Estate (partial) |
| `public/models/real-estate-ai/` | Real Estate AI farmhouse | **Production** — dual-model transformation |
| `public/models/kiddo/` | Kiddo companion | **Production** — KiddoHero |
| `public/models/products/{product}/` | All products | **Staging** — empty, README only |
| `public/models/games/nightmare-forest/` | Nightmare Forest | **Staging** — empty |
| `public/images/products/{product}/` | Hero PNGs, marketing | Mixed — some approved heroes live here |
| `public/images/product-heroes/posters/` | Generated from sources | Build script; one custom poster tracked |

## Current approved Meshy-derived assets

| Asset | Repo path | Meshy origin |
|-------|-----------|--------------|
| AI Core v2 (web) | `public/models/cinnova-core/CinNova_AI_Core_v2.web.glb` | Brand DNA / AI Core |
| StudyNest library | `public/models/product-heroes/studynest-campus-library.web.glb` | Completed / StudyNest |
| PoisonGuard scanner | `public/models/product-heroes/poisonguard-plant-scanner.web.glb` | Completed / PoisonGuard |
| Real Estate farmhouse (master) | `public/models/product-heroes/realestateai-farmhouse-transformation.glb` | Completed / Real Estate AI |
| Farmhouse before/after | `public/models/real-estate-ai/*.glb` | Real Estate AI |
| Kiddo companion | `public/models/kiddo/kiddo-companion.glb` | Completed / Kiddo |

Masters (`*.glb` without `.web`) and reference PNGs are gitignored — regenerate web assets with `npm run optimize:core-model` / gltf-transform per `public/models/cinnova-core/README.md`.

## Future Meshy → repo workflow

1. **Complete** in Meshy under `Completed/{Project}/`
2. **Export** GLB to `Exports/GLB/`; keep master locally
3. **Optimize** to `{name}.web.glb` (Draco, ≤ target poly/size)
4. **Drop** web GLB in `public/models/products/{slug}/` for review
5. **Capture poster** (model-viewer screenshot or source PNG) → `public/images/products/{slug}/` or posters folder
6. **Approve** — add row to product visual roadmap
7. **Wire** — update `productHero3D.js` / hero components in a follow-up PR (not this phase)

## Assets still needed from Meshy

| Product | Scene | Priority |
|---------|-------|----------|
| TechMate | Data-center / support desk hero | High — config references GLB |
| Kiddo | Kids learning / play hero (product-heroes slot) | Medium |
| Home | Customer communication scene (optional; home uses AI Core today) | Low |
| Real Estate | Merged v2 transformation GLB | High — see v2 workflow doc |
| Nightmare Forest | Game environment + characters | Future — game not on site yet |
| CinNova site | Blog/resource/social template props | Medium |

## Naming rules (Meshy → repo)

| Type | Convention | Example |
|------|------------|---------|
| Master GLB | `{product}-{scene}.glb` | `studynest-campus-library.glb` |
| Web GLB | `{same}.web.glb` | `studynest-campus-library.web.glb` |
| Poster PNG | `{same-base}.png` in `product-heroes/posters/` | `studynest-campus-library.png` |
| Approved 2D hero | `{product}-hero-approved-v1.png` | `techmate-hero-approved-v1.png` |
| Version folders in Meshy | `v1`, `v1.0` under project | Match Brand DNA token layout |

## Commands (repo)

- `npm run setup:product-hero-posters` — regenerate poster PNGs during build
- `npm run optimize:core-model` — compress AI Core for web
- See `docs/product-hero-3d-production-guide.md` for full hero pipeline

## Do not (this phase)

- Move files out of `public/models/real-estate-ai/`, `cinnova-core/`, or `Kiddo/`
- Change paths in `src/data/productHero3D.js` or hero components
- Commit large master GLBs (use `.gitignore` patterns already in place)
