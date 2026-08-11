# CinNova Editorial — Phase 4

Coverage expansion, Blog Engine 2.0, controlled draft readiness — **shadow only**.

## Modes (fail closed)

| Mode | Status in Phase 4 |
|---|---|
| SHADOW | **Active** for production scheduler |
| DRAFT | Prepared; not globally activated |
| PUBLISH | Disabled (fail closed to SHADOW) |
| AUTO_PUBLISH | Disabled (fail closed to SHADOW) |

## Source coverage

- Complementary feeds added (EPA, USGS, DOE, ESA, Guardian Technology, Cloudflare Blog, Hugging Face Blog)
- Still **unavailable without license**: AP, Reuters, Bloomberg, FT, CNBC, Wired (as documented), Science journal, Anthropic RSS, NIH (403), WH/DOJ, local partners
- Desk matrix: `scripts/editorial/research/sourceCoverage.mjs` → `buildCoverageMatrix()`
- Goal: improve independent corroboration paths — not maximize feed count
- News READY still requires ≥2 genuinely independent sources + claim agreement

## Blog Engine 2.0

- Categories: AI explainers/tutorials, technology guides, cybersecurity, productivity, software, business, startups, design, education, app guides, CinNova ecosystem
- Evergreen qualification does **not** require breaking-news freshness
- Still requires authoritative sources, search intent, originality, dedupe, citations
- 30-day calendar: `buildBlogContentCalendar()` — **plan only**, no publish, no invented search volume

## Commercial boundary

- CTAs allowed: books, apps, newsletter, products, affiliate (disclosed)
- Editorial conclusions independent of monetization
- Affiliate disclosure required; sponsored labeled
- No fake reviews/testing/personal experience
- Monetization activation remains OFF

## Draft safety

- HOLD/REJECT never become draft files
- Drafts: `isPublished=false`, excluded from sitemap / RSS / search / prerender / structured data
- Tests: `npm run test:editorial-phase4`

## Images / translation

- Hero kinds designed: APPROVED_SOURCE / LICENSED_STOCK / CINNOVA_ORIGINAL / AI_ILLUSTRATION / NO_IMAGE
- No unauthorized generation or news-photography scrape in this phase
- Translation jobs: MISSING → … → PUBLISHED status machine; English authoritative; no new facts

## Multi-day metrics

- `editorial-reports/shadow-quality-metrics.json` accumulates **real** runs only

## Safety

No merge · no deploy · no live publication · scheduler SHADOW · no auto-publish · no fabricated facts/quotes · no fake corroboration · no live affiliate activation
