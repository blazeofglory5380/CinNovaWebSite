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

### Approved (production)
| Asset | Path |
|-------|------|
| City hero (2D) | `/images/products/real-estate/real-estate-ai-city-hero-approved-v1.png` |
| Farmhouse poster | `/images/real-estate-ai/real-estate-ai-farmhouse-transformation-hero.png` |
| Before/after previews | `/images/real-estate-ai/farmhouse-old-decrepit-preview.png`, `farmhouse-modern-renovated-preview.png` |
| Transformation GLBs | `/models/real-estate-ai/farmhouse-old-decrepit.glb`, `farmhouse-modern-renovated.glb` |
| Product hero GLB (dev/archive) | `/models/product-heroes/realestateai-farmhouse-transformation.glb` |
| Card thumbnail | `/images/products/cinnova-real-estate-property.jpg` |

### Future
- Merged single-scene GLB (`farmhouse-transformation.glb`) — see `realEstateHeroAssets.js`
- v2 hero workflow: `docs/realestateai-farmhouse-hero-v2-workflow.md`
- Staging folder: `public/models/products/real-estate/`

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
