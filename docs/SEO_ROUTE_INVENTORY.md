# SEO Route Inventory

**Scope:** CinNova production site at tip `e18bf56` / Phase 11.3 worktree  
**Production origin:** https://getcinnova.com  
**Inventory date:** Phase 11.3 documentation pass  

Counts used below are factual inventory figures (not traffic or ranking claims):

| Surface | Count |
|---|---|
| Published blog posts | 45 |
| Public news stories | 32 |
| Catalog books | 4 |
| Products | 5 |
| Resources | 12 |
| Migrated public pages | 50 |
| Sitemap URLs | ~165 |

**Column legend**

| Field | Meaning |
|---|---|
| Route | Canonical path pattern |
| Purpose | Why the URL exists |
| Indexable | Intended crawl/index policy |
| Canonical | Self-canonical expectation |
| Title source | Where `<title>` / SEO title is defined |
| Description | Meta description source |
| OG | Open Graph / Twitter handling |
| Schema | JSON-LD types in use |
| Sitemap | Included in `sitemap.xml`? |
| Internal links | Primary in-site discovery |
| Legacy | `?page=` / query legacy status |
| Issues | Known gaps at tip |
| Action (Phase 11.3) | Planned remediation |

---

## `/` — Home

| Field | Value |
|---|---|
| Route | `/` |
| Purpose | Brand + product ecosystem entry; primary organic landing |
| Indexable | Yes |
| Canonical | `https://getcinnova.com/` |
| Title source | Home page SEO / `PageSEO` |
| Description | Home page meta description |
| OG | Default OG image (`defaultOgImage` / homepage hero) |
| Schema | `Organization`, `WebSite` |
| Sitemap | Yes (priority 1.0, weekly) |
| Internal links | Nav → Products, Books, News, Blog, Resources, About, Newsletter |
| Legacy | Plain `/` (no redirect) |
| Issues | None structural |
| Action (Phase 11.3) | Keep; ensure internal CTAs favor clean paths |

---

## `/products` — Product index

| Field | Value |
|---|---|
| Route | `/products` |
| Purpose | Hub for StudyNest, PoisonGuard, Kiddo, TechMate AI, Real Estate AI |
| Indexable | Yes |
| Canonical | `https://getcinnova.com/products` |
| Title source | Products page SEO |
| Description | Products collection meta |
| OG | Page-level OG; cinematic hero poster available for LCP |
| Schema | `CollectionPage` |
| Sitemap | Yes |
| Internal links | Home, product cards → `/products/:key`, Resources, Newsletter |
| Legacy | `/?page=products` → 308 → `/products` (middleware) |
| Issues | Hero video performance (see `SEO_PERFORMANCE_AUDIT.md`) |
| Action (Phase 11.3) | Keep poster + `preload=metadata`; monitor LCP |

---

## `/products/:key` — Product landings

| Field | Value |
|---|---|
| Route | `/products/studynest`, `/products/poisonguard`, `/products/kiddo`, `/products/techmate`, `/products/real-estate` |
| Purpose | Product marketing + lead/newsletter paths |
| Indexable | Yes |
| Canonical | `https://getcinnova.com/products/{key}` |
| Title source | Per-product page SEO |
| Description | Per-product meta |
| OG | Product marketing / poster imagery |
| Schema | `SoftwareApplication` (+ helpers such as `ImageObject`, breadcrumbs/FAQ where present) |
| Sitemap | Yes (5 URLs) |
| Internal links | `/products`, related Resources, Guides, Newsletter, Real Estate calculator (RE) |
| Legacy | `/?page={key}` → 308 → `/products/{key}` |
| Issues | Offer `price: "0"` previously present on product schema — **invented free Offer; being removed in Phase 11.3** |
| Action (Phase 11.3) | Remove invented `Offer`/`price: "0"` from product JSON-LD; keep factual SoftwareApplication fields |

---

## `/books` — Books storefront index

