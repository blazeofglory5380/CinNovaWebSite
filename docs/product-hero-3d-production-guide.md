# CinNova Product Hero 3D — Asset Production Checklist & Integration Guide

**Status:** Frontend system shipped (`ProductHero3D` + `productHero3D.js`). GLB assets are pending.  
**Do not change:** SEO, routes, sitemap, blog pages, or `ProductHero3D.jsx` unless a technical blocker appears.

---

## 1. Approved concept board style (all six heroes)

Every hero model must read as one family on the Cin Nova site.

| Element | Requirement |
|--------|-------------|
| **Background** | Clean white / very light cool gray studio void. No busy environments, no sky domes, no photo backplates. |
| **Composition** | Premium 3D **diorama** on a **circular platform base** (matte white or light stone, subtle bevel). |
| **Lighting** | Soft studio key + fill. Accent rim lights in **bright blue, green, and purple** (SaaS/product palette). Warm accents only where the story needs it (e.g. interior glow on farmhouse). |
| **Shadows** | Soft contact shadow under platform and hero objects. No harsh black ground planes. |
| **UI layer** | **Floating glass / frosted UI panels** near the subject: rounded corners, thin borders, light blur, readable labels. Panels should feel like product software, not game HUD. |
| **Tone** | Friendly, modern, trustworthy SaaS. Avoid horror, grime-for-shock, or hyper-real decay. |
| **Camera** | Hero readable from **front 3/4** at default orbit. Model must look good at **360°** rotation (no missing backs, no one-sided billboards). |
| **Scale** | Subject centered on platform. Orbit pivot at platform center. Ground at Y = 0. |

**Accent color mapping (match site heroes):**

| Product | Primary accent | GLB accent use |
|---------|----------------|----------------|
| Home | Cobalt `#2563eb` | AI chat panels, connection lines |
| PoisonGuard | Emerald `#059669` | Safety scan UI, hazard highlights |
| Real Estate AI | Rose `#db2777` / pink UI | Analysis overlays, value panels |
| Kiddo | Magenta `#db2777` | Playful UI chips, learning badges |
| StudyNest | Violet `#7c3aed` | Study tools, library screens |
| TechMate AI | Sky `#0284c7` | Server status, cloud nodes |

---

## 2. Technical delivery spec (model-viewer)

The site uses `@google/model-viewer` with:

- `camera-controls` + touch orbit (`touch-action="pan-y"`)
- `environment-image="neutral"`
- `shadow-intensity="0.45"`, `exposure="1.05"`
- Auto-rotate **18°/s** when `prefers-reduced-motion` is off
- Lazy load; **HEAD request** on `modelSrc` before viewer mounts

### Export requirements

| Spec | Target |
|------|--------|
| Format | **GLB** (glTF 2.0 binary), single file |
| Units | Meters, **Y-up** |
| Pivot | Platform center at world origin; platform top ≈ Y = 0 |
| Bounding box | Fits in ~**2.5 m** diameter circle on platform (adjust in DCC, not in code) |
| File size | **≤ 4 MB** target, **8 MB** hard max |
| Textures | Power-of-two, **≤ 2048** (1024 preferred for mobile) |
| Materials | PBR (metallic-roughness). Avoid unsupported extensions. |
| Compression | **Draco** mesh + **KTX2/Basis** textures if needed to hit size budget |
| Animations | Embed in GLB if used; name clips clearly (see §4) |
| Transparency | Minimize overdraw; UI panels as thin emissive/glass meshes OK |
| LOD | Not required; one hero mesh set is enough |
| Legal | Original or licensed assets only |

### Default camera framing (author in Blender)

- Camera distance: subject fills ~**70%** of frame height at default `model-viewer` orbit.
- Leave **10–15%** padding top/side so floating UI is not clipped on mobile.
- Test orbit at 0°, 90°, 180°, 270° before export.

### Poster companion image

Each GLB has a matching poster PNG (already wired). When the GLB is final:

1. Render a **1600×1200** still from the **same camera angle** as the default hero frame.
2. Replace the file at the poster path (see §6 table).
3. Run `npm run setup:product-hero-posters` only if re-generating from sources; otherwise overwrite PNG directly.

---

## 3. Priority asset: Real Estate AI farmhouse transformation

**Deliverable path (exact):**  
`public/models/product-heroes/realestateai-farmhouse-transformation.glb`

**Poster path:**  
`public/images/product-heroes/posters/realestateai-farmhouse-transformation.png`

**Page:** `/?page=real-estate` · **Config key:** `real-estate` in `src/data/productHero3D.js`

### 3.1 Story beat (single diorama, readable in 5 seconds)

A **before → after** property transformation on one circular platform:

