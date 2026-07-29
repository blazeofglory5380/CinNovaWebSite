# Daily Editorial Workflow

Safe daily preparation for CinNova News + Blog. **Preparation only** — never auto-publish, auto-commit (except optional Draft PR prep), auto-merge, or auto-deploy.

Full Phase 10A spec: [`docs/EDITORIAL_DAILY_AUTOMATION.md`](./EDITORIAL_DAILY_AUTOMATION.md)

## Commands

```bash
npm run editorial:research -- --date=2026-07-29 [--from-packet=...] [--dry-run]
npm run editorial:daily    -- --date=2026-07-29 [--from-packet=...] [--dry-run] [--skip-existing] [--no-social]
npm run editorial:factcheck -- --date=2026-07-29
npm run editorial:review    -- --date=2026-07-29
npm run editorial:prepare-pr -- --date=2026-07-29 [--dry-run]
```

### What changed in Phase 10A
- Desks without a verified packet candidate → **NO QUALIFIED STORY** (no junk empty drafts)
- Deterministic fact-check gate: READY / REVIEW / HOLD / REJECT
- Duplicate / UPDATE / FOLLOW-UP detection
- SEO + internal link suggestions + hero IMAGE REQUIRED entries
- Optional social drafts (`status: draft` only)
- GitHub Action opens **Draft PRs** only when material exists

## Architecture

```
editorial:research → score packet / gaps
editorial:daily    → qualified drafts + report
editorial:factcheck / editorial:review
editorial:prepare-pr → Draft PR (never merge)
```

Scheduler: `.github/workflows/editorial-daily.yml` (`0 13 * * *` UTC) or Windows Task Scheduler running the same npm commands.

## Research agent input

Live web research is **not** invented by these commands. Pass a verified packet:

`editorial-reports/research-packet.example.json`

Per News item include: title, date, location, sources[], verifiedClaims[], attributedClaims[], uncertainties[], whyItMatters.  
Empty desk objects are fine — they become NO QUALIFIED STORY.

## Manual publish path (unchanged)

News: `news:new` → fill → preview → `validate:news` → `news:publish` → human PR  
Blog: `blog:new` → fill → preview → `validate:blog` → `blog:publish` → human PR  

See `docs/NEWS_EDITORIAL_WORKFLOW.md` and `docs/BLOG_EDITORIAL_SEO_WORKFLOW.md`.

## Social extension

READY/REVIEW drafts may get optional `src/data/social-drafts/*.json` with UTM links.  
Never auto-post. See `docs/SOCIAL_MEDIA_FOUNDATION.md`.

## Safety invariants

- Drafts never enter public catalogs / sitemap / prerender
- Preview routes are DEV-only and `noindex`
- `editorial:daily` never publishes or merges
- HOLD content never publish-candidate
- Social drafts never auto-post and never contain credentials
- Unrelated worktree files must stay untouched
