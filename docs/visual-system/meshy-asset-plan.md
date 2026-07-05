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

## Real Estate AI Meshy plan

External workspace: `G:\CinNova Assets\Meshy\Completed\Real Estate AI` (and `In Progress\Real Estate AI`).

**Production rule:** the live website hero is the **city illustration** (`real-estate-ai-city-hero-approved-v1.png`). All Meshy work below is for marketing, app surfaces, and the optional farmhouse 3D slot — none of it replaces the city hero without an explicit approval phase.

### Scene catalog

| Scene | Description | Meshy folder | Repo staging | Priority |
|-------|-------------|--------------|--------------|----------|
| **3D city block** | Low-poly city grid, 4–8 buildings, readable from aerial angle, neutral daylight | `Completed/Real Estate AI/City Block/v1/` | `models/products/real-estate/realestateai-city-block.web.glb` | P1 |
| **Glowing property pin set** | 3–5 map pins (rose glow, glass stem), separate meshes for animation | `Completed/Real Estate AI/Property Pins/v1/` | `models/products/real-estate/realestateai-property-pins.web.glb` | P1 |
| **Modern house + data overlays** | Single residential model, frosted HUD panels (ARV, cap rate, rehab cost) | `Completed/Real Estate AI/House Data Overlay/v1/` | `models/products/real-estate/realestateai-house-data-overlay.web.glb` | P2 |
| **Investor dashboard room** | Desk + monitors showing abstract charts, city view through window | `Completed/Real Estate AI/Investor Room/v1/` | `models/products/real-estate/realestateai-investor-dashboard-room.web.glb` | P3 |
| **Farmhouse transformation** | Before/after diorama (v2 spec) | `Completed/Real Estate AI/Farmhouse/v2/` | `models/product-heroes/realestateai-farmhouse-transformation-v2.glb` | P2 |

### 3D city block model

- **Scale:** platform ~2 m diameter; buildings 0.3–0.8 m tall for diorama readability
- **Materials:** matte white concrete base, glass curtain walls, subtle emissive window grids
- **Camera:** 45° aerial, hero-safe 360° orbit
- **Animation (optional):** slow turntable or pin pulse — clip name `Orbit` or `Idle`
- **Poster:** capture to `public/images/products/real-estate/realestateai-city-block-poster-v1.png`
- **Use:** app map marketing, feature sections, social video stills — **not** live page hero

### Glowing property pin set

- **Meshes:** pin base, stem, head, glow halo (separate for emissive control)
- **Colors:** rose `#ec4899` primary glow, blue `#2563eb` secondary for selected state
- **Variants:** default, selected, alert (3 materials or 3 objects)
- **Export:** single GLB with named nodes `Pin_Default`, `Pin_Selected`, `Pin_Alert`
- **Use:** compositing on city block, 2D map mockups, Lottie/video exports

### Modern house with data overlays

- **House:** contemporary suburban, white siding, black frames — distinct from farmhouse v2
- **Overlays:** 2–4 frosted panels floating near roofline; bake labels at 1024px
- **Lighting:** studio key + rose/blue rim (match farmhouse v2 spec)
- **Animation:** subtle panel fade-in loop (6 s), clip `DataReveal`
- **Use:** dashboard mockup companion, report covers, `#features` section art

### Investor dashboard room

- **Set:** minimal office, dual monitors, keyboard, chair silhouette
- **Screens:** abstract chart textures (no real data), emissive screen planes
- **Window:** optional city block visible outside (reuse city block asset)
- **Poly budget:** ≤ 80k tris web target after Draco
- **Use:** “built for investors” marketing, newsletter hero, future app landing

### Farmhouse transformation — archive & rollback notes

| Version | File | Status | Action |
|---------|------|--------|--------|
| **v1 procedural** | `models/product-heroes/realestateai-farmhouse-transformation.glb` | Rejected for production | **Keep as archive** — do not delete; not wired to live hero |
| **Dual-model (live support)** | `models/real-estate-ai/farmhouse-old-decrepit.glb`, `farmhouse-modern-renovated.glb` | Production support assets | **Do not move** — used by transformation config |
| **v2 (target)** | `models/product-heroes/realestateai-farmhouse-transformation-v2.glb` | Not shipped | Drop when DCC quality approved |
| **Poster (custom)** | `images/product-heroes/posters/realestateai-farmhouse-transformation.png` | Tracked, build-respected | Regenerate only via approved capture |

**Rollback:** if v2 fails review, live page remains on **city hero** (2D). Farmhouse poster/GLB stack stays dormant — no revert of city hero required.

Workflow detail: `docs/realestateai-farmhouse-hero-v2-workflow.md`.

### Export formats & naming (Real Estate AI)

| Stage | Format | Location | Naming |
|-------|--------|----------|--------|
| Meshy export | GLB (master) | `G:\...\Exports\GLB\` | `realestateai-{scene}-master.glb` |
| Blender polish | GLB (master) | Meshy project `Models/` | same base name |
| Web production | GLB + Draco | `public/models/products/real-estate/` | `realestateai-{scene}.web.glb` |
| Optional AR | USDZ | Meshy `Exports/USDZ/` | `realestateai-{scene}.usdz` |
| Source textures | PNG | Meshy `Textures/PBR/` | `{scene}_BaseColor.png`, `_Normal.png`, etc. |
| Poster | PNG | `public/images/products/real-estate/` or `product-heroes/posters/` | `realestateai-{scene}-poster-v1.png` |
| Prompt archive | TXT/MD | Meshy `Prompt/` | `{scene}-prompt-v1.md` |

**Scene slugs:** `city-block`, `property-pins`, `house-data-overlay`, `investor-dashboard-room`, `farmhouse-transformation`.

**Optimize before commit:**

```bash
npx gltf-transform optimize realestateai-{scene}-master.glb realestateai-{scene}.web.glb --compress draco
```

Masters stay local or in Meshy — follow `.gitignore` patterns for `product-heroes` masters.

---

## Assets still needed from Meshy

| Product | Scene | Priority |
|---------|-------|----------|
| **Real Estate AI** | City block + property pins | **P1** — see [Real Estate AI Meshy plan](#real-estate-ai-meshy-plan) |
| **Real Estate AI** | Farmhouse v2 transformation GLB | **P2** — v2 workflow doc |
| **Real Estate AI** | House data overlay, investor room | **P2–P3** |
| TechMate | Data-center / support desk hero | High — config references GLB |
| Kiddo | Kids learning / play hero (product-heroes slot) | Medium |
| Home | Customer communication scene (optional; home uses AI Core today) | Low |
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