| Field | Value |
|---|---|
| Route | `/books` |
| Purpose | CinNova Books catalog hub; Amazon outbound for AVAILABLE titles |
| Indexable | Yes |
| Canonical | `https://getcinnova.com/books` |
| Title source | Books page SEO |
| Description | Books collection meta |
| OG | Shared Books cinematic art / poster |
| Schema | `CollectionPage` |
| Sitemap | Yes |
| Internal links | Home, book cards → `/books/:slug`, Newsletter |
| Legacy | `/?page=books` → 308 → `/books` |
| Issues | Hero video performance (same pattern as Products) |
| Action (Phase 11.3) | Keep poster + `preload=metadata`; no fake ratings/prices |

---

## `/books/:slug` — Book detail

| Field | Value |
|---|---|
| Route | `/books/the-southeast-asian-table`, `/books/beyond-the-last-light`, `/books/nightmare-forest`, `/books/kiddo-illustrated-collection` |
| Purpose | Title detail; commerce CTA only when verified |
| Indexable | Yes |
| Canonical | `https://getcinnova.com/books/{slug}` |
| Title source | `{title} \| CinNova Books` |
| Description | Catalog description / synopsis |
| OG | Cover art |
| Schema | `Book` — **no Offer, no AggregateRating, no invented price** |
| Sitemap | Yes (4 URLs) |
| Internal links | `/books`, Newsletter signup on detail |
| Legacy | `/?page=books&book={slug}` → 308 → `/books/{slug}` |
| Issues | Only SEAT is AVAILABLE (Amazon outbound). Beyond = COMING_SOON; Nightmare Forest + Kiddo Illustrated = IN_DEVELOPMENT |
| Action (Phase 11.3) | Preserve honest status labels; continue omitting Offer until on-site verified price exists |

---

## `/news` — News Center index

| Field | Value |
|---|---|
| Route | `/news` |
| Purpose | Fresh news hub (32 public stories) |
| Indexable | Yes |
| Canonical | `https://getcinnova.com/news` |
| Title source | News index SEO |
| Description | News Center meta |
| OG | Index-level OG |
| Schema | `CollectionPage` (+ listing `NewsArticle` refs where emitted) |
| Sitemap | Yes (daily changefreq) |
| Internal links | Home, story cards, Blog cross-links where editorial |
| Legacy | `/?page=news` → 308 → `/news` |
| Issues | Google News sitemap **not warranted yet** (later decision) |
| Action (Phase 11.3) | Maintain freshness publishing; do not add News sitemap until editorial cadence + GSC data justify it |

---

## `/news/:slug` — News story

| Field | Value |
|---|---|
| Route | `/news/{slug}` |
| Purpose | Individual sourced news article |
| Indexable | Yes for public published stories; **noindex** for draft/demo/unpublished |
| Canonical | `https://getcinnova.com/news/{slug}` (public only) |
| Title source | `seoTitle` / story title |
| Description | Story SEO description |
| OG | Story hero image |
| Schema | `NewsArticle`, `BreadcrumbList`, publisher Organization |
| Sitemap | Public stories only (32); demos/drafts excluded |
| Internal links | News index, related stories, topical products when relevant |
| Legacy | `/?page=news&story={slug}` → 308 → `/news/{slug}` |
| Issues | Preview routes must stay noindex / out of sitemap |
| Action (Phase 11.3) | Keep public/preview separation; monitor indexing of public stories in GSC |

---

## `/blog` — Blog index

| Field | Value |
|---|---|
| Route | `/blog` |
| Purpose | Evergreen content hub (45 published posts) |
| Indexable | Yes |
| Canonical | `https://getcinnova.com/blog` |
| Title source | Blog index SEO |
| Description | Blog meta |
| OG | Default / featured post imagery |
| Schema | `Blog` (+ `BlogPosting` listing items) |
| Sitemap | Yes |
| Internal links | Home, category hubs, article cards, Resources, Products |
| Legacy | Clean `/blog` primary; legacy query article deep-links incomplete (see below) |
| Issues | Missing `?article=` → `/blog/:slug` middleware redirect (Phase 11.3) |
| Action (Phase 11.3) | Add legacy `?article=` → `/blog/{slug}` 308 redirect |

---

## `/blog/:slug` — Blog article

