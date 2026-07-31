# SEO Performance Audit

**Scope:** CinNova tip `e18bf56` / Phase 11.3 worktree  
**Focus:** Products & Books cinematic heroes, motion policy, structured-data honesty that affects crawl trust  
**Method:** Code/inventory observation — **no fabricated Lighthouse, CrUX, or lab CWV numbers**

---

## 1. Executive findings

| Area | Finding |
|---|---|
| Products hero (`/products`) | Full-bleed cinematic **video** hero with `poster` + `preload="metadata"` |
| Books hero (`/books`) | Same pattern: video + poster + `preload="metadata"` |
| Primary risk | **LCP** dominated by hero media (poster decode / video layer) on marketing hubs |
| Secondary risk | **CLS** if poster/video dimensions or font/nav shifts are unstable |
| Interaction risk | **INP** generally less about the hero than about heavy UI elsewhere; video play/pause still needs to stay off the main-thread critical path |
| Reduced motion | `prefers-reduced-motion` hooks/CSS present across UI; heroes must keep respecting it |
| Schema honesty | Book schema omits fake Offer/Rating; product Offer `price: "0"` is invented and being removed |

---

## 2. Hero / video findings — Products

**Route:** `/products`  
**Implementation notes (observational):**

- Hero uses a video element with an explicit **poster** image.
- `preload="metadata"` is set — browsers should avoid downloading the full video up front solely for the first paint.
- Poster assets also exist under product-hero poster paths for individual product landings / 3D fallbacks.

**Why this matters for SEO**

- `/products` is a high-priority sitemap URL (hub for 5 products).
- Slow LCP on a hub page can degrade experience signals even when content quality is fine.
- Organic visitors arriving from branded or category queries hit this hub often in the intended funnel.

**Keep**

- Poster-first visual completeness for first paint.
- `preload="metadata"` (do not “fix” perceived quality by switching to `preload="auto"`).
- Status-honest product cards below the hero (no fake pricing UI).

**Watch**

- Poster file weight and dimensions matching the display box.
- Autoplay policies and whether multiple sources compete with LCP.
- Ensuring the LCP candidate is the poster (or a lightweight image), not a late video frame.

---

## 3. Hero / video findings — Books

**Route:** `/books`  
**Implementation notes (observational):**

- Same cinematic pattern as Products: video hero, **poster**, `preload="metadata"`.
- Shared cinematic art also used for some title covers (Nightmare Forest / Beyond crops) — separate from the hero video concern but relevant to image weight on detail pages.

**Why this matters for SEO**

- Books hub is a commercial gateway (SEAT AVAILABLE → Amazon outbound).
- Performance regressions here tax the monetization funnel: organic → Books → outbound/lead.

**Keep**

- Poster + metadata preload strategy.
- Honest release badges (AVAILABLE / COMING_SOON / IN_DEVELOPMENT) — trust is part of “performance” in SERP reputation.

**Watch**

- Cover images on `/books/:slug` (especially large Kindle/cover assets) as secondary LCP candidates on detail pages.
- Avoid loading Amazon or third-party widgets that block rendering (outbound should remain a simple link/CTA).

---

## 4. LCP / CLS / INP notes (observational, not lab numbers)

### LCP

- **Likely LCP elements** on Products/Books hubs: hero poster image (desired) or a text block if media is delayed (less ideal if font swap is slow).
- Video with `preload="metadata"` is the correct default; full video bytes should not be required for LCP.
- Individual product pages may LCP on poster / marketing images / 3D poster fallbacks rather than video.

**Do not record fake scores.** When lab tests are run, attach dated exports outside this file or append a dated subsection with real numbers.

### CLS

- Risk sources to watch qualitatively:
  - Hero poster → video swap without reserved aspect ratio
  - Sticky nav height changes
  - Late-loading webfonts without stable fallback metrics
  - Card grids inserting badges/status chips after hydration
- Mitigation direction: intrinsic aspect ratio / min-height on hero media stage; avoid injecting above-fold content after paint.

### INP

