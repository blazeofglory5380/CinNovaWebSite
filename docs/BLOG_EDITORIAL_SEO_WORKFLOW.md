# Blog Editorial + SEO Workflow

Editorial draft pipeline and SEO standards for CinNova Blog. Analogous to News; **does not redesign** the Blog UI.

## Commands

```bash
npm run blog:new -- --slug=<kebab-slug> --category="Artificial Intelligence"
npm run validate:blog
npm run validate:blog -- --publish <slug>
npm run blog:publish -- <slug> --dry-run
npm run blog:publish -- <slug>
```

Drafts live in `src/data/blog-drafts/<slug>.json` and load only via `src/data/blogDrafts.js` in Vite **DEV**.

## Draft architecture

| Concern | Behavior |
|---------|----------|
| Production feed | Excluded (`getPublishedBlogPosts` ignores drafts) |
| Sitemap | Excluded (published only) |
| Prerender | Excluded |
| Preview | `/?page=blog-preview&slug=...` — DEV only, `noindex` |
| Publish | Inserts into `fullArticles` in `blogPosts.js`, deletes draft JSON |

## SEO metadata (published articles)

Each public article should have:

- **seoTitle** — unique, ~50–60 chars (falls back to `Title | CinNova Blog`)
- **seoDescription** — unique, ~140–155 chars (falls back to `metaDescription` then `excerpt`)
- **canonical** — `https://getcinnova.com/blog/<slug>` (client + prerender)
- **Open Graph / Twitter** — via `SEO.jsx` (`og:*`, `twitter:card=summary_large_image`)

Client (`ArticlePage.jsx`) and prerender (`scripts/seo-shared.mjs` → `getArticleMetadata`) both prefer `seoTitle` / `seoDescription`.

## Structured data

`BlogPosting` (+ optional `Article` semantics via BlogPosting) graph includes:

- BreadcrumbList (Home → Blog → Category → Article)
- Person author
- ImageObject (url, name/alt, optional width/height/caption)
- datePublished / dateModified
- publisher Organization

Preview mode omits schema and sets `noindex`.

## Validation rules (`npm run validate:blog`)

**Errors (fail):**

- Duplicate id/slug/title across catalog
- Invalid slug shape
- Broken hero path (field set but file missing)
- Broken `relatedReading` / `relatedNewsIds` / `relatedNewsSlugs`
- Draft colliding with published slug or marked `status=published`
- Publish mode: missing SEO/hero/alt, thin content (&lt;500 words), placeholder sources

**Warnings (do not fail catalog validate):**

- Missing seoTitle / hero / alt on older published posts
- SEO length outside sensible ranges
- Thin content, weak headings, missing citations on long posts
- Orphan / weakly linked posts
- Shared heroes, duplicate descriptions
- Near-duplicate / cannibalization candidates
- Large/small hero file sizes

## Internal linking

- Prefer existing `relatedReading` + category/pillar graph in `blogPosts.js`.
- Optional draft fields: `relatedNewsIds`, `relatedNewsSlugs` — only when a public News story is genuinely relevant.
- Product CTAs remain category-driven (`BlogProductCTA`); do not spam unrelated product links.
- Do not add links solely to raise counts.

## Images

- Hero required for publish; prefer inventory/`heroImage` under `public/`.
- Alt text required (`heroImageAlt`).
- Hero/LCP: `ArticleImage` with `priority` → `loading=eager` + `fetchPriority=high`.
- Below-fold images: lazy by default.
- Validator flags missing paths, duplicate heroes, and extreme file sizes.

## Sitemap / indexing

- Published articles only in sitemap (`seoConfig.collectSitemapEntries`).
- Drafts and `blog-preview` excluded (`EXCLUDED_PAGE_KEYS`, robots disallow).
- Preview uses `noindex`.

## Source quality

- Research-heavy posts should carry a `sources` (or `citations`) array with real URLs.
- Replace all `example.com` / `replace-me` placeholders before publish.
- Never invent current events or statistics.

## PR process

1. Validate + local preview
2. `blog:publish` (or keep as draft and commit draft JSON for review)
3. Focused PR (blog data + assets only)
4. Human review → merge → production deploy via normal pipeline

## Safety

- Preserve existing Blog routes, production article content, analytics, and product routes.
- Do not auto-publish from `editorial:daily`.
