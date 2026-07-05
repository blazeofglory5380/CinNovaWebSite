# Product Visual Roadmap

Purpose: track approved and planned visuals per CinNova product app — heroes, marketing, characters, and 3D — while keeping all existing production paths unchanged.

## Asset categories (per product)

| Layer | Images | Models | Wired in |
|-------|--------|--------|----------|
| Hero (2D) | `public/images/products/{product}/` | — | Product page hero components |
| Hero (3D) | `public/images/product-heroes/posters/` | `public/models/product-heroes/` | `src/data/productHero3D.js` |
| Product-specific 3D | legacy paths e.g. `public/models/real-estate-ai/` | same | `realEstateHeroAssets.js`, etc. |
| Marketing / features | `public/images/products/`, `marketing/` | — | `marketingImages.js`, product pages |
| Future canonical | `public/models/products/{product}/` | same | Not wired yet — staging for new exports |

---

## Real Estate AI

Detailed visual plan for CinNova Real Estate AI — website, marketing, and future app surfaces. **Do not move or rewire production paths** until a separate wiring phase is approved.

### Approved current hero (locked)

| Asset | Path | Component / config | Status |
|-------|------|-------------------|--------|
| **City hero (2D)** | `/images/products/real-estate/real-estate-ai-city-hero-approved-v1.png` | `RealEstateCityHero.jsx` | **Approved — do not change** |
| Card thumbnail | `/images/products/cinnova-real-estate-property.jpg` | `products.js`, ecosystem grid | Production |
| Farmhouse poster (legacy slot) | `/images/real-estate-ai/real-estate-ai-farmhouse-transformation-hero.png` | `productHero3D.js` / `realEstateHeroAssets.js` | Retained — not live hero |
| Before/after previews | `/images/real-estate-ai/farmhouse-old-decrepit-preview.png`, `farmhouse-modern-renovated-preview.png` | Transformation UI | Production support |
| Dual-model GLBs | `/models/real-estate-ai/farmhouse-old-decrepit.glb`, `farmhouse-modern-renovated.glb` | `realEstateHeroAssets.js` | Production support |
| v1 procedural GLB (archive) | `/models/product-heroes/realestateai-farmhouse-transformation.glb` | Not wired to live hero | Dev placeholder only |

**Live page hero:** city illustration only (`RealEstateCityHero`). Farmhouse 3D/poster stack is intentionally retained in config but superseded on the product page.

### Visual identity

| Element | Direction |
|---------|-----------|
| **Palette** | Rose accent `#ec4899`, blue accent `#2563eb`, white studio backgrounds, soft glass UI panels |
| **Mood** | Premium proptech — data-driven, trustworthy, investor-grade (not cartoonish) |
| **3D style** | Clean dioramas, readable silhouettes at 375px mobile, frosted HUD overlays |
| **2D style** | Aerial/city blocks, glowing map pins, modern residential + commercial mix |
| **Typography in art** | Minimal baked text; prefer UI mockups with placeholder labels |
| **Brand tie-in** | CinNova glass materials, rose/blue rim lighting — align with Brand DNA |

Reference: `docs/realestateai-farmhouse-hero-asset-guide.md`, `design-exports/real-estate-hero-concept/`.

### Website support visuals

| Asset type | Purpose | Recommended destination | Priority |
|------------|---------|-------------------------|----------|
| Feature section stills | Deal analysis, cash flow, property search | `public/images/products/real-estate/features/` | P1 |
| Tools strip icons / screenshots | Mortgage calc, comps, ROI | `public/images/products/real-estate/tools/` | P2 |
| Ecosystem / cross-sell cards | Products page, Home grid | Existing root JPG path or `products/real-estate/marketing/` | P3 |
| OG / social share card | Link previews | `public/images/cinnova/social/real-estate-og-v1.png` | P2 |
| Waitlist / CTA backgrounds | Section dividers | `public/images/products/real-estate/sections/` | P3 |

Existing marketing stills (keep paths): `/images/marketing/realestate-cash-flow.jpg`, `realestate-property-search.jpg`, `/images/real-estate/ai-real-estate-investing-deal-analysis.jpg`.

### Dashboard mockups

Static UI compositions for product page features and future app marketing — **not** functional screenshots.

| Mockup | Description | Filename pattern | Destination |
|--------|-------------|------------------|-------------|
| Deal analyzer | Property card + ARV/ROI panels | `realestate-dashboard-deal-analyzer-v{N}.png` | `products/real-estate/dashboards/` |
| Portfolio overview | Multi-property map + summary KPIs | `realestate-dashboard-portfolio-v{N}.png` | same |
| Cash flow model | Chart + mortgage inputs | `realestate-dashboard-cashflow-v{N}.png` | same |
| Comp search | Side-by-side listings | `realestate-dashboard-comps-v{N}.png` | same |
| Renovation estimator | Before/after cost breakdown | `realestate-dashboard-renovation-v{N}.png` | same |

