# CinNova News editorial workflow

Safe path from draft → validate → preview → publish → PR.  
Does **not** redesign the News Center UI. Does **not** auto-commit, auto-push, or auto-deploy.

## Architecture

| Layer | Location | Public? |
|-------|----------|---------|
| Public catalog | `src/data/newsPosts.js` | Yes — feed, `/news/<slug>`, sitemap, prerender |
| Drafts | `src/data/news-drafts/<slug>.json` | **No** — local editorial only |
| Draft loader | `src/data/newsDrafts.js` | DEV-only helpers |
| Preferred heroes | `public/images/news/<coverage>/` | When referenced by a published story |

Drafts are **never** merged into `getPublishedNewsStories()` / `getPublicNewsStories()`. Related-news resolution only reads the public catalog, so drafts cannot appear as related suggestions on live stories.

## Quick start

```bash
# 1) Create an empty skeleton (no invented reporting)
npm run news:new -- --slug=example-city-council-vote --coverage=local

# 2) Edit the JSON draft with sourced reporting
#    src/data/news-drafts/example-city-council-vote.json

# 3) Add a hero under the preferred path (or reuse an existing library image)
#    public/images/news/local/example-city-council-vote.jpg

# 4) Validate catalog + drafts
npm run validate:news

# 5) Preview locally (Vite DEV only)
npm run dev
# open http://localhost:5173/?page=news-preview&slug=example-city-council-vote

# 6) Strict publish check, then promote into newsPosts.js
npm run validate:news -- --publish example-city-council-vote
npm run news:publish -- example-city-council-vote

# 7) Build / lint, then commit + PR manually
npm run build
npm run lint
```

## How to create a story

1. Run `npm run news:new` with a kebab-case `--slug` and `--coverage` (`local` | `state` | `national` | `international`).
2. Fill every field from **sourced** reporting. Leave fields empty until you have evidence — do not invent events, quotes, statistics, or URLs.
3. Keep `isPublished: false`, `isDraft: true`, `isDemo: false` until `news:publish` promotes the story.

## How to source it

- Prefer primary documents (government releases, dockets, statutes) and reputable independent reporting.
- Every public story needs **at least two** labeled sources.
- Paraphrase; do not invent quotation marks around speech you did not verify.
- Record the publisher, URL, and a short note on what the source establishes.

## Source-quality standards

| Label | Meaning | Use when |
|-------|---------|----------|
| `verified` | Independently confirmed by Cin Nova or documented in a primary record | Court filings, official tallies you can check, multi-outlet confirmation of the same fact |
| `official` | On the record from the body that issued it | Agency press releases, statutes, regulator advisories |
| `claim` | Asserted but not confirmed by Cin Nova | Anonymous memos, contested allegations, projections |

Section `claimType` must match the same scale so body copy never presents an unresolved claim as fact.

## Handling allegations

- Attribute the allegation to the speaker or outlet.
- Separate “what was reported” from “what is confirmed.”
- Prefer a `claim` source type and `claimType: "claim"` on the matching section.
- Do not upgrade a claim to verified without independent confirmation.

## Future / pending event language

- Use future or pending tense for items that have not happened yet (“staff will return,” “production is planned”).
- Do not write pending board items, hearings, or manufacturing targets as completed outcomes.
- `npm run news:publish` rejects `publishedAt` values more than 24 hours in the future to catch accidental future-dating.

## Breaking / developing rules

- `status: "breaking"` and `"developing"` are reserved for live desk use.
- Do not ship those statuses on evergreen or finished analysis without an active reporting reason.
- Prefer `standard`, `update`, or `analysis` for most catalog stories.

## Image requirements

Preferred tree (new assets):

```text
public/images/news/
  local/
  state/
  national/
  international/
```

Rules:

- Reuse existing library images when appropriate; do **not** mass-move historical heroes.
- Every published story needs `heroImage`, descriptive `heroAlt`, and a `heroCaption` that states the image is library/illustration when it is not event photography.
- `validate:news` / `news:publish` fail when the hero path is missing on disk (non-http paths).

## Fact-check checklist

- [ ] Slug and id are unique across catalog + drafts
- [ ] Coverage level and category are correct
- [ ] Timestamps are real ISO datetimes; not accidentally far future
- [ ] Every factual sentence is backed by a labeled source
- [ ] Claims/allegations are labeled and attributed
- [ ] Pending events use pending/future tense
- [ ] Related news ids resolve to public stories
- [ ] Related blog slugs resolve to **published** blog posts
- [ ] SEO title/description filled; no placeholder `example.com` URLs
- [ ] Hero exists on disk; alt text is meaningful

## Preview process

- URL: `/?page=news-preview&slug=<slug>`
- Gate: `import.meta.env.DEV` only (production always 404s)
- Always `noindex`; excluded from sitemap and `EXCLUDED_PAGE_KEYS`
- Shows an editorial draft banner
- Does not fire `news_story_view` (avoids polluting analytics while editing)

## Validation

```bash
npm run validate:news
npm run validate:news -- --publish <slug>
```

Incomplete drafts fail `npm run validate:news` with actionable errors (missing
fields, placeholder sources, missing hero files, etc.). Catalog stories still
emit non-blocking warnings for SEO length and claim-label hygiene.

Publishing-blocking issues exit non-zero.

## Publish process

```bash
npm run news:publish -- <slug> --dry-run   # validate + plan only
npm run news:publish -- <slug>            # promote into newsPosts.js
```

Before writing to `newsPosts.js` the command:

1. Loads the draft JSON  
2. Runs **publish-mode** validation  
3. Confirms sources, hero file, and related references  
4. Rejects accidental future `publishedAt` (>24h ahead)  
5. Sets `isPublished: true`, `isDemo: false`, strips `isDraft`  
6. Appends the story to `src/data/newsPosts.js` (skipped on `--dry-run`)  
7. Deletes the draft JSON (skipped on `--dry-run`)  

It does **not** git commit, push, or deploy.

## Git / PR process

1. Review the `newsPosts.js` diff (and any new image under `public/images/news/`).  
2. Run `npm run validate:news && npm run build && npm run lint`.  
3. Commit only News-related files. Leave unrelated local work (Kiddo/Hero/blog drafts) untouched.  
4. Open a PR to `main`.  
5. Merge with the normal repository strategy; let Vercel deploy from `main`.  
6. No force-push. No manual production deploy.

## Analytics (unchanged)

Preserve these event names:

- `news_page_view`
- `news_filter_change`
- `news_story_click`
- `news_story_view`
- `related_news_click`
- `news_newsletter_click`

## Safety guarantees

- Drafts cannot appear on production News feeds.  
- Drafts cannot enter the sitemap or prerendered `/news/<slug>.html`.  
- Draft preview cannot resolve in production builds.  
- Related-news suggestions never point at drafts.  
- No auto-publish, auto-commit, auto-push, or auto-deploy.  
- Scripts never fabricate sources or current events.
