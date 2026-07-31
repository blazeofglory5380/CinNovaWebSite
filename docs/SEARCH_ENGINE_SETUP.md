# Search Engine Setup

**Production:** https://getcinnova.com  
**GA4 measurement ID:** `G-CD944CHBK6`  
**Google site verification meta (already in `index.html`):**  
`bIkFCba9eay4SEEiR3u_X6TulZKU69o64-QwKlUtT4I`  
**Bing verification:** NOT configured (setup steps only; no token in repo)

This guide is procedural. It does not claim that Search Console or Bing properties are already connected beyond what exists in-repo.

---

## 1. Google Search Console — using existing verification meta

### 1.1 Add the property

1. Sign in to [Google Search Console](https://search.google.com/search-console).
2. Add a property for the production site.
   - Prefer **URL-prefix** property: `https://getcinnova.com/`  
   - Optionally also add a **Domain** property later if DNS verification is available; not required for the existing HTML meta method.
3. Choose **HTML tag** verification if prompted.

### 1.2 Verify with the existing meta tag

The site already includes:

```html
<meta name="google-site-verification" content="bIkFCba9eay4SEEiR3u_X6TulZKU69o64-QwKlUtT4I" />
```

1. In GSC, ensure the verification content string matches the meta above exactly.
2. Deploy / confirm production `index.html` serves that tag on `https://getcinnova.com/`.
3. Click **Verify** in GSC.
4. If verification fails: View Page Source on production and confirm the meta is present in the initial HTML (not only injected after JS).

**In-repo status wording:** verification meta present; GSC property connection status not confirmed in-repo. Record the UI confirmation date in your ops notes outside inventing it here.

### 1.3 Users & permissions

- Add owners/users who need coverage and performance access.
- Keep access limited; Search Console data can reveal query strategies.

---

## 2. Sitemap submission

### 2.1 Primary sitemap

Submit:

`https://getcinnova.com/sitemap.xml`

Expected contents at baseline: ~165 URLs covering home, migrated public pages, blog (index/categories/posts), news stories, products, books, and resources. Excludes admin/preview and `newsletter-success`.

### 2.2 Video sitemap

`robots.txt` also declares:

`https://getcinnova.com/sitemap-video.xml`

Submit this in GSC if the file is served and maintained. If GSC reports fetch errors, fix generation before relying on it.

### 2.3 Submission steps

1. GSC → **Sitemaps**.
2. Enter `sitemap.xml` (and `sitemap-video.xml` if applicable).
3. Submit and wait for “Success” / discovered URL counts.
4. Re-check after each major deploy that changes routes or publishing volume.

### 2.4 Google News sitemap

**Not warranted yet.** Do not submit a News-specific sitemap until editorial cadence and measured Search performance justify the operational cost. Standard sitemap story URLs are sufficient for now. See `SEO_GROWTH_PLAN.md` decision gate (days 61–90).

---

## 3. URL Inspection workflow

Use **URL Inspection** for any URL that must rank or that shows coverage problems.

### 3.1 When to inspect

- New canonical routes after migration (`/products/...`, `/books/...`, `/news/...`, `/blog/...`, `/guides/...`).
- After adding the `?article=` → `/blog/:slug` redirect (Phase 11.3).
- Suspected soft-404 or duplicate (`?page=` vs clean path).
- Structured-data changes (Book schema, product Offer removal).
- `noindex` confirmation for `/newsletter-success`, previews, 404.

### 3.2 Steps

1. Paste the **canonical clean URL** (not the legacy query form, unless testing the redirect).
2. Review:
   - Google-selected canonical vs user-declared canonical
   - Indexing allowed? (`noindex` / robots)
   - Crawl fetched HTML vs SPA expectations (prerender/static HTML where applicable)
3. If the page should be indexed and is eligible: **Request indexing** (sparingly; not for bulk).
4. For legacy URLs: Inspect `/?page=...` or future `?article=` and confirm **308/redirect** to the clean path, then inspect the clean target.

### 3.3 Redirect checks (Phase 11.3)

| Test URL pattern | Expected |
|---|---|
| `/?page=products` | 308 → `/products` |
| `/?page=studynest` (etc.) | 308 → `/products/{key}` |
| `/?page=books&book=the-southeast-asian-table` | 308 → `/books/the-southeast-asian-table` |
| `/?page=news&story={slug}` | 308 → `/news/{slug}` |
| `?article={slug}` (after fix) | 308 → `/blog/{slug}` |

---

## 4. Indexing monitoring

### 4.1 Coverage / Pages reports

Monitor regularly:

- Indexed vs not indexed reasons (excluded by `noindex`, redirect, not found, crawled currently not indexed, duplicate).
- Spikes in `?page=` URLs still being indexed (should decline as 308s consolidate).
- Accidental indexing of preview/admin URLs (should be zero).
- Accidental indexing of `/newsletter-success` (should be zero; landing `/newsletter` should remain indexable).

### 4.2 Enhancement reports

After Offer removal on products and continued clean Book schema:

- Watch for rich-result eligibility changes (do not force Offers).
- Validate NewsArticle / BlogPosting where Google reports errors.

### 4.3 Cadence

| Cadence | Actions |
|---|---|
| Weekly (early) | Sitemap status, new coverage errors, redirect anomalies |
| Biweekly | Query/page performance by directory |
| After each SEO deploy | Spot URL Inspection on changed templates |

---

## 5. Bing Webmaster Tools setup (no fake tokens)

Bing verification is **not configured**. Do not invent a `msvalidate.01` token in docs or code until one is issued to the property owner.

### 5.1 Create / claim the site

1. Sign in to [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Add `https://getcinnova.com`.
3. Choose a verification method Bing offers, for example:
   - **XML file** upload to `public/`
   - **Meta tag** in `index.html`
   - **DNS CNAME/TXT**
   - **Import from Google Search Console** (if Bing still offers GSC import and GSC is verified)

### 5.2 After a real token exists

1. Add the Bing-provided meta or file exactly as issued.
2. Commit/deploy.
3. Complete verification in Bing’s UI.
4. Submit `https://getcinnova.com/sitemap.xml`.
5. Document the verification method used in ops notes (not a fabricated token value in git unless the meta/file must live in the repo).

### 5.3 Ongoing Bing

- Monitor Index Explorer / URL inspection equivalents for the same redirect and noindex rules.
- Do not assume Google and Bing behave identically on SPA/prerender edges.

---

## 6. Privacy-safe analytics relationship (GA4 `G-CD944CHBK6`)

### 6.1 Roles

| System | Role |
|---|---|
| Google Search Console | Queries, impressions, clicks, index coverage |
| GA4 `G-CD944CHBK6` | On-site behavior, events, funnel steps after landing |

GSC answers “how we appear in search.” GA4 answers “what visitors do after they arrive.” Join them carefully.

### 6.2 Privacy-safe practices

- Do not export or publish raw query reports that expose personal data.
- Prefer aggregated directory-level and landing-page reporting for SEO reviews.
- Respect consent / privacy policy disclosures already on `/privacy`.
- Do not store Search Console dumps with PII in the public repo.
- Monetization admin UI is intentionally not exposed publicly; robots.txt is not access control.

### 6.3 Practical join method

1. In GSC: identify top landing pages by clicks (when data exists).
2. In GA4: filter Sessions (or users) where session source/medium is organic search and landing page matches those paths.
3. Evaluate downstream events (book view, product CTA, newsletter complete, Amazon outbound) only with real event definitions from `src/utils/analytics.js` / `MONETIZATION_METRICS.md`.

---

## 7. Metrics to monitor

### 7.1 Search performance (GSC)

| Metric | Why |
|---|---|
| Impressions | Visibility |
| Clicks | Visits from search |
| CTR | Snippet/title effectiveness |
| Average position | Directional only; volatile |
| Indexing coverage | Technical health |

### 7.2 Breakdown by surface (practical filters)

Use page path prefix filters / content groupings when sample size allows:

| Surface | Path prefix examples |
|---|---|
| News | `/news` |
| Blog | `/blog` |
| Books | `/books` |
| Products | `/products` |
| Guides | `/guides` |
| Resources | `/resources` |
| Tools | `/tools` |
| Company | `/company`, `/about`, `/newsletter` |

Until GSC has enough data, report “insufficient data” rather than inventing numbers.

### 7.3 Site behavior (GA4)

- Organic sessions / users (as GA4 defines them)
- Landing page views for money pages: `/books/*`, `/products/*`, `/newsletter`
- Commerce events: item views, CTA clicks, outbound clicks, newsletter lead start/complete (see monetization metrics doc)
- Engagement quality signals available in GA4 (do not invent thresholds)

---

## 8. SEO → monetization metric definitions

Definitions only. Do **not** invent measured production values.

Assume an **organic search session** (or organic landing) as the denominator cohort, defined consistently in GA4 (e.g., session default channel group = Organic Search, or first landing from organic).

| Metric | Definition |
|---|---|
| `organic_to_book_rate` | Organic sessions that view at least one Books surface (`/books` or `/books/:slug`, or equivalent `commerce_item_view` for books) ÷ organic sessions |
| `organic_to_product_rate` | Organic sessions that view at least one Product surface (`/products` or `/products/:key`, or product view events) ÷ organic sessions |
| `organic_to_newsletter_rate` | Organic sessions that complete newsletter signup (`commerce_lead_complete` / `newsletter_signup`) ÷ organic sessions |
| `organic_to_outbound_rate` | Organic sessions that fire a retailer outbound click (`commerce_outbound_click` / book external purchase click) ÷ organic sessions |

### Notes on interpretation

- Numerators should be **session-scoped unique** (at least one event), not raw event spam counts, unless you explicitly document otherwise.
- SEAT Amazon clicks are the primary outbound today; do not treat COMING_SOON/IN_DEVELOPMENT titles as outbound failures.
- These rates complement — and do not replace — on-page rates like `book_detail_to_outbound_rate` in `MONETIZATION_METRICS.md`.

---

## 9. Checklist (operators)

- [ ] GSC property added for `https://getcinnova.com`
- [ ] Verification succeeded against existing meta token
- [ ] `sitemap.xml` submitted and fetched successfully
- [ ] `sitemap-video.xml` submitted or intentionally deferred with reason
- [ ] URL Inspection spot-checks on Products, Books, News, Blog, Newsletter, Newsletter-success (noindex)
- [ ] Bing property added and verified with a **real** Bing-issued token/method
- [ ] Bing sitemap submitted
- [ ] GA4 `G-CD944CHBK6` organic segments documented for SEO reviews
- [ ] organic_to_* explorations saved (definitions above)
- [ ] Google News sitemap explicitly deferred

---

## Related docs

- `SEO_BASELINE.md` — inventory & config state
- `SEO_ROUTE_INVENTORY.md` — route policies
- `SEO_GROWTH_PLAN.md` — 30/60/90 plan
- `MONETIZATION_METRICS.md` — commerce event definitions
- `SEO_PERFORMANCE_AUDIT.md` — hero/video performance
