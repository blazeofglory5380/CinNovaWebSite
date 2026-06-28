# Real Estate AI Farmhouse Hero — v2 Production Workflow

**Status:** v1 procedural GLB **rejected** for production (too low-poly). Live page is **poster-only** until v2 ships.

| Item | Value |
|------|--------|
| **v2 GLB drop path** | `public/models/product-heroes/realestateai-farmhouse-transformation-v2.glb` |
| **Poster path** | `public/images/product-heroes/posters/realestateai-farmhouse-transformation.png` |
| **Config key** | `real-estate` in `src/data/productHero3D.js` |
| **Creative spec** | `docs/realestateai-farmhouse-hero-asset-guide.md` §1–§4 |
| **Live page** | `https://cin-nova-web-site.vercel.app/?page=real-estate` |

Do **not** ship another procedural Three.js placeholder. This asset requires DCC quality (Spline or Blender).

---

## 1. Why v1 was rejected

The dev procedural GLB (`realestateai-farmhouse-transformation.glb`) proved integration only. It used primitive boxes/cones, tiny scale, and no readable detail at mobile size. It does **not** match the approved concept board (premium diorama, detailed before/after farmhouse, frosted UI panels, rose/blue accent lighting).

**Production rule:** `modelSrc` points at the v2 path. Until that file exists, `ProductHero3D` shows the poster fallback automatically.

---

## 2. Approved visual target (non-negotiable)

Read the full brief in `docs/realestateai-farmhouse-hero-asset-guide.md`. Summary:

- **Premium 3D diorama** on a **circular white platform** with soft contact shadow
- **White studio background** (cyclorama or void — page provides light gradient)
- **Split transformation:** decaying farmhouse **left/rear**, modern farmhouse **right/front**
- **Before:** peeling paint, damaged roof, broken porch, overgrown grass (stylized, not horror)
- **After:** white siding, black-framed windows, repaired porch, warm window glow, clean landscaping
- **Couple** in foreground — silhouettes readable at **375px** mobile width
- **2–4 frosted UI panels:** property analysis (rose `#ec4899`), renovation plan, value increase (blue `#2563eb`)
- **Rose + blue accent rim lighting**, soft studio key/fill
- **Camera:** close enough that the house **fills the hero stage** (not a tiny model in empty space)
- **360° safe:** full geometry all around, no billboards or missing backs
- **Animation:** 6–10 s seamless loop, first clip named **`Transformation`**

Reference style: `docs/product-hero-3d-production-guide.md` §1 and §3.

---

## 3. Recommended pipeline: Spline → Blender → GLB

### Option A — Spline (fast iteration, concept fidelity)

Best when matching the concept board layout and materials quickly.

1. **New Spline file** — scene scale: platform ~2.5 m diameter, Y-up.
2. **Block the diorama** using Spline primitives + imported meshes:
   - Circular platform (matte white, subtle bevel)
   - Before/after farmhouses as separate groups
   - Couple (use Spline characters or import rigged low-poly humans)
   - Frosted glass panels (emissive edges, baked labels)
3. **Materials:** PBR where possible; rose/blue emissive accents on UI edges.
4. **Lighting:** studio HDRI or 3-point + rose/blue rim lights.
5. **Animation:** before → after transition (6–8 s), loop seamless. Name clip **`Transformation`**.
6. **Export:** Spline → GLB (or export glTF and convert in Blender).
7. **Polish in Blender** (§4) — optimize, validate, Draco if needed.

### Option B — Blender (full control, recommended for final ship)

Best for final topology, textures, and file-size control.

1. **Scene setup**
   - Units: meters, Y-up
   - Platform center at world origin, top at Y = 0
   - Turntable pivot = platform center

2. **Modeling targets**
   | Element | Notes |
   |---------|--------|
   | Platform | Cylinder, ~1.15 m radius, 0.1 m height, white stone material |
   | Before house | ~0.6 m wide footprint, damaged roof mesh, broken porch planks, peeling siding normals |
   | After house | Same footprint, crisp siding, black window frames, porch repair, emissive window planes |
   | Grass | Separate meshes: overgrown (before) vs trimmed (after); animate cross-fade or swap |
   | Couple | ~0.35 m tall figures, simple but **not** blocky; facing houses |
   | UI panels | Thin boxes, glass BSDF + emissive border; bake label text to 1024 textures |

3. **Textures**
   - 1024² default, 2048 max for hero siding
   - Bake ambient occlusion + roughness where helpful
   - Power-of-two only

4. **Animation**
   - Single action: **`Transformation`**, 8 s, linear loop
   - 0–2 s: hold before state
   - 2–5 s: roof/porch/siding/grass/UI transition
   - 5–8 s: hold after state
   - Put **`Transformation` first** in export (only clip, or reorder in gltf-transform)

5. **Export**
   - glTF 2.0 → **GLB**, embed animations
   - Apply all transforms before export
   - Target ≤ 4 MB (8 MB hard max)

6. **Post-export**
   ```bash
   # Optional size pass (from repo root)
   npx gltf-transform optimize public/models/product-heroes/realestateai-farmhouse-transformation-v2.glb \
     public/models/product-heroes/realestateai-farmhouse-transformation-v2.glb \
     --compress draco
   ```

---

## 4. Poster capture (1600 × 1200)

After v2 GLB is approved in [modelviewer.dev/editor](https://modelviewer.dev/editor/):

| Setting | Starting value (tune to fill hero) |
|---------|-------------------------------------|
| `camera-orbit` | `0deg 72deg 3.5m` (closer than v1 — house must dominate frame) |
| `field-of-view` | `30deg` |
| `exposure` | `1.05` |
| `shadow-intensity` | `0.45` |
| `environment-image` | `neutral` |
| Animation frame | Pause at **after-state** (~6.2 s on 8 s clip) |

Save to `public/images/product-heroes/posters/realestateai-farmhouse-transformation.png`.

Or run (dev server required):

```bash
npm run capture:realestate-hero-poster
```

Update capture script camera if v2 bounding box differs.

---

## 5. Integration checklist (no frontend code changes)

1. Place v2 GLB at `public/models/product-heroes/realestateai-farmhouse-transformation-v2.glb`
2. Update poster PNG if camera or after-state changed
3. `npm run dev` → open `/?page=real-estate`
4. Confirm:
   - Poster chip disappears after GLB loads
   - `Transformation` loops
   - 360° orbit shows no missing geometry
   - Readable on mobile (~375px)
5. `npm run build` → commit → push → verify production URL returns `model/gltf-binary` **200**

`productHero3D.js` already points at the v2 path. No React changes needed.

---

## 6. Validation gates (sign-off)

- [ ] Matches concept board style (§2 above + asset guide §1)
- [ ] Not low-poly / placeholder quality
- [ ] glTF Validator: **0 errors**
- [ ] modelviewer editor: orbit + animation OK on white background
- [ ] GLB ≤ 4 MB (or ≤ 8 MB with justification)
- [ ] Poster updated at 1600 × 1200
- [ ] Production GLB URL returns 200

---

## 7. v1 archival reference

| File | Status |
|------|--------|
| `public/models/product-heroes/realestateai-farmhouse-transformation.glb` | Archived dev placeholder — **not wired to production** |
| `scripts/build-realestate-hero-glb.mjs` | Dev-only — do not run for production assets |

**Last updated:** 2026-06-28
