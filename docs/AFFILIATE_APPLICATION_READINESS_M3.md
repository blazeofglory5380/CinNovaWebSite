# Affiliate Application Readiness — Phase M3

**Date:** 2026-08-11  
**Source:** verified partner catalog only (`enrollmentCatalogData.js`). Unverified fields = **UNKNOWN**.  
**Rule:** No live affiliate links. No fabricated programs, IDs, commissions, or partnerships.

## Summary

| Metric | Count |
|---|---|
| Prospects | 29 |
| Verified official program URL | 24 |
| APPLY_NOW | 10 |
| WAITLIST | 2 |
| NO_PUBLIC_PROGRAM | 5 |
| PARTNER_ONLY | 7 |
| UNKNOWN | 5 |
| FTC disclosure required (catalog) | 29 |
| ACTIVE affiliates | 0 |
| Global affiliate feature gate | OFF |

## HIGH priority classification

| Company | Official program URL | Classification | Notes (catalog only) |
|---|---|---|---|
| Adobe | https://www.adobe.com/affiliates.html | **APPLY_NOW** | Partnerize. Commission evidence in catalog (incl. first-month subscription share). Cookie/payout **UNKNOWN**. |
| Notion | https://www.notion.com/affiliates | **APPLY_NOW** | PartnerStack. Commission structure referenced in catalog evidence; cookie/payout **UNKNOWN**. Runtime registry remains disabled. |
| Runway | https://runway.com/affiliate-program | **APPLY_NOW** | Public apply page verified. Commission, cookie, payout, network **UNKNOWN**. |
| ElevenLabs | https://elevenlabs.io/affiliates | **APPLY_NOW** | PartnerStack. Catalog evidence: 22%/11% tiers, 90-day cookie, payout after license active >90 days. |
| Figma | https://weave.figma.com/affiliate | **APPLY_NOW** | **Weave-only** (not general Figma Design). 25% recurring for new subscribers (catalog evidence). Cookie/payout/network **UNKNOWN**. |

All five currently have a real public affiliate/referral apply path in the catalog. None are activated.

## 29-prospect application pack

Unverified columns are **UNKNOWN**. Application status for all: `not_started`. Partnership implied: **false**.

