# Real Estate AI Farmhouse Hero — Asset Production Guide

**Asset:** `realestateai-farmhouse-transformation.glb`  
**Poster:** `realestateai-farmhouse-transformation.png`  
**Live page:** `/?page=real-estate`  
**Frontend:** Already wired. Do **not** change `ProductHero3D.jsx`, `ProductHero3D.css`, `productHero3D.js`, SEO, sitemap, routing, or blog code.

---

## 1. Creative brief (concept board)

**Reading:** Premium SaaS product diorama on a white studio stage — friendly, modern, investor-focused, not horror or photoreal grime.

| Pillar | Direction |
|--------|-----------|
| **Background** | Clean white / cool off-white studio void. No sky, terrain, or photo plates outside the platform. |
| **Stage** | Premium **3D diorama** on a **circular platform** (matte white or light stone, subtle bevel). |
| **Shadows** | Soft contact shadow under the platform. No pure-black ground cards. |
| **UI** | **Floating frosted glass panels** — rounded corners, thin border, light blur, readable labels. Product software, not game HUD. |
| **Lighting** | Soft studio key + fill. **Rose + blue** accent rims (`#ec4899`, `#2563eb`). Touch of green (`#10b981`) for positive metrics. Warm window glow on the modern house only. |
| **Tone** | Approachable, trustworthy, modern real estate intelligence. |
| **360°** | Full geometry all around. No one-sided billboards, missing backs, or camera-only cheats. |

**Real Estate accent (match live page):** rose primary `#db2777` / `#ec4899`, blue secondary `#2563eb`.

---

## 2. Story (5-second read)

On one circular platform, show **AI-guided property transformation**:

1. An **old, decaying farmhouse** (before).
2. A **brand-new modern farmhouse** (after).
3. A **couple** viewing the property.
4. **AI analysis + renovation/value panels** floating nearby.
5. A **looping animation** that transforms before → after.

The viewer should understand *investment intelligence + renovation upside* without reading page copy.

---

## 3. Scene checklist

### 3.1 Before state (old farmhouse)

Place on the **left / rear** of the platform (viewer default is front 3/4).

- [ ] Peeling / faded paint on siding (stylized, not horror)
- [ ] **Broken porch** — sagging rail, missing step, or collapsed section
- [ ] **Damaged roof** — missing shingles, patch, or sag
- [ ] **Overgrown grass** and light weeds at foundation
- [ ] Muted, desaturated materials vs. the after side
- [ ] Still on-brand: premium diorama, not abandoned-building shock

### 3.2 After state (modern farmhouse)

Place on the **right / front** of the platform.

- [ ] **Fresh white siding**
- [ ] **Black-framed** windows and doors
- [ ] **Repaired porch** with clean lines and intact railings
- [ ] **Clean landscaping** — trimmed lawn, simple shrubs or path
- [ ] **Warm lights** in windows and/or porch (soft emissive)
- [ ] Crisp, bright materials that contrast the before side

### 3.3 Characters

- [ ] **One couple**, adult proportions, friendly and professional
- [ ] Standing on the platform (grass/path), facing the houses
- [ ] Silhouette readable at mobile thumbnail size
- [ ] Neutral wardrobe, no logos
- [ ] Modeled for **360°** (no flat cutout backs)

### 3.4 Floating UI panels (required)

**2–4 panels** around the scene. Do not block the couple or the before/after read.

| Panel | Example content | Accent |
|-------|-----------------|--------|
| **AI property analysis** | Condition score, roof status, porch repair flag | Rose `#ec4899` |
| **After-repair value (ARV)** | Large dollar figure + label | Blue `#2563eb` |
| **Renovation budget** | Est. rehab cost | Rose or neutral |
| **Deal signal** (optional) | Cap rate, cash-flow positive | Green `#10b981` |

Panel style:

- [ ] Frosted / glass material with subtle emissive edge
- [ ] Rounded rectangle, thin border
- [ ] Text baked to texture **or** simple geometry blocks (must stay legible at **375px** wide)
- [ ] Optional thin connector lines / scan brackets toward the **before** structure

### 3.5 Platform & studio

- [ ] **Circular platform** centered at world origin
- [ ] Platform top at **Y = 0** (ground plane)
- [ ] Pivot / orbit center = **platform center**
- [ ] Soft shadow disc or contact shadow under platform
- [ ] White studio backdrop (hemisphere or cyclorama) inside the GLB optional; page already provides a light hero surface

---

## 4. Animation

| Property | Spec |
|----------|------|
| **Clip name** | `Transformation` (must be the **first** animation in the GLB) |
| **Duration** | **6–10 seconds**, seamless loop |
| **Structure** | Hold before → transform → hold after → loop |
| **Suggested timing (8 s)** | 0–2 s before · 2–5 s transition · 5–8 s after |
| **Motion** | Cross-fade, scale, material blend, or mesh swap: peeling → fresh siding; roof/porch repair; grass trim; lights fade up |
| **UI** | Panels fade/slide in during mid-transition (optional) |
| **Camera** | **No camera animation** — `model-viewer` owns orbit |