| Field | Value |
|---|---|
| Route | `/blog/{slug}` |
| Purpose | Evergreen article (45 published) |
| Indexable | Yes for published; preview = noindex |
| Canonical | `https://getcinnova.com/blog/{slug}` |
| Title source | Post SEO title |
| Description | Post meta description |
| OG | Post hero / ogImage |
| Schema | `BlogPosting`, Organization, ImageObject as applicable |
| Sitemap | Published posts only |
| Internal links | Category hub, related posts, cluster destinations (Books/Products/Newsletter) |
| Legacy | **Gap:** `?article=` not yet redirected via middleware (being added in Phase 11.3) |
| Issues | Legacy article URLs may still resolve client-side without edge 308 |
| Action (Phase 11.3) | Implement `?article=` → `/blog/:slug` in `legacyRouteRedirects` + middleware path |

---

## `/blog/category/:slug` — Category hubs

| Field | Value |
|---|---|
| Route | `/blog/category/{slug}` |
| Purpose | Category filters for blog taxonomy |
| Indexable | Yes |
| Canonical | Category clean URL |
| Title source | Category + Blog branding |
| Description | Category listing meta |
| OG | Blog-level defaults |
| Schema | Collection-style listing (Blog index patterns) |
| Sitemap | Yes (one per `blogCategories` entry) |
| Internal links | Blog index ↔ category ↔ articles |
| Legacy | N/A (clean routes) |
| Issues | Thin category pages if few posts — monitor in GSC |
| Action (Phase 11.3) | Ensure each category has meaningful listings; strengthen internal links from articles |

**Categories in registry:** AI News, Artificial Intelligence, Real Estate Technology, Education Technology, Healthcare Technology, Construction Technology, Data Centers & Databases, Robotics & Automation, Future Technology, Business & Entrepreneurship, CinNova Updates.

---

## `/resources` — Resource library index

| Field | Value |
|---|---|
| Route | `/resources` |
| Purpose | Downloadable / gated resource hub (12 resources) |
| Indexable | Yes |
| Canonical | `https://getcinnova.com/resources` |
| Title source | Resources page SEO |
| Description | Library meta |
| OG | Resource marketing imagery |
| Schema | `CollectionPage`, listed `CreativeWork` |
| Sitemap | Yes |
| Internal links | Products, Blog, Newsletter lead capture |
| Legacy | `/?page=resources` → 308 → `/resources` |
| Issues | None structural |
| Action (Phase 11.3) | Keep; align resource CTAs with monetization funnel |

---

## `/resources/:slug` — Resource detail

| Field | Value |
|---|---|
| Route | `/resources/{slug}` (12 slugs) |
| Purpose | Individual resource landing + lead path |
| Indexable | Yes |
| Canonical | `https://getcinnova.com/resources/{slug}` |
| Title source | Resource title SEO |
| Description | Resource description |
| OG | Resource hero image |
| Schema | `CreativeWork` |
| Sitemap | Yes |
| Internal links | Related products, Resources index, Newsletter |
| Legacy | `/?resource={slug}` → 308 → `/resources/{slug}` |
| Issues | None structural |
| Action (Phase 11.3) | Keep; ensure related-product links use clean `/products/:key` |

---

## `/about`

| Field | Value |
|---|---|
| Route | `/about` |
| Purpose | Company / brand story |
| Indexable | Yes |
| Canonical | `https://getcinnova.com/about` |
| Title source | `PUBLIC_PAGE_ROUTES` + page SEO |
| Description | Registry + page meta |
| OG | Default / about imagery |
| Schema | `AboutPage` / WebPage pattern |
| Sitemap | Yes |
| Internal links | Home, Products, Contact, Press |
| Legacy | `/?page=about` → 308 → `/about` |
| Issues | None |
| Action (Phase 11.3) | Keep |

---

## `/newsletter` — Newsletter landing

| Field | Value |
|---|---|
| Route | `/newsletter` |
| Purpose | Meaningful subscribe landing (product updates, guides, early access) |
| Indexable | **Yes (INDEX)** — content page, not a thin thank-you |
| Canonical | `https://getcinnova.com/newsletter` |
| Title source | `PUBLIC_PAGE_ROUTES` + NewsletterPage SEO |
| Description | Newsletter landing meta |
| OG | Page-level OG |
| Schema | `WebPage` |
| Sitemap | Yes |
| Internal links | Home, Blog, Books, Products CTAs |
| Legacy | `/?page=newsletter` → 308 → `/newsletter` |
| Issues | None for index policy |
| Action (Phase 11.3) | Keep INDEX; measure `organic_to_newsletter_rate` once GSC+GA4 joined |

