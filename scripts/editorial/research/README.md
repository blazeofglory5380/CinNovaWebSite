# Phase 10B.1 research ingestion

This directory adds a feed-first research foundation in front of the Phase 10A editorial pipeline. It fetches or loads source material, normalizes and clusters candidates, checks freshness, corroboration, syndication, CinNova duplication, relevance, and routing, then emits a Phase 10A-compatible **VERIFIED RESEARCH PACKET**.

It does not publish, merge, deploy, create social posts, or mark a story `READY`. Phase 10A remains responsible for fact-checking and draft eligibility.

## Modes

- `npm run editorial:discover -- --fixture --dry-run` uses deterministic local fixtures and performs no network requests. This is the safe default and the CI default.
- `npm run editorial:discover -- --live` queries only active registry entries with verified HTTPS feed URLs. Individual source outages are recorded and do not stop other sources.
- `npm run editorial:research-live -- --live --date=YYYY-MM-DD` writes `editorial-reports/<date>-live-packet.json`. Pass that file explicitly to Phase 10A with `npm run editorial:daily -- --from-packet=<path>`.

Sources without a confirmed public feed stay inactive with `feedUrl: null`. Tier 4 sources are discovery-only and cannot independently qualify a story.