| Company | Program URL | Network | Eligibility | Commission | Cookie | Payout | Apply class | Disclosure |
|---|---|---|---|---|---|---|---|---|
| OpenAI | https://openai.com/business/partners/ | UNKNOWN | Partner/implementation (catalog) | UNKNOWN | UNKNOWN | UNKNOWN | PARTNER_ONLY | required |
| Anthropic | https://claude.com/partners | UNKNOWN | Claude Partner Network | UNKNOWN | UNKNOWN | UNKNOWN | PARTNER_ONLY | required |
| Google AI | — | UNKNOWN | No public Gemini consumer affiliate identified | UNKNOWN | UNKNOWN | UNKNOWN | NO_PUBLIC_PROGRAM | required |
| Hugging Face | — | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | NO_PUBLIC_PROGRAM | required |
| Perplexity | https://partners.dub.co/perplexity | UNKNOWN | Dub-hosted affiliate portal | UNKNOWN | UNKNOWN | UNKNOWN | APPLY_NOW | required |
| Runway | https://runway.com/affiliate-program | UNKNOWN | Creators / application form | UNKNOWN | UNKNOWN | UNKNOWN | APPLY_NOW | required |
| ElevenLabs | https://elevenlabs.io/affiliates | PartnerStack | Creators via PartnerStack | Verified in catalog evidence (22%/11% tiers) | 90-day cookie | After license active >90 days | APPLY_NOW | required |
| Adobe | https://www.adobe.com/affiliates.html | Partnerize | Creators / publications | Catalog evidence (incl. first-month share) | UNKNOWN | UNKNOWN | APPLY_NOW | required |
| Canva | https://www.canva.com/help/canva-affiliate-marketing-program/ | UNKNOWN | Canvassador only; applications closed | UNKNOWN | UNKNOWN | UNKNOWN | WAITLIST | required |
| Figma | https://weave.figma.com/affiliate | UNKNOWN | Weave creators/educators | 25% recurring (Weave, catalog) | UNKNOWN | UNKNOWN | APPLY_NOW | required |
| Notion | https://www.notion.com/affiliates | PartnerStack | Bloggers / creators | Catalog evidence (signup + first-year share) | UNKNOWN | UNKNOWN | APPLY_NOW | required |
| Midjourney | — | UNKNOWN | No public program identified | UNKNOWN | UNKNOWN | UNKNOWN | NO_PUBLIC_PROGRAM | required |
| Descript | https://www.descript.com/affiliate | PartnerStack | Creators; PartnerStack payment | Catalog: published per-subscriber terms | UNKNOWN | UNKNOWN | APPLY_NOW | required |
| GitHub | https://github.com/partners | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | required |
| Vercel | https://vercel.com/partners | UNKNOWN | Solution/technology partners | UNKNOWN | UNKNOWN | UNKNOWN | PARTNER_ONLY | required |
| Netlify | https://www.netlify.com/partners/ | PartnerStack | Ecosystem partners incl. creators (catalog) | Catalog: revenue share via PartnerStack | UNKNOWN | UNKNOWN | APPLY_NOW | required |
| Replit | https://replit.com/partners | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | required |
| Docker | https://www.docker.com/partners/ | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | required |
| Cloudflare Developers | https://www.cloudflare.com/partners/technology-partners/ | UNKNOWN | Technology integrators | UNKNOWN | UNKNOWN | UNKNOWN | PARTNER_ONLY | required |
| Amazon Web Services | https://aws.amazon.com/partners/ | UNKNOWN | AWS Partner Network | UNKNOWN | UNKNOWN | UNKNOWN | PARTNER_ONLY | required |
| Google Cloud | https://cloud.google.com/affiliate-program | UNKNOWN | CJ Affiliate; US/Canada (catalog) | Catalog: cash rewards for eligible referrals | UNKNOWN | UNKNOWN | APPLY_NOW | required |
| Microsoft Azure | https://partner.microsoft.com/ | UNKNOWN | Microsoft Cloud partner businesses | UNKNOWN | UNKNOWN | UNKNOWN | PARTNER_ONLY | required |
| DigitalOcean | https://www.digitalocean.com/partners/pod | UNKNOWN | Partner Pod / services | Catalog notes referral fees for qualified partners; not treated as creator APPLY_NOW | UNKNOWN | UNKNOWN | UNKNOWN | required |
| Cloudflare | https://www.cloudflare.com/partners/ | UNKNOWN | Integrators / resellers / MSPs | UNKNOWN | UNKNOWN | UNKNOWN | PARTNER_ONLY | required |
| NVIDIA | https://www.nvidia.com/en-us/affiliates/ | Rakuten Marketing | Website publishers | UNKNOWN | UNKNOWN | UNKNOWN | APPLY_NOW | required |
| Apple | https://performance-partners.apple.com/home | Partnerize | Limited / invite Performance Partners | UNKNOWN | UNKNOWN | UNKNOWN | WAITLIST | required |
| Framework | — | UNKNOWN | Staff stated no affiliate program | UNKNOWN | UNKNOWN | UNKNOWN | NO_PUBLIC_PROGRAM | required |
| Raspberry Pi | — | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | NO_PUBLIC_PROGRAM | required |
| Logitech | https://info.logitech.com/globalpartnerconnect | UNKNOWN | B2B Partner Connect | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | required |

Allowed / prohibited promotion methods: **UNKNOWN** unless catalog evidence notes a restriction (ElevenLabs: spam / impersonation / branded paid search).

## Application data required (before any apply)

Typical (do not invent per-program extras):

- Legal business / publisher name and site URL (`getcinnova.com`)
- Contact email and tax/payout identity (collected only on the official program site)
- Traffic / content description
- FTC disclosure copy ready (`/affiliate-disclosure`)
- No placeholder affiliate IDs

## Workflow

`NOT_APPLIED` → `READY_TO_APPLY` → `APPLIED` → `PENDING` → `APPROVED` | `REJECTED` → `ACTIVE` | `PAUSED`

- `READY_TO_APPLY` = catalog `applicationReady` + official program URL  
- `APPROVED` requires evidence (`approvalDate` + `sourceUrl`)  
- `ACTIVE` requires: approved + verified ID + verified tracking template + disclosure + global feature gate  

Current: all 29 `NOT_APPLIED` / `not_started`. None `ACTIVE`.

## Activation blockers

1. Global affiliate feature gate OFF  
2. No verified affiliate IDs or tracking templates  
3. No attorney-finalized promotion/disclosure operating procedure beyond existing page  
4. LIVE commercial destinations remain disabled  
5. Do not apply until owner authorizes outbound applications (this phase prepares packs only)

## Disclosure status

Engineering page `/affiliate-disclosure` exists (M1). Classification: **ATTORNEY_REVIEW_REQUIRED**. All 29 catalog rows require FTC disclosure if ever activated.