---

## `/newsletter-success` — Post-subscribe confirmation

| Field | Value |
|---|---|
| Route | `/newsletter-success` (and/or `?page=newsletter-success`) |
| Purpose | Confirmation / success state after signup |
| Indexable | **NOINDEX** (must not compete with `/newsletter`) |
| Canonical | Prefer no strong self-canonical competition; stay out of sitemap |
| Title source | Success page SEO with `noindex` |
| Description | Transactional copy |
| OG | Not a discovery surface |
| Schema | Minimal / none required |
| Sitemap | **Excluded** (`EXCLUDED_PAGE_KEYS`) |
| Internal links | Soft links back to Home / Blog / Products |
| Legacy | Query form may still exist; not a marketing destination |
| Issues | Documented NOINDEX requirement — verify meta remains |
| Action (Phase 11.3) | Confirm `noindex` stays; never add to sitemap |

---

## Guides (`/guides` and `/guides/...`)

| Field | Value |
|---|---|
| Route | `/guides` (AI tutorials hub) + 34 individual guide paths under `/guides/...` (including language variants) |
| Purpose | Evergreen AI tutorials and workflow guides |
| Indexable | Yes |
| Canonical | Clean `/guides/...` paths from `PUBLIC_PAGE_ROUTES` |
| Title source | Registry titles (mirror TutorialSEO) |
| Description | Registry descriptions |
| OG | Guide / default OG |
| Schema | Hub: `CollectionPage`; guides: `TechArticle` (hreflang groups where language variants exist) |
| Sitemap | Yes (migrated public pages) |
| Internal links | AI Tutorials hub, related products (StudyNest / TechMate / Real Estate), Blog clusters |
| Legacy | `/?page={guide-key}` → 308 → clean `/guides/...` |
| Issues | Large guide set — watch for cannibalization; use clear internal linking |
| Action (Phase 11.3) | Keep registry sync with sitemap; strengthen cluster links to Products/Books |

---

## Company pages (`/company/*`)

| Field | Value |
|---|---|
| Route | `/company/partners`, `/company/partnerships`, `/company/press`, `/company/media-kit`, `/company/advertise`, `/company/partner-with-us`, `/company/sponsor-newsletter` |
| Purpose | Partnerships, press, advertising, sponsorship |
| Indexable | Yes |
| Canonical | Clean `/company/...` |
| Title source | `PUBLIC_PAGE_ROUTES` |
| Description | Registry + page SEO |
| OG | Page-level / default |
| Schema | `WebPage` |
| Sitemap | Yes |
| Internal links | About, Contact, Newsletter sponsor path |
| Legacy | `/?page={key}` → 308 |
| Issues | None structural |
| Action (Phase 11.3) | Keep; do not invent audience stats in copy beyond verified media kit claims |

---

## Tools / calculator

| Field | Value |
|---|---|
| Route | `/tools/rental-property-calculator` |
| Purpose | Free rental property calculator → Real Estate AI funnel |
| Indexable | Yes |
| Canonical | `https://getcinnova.com/tools/rental-property-calculator` |
| Title source | Registry Tech/tool title |
| Description | Cash flow / cap rate / ROI calculator meta |
| OG | Tool page OG |
| Schema | `WebApplication` (Offer price `0` on free tool is a known pattern — treat carefully; do not invent paid prices elsewhere) |
| Sitemap | Yes |
| Internal links | Real Estate AI product, Resources (deal/cash-flow templates), Blog RE cluster |
| Legacy | `/?page=free-rental-property-calculator` → 308 |
| Issues | Free Offer on calculator is intentional for a free tool; product landings must not invent prices |
| Action (Phase 11.3) | Keep tool; remove invented product Offers separately |

---

## Other migrated public pages

| Route family | Examples | Indexable | Sitemap | Notes |
|---|---|---|---|---|
| Pricing | `/pricing` | Yes | Yes | Plans/tiers information |
| Contact | `/contact` | Yes | Yes | ContactPage schema |
| Languages | `/languages` | Yes | Yes | Language chooser hub |
| Privacy / Terms | `/privacy`, `/terms` | Yes | Yes | Legal; yearly changefreq |
| Migrated total | 50 non-home public pages | Yes (except excluded) | Yes | Clean paths via Phase 2B |

