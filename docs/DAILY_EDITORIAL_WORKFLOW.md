# Daily Editorial Workflow

Safe daily preparation for CinNova News + Blog. **Preparation only** — never auto-publish, auto-commit, auto-push, auto-open/merge PRs, or auto-deploy.

## Command

```bash
npm run editorial:daily
npm run editorial:daily -- --date=2026-07-28
npm run editorial:daily -- --skip-existing
npm run editorial:daily -- --dry-run
npm run editorial:daily -- --from-packet=editorial-reports/research-packet.example.json
```

Creates (when missing):

| Surface | Count | Default slug pattern |
|---------|-------|----------------------|
| News Local | 1 | `daily-local-YYYYMMDD` |
| News State | 1 | `daily-state-YYYYMMDD` |
| News National | 1 | `daily-national-YYYYMMDD` |
| News International | 1 | `daily-international-YYYYMMDD` |
| Blog | 1 | `daily-blog-YYYYMMDD` |

Writes a report to `editorial-reports/YYYY-MM-DD.md` and runs `validate:news` + `validate:blog` (skeleton drafts are expected to fail field completeness until filled).

## Architecture

```
editorial:daily
  ├─ news draft skeletons → src/data/news-drafts/*.json
  ├─ blog draft skeleton  → src/data/blog-drafts/*.json
  ├─ validate:news / validate:blog (report only)
  └─ editorial-reports/<date>.md
```

Later triggers (manual wiring):

- **Windows Task Scheduler** — run `npm run editorial:daily` in the repo root on a daily cadence.
- **GitHub Actions** — schedule a workflow that checks out the repo and runs the same command; commit drafts only via a human-reviewed PR (never force-push / auto-merge from this job).

## Research agent input

Live web research is **not** invented by this command. Pass a verified packet with `--from-packet`:

See `editorial-reports/research-packet.example.json`.

Required from a research agent (per item):

1. Verified working title and angle (no fabricated events)
2. 2–4 credible source URLs with publisher + access date
3. Outline / section headings
4. Suggested internal blog + news links **only if topically relevant**
5. Hero image brief (mood, subject, avoid list)

## News workflow

1. `npm run news:new -- --slug=... --coverage=local|state|national|international`
2. Fill sourced JSON in `src/data/news-drafts/`
3. DEV preview: `/?page=news-preview&slug=...`
4. `npm run validate:news` / `npm run validate:news -- --publish <slug>`
5. `npm run news:publish -- <slug> --dry-run` then without `--dry-run`
6. Manual commit + PR

See `docs/NEWS_EDITORIAL_WORKFLOW.md`.

## Blog workflow

1. `npm run blog:new -- --slug=... --category="Artificial Intelligence"`
2. Fill sourced JSON in `src/data/blog-drafts/`
3. DEV preview: `/?page=blog-preview&slug=...` (noindex; not in sitemap/feed)
4. `npm run validate:blog` / `npm run validate:blog -- --publish <slug>`
5. `npm run blog:publish -- <slug> --dry-run` then without `--dry-run`
6. Manual commit + PR

See `docs/BLOG_EDITORIAL_SEO_WORKFLOW.md`.

## Source quality & citations

- Prefer primary sources (gov, court, company, standards bodies) over aggregation.
- Classify News sources with existing `type` keys (`verified`, etc.).
- Never leave `example.com` / `replace-me` URLs in publish-ready drafts.
- Do not fabricate statistics, quotes, or “today’s” events.

## SEO, images, preview, validation, publish, PR

| Step | News | Blog |
|------|------|------|
| SEO meta | `seoTitle`, `seoDescription` | `seoTitle`, `seoDescription` (or `metaDescription`) |
| Hero | `/images/news/<coverage>/<slug>.jpg` | `/images/blog/hero/<slug>.webp` (+ brief) |
| Preview | `news-preview` DEV only | `blog-preview` DEV only |
| Validate | `validate:news` | `validate:blog` |
| Publish | `news:publish` | `blog:publish` |
| PR | Human-reviewed, focused diff | Human-reviewed, focused diff |

## Safety invariants

- Drafts never enter `getPublicNewsStories()` / `getPublishedBlogPosts()`.
- Drafts never enter sitemap or prerender.
- Preview routes are DEV-only and `noindex`.
- `editorial:daily` never publishes or commits.
