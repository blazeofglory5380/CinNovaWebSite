# Editorial Daily Automation (Phase 10A)

Production-grade **preparation** pipeline for CinNova News + Blog.  
It does **not** auto-publish, auto-merge, auto-deploy, invent events/sources, or store credentials.

## Current activation state

| Capability | Status |
|---|---|
| Shadow / dry-run (full pipeline simulation) | **ACTIVE** — schedule + default manual |
| Draft file writes + Draft PR preparation | **OFF** until explicit `allow_draft_pr` activation |
| Production auto-publish (`news:publish` / `blog:publish`) | **NEVER** enabled by automation |
| Social posting / merge / deploy | **NEVER** |

Scheduled cron (`0 13 * * *`) always runs in **shadow mode**: live research feeds, dry-run pipeline, shadow reports under `editorial-reports/YYYY-MM-DD-shadow.{json,md}`, no draft files, no Draft PR.

## Commands

```bash
npm run editorial:shadow   -- --date=YYYY-MM-DD [--fixture|--live] [--from-packet=...] [--skip-discover]
npm run editorial:research -- --date=YYYY-MM-DD [--from-packet=...] [--dry-run]
npm run editorial:daily    -- --date=YYYY-MM-DD [--from-packet=...] [--dry-run] [--skip-existing] [--no-social]
npm run editorial:factcheck -- --date=YYYY-MM-DD [--slug=...]
npm run editorial:review    -- --date=YYYY-MM-DD
npm run editorial:prepare-pr -- --date=YYYY-MM-DD [--dry-run]
```

Desired sequence (shadow / current):

```
editorial:shadow
  → discover + research-live (fixture or live)
  → editorial:research --dry-run
  → editorial:daily --dry-run
  → editorial-reports/YYYY-MM-DD-shadow.{json,md}
  → no draft files · no Draft PR · no publish
```

Later activation sequence (explicit only — not current default):

```
editorial:research
  → candidate scoring + dedupe
  → editorial:daily (qualified drafts only)
  → fact-check + SEO + internal links + heroes + optional social drafts
  → validation + editorial-reports/YYYY-MM-DD.md
  → editorial:review
  → editorial:prepare-pr   # Draft PR only, never merge / never auto-publish
```

Preserved: `news:new`, `news:publish`, `blog:new`, `blog:publish`, `validate:news`, `validate:blog`.

## Architecture

```
editorial-reports/research-packet*.json   (human/agent verified input)
        │
        ▼
scripts/editorial-research.mjs
  - relevance scoring (AI, data centers, education, real estate tech, …)
  - duplicate / UPDATE / FOLLOW-UP / NEW STORY
  - fact-check readiness preview
  - NO QUALIFIED STORY when a desk has no verified candidate
        │
        ▼
scripts/editorial-daily.mjs  (pipeline core: scripts/lib/editorial-pipeline.mjs)
  - writes news/blog drafts only for qualified desks
  - SEO enrichment + audit
  - internal link suggestions (broken-slug safe)
  - hero assign-or-IMAGE REQUIRED
  - optional social drafts (status=draft, UTM via socialUtm)
  - validate:news / validate:blog
  - editorial-reports/YYYY-MM-DD.md
```

### Key libraries
| Module | Role |
|---|---|
| `scripts/lib/editorial-research.mjs` | Packet scoring, gap hints |
| `scripts/lib/editorial-dedupe.mjs` | Duplicate / evolution detection |
| `scripts/lib/editorial-factcheck.mjs` | READY / REVIEW / HOLD / REJECT |
| `scripts/lib/editorial-seo.mjs` | SEO suggest + audit |
| `scripts/lib/editorial-links.mjs` | Internal links + product CTAs |
| `scripts/lib/editorial-heroes.mjs` | Inventory assign or IMAGE REQUIRED |
| `scripts/lib/editorial-social.mjs` | Social draft prep (no posting) |
| `scripts/lib/editorial-report.mjs` | Daily markdown report |
| `scripts/lib/editorial-pipeline.mjs` | Orchestrator |
| `scripts/lib/editorial-shadow-report.mjs` | Shadow / dry-run report writer |
| `scripts/editorial/research/scheduleMode.mjs` | Research + execution mode resolver (`autoPublish` always false) |