1. **Left / rear (before):** Old damaged farmhouse — peeling paint, broken porch, damaged roof, overgrown grass.
2. **Right / front (after):** Brand-new modern farmhouse — fresh white siding, black-framed windows, repaired porch, clean landscaping, warm interior/exterior lights.
3. **Center foreground:** A **couple** viewing the property (friendly, professional, not posed like stock clichés).
4. **Floating UI:** AI property analysis overlays + renovation/value panels (glass panels, rose/blue accents).

The viewer should understand **AI-guided renovation intelligence** without reading copy.

### 3.2 Before-state checklist (old farmhouse)

- [ ] Peeling paint on siding (stylized, not photoreal rot)
- [ ] Broken / sagging porch railing or missing steps
- [ ] Damaged roof (missing shingles or patched section)
- [ ] Overgrown grass and light weeds at foundation
- [ ] Muted, desaturated materials vs. the “after” side
- [ ] Still **on-brand** (diorama toy-like premium, not abandoned horror)

### 3.3 After-state checklist (modern farmhouse)

- [ ] Fresh **white siding**
- [ ] **Black-framed** windows and doors
- [ ] Repaired porch with clean lines
- [ ] Trimmed lawn / simple landscaping ( shrubs or path )
- [ ] **Warm lights** in windows or porch (soft emissive)
- [ ] Crisp, bright materials contrasting the before side

### 3.4 Characters

- [ ] One couple, adult proportions, simple stylized bodies (low poly OK)
- [ ] Standing on platform grass/path, facing the house transition
- [ ] Neutral-friendly wardrobe (no logos)
- [ ] Silhouette readable at thumbnail size

### 3.5 Floating UI panels (required)

Place **2–4** panels around the house, not blocking the couple or the transformation read:

| Panel | Example content | Style |
|-------|-----------------|-------|
| Analysis overlay | “Condition score 62” · “Roof: replace” · “Porch: repair” | Frosted card, rose/pink accent border |
| ARV / value | “After-repair value $485k” | Large number, small label |
| Renovation budget | “Est. rehab $48k” | Secondary panel |
| Deal signal | “Cash flow positive” or “Cap rate 7.2%” | Optional third panel |

- [ ] Panels use **rounded rects**, subtle emissive edge, **no tiny illegible text** (use simple geometry + texture bakes if needed)
- [ ] Thin connector lines or scan brackets toward the **before** structure OK
- [ ] Colors: **rose `#ec4899`**, **blue `#2563eb`**, touch of **green `#10b981`** for “positive” metrics

### 3.6 Transformation animation (embedded in GLB)

**Clip name suggestion:** `Transformation` (or `transform`)

| Property | Spec |
|----------|------|
| Duration | **6–10 s** loop |
| Easing | Smooth ease-in-out; hold **2 s** on before and **2 s** on after |
| Motion | Cross-fade or morph: peeling → fresh siding; roof repair; porch fix; grass trim; lights fade up |
| UI | Panels can fade/slide in during mid-transition (optional) |
| Reduced motion | Site disables auto-rotate only; **animation still plays** unless you add a static “after” pose at frame 0 for a second clip `StaticAfter` |

**Recommended clips:**

1. `Transformation` — full loop (default if model-viewer plays first animation)
2. `StaticHero` — single frame at best “after” angle for fallback thumbnail capture

> Note: `ProductHero3D` does not configure `animation-name` today. model-viewer autoplays the **first** glTF animation if present. Order clips accordingly or put the loop first.

### 3.7 Platform & staging

- [ ] **Circular platform** base, white/light stone
- [ ] Soft shadow blob under platform
- [ ] White studio background (no HDRI landscape)
- [ ] House + couple + UI contained inside platform radius
- [ ] **360° safe:** back of house and couple modeled; no camera-only cheats

### 3.8 Real Estate AI — production sign-off