**Autoplay rule:** The site’s viewer autoplays the **first** glTF clip. Name and order matter — put `Transformation` first.

**Reduced motion:** The page disables auto-orbit only; the GLB animation may still play unless you ship a separate static hero clip (not required for v1).

---

## 5. Technical export spec

| Requirement | Target |
|-------------|--------|
| Format | **GLB** (glTF 2.0 binary), single file |
| Path | `public/models/product-heroes/realestateai-farmhouse-transformation.glb` |
| Coordinate system | **Y-up** |
| Pivot | Centered on **circular platform** |
| Materials | **PBR** metallic-roughness |
| Textures | **1024** preferred, **2048** max, power-of-two |
| File size | **≤ 4 MB** target · **8 MB** hard maximum |
| Compression | **Draco** mesh compression if needed to hit budget |
| Bounding volume | Hero fits ~**2.5 m** diameter on platform |
| Extensions | Stick to Khronos core + Draco; avoid exotic extensions |

### Blender export notes

1. Apply all transforms (platform centered at origin).
2. Embed animations in the GLB.
3. Name the first action **`Transformation`**.
4. Export glTF 2.0 → GLB.
5. If over 4 MB: decimate non-hero meshes, resize textures to 1024, apply Draco.

### Validation (required before handoff)

1. **[glTF Validator](https://github.khronos.org/glTF-Validator/)** — zero errors.
2. **[modelviewer.dev/editor](https://modelviewer.dev/editor/)** — load GLB, confirm:
   - Orbit 360°
   - Animation loops
   - Materials read on white background
   - No z-fighting or clipping at default framing

---

## 6. Poster companion image

| Property | Value |
|----------|--------|
| Path | `public/images/product-heroes/posters/realestateai-farmhouse-transformation.png` |
| Size | **1600 × 1200** PNG |
| Frame | **After-state hero** at default orbit (matches first impression on site) |
| Capture | Render from DCC **or** screenshot from modelviewer editor at the same angle |

Replace the poster whenever the default camera angle or after-state design changes.

---

## 7. Integration (zero frontend changes)

Paths are already configured. **Drop-in only.**

### Step 1 — Place files

```text
public/models/product-heroes/realestateai-farmhouse-transformation.glb
public/images/product-heroes/posters/realestateai-farmhouse-transformation.png   (if updated)
```

### Step 2 — Run dev server

```bash
npm run dev
```

### Step 3 — Open the page

```text
http://localhost:5173/?page=real-estate
```

*(If port 5173 is busy, Vite may use 5174 — check the terminal URL.)*

### Step 4 — Confirm QA

| Check | Pass criteria |
|-------|----------------|
| **GLB loads** | Network: `HEAD` + `GET` on `.glb` return **200**; `Content-Type: model/gltf-binary` |
| **Poster fallback gone** | “Poster preview active” chip **disappears** after model loads |
| **Animation plays** | Before → after transformation loops (~6–10 s) |
| **360° orbit** | Drag on desktop rotates full scene; no missing backs |
| **Touch rotation** | Pinch/drag works on iPhone / iPad |
| **Auto-rotate** | Slow idle rotation when `prefers-reduced-motion` is off |
| **Mobile** | Readable at ~375px width; UI panels not clipped |

### Step 5 — Production deploy

- Commit GLB (+ poster if changed).
- `npm run build` (already passes; GLB is a static `public/` asset, not bundled into JS).
- No sitemap, SEO, or routing updates required.

---

## 8. Default hero framing (artist reference)

**Turntable angles to approve:** 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°.

**Poster / default frame:**

- Couple in foreground, slightly off-center
- Before house visible left-rear, modern house right-front
- 2–3 UI panels visible (analysis, ARV, rehab)
- Rose/blue UI accents, white platform, soft shadow
- Warm glow on modern windows

```
        [UI: ARV]                    [UI: Analysis]
              \                         /
    [Before house]  (couple)  [Modern house]
              \      |      /
           ====== platform ======
              ~~~~ soft shadow ~~~~
```

---

## 9. Production sign-off

Sign only when **all** are true:

- [ ] Matches §1 concept board style
- [ ] All §3 scene elements present
- [ ] `Transformation` is **first** animation, 6–10 s loop
- [ ] GLB ≤ 4 MB (or ≤ 8 MB with written justification)
- [ ] glTF Validator: **0 errors**
- [ ] modelviewer editor: orbit + animation OK
- [ ] Poster PNG updated if camera changed
- [ ] §7 integration QA passed on desktop + one mobile device

---

## 10. Reference paths (read-only)

| Item | Location |
|------|----------|
| GLB drop path (v2) | `public/models/product-heroes/realestateai-farmhouse-transformation-v2.glb` |
| v1 procedural (archived) | `public/models/product-heroes/realestateai-farmhouse-transformation.glb` — **not in production** |
| v2 workflow | `docs/realestateai-farmhouse-hero-v2-workflow.md` |
| Dev placeholder builder | `npm run build:realestate-hero-glb` — **dev only, do not ship** |

**Last updated:** 2026-06-28