Format: 16:9 and 4:3 variants; export @2x PNG; dark + light theme optional.

### Report mockups

PDF/export preview art for guides, lead magnets, and Resources page.

| Report type | Filename pattern | Destination |
|-------------|------------------|-------------|
| Investment memo | `realestate-report-investment-memo-v{N}.png` | `products/real-estate/reports/` |
| Market snapshot | `realestate-report-market-snapshot-v{N}.png` | same |
| Renovation scope | `realestate-report-renovation-scope-v{N}.png` | same |
| Deal one-pager | `realestate-report-deal-onepager-v{N}.png` | same |

Pair with Resources entries when gated downloads ship — wire in a separate phase.

### Blog / social visuals

| Asset | Use | Source / destination |
|-------|-----|---------------------|
| Blog heroes | Real-estate category posts | `/images/real-estate/`, `/images/blog/real-estate/` (existing) |
| Inline diagrams | Deal flow, cap rate explainer | `products/real-estate/blog/` or `cinnova/blog/real-estate/` |
| Social templates | LinkedIn, X, Instagram | `public/images/cinnova/social/real-estate-*` |
| Newsletter headers | Sponsor / product updates | `cinnova/social/` |

Existing blog inventory: `blogImageInventory.js` — extend with new paths only after files land.

### Future app visuals

For the standalone Real Estate AI app (not getcinnova.com product page):

| Category | Examples | Staging folder |
|----------|----------|----------------|
| Onboarding | Welcome, connect MLS/data | `products/real-estate/app/onboarding/` |
| Map / search | 3D city block, pin clusters | `models/products/real-estate/` + `images/.../app/map/` |
| Property detail | Photo carousel, AI summary panel | `products/real-estate/app/property-detail/` |
| Analysis workspace | Split view: inputs + results | `products/real-estate/app/analysis/` |
| Empty states | No deals, no comps | `products/real-estate/app/empty-states/` |

### Priority order

| Priority | Deliverable | Notes |
|----------|-------------|-------|
| **P0** | Keep city hero v1 unchanged | No edits to approved PNG or `RealEstateCityHero` |
| **P1** | Feature + dashboard mockups (deal analyzer, cash flow) | Unblocks product page `#features` refresh |
| **P1** | 3D city block + property pin set (Meshy) | App/map marketing; see meshy-asset-plan |
| **P2** | Report mockups + social/OG templates | Resources + share growth |
| **P2** | Farmhouse v2 GLB (Spline/Blender) | Poster-only slot today — see v2 workflow doc |
| **P3** | Investor dashboard room (3D) | Hero B-roll / app landing |
| **P3** | Modern house + data overlay scene | Feature marketing still |
| **P4** | Full app screen library | Post-MVP app launch |

### Naming conventions (Real Estate AI)

| Type | Pattern | Example |
|------|---------|---------|
| Approved hero | `real-estate-ai-{subject}-hero-approved-v{N}.png` | `real-estate-ai-city-hero-approved-v1.png` |
| Feature still | `realestate-feature-{topic}-v{N}.png` | `realestate-feature-deal-analysis-v1.png` |
| Dashboard mockup | `realestate-dashboard-{screen}-v{N}.png` | `realestate-dashboard-cashflow-v1.png` |
| Report mockup | `realestate-report-{type}-v{N}.png` | `realestate-report-investment-memo-v1.png` |
| 3D master GLB | `realestateai-{scene}.glb` | `realestateai-city-block.glb` |
| 3D web GLB | `realestateai-{scene}.web.glb` | `realestateai-city-block.web.glb` |
| Poster | `realestateai-{scene}.png` in `product-heroes/posters/` | build script compatible |
| Social | `real-estate-{platform}-{topic}-v{N}.png` | `real-estate-linkedin-deal-analysis-v1.png` |

Slug for folders: **`real-estate`** (matches `products/real-estate/`, `models/products/real-estate/`).

### Recommended folder destinations

```
public/images/products/real-estate/
  real-estate-ai-city-hero-approved-v1.png   ← production hero (do not move)
  features/                                   ← P1 feature stills
  tools/                                      ← tool section art
  dashboards/                                 ← UI mockups
  reports/                                    ← report preview art
  marketing/                                  ← campaigns, OG variants
  sections/                                   ← CTA / divider backgrounds
  app/                                        ← future app screens
    onboarding/
    map/
    property-detail/
    analysis/
    empty-states/

public/images/real-estate-ai/                 ← legacy farmhouse stack (keep)
public/images/real-estate/                    ← blog topic library (keep)
public/images/cinnova/social/                 ← cross-site social templates

public/models/real-estate-ai/                 ← production dual farmhouse GLBs (keep)
public/models/product-heroes/                 ← hero GLBs + posters (keep)
public/models/products/real-estate/           ← staging for new Meshy exports
```

