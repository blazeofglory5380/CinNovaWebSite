# SEO Baseline

**Tip:** `e18bf56` (Phase 11.3 worktree)  
**Production:** https://getcinnova.com  
**Analytics property (GA4):** `G-CD944CHBK6`

This baseline records **factual inventory and configuration state only**. It does not include traffic, rankings, impressions, CTR, or any laboratory performance scores.

---

## 1. Content inventory (factual counts)

| Surface | Count | Notes |
|---|---:|---|
| Published blog posts | 45 | Sitemap includes published only |
| Public news stories | 32 | Demo/draft/unpublished excluded from public set + sitemap |
| Catalog books | 4 | See release statuses below |
| Products | 5 | StudyNest, PoisonGuard, Kiddo, TechMate AI, Real Estate AI |
| Resources | 12 | Clean `/resources/:slug` routes |
| Migrated public pages | 50 | Phase 2B clean paths (guides, company, tools, core pages) |
| Sitemap URLs | ~165 | Built via `collectSitemapEntries()`; drifts as content publishes |

### Book release statuses

| Title | Slug | Status |
|---|---|---|
| The Southeast Asian Table | `the-southeast-asian-table` | AVAILABLE |
| Beyond the Last Light | `beyond-the-last-light` | COMING_SOON |
| Nightmare Forest | `nightmare-forest` | IN_DEVELOPMENT |
| Kiddo Illustrated Collection | `kiddo-illustrated-collection` | IN_DEVELOPMENT |

### Products

| Name | Path key |
|---|---|
| StudyNest | `studynest` |
| PoisonGuard | `poisonguard` |
| Kiddo | `kiddo` |
| TechMate AI | `techmate` |
| CinNova Real Estate AI | `real-estate` |

---

## 2. Search Console connection

| Item | Status |
|---|---|
| Google site verification meta in `index.html` | Present: `bIkFCba9eay4SEEiR3u_X6TulZKU69o64-QwKlUtT4I` |
| GSC property connection status | **Verification meta present; GSC property connection status not confirmed in-repo** |
| Sitemap URL to submit | `https://getcinnova.com/sitemap.xml` |
| Video sitemap referenced in robots | `https://getcinnova.com/sitemap-video.xml` |

Operators must confirm in the Google Search Console UI that the property is added, verification succeeded, and the sitemap is accepted. That confirmation is outside the repository.

---

## 3. Bing Webmaster Tools

| Item | Status |
|---|---|
| Bing verification | **NOT configured** |
| Tokens in repo | None (do not invent) |

Setup steps only are documented in `SEARCH_ENGINE_SETUP.md`.

---

## 4. Crawl / index controls

### robots.txt

- `Allow: /`
- Disallows admin/preview paths:
  - `/blog-admin`
  - `/?page=newsletter-admin`
  - `/?page=blog-manager`
  - `/?page=news-preview`
  - `/?page=blog-preview`
- Declares both XML sitemaps above

### NOINDEX / exclusion policy (documented)

| Surface | Policy |
|---|---|
| `/newsletter` | **INDEX** — meaningful landing with content |
| `/newsletter-success` | **NOINDEX**; excluded from sitemap (`EXCLUDED_PAGE_KEYS`) |
| Admin / preview pages | noindex + robots Disallow |
| Draft/demo news & blog preview | noindex; out of sitemap |
| Not Found | noindex,follow; no `/404` canonical |

---

## 5. Legacy redirects status

Implemented via Vercel middleware on `/` + shared `resolveLegacyRouteRedirect()`:

| Legacy pattern | Edge 308 target | Status |
|---|---|---|
| `/?page=products` | `/products` | Done |
| `/?page={product}` | `/products/{key}` | Done |
| `/?page=resources` | `/resources` | Done |
| `/?resource={slug}` | `/resources/{slug}` | Done |
| `/?page=news[&story=]` | `/news` / `/news/{slug}` | Done |
| `/?page=books[&book=]` | `/books` / `/books/{slug}` | Done |
| Migrated `/?page={publicKey}` | Clean `PUBLIC_PAGE_ROUTES` path | Done (50 pages) |
| `?article=` → `/blog/:slug` | `/blog/{slug}` | **Missing — Phase 11.3** |

Client `replaceState` fallback exists for local/non-Vercel hosting for supported legacy queries.

---

## 6. Structured data types in use

Observed JSON-LD `@type` usage across the codebase (not an exhaustiveness proof for every page render):

| Type | Typical surfaces |
|---|---|
| `Organization` | Home, publishers across pages |
| `WebSite` | Home |
| `WebPage` / `AboutPage` / `ContactPage` | Marketing & company pages |
| `CollectionPage` | Products, Books, News, Resources, Languages, Guides hub |
| `Blog` / `BlogPosting` | Blog index & articles |
| `NewsArticle` | News stories (+ index listing refs) |
| `Book` | Book detail (no Offer / no AggregateRating) |
| `SoftwareApplication` | Product landings |
| `CreativeWork` | Resources |
| `TechArticle` | AI guides |
| `WebApplication` | Rental property calculator |
| `BreadcrumbList` | News / helpers |
| `FAQPage` | Via schema helpers where used |
| `ImageObject` / `Person` / `Place` | Helpers & news metadata |
| `Offer` | Present on some product landings as `price: "0"` — **invented free Offer; Phase 11.3 removes from product pages**. Free calculator Offer is a separate free-tool case. |

**Book schema policy (baseline):** no fake ratings, prices, or offers.

---

## 7. Known performance concerns (observational)

- **Cinematic hero videos** on **Products** (`/products`) and **Books** (`/books`) are the primary performance risk for LCP.
- Mitigation already in product: `preload="metadata"` + poster images (not full video preload).
- `prefers-reduced-motion` CSS/hooks exist across UI; heroes should respect reduced motion.
- No fabricated Lighthouse/CWV numbers are recorded in this baseline. See `SEO_PERFORMANCE_AUDIT.md` for qualitative notes and recommendations.

---

## 8. Monetization funnel (SEO-relevant)

```
organic → content (News / Blog / Guides / Resources)
       → Books / Products / Newsletter
       → Amazon outbound (AVAILABLE books) / lead capture
```

Metric definitions (rates only; no measured values claimed): see `SEARCH_ENGINE_SETUP.md` and `MONETIZATION_METRICS.md`.

---

## 9. Explicit non-goals at this baseline

- No Google News sitemap (later decision)
- No invented Bing verification tokens
- No traffic/ranking claims
- No fabricated Core Web Vitals lab numbers
- No claiming GSC “connected” beyond verification meta presence in-repo
