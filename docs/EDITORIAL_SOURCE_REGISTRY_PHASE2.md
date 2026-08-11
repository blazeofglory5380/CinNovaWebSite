# Editorial Trusted Source Registry — Phase 2 Audit

**Date:** 2026-08-11  
**Branch:** `agent/cinnova-editorial-shadow-mode`  
**Policy:** Expand discovery diversity without weakening anti-fabrication / corroboration gates. Do not scrape paywalls or invent endpoints.

## Why the prior 6-source live run was skewed

Active sources were:

| ID | Role | Effect |
|---|---|---|
| `cisa-advisories` | Official ICS/cyber advisories (high volume) | Dominated selection with product advisories |
| `nist-news` | Official standards/AI | Useful but lower volume |
| `nasa-press` | Space/science | Often failed editorial-fit minimum for CinNova |
| `sec-press` | Finance/enforcement | Often low editorial-fit vs AI/tech focus |
| `mit-ai` | University AI | Secondary; many items stale or thin |
| `arxiv-cs-ai` | Preprint flood (~700+/day) | Inflated candidate counts; **cannot** independently corroborate |

Result: cybersecurity + government notices + research papers crowded out company newsrooms and specialty journalism. Local/state feeds were never configured.

## Tier model (canonical)

| Tier | Meaning | Corroboration |
|---|---|---|
| `TIER_1_PRIMARY` | Official gov / company / research primary | Eligible; company primaries require secondary |
| `TIER_1_NEWS` | Major wire / highly reputable newsroom | Eligible |
| `TIER_2_REPUTABLE` | Established specialty publication | Eligible |
| `TIER_3_DISCOVERY_ONLY` | Discovery aid only | **Never** independently qualifies |
| `BLOCKED` | Untrusted / SEO farm / rumor | Never ingested |

Legacy aliases still accepted: `TIER_2_HIGH_AUTHORITY` → news, `TIER_3_REPUTABLE_SECONDARY` → reputable, `TIER_4_DISCOVERY_ONLY` → discovery-only.

### Publication gate preference (never auto-publish)

1. **A:** 1 authoritative primary + 1 independent reputable source  
2. **B:** 2 independent Tier-1-news / Tier-2-reputable sources  
3. **C:** Solo allowlisted official primary may research-qualify / REVIEW — Phase 10A still blocks auto-publish  

Never: one weak/discovery source; syndicated copies; press-release mirrors; quote-of-quote as independence.

## Active HTTPS feeds (Phase 2)

Configured after live HTTP probe. Only public RSS/Atom endpoints.

**Primary official:** NIST, CISA, NASA, SEC, Federal Reserve, FTC, FDA, CDC media RSS, NOAA, NSF  

**Company primary (require secondary):** OpenAI, NVIDIA, Google AI, DeepMind, Microsoft Research, Meta Newsroom, Apple Newsroom, AWS Blog  

**Tier-1 news:** BBC Technology, NPR Technology  

**Tier-2 specialty:** The Verge, TechCrunch, Ars Technica, IEEE Spectrum, MIT Technology Review, Nature RSS, MIT News AI  

**Discovery-only (active):** arXiv cs.AI (reclassified — no longer corroboration-eligible)

## Documented unavailable (not forced)

| Source | Reason |
|---|---|
| Associated Press | Licensed wire — no CinNova endpoint |
| Reuters | Licensed wire — no CinNova endpoint |
| Bloomberg | Paywalled / licensed |
| Financial Times | Paywalled / licensed |
| CNBC | No verified safe public feed configured |
| Wired | No verified safe public feed configured |
| Science (AAAS) | Paywalled journal |
| Anthropic News | No public RSS (404) |
| NIH News | Probed RSS returned 403 |
| DOJ / White House | No verified feed configured yet |
| Local/state partner | Placeholder only |

## Independence & clustering upgrades

- Organization aliases (Meta/Google/NVIDIA/etc.) collapse sibling domains  
- Press-release mirrors and attribution-copy detection  
- Cross-source clustering via shared company entities + event verbs + date window  
- Syndicated wire markers expanded (Reuters/AP/BBC/NPR)  

## Live shadow result after Phase 2 (2026-08-11)

| Metric | Before (6 feeds) | After Phase 2 |
|---|---|---|
| Active HTTPS feeds | 6 | 28 |
| Candidates (capped) | 908 | 579 (40/source cap) |
| Research-qualified | 9 | 18 |
| Selected | 1 (CISA ICS HOLD) | 2 (NPR + BBC **REVIEW**) |
| Shadow drafts | 0 | 2 REVIEW (report-only) |
| READY auto-drafts | 0 | 0 (needs 2nd independent source) |

Gates were **not** weakened: READY still requires ≥2 independent sources at Phase 10A. Company primaries require secondary. arXiv is discovery-only. Reuters/AP remain unavailable without license.

## Remaining blockers before READY / auto-publish

1. Second independent source on selected newsroom stories (licensed wires or stronger enrichment matches)
2. Blog evergreen path still empty in this window
3. Local/state partners unconfigured
4. Draft-file writing / Draft PR / auto-publish remain OFF