- Heroes should not attach expensive per-frame work on main thread for first interaction.
- Reduced-motion users should skip non-essential animation loops (`useReducedMotion` + CSS `@media (prefers-reduced-motion: reduce)` patterns already exist).
- Third-party scripts (if added later for ads/affiliates) are a larger INP risk than the poster strategy itself — evaluate carefully.

---

## 5. Poster + `preload="metadata"` strategy

### Intended behavior

1. Browser fetches hero **poster** for first meaningful paint.
2. Video metadata may load; full media download waits for user agent heuristics / play intent.
3. Visual brand remains cinematic without forcing every visitor to pay full video cost for SEO landings.

### Recommendations made / kept

| Recommendation | Status |
|---|---|
| Use poster images on Products & Books heroes | **Kept** |
| Set `preload="metadata"` on hero videos | **Kept** |
| Do not switch marketing heroes to `preload="auto"` for “richer” feel | **Keep this rule** |
| Honor `prefers-reduced-motion` (static poster / reduced animation) | **Keep / verify** |
| Prefer compressed, correctly sized posters in the hero slot | **Ongoing** |
| Avoid multi-video autoplay stacks above the fold | **Keep** |
| Treat detail-page cover art weight as part of Books performance | **Ongoing** |

---

## 6. Reduced motion

Evidence in codebase:

- `src/ui/useReducedMotion.js` listens for `(prefers-reduced-motion: reduce)`.
- Multiple page CSS files (Products, Books-related product skins, Home, News, ambient UI) include `@media (prefers-reduced-motion: reduce)` rules.

**Audit expectation**

- With reduced motion enabled, hero experience should remain understandable with the **poster** (or still frame), not a broken empty stage.
- Decorative ambient motion should disable; core navigation/CTAs remain usable.

---

## 7. Structured data & performance-of-trust

Performance audits often ignore schema, but invented commercial data creates long-term SEO risk.

| Item | Baseline | Phase 11.3 action |
|---|---|---|
| Book JSON-LD Offer / AggregateRating / price | Omitted (correct) | **Keep omitted** |
| Product JSON-LD `Offer` `price: "0"` | Present on product landings | **Remove** — invented free offer |
| Free rental calculator Offer `0` | Free tool case | Keep only if still accurately “free”; do not copy pattern to paid products |
| Newsletter success | noindex | Keep — prevents thin URL competition |

---

## 8. Other surfaces (brief)

| Surface | Performance note |
|---|---|
| Home | Brand hero imagery; watch image weight; ambient motion behind reduced-motion gates |
| Product detail pages | Poster / 3D model-viewer fallbacks — model load must not block critical content |
| News / Blog | Article heroes; prefer appropriately sized images already referenced in sitemap image extensions |
| Guides | Long-form HTML — watch font/CSS weight more than video |
| Admin/preview | Not SEO-critical; excluded from robots/sitemap |

---

## 9. Recommended validation workflow (when measuring for real)

1. Test `/products` and `/books` on mobile + desktop separately.
2. Note the **actual LCP element** in a real trace (poster vs text vs video frame).
3. Confirm video network waterfall does not rival LCP image bytes on first load.
4. Toggle OS/browser reduced motion and re-check hero.
5. Re-run after any hero asset swap; append dated results — never invent them ahead of time.

---

## 10. Phase 11.3 performance checklist

- [ ] Products hero still has poster + `preload="metadata"`
- [ ] Books hero still has poster + `preload="metadata"`
- [ ] Reduced-motion path verified on both hubs
- [ ] No new above-fold autoplay video added to other money pages without the same strategy
- [ ] Product schema Offer `price: "0"` removed
- [ ] Book schema remains free of fake ratings/prices/offers
- [ ] Optional: attach first real field/lab measurements with date when available

---

## Related docs

- `SEO_BASELINE.md` — known concerns summary
- `SEO_ROUTE_INVENTORY.md` — route-level actions
- `SEO_GROWTH_PLAN.md` — 30/60/90 performance tasks
- `SEARCH_ENGINE_SETUP.md` — measurement setup (GSC/GA4)