- [ ] Reads clearly at **375px** wide (mobile hero)
- [ ] Before/after understandable without text
- [ ] File ≤ 4 MB (or justified ≤ 8 MB)
- [ ] GLB validates in [glTF Validator](https://github.khronos.org/glTF-Validator/)
- [ ] Tested in model-viewer [editor](https://modelviewer.dev/editor/)
- [ ] Poster PNG updated to match default frame
- [ ] `alt` text unchanged in config (already set)

---

## 4. All six assets — file map & concepts

| # | GLB path | Poster path | Concept (one line) |
|---|----------|-------------|-------------------|
| 1 | `home-ai-customer-communication.glb` | `posters/home-ai-customer-communication.png` | AI interface communicating with a customer |
| 2 | `poisonguard-decaying-poison-oak.glb` | `posters/poisonguard-decaying-poison-oak.png` | Poison oak decaying / breaking down safely |
| 3 | **`realestateai-farmhouse-transformation.glb`** | `posters/realestateai-farmhouse-transformation.png` | **Farmhouse before/after + couple + AI panels** |
| 4 | `kiddo-kids-learning-play.glb` | `posters/kiddo-kids-learning-play.png` | Kids playing and learning with Kiddo |
| 5 | `studynest-campus-library.glb` | `posters/studynest-campus-library.png` | Campus library + modern AI study atmosphere |
| 6 | `techmate-data-center.glb` | `posters/techmate-data-center.png` | Data center, servers, cloud + AI tech |

**URL prefix:** `/models/product-heroes/` and `/images/product-heroes/` (served from `public/`).

---

## 5. Per-asset production checklist (template)

Copy for each model after farmhouse is approved.

### Pre-production

- [ ] Concept sketch matches §1 style board
- [ ] Accent color assigned from table
- [ ] Circular platform + white void in layout
- [ ] 360° rotation plan (no single-sided geometry)
- [ ] UI panel mockups approved (content + placement)
- [ ] Animation list defined (if any)

### Modeling & texturing

- [ ] Hero subject centered on platform
- [ ] PBR materials; no excessive gloss
- [ ] Floating UI as separate meshes
- [ ] Contact shadows baked or authored
- [ ] Poly budget reasonable (hero diorama, not game level)

### Animation (if applicable)

- [ ] Named clips in glTF
- [ ] Loop-friendly
- [ ] First clip = intended default autoplay
- [ ] No camera animation (model-viewer owns camera)

### Export & optimize

- [ ] GLB exported with applied transforms
- [ ] Draco / texture compression applied
- [ ] File size within budget
- [ ] glTF Validator: 0 errors
- [ ] Tested on Chrome desktop + Safari iOS

### Poster

- [ ] 1600×1200 PNG exported
- [ ] Matches default orbit framing
- [ ] Saved to correct `posters/` filename

### Integration QA (no code changes)

- [ ] GLB placed at exact `public/models/product-heroes/<filename>.glb`
- [ ] Hard refresh `/?page=...` — poster fallback disappears, model loads
- [ ] Drag orbit works (desktop)
- [ ] Pinch/drag works (iPhone/iPad)
- [ ] `prefers-reduced-motion`: auto-rotate off; model still usable
- [ ] Lighthouse: LCP acceptable (poster preloads on home only)

---

## 6. Integration guide (zero-code path)

The frontend is **path-driven**. No React changes are required when filenames stay the same.

### Step 1 — Place the GLB

```text
public/models/product-heroes/realestateai-farmhouse-transformation.glb
```

### Step 2 — Update poster (recommended)

```text
public/images/product-heroes/posters/realestateai-farmhouse-transformation.png
```

### Step 3 — Verify locally

```bash
npm run dev
```

Open:

- Real Estate: `http://localhost:5173/?page=real-estate`
- Others: `/?page=studynest`, `poisonguard`, `kiddo`, `techmate`, and `/` for home

**Success signals:**

1. Network tab: `HEAD` + `GET` on `.glb` return **200**
2. Hero shows interactive model (not “Poster preview active” chip)
3. Orbit and touch controls respond

### Step 4 — Production deploy

- Commit GLB + poster PNG (watch repo size; LFS if > 10 MB total)
- Deploy as usual; `npm run build` does not bundle GLB into JS
- No sitemap or SEO updates required (models are static assets)

### Step 5 — Optional hardening (only if needed)

| Issue | Fix (asset-side first) |
|-------|-------------------------|
| Model too dark | Re-export with higher emissive on UI; test `exposure` in model-viewer editor |
| Wrong scale | Re-export; do not change component |
| Animation wrong | Reorder clips or rename; first clip autoplays |
| HEAD fails on CDN | Ensure `.glb` MIME `model/gltf-binary` on host |
| File too large | Draco + 1024 textures + reduce UI polygon count |

**Do not change** `src/data/productHero3D.js` unless the **filename** changes.

---

## 7. Suggested production order

1. **Real Estate AI farmhouse** (priority — full spec in §3)
2. **Home** AI customer communication (ecosystem flagship on `/`)
3. **PoisonGuard** poison oak decay (safety story)
4. **StudyNest** campus library
5. **Kiddo** kids learning play
6. **TechMate** data center

Farmhouse sets the **style contract** for platform, UI panels, lighting, and file weight. Reuse that kit for the other five.

---

## 8. Quick reference — farmhouse shot list for artist

**Single hero frame (poster + default orbit):**

- Couple foreground, slightly off-center
- Before house left-rear, after house right-front
- 2–3 UI panels visible: condition score, ARV, rehab estimate
- Rose/blue UI accents, white platform, soft shadow
- Warm window glow on modern side

**Turntable test angles:** 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315° — house, couple, and platform hold together; no floating gaps.

---

## 9. Contacts & config reference

| Item | Location |
|------|----------|
| Hero props & paths | `src/data/productHero3D.js` |
| Viewer component | `src/components/ProductHero3D.jsx` |
| Poster generator | `scripts/setup-product-hero-posters.mjs` |
| Model drop folder | `public/models/product-heroes/` |

**Last updated:** 2026-06-28 · Frontend build passed with poster fallbacks active.