## Research method

1. A human or external research agent supplies a **verified** packet (`--from-packet`).
2. The pipeline **never invents** a current event to fill Local/State/National/International.
3. Empty / weak desks → **NO QUALIFIED STORY** (no junk draft).
4. Blog topics use packet content plus content-gap **hints** (not auto-written articles without a topic).
5. `forceDraft: true` on a REVIEW packet item can allow draft creation after human intent.

See `editorial-reports/research-packet.example.json`.

## Source / fact-check rules

Statuses: **READY** · **REVIEW** · **HOLD** · **REJECT**

READY needs: confirmed date + location, supported headline, sourced primary claims, no unresolved contradiction affecting headline/dek, no duplicate, valid source URLs, acceptable recency.

HOLD examples: official record vs media conflict; unclear enactment/effective date; pending deal described as closed; proposal described as law; unverified job/investment figures.

**HOLD never enters publish candidates.**

Claim honesty fields on drafts/packets:
- `verifiedClaims[]`
- `attributedClaims[]`
- `uncertainties[]`
- distinguish FACT / COMPANY CLAIM / MEDIA REPORT / PROPOSAL / REQUEST / PENDING / ENACTED / ESTIMATE in notes

## Duplicate detection

Compares candidates against `newsPosts.js`, `news-drafts/`, and recent `editorial-reports/*.md`:

| Class | Meaning |
|---|---|
| DUPLICATE | Exact slug/headline or near-duplicate — do not republish |
| UPDATE | Same underlying event — only if material new development |
| FOLLOW-UP | Related prior coverage |
| NEW STORY | No strong collision |

## Blog topic selection

Order of preference:
1. Current News cluster without an evergreen explainer
2. Category content gaps
3. Packet `searchIntent` / `primaryKeyword`
4. Internal-link opportunity + product relevance
5. Evergreen value

Target useful length ~900–1800 words (no filler). Avoid writing a Blog merely because a News story exists.

## SEO automation

- Suggests `seoTitle` / `seoDescription` / canonical targets when missing
- Audits length, duplicate titles, cannibalization signals
- Does not keyword-stuff
- NewsArticle / BlogPosting compatibility remains with existing site schema builders at publish time

## Image pipeline

1. Prefer on-disk hero at conventional path  
2. Else topical inventory match (flag reuse)  
3. Else **IMAGE REQUIRED** with filename, folder, 1600×900, alt, concept, prompt  
Never fabricates image binaries.

## Social draft integration

For READY/REVIEW (non-blocked) items, optional drafts under `src/data/social-drafts/` for Facebook, Instagram, X, LinkedIn, TikTok, YouTube Short concept.  
UTM via `src/utils/socialUtm.js`. Status remains **`draft`**. No API posting.

## GitHub Action

`.github/workflows/editorial-daily.yml`
- Schedule: `0 13 * * *` (UTC) + `workflow_dispatch`
- **Schedule is forced into shadow/dry-run** (live research, no draft writes, no Draft PR)
- Manual defaults: `shadow=true`, `dry_run=true`, `allow_draft_pr=false`
- Shadow path: research → daily `--dry-run` → `editorial:shadow` report → tests → artifact upload
- Draft PR path (manual only): requires `allow_draft_pr=true` **and** `dry_run=false` **and** `shadow=false`
  - Then: factcheck/review → commit editorial paths → Draft PR `Editorial Daily — YYYY-MM-DD`
- If nothing qualified / shadow mode: **no junk PR**
- Never merges, never deploys, never auto-publishes catalogs

## Safety invariants

- Shadow mode never writes news/blog/social drafts or opens PRs
- Drafts stay out of public catalogs / sitemap / prerender until `*:publish`
- Preview routes remain DEV-only
- No credentials in git
- Unrelated worktree files must not be staged by `editorial:prepare-pr`
- No ads / no social auto-post
- Production auto-publishing remains off until a future explicit activation phase