---

## Admin / preview (non-public)

| Field | Value |
|---|---|
| Route | `/blog-admin`, `/?page=blog-manager`, `/?page=newsletter-admin`, `/?page=news-preview`, `/?page=blog-preview` |
| Purpose | Editorial / admin / preview tooling |
| Indexable | **No** — robots Disallow + page `noindex` where rendered |
| Canonical | N/A for discovery |
| Title source | Admin UI titles |
| Description | N/A |
| OG | N/A |
| Schema | N/A |
| Sitemap | Excluded |
| Internal links | Not linked from public nav |
| Legacy | Query admin keys intentionally **not** redirected to invented clean public routes |
| Issues | robots.txt is not access control |
| Action (Phase 11.3) | Keep Disallow + noindex; do not expose unauthenticated monetization admin |

**robots.txt Disallow paths:**

```
Disallow: /blog-admin
Disallow: /?page=newsletter-admin
Disallow: /?page=blog-manager
Disallow: /?page=news-preview
Disallow: /?page=blog-preview
```

---

## 404 / Not Found

| Field | Value |
|---|---|
| Route | Soft 404 / `not-found` experience |
| Purpose | Unknown paths |
| Indexable | **noindex,follow** — no canonical to `/404` |
| Canonical | None (never invent `/404` canonical) |
| Title source | NotFound page |
| Description | Minimal |
| OG | N/A |
| Schema | None |
| Sitemap | No |
| Internal links | Home, Products, Blog |
| Legacy | N/A |
| Issues | Ensure unknown legacy queries do not soft-200 indexable shells |
| Action (Phase 11.3) | Keep noindex; validate crawl of junk query URLs |

---

## Sitemap

| Field | Value |
|---|---|
| Route | `/sitemap.xml` (+ `/sitemap-video.xml` referenced in robots) |
| Purpose | URL discovery for search engines (~165 locs) |
| Indexable | N/A (feed) |
| Contents | Home, migrated static pages, blog index + categories + posts, news stories, products index + landings, books index + details, resources index + details; image extensions where attached |
| Excluded | Admin, previews, `newsletter-success`, demos/drafts |
| Issues | Count drifts as content publishes — regenerate on build |
| Action (Phase 11.3) | Submit/confirm in GSC; add blog article redirect so legacy URLs consolidate before crawl waste |

**Google News sitemap:** Not warranted yet. Document as a later decision after news cadence and Search Console performance justify a separate news feed.

---

## robots.txt

| Field | Value |
|---|---|
| Route | `/robots.txt` |
| Purpose | Crawl allowances + sitemap pointers |
| Allow | `/` |
| Disallow | Admin/preview paths listed above |
| Sitemap | `https://getcinnova.com/sitemap.xml`, `https://getcinnova.com/sitemap-video.xml` |
| Issues | Does not block `/newsletter-success` by path — relies on **noindex** + sitemap exclusion (documented intentionally) |
| Action (Phase 11.3) | Keep; verify newsletter-success noindex in audits |

---

## Cross-cutting: legacy redirects

| Pattern | Status |
|---|---|
| `/?page=products` | 308 → `/products` |
| `/?page={productKey}` | 308 → `/products/{key}` |
| `/?page=resources` | 308 → `/resources` |
| `/?resource={slug}` | 308 → `/resources/{slug}` |
| `/?page=news[&story=]` | 308 → `/news` or `/news/{slug}` |
| `/?page=books[&book=]` | 308 → `/books` or `/books/{slug}` |
| Migrated public `/?page={key}` | 308 → clean path from `PUBLIC_PAGE_ROUTES` |
| `?article=` → `/blog/:slug` | **Missing — Phase 11.3 action** |

Middleware matcher is `/` only (edge 308). Clean routes never enter the redirect loop.

---

## Monetization funnel (SEO context)

Organic discovery → content (News / Blog / Guides / Resources) → Books / Products / Newsletter → Amazon outbound (AVAILABLE books) or lead capture.

Do not invent conversion rates in this inventory; definitions live in `SEARCH_ENGINE_SETUP.md` and monetization metrics docs.
