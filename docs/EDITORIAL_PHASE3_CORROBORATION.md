# CinNova Editorial — Phase 3 Corroboration

## Goal

Improve event-level enrichment and claim-level corroboration so legitimate stories can reach **READY** in shadow mode when ≥2 genuinely independent sources agree — without weakening gates or fabricating corroboration.

## What shipped

| Area | Change |
|---|---|
| Event matching | `eventFingerprint.mjs` — entities, amounts, actions, time windows (breaking 24h / business 48h / regulatory 72h / research 7d) |
| Entities | `entities.mjs` — OpenAI/Google/Meta/NVIDIA/FDA/Fed/… normalization |
| Numerics | `numericClaims.mjs` — `$5B` ≡ `$5 billion`; material conflicts → HOLD |
| Claim matrix | `claimMatrix.mjs` — principal claims, agreement/conflict, READY impact |
| Independence | Identical quotes + sole-source attribution collapse |
| Enrichment | Cross-desk trusted-pool search; primary↔secondary pairing preference |
| Blog evergreen | `blogEvergreen.mjs` — separate from breaking-news freshness; paths A/B/C; ICS advisories stay News |
| Shadow drafts | Claim matrix, independence counts, why READY/REVIEW |

## Live shadow (2026-08-11) after Phase 3

| Metric | Result |
|---|---|
| Candidates | 579 |
| Research-qualified | 104 |
| News READY | **0** (correct — no second independent source with claim agreement in pool) |
| News REVIEW | **2** |
| Blog READY | 0 |
| Blog REVIEW | **1** |

### News REVIEW (report-only)

1. NPR — *An AI chatbot is joining the search for art looted by the Nazis* — solo Tier-1 news; enrichment found no independent secondary on the same event.
2. BBC — *Wall Street giants hand Nvidia $500bn…* — solo Tier-1 news; pool has related Nvidia coverage at **$750bn** (NPR), which correctly does **not** corroborate the $500bn claim (numeric disagreement / different figure).

### Blog REVIEW

Evergreen framing from authoritative primary (NIST / standards path preferred; ICS product advisories excluded).

## Why zero News READY is correct today

- READY still requires **≥2 independent sources** + **principal claim agreement**.
- No fabricated second sources.
- Licensed wires (AP/Reuters) remain unavailable.
- Same-company different amounts must not merge into READY.

Fixture shadow (`editorial:shadow`) still produces READY when fixtures supply genuine multi-source packets — proving the promotion path works without lowering live gates.

## Safety

- No merge / deploy / auto-publish / catalog writes / Draft PR
- No weakened source threshold
- No invented quotes, facts, or corroboration
