# SEO Growth Plan

**Scope:** CinNova Phase 11.3 onward (tip `e18bf56` baseline)  
**Production:** https://getcinnova.com  

This plan prioritizes technical correctness, honest structured data, content clustering against real products, and measurement setup. It does **not** include fabricated traffic projections, ranking guarantees, or invented volumes.

---

## Strategic pillars

### 1. Technical SEO
- Finish legacy consolidation: add `?article=` → `/blog/:slug` 308 (Phase 11.3 gap).
- Remove invented product `Offer` / `price: "0"` from product JSON-LD.
- Keep Book schema free of Offer / AggregateRating / invented prices.
- Preserve robots Disallow for admin/preview; keep `/newsletter-success` NOINDEX + sitemap-excluded; keep `/newsletter` INDEX.
- Confirm GSC property (verification meta already present) and submit `https://getcinnova.com/sitemap.xml`.
- Configure Bing Webmaster Tools (not configured today).
- Keep sitemap generation aligned with registries (~165 URLs today; will grow with publishes).

### 2. News freshness
- Continue publishing sourced public news (32 stories at baseline).
- Prefer News → Evergreen internal links into Guides/Blog/Products.
- Do **not** add a Google News sitemap yet; revisit when cadence + GSC data justify it.
- Keep drafts/demos noindex and out of sitemap.

### 3. Evergreen Blog
- 45 published posts at baseline — improve internal links into cluster destinations.
- Strengthen category hubs (`/blog/category/:slug`) with clearer intro copy only when thin; avoid doorway pages.
- Use `SEO_CONTENT_CLUSTERS.md` for new article *concepts*; do not mass-generate thin posts.
- Bridge AI News blog category with News Center carefully (duplicate intent control).

### 4. Books
- Push SEAT (AVAILABLE) as the only purchase-capable title via Amazon outbound.
- Use COMING_SOON / IN_DEVELOPMENT pages for awareness + newsletter — never fake availability.
- Maintain Books hero poster + `preload=metadata` performance posture.
- Cluster cooking / publishing content toward `/books` and SEAT detail.

### 5. Products
- Five product landings: StudyNest, PoisonGuard, Kiddo, TechMate AI, Real Estate AI.
- Real Estate: calculator + templates as the sharpest commercial assist.
- PoisonGuard: higher factual bar; safety disclaimers; no emergency overclaim.
- StudyNest / TechMate / Kiddo: status-honest education content → product → newsletter.
- Fix schema Offer invention on product pages (Phase 11.3).

### 6. Internal linking
- One primary commercial destination per article where possible.
- Standard paths: News → Blog/Guides → Product/Book/Calculator → Newsletter.
- Prefer clean paths everywhere (no new `?page=` links in content).
- Resources (12) should deep-link related products.

### 7. Authority
- Guides library (`/guides` + language variants) is a major authority asset — keep tutorials accurate and updated.
- Company/press pages support brand queries; do not invent audience stats.
- Cite primary sources on news; avoid unearned expertise claims on YMYL-adjacent safety topics.

### 8. Performance
- Treat Products/Books cinematic heroes as the main CWV risk.
- Keep posters + `preload=metadata`; honor `prefers-reduced-motion`.
- Re-test after hero changes; record observations in `SEO_PERFORMANCE_AUDIT.md` without inventing scores.

### 9. Measurement
- GA4: `G-CD944CHBK6` (privacy-safe relationship documented in setup guide).
- GSC: confirm property + sitemap; monitor impressions/clicks/CTR/coverage by surface.
- Define SEO→monetization rates (organic_to_*) — definitions only until data exists.
- Bing: configure, then monitor separately once verified.

---

## 30 / 60 / 90 day plan

### Days 0–30 — Foundation & trust

**Technical**
- [ ] Ship `?article=` → `/blog/:slug` redirect.
- [ ] Remove invented product Offer `price: "0"` from product schema.
- [ ] Audit `/newsletter-success` noindex still present.
- [ ] Confirm GSC verification using existing meta; submit sitemap.
- [ ] Start Bing Webmaster Tools setup (no fake tokens).

**Content / linking**
- [ ] Add internal links from top existing Blog/News pieces into SEAT, Real Estate calculator, and Newsletter (only where editorially natural).
- [ ] PoisonGuard: review safety copy for overclaim; fix if needed.

**Performance**
- [ ] Verify Products/Books heroes still use poster + `preload=metadata`.
- [ ] Spot-check reduced-motion behavior on those pages.

**Measurement**
- [ ] Document which GA4 explorations/reports will hold organic landing → book/product/newsletter/outbound (no fabricated baselines).

### Days 31–60 — Cluster depth

**Technical**
- [ ] Resolve GSC coverage issues found after sitemap submission (redirects, noindex conflicts, soft 404s).
- [ ] Ensure new publishes appear in sitemap on deploy.

**Content**
- [ ] Publish a small set of cluster articles from `SEO_CONTENT_CLUSTERS.md` (quality over quantity) across Real Estate, SEAT/cooking, and Study.
- [ ] Strengthen News → evergreen bridges on new stories.
- [ ] Refresh 1–2 high-potential existing guides for accuracy (not keyword stuffing).

**Commercial SEO**
- [ ] SEAT detail + Books index CTA clarity (trust-first; no fake ratings).
- [ ] Calculator → Real Estate AI path QA.

**Measurement**
- [ ] Begin segmenting GSC performance by directory (`/news`, `/blog`, `/books`, `/products`, `/guides`) once data exists.
- [ ] Wire or verify analytics events needed for organic_to_* rate definitions.

### Days 61–90 — Expansion & decision gates

**Technical**
- [ ] Re-audit structured data (Books still clean; products without invented Offers).
- [ ] Revisit whether video sitemap entries remain accurate after hero asset changes.

**Content**
- [ ] Expand Tech/AI and Product-building clusters with a few durable posts.
- [ ] Evaluate Kiddo bridge content only with honest IN_DEVELOPMENT status.
- [ ] Continue news freshness without sacrificing sourcing standards.

**Decision gate — Google News sitemap**
- [ ] Review news cadence, original reporting depth, and GSC behavior.
- [ ] Only then decide whether a Google News sitemap is warranted (default remains **not yet**).

**Authority / partners**
- [ ] Align company/advertise pages with real sponsorship readiness docs — no invented metrics.

**Measurement**
- [ ] First honest read of SEO→monetization rates if sample sizes allow; otherwise keep “insufficient data.”
- [ ] Adjust next-quarter topics from observed queries (GSC), not invented keyword lists.

---

## Operating principles

1. **Honesty over rich results theater** — omit Offer/Rating when unverified.
2. **Clean URLs only for new links** — legacy redirects are a bridge, not a template.
3. **Clusters follow products** — do not invent businesses (e.g., StageScout) as SEO pillars.
4. **No fake forecasts** — success is measured after GSC/GA4 data exists.
5. **Safety cluster restraint** — PoisonGuard content is held to a higher factual bar.

---

## Related docs

- `SEO_ROUTE_INVENTORY.md` — route-level actions
- `SEO_CONTENT_CLUSTERS.md` — topic map
- `SEO_BASELINE.md` — factual counts & config state
- `SEARCH_ENGINE_SETUP.md` — GSC/Bing/GA4 procedures
- `SEO_PERFORMANCE_AUDIT.md` — hero/video CWV notes
- `MONETIZATION_METRICS.md` — commerce event definitions
