# CinNova Website Visual Roadmap

Purpose: plan and track site-wide visuals for getcinnova.com — home, blog, resources, social, and cross-product marketing — without moving existing production paths.

## Asset categories

| Category | Folder | Use |
|----------|--------|-----|
| Home & brand | `public/images/home/`, `public/models/cinnova-core/` | Homepage hero, OG image, AI Core 3D |
| CinNova site | `public/images/cinnova/blog`, `resources`, `social`, `product-overview` | Editorial, downloads, social cards, ecosystem overview |
| Blog | `public/images/blog/`, topic folders (`ai/`, `education/`, etc.) | Post heroes and inline art |
| Resources | `public/images/education/` (current hero), `public/images/cinnova/resources/` (future) | Resource hub and guide covers |
| Product cards | `public/images/products/` (root-level JPGs) | Product grid thumbnails on Home / Products |
| Product heroes | `public/images/products/{product}/`, `public/images/product-heroes/posters/` | Page heroes and 3D fallbacks |
| Marketing | `public/images/marketing/` | About, pricing, contact, newsletter |
| 3D heroes | `public/models/product-heroes/`, `public/models/cinnova-core/` | model-viewer assets |

## Current approved assets (production — do not move)

### Home
- **Hero 3D:** `/models/cinnova-core/CinNova_AI_Core_v2.web.glb` (CinNovaCoreHero — untouched)
- **OG / marketing still:** `/images/home/homepage-hero-innovation.jpg`

### Blog
- Topic libraries under `/images/blog/{category}/` and `/images/{ai,education,datacenters,...}/`
- Inventory: `src/data/blogImageInventory.js`, credits: `src/data/imageCredits.js`

### Resources
- **Hero:** `/images/education/ai-education-guide-2026.jpg` (`siteMarketing.resourcesHero`)

### Product cards (Home ecosystem grid)
- `/images/products/studynest-student-learning.jpg`
- `/images/products/poisonguard-pet-family-safety.jpg`
- `/images/products/kiddo-child-learning.jpg`
- `/images/products/techmate-ai-device-support.jpg`
- `/images/products/cinnova-real-estate-property.jpg`

### Social / OG
- Default OG: `/images/home/homepage-hero-innovation.jpg` (`seoConfig.defaultOgImage`)

## Future assets needed

| Area | Asset | Target folder | Notes |
|------|-------|---------------|-------|
| CinNova blog | Branded post templates, category headers | `public/images/cinnova/blog/` | Optional migration from flat `/images/blog/` over time |
| Resources | Dedicated resource covers & hero variants | `public/images/cinnova/resources/` | Keep current hero path until swap is approved |
| Social | OG/Twitter/LinkedIn templates per section | `public/images/cinnova/social/` | 1200×630, 1080×1080 |
| Product overview | Ecosystem diagram, “five products” art | `public/images/cinnova/product-overview/` | Home / Products page |
| Home poster | Optional static fallback for AI Core | `public/images/product-heroes/posters/` | Build generates most posters; custom captures stay tracked |

## Naming rules

- **Pattern:** `{scope}-{subject}-{variant}.{ext}` — lowercase, hyphens, no spaces
- **Approved hero suffix:** `-approved-v1`, `-approved-v2` (increment on redesign)
- **Posters (generated):** match `productHero3D.js` keys, e.g. `studynest-campus-library.png`
- **Web GLB suffix:** `.web.glb` for Draco-compressed production models; master `.glb` stays local/gitignored
- **Do not rename** files already referenced in `src/` — add new versions alongside and update config in a separate phase

## Related docs

- [Product visual roadmap](./product-visual-roadmap.md)
- [Meshy asset plan](./meshy-asset-plan.md)
- External Meshy workspace: `G:\CinNova Assets\Meshy`