### Related docs

- [Meshy asset plan — Real Estate AI](./meshy-asset-plan.md#real-estate-ai-meshy-plan)
- [Farmhouse hero v2 workflow](../realestateai-farmhouse-hero-v2-workflow.md)
- [Farmhouse hero asset guide](../realestateai-farmhouse-hero-asset-guide.md)

---

## PoisonGuard

### Approved (production)
| Asset | Path |
|-------|------|
| Hero (2D) | `/images/products/poisonguard/poisonguard-hero-approved-v1.png` |
| 3D scanner | `/models/product-heroes/poisonguard-plant-scanner.web.glb` |
| Feature shots | `/images/products/poisonguard-feature-*.jpg` |
| Card / marketing | `/images/products/poisonguard-pet-family-safety.jpg`, `products/poisonguard/marketing/*` |

### Future
- Updated plant scanner v2, household hazard scenes
- Staging: `public/models/products/poisonguard/`

---

## TechMate

### Approved (production)
| Asset | Path |
|-------|------|
| Hero (2D) | `/images/products/techmate/techmate-hero-approved-v1.png` |
| Card thumbnail | `/images/products/techmate-ai-device-support.jpg` |
| Marketing | `/images/marketing/techmate-network-diagnostics.jpg` |

### Future
| Asset | Path / notes |
|-------|----------------|
| 3D data-center hero | `/models/product-heroes/techmate-data-center.glb` (referenced, not yet shipped) |
| Poster | `/images/product-heroes/posters/techmate-data-center.png` (build-generated) |
| Staging | `public/models/products/techmate/` |

---

## StudyNest

### Approved (production)
| Asset | Path |
|-------|------|
| 3D campus library | `/models/product-heroes/studynest-campus-library.web.glb` |
| Card thumbnail | `/images/products/studynest-student-learning.jpg` |
| Page inline | `/images/education/ai-tutor-personalized-learning-dashboard.jpg` |

### Future
- Dedicated 2D hero in `public/images/products/studynest/`
- Poster: `studynest-campus-library.png` (build-generated from source)
- Staging: `public/models/products/studynest/`

---

## Kiddo

### Approved (production)
| Asset | Path |
|-------|------|
| 3D companion | `/models/kiddo/kiddo-companion.glb` (KiddoHero) |
| Characters | `/images/Kiddo/characters/*.png` (kiki, nova, splash, etc.) |
| Worlds | `/images/Kiddo/worlds/*.png` |
| Branding / gameplay | `/images/Kiddo/branding/kiddo-hero.png`, `gameplay/app-preview.png` |
| Card thumbnail | `/images/products/kiddo-child-learning.jpg` |

### Future
| Asset | Notes |
|-------|-------|
| Product hero GLB | `/models/product-heroes/kiddo-kids-learning-play.glb` (config only) |
| Canonical 2D folder | `public/images/products/kiddo/` (empty — staging) |
| Staging 3D | `public/models/products/kiddo/` |

---

## Nightmare Forest (game)

### Approved
- None wired to getcinnova.com production.

### Future
- Concept and gameplay art: `public/images/games/nightmare-forest/`
- 3D exports: `public/models/games/nightmare-forest/`
- Meshy workspace: `G:\CinNova Assets\Meshy\Completed\Nightmare Forest`

---

## Naming rules

1. **Product slug:** `real-estate`, `poisonguard`, `techmate`, `studynest`, `kiddo`, `nightmare-forest`
2. **Hero PNG:** `{product}-hero-approved-v{N}.png`
3. **Feature JPG:** `{product}-feature-{topic}.jpg` or `{product}-{topic}.jpg` at products root (legacy — keep paths)
4. **GLB master:** `{product}-{scene-description}.glb` → optimize to `{same}.web.glb`
5. **Kiddo characters/worlds:** Title Case filenames in existing `Kiddo/` tree — do not rename production PNGs
6. New assets go in `products/{slug}/` or `models/products/{slug}/` first; path updates happen in a separate wiring phase

## Related

- [CinNova website visual roadmap](./cinnova-website-visual-roadmap.md)
- [Meshy asset plan](./meshy-asset-plan.md)
- [Product hero 3D production guide](../product-hero-3d-production-guide.md)
