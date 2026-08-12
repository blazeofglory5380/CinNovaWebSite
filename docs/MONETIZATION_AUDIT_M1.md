# CinNova Monetization Audit — Phase M1

**Base:** `origin/main` @ `6126e09` (commerce platform 12 merged)  
**Branch:** `agent/cinnova-monetization-completion-m1`  
**Worktree:** `D:/CinNovaWebSite-worktrees/monetization-completion-m1`  
**Audit date:** 2026-08-11  
**Rule:** No code changes were made before this inventory was written.

## Classification legend

COMPLETE · PARTIAL · PLACEHOLDER · DISABLED · MISSING · DUPLICATE · STALE

## Inventory

| Area | Status | Notes / paths |
|---|---|---|
| Store (hosted CinNova checkout) | MISSING | No `/store`, `/cart`, `/checkout` UI |
| Product catalog (Phase 11) | COMPLETE | `src/data/commerceCatalog.js`, `commerceModels.js` |
| Product catalog (Phase 12) | COMPLETE | `src/data/commerce/platform/productCatalog.js` — `commerceEligible: false` |
| Catalog duplication | DUPLICATE | Phase 11 ↔ Phase 12 catalogs both present |
| Digital downloads (free/lead) | COMPLETE | Resources + free guides |
| Digital downloads (paid entitlement) | PLACEHOLDER | Architecture only; empty entitlement store |
| Affiliate center UI | MISSING | Partner-admin not publicly routed |
| Affiliate partner catalog | COMPLETE | Prospect catalog; no fake partnerships |
| Affiliate click tracking | DISABLED | Wired; `VITE_AFFILIATES_ENABLED` off |
| Affiliate disclosure component | COMPLETE | Gated; needs dedicated global page |
| Recommendation engine | COMPLETE / DISABLED commercial | Editorial rails live; commercial slot off |
| Advertising pages | PARTIAL | `/company/advertise` etc.; bare short paths missing |
| Sponsor / partner-with-us / press | PARTIAL | Marketing shells; no booking/checkout |
| Newsletter signup | COMPLETE | `/newsletter` + `/api/subscribe` |
| Newsletter ESP sync | PARTIAL | Provider config without live API routes |
| Newsletter sponsorship | PARTIAL | Sales page only |
| Premium newsletter | PLACEHOLDER | Flag not activated |
| Media kit | PARTIAL | Metrics TBD / available on request needed |
| Contact sales | MISSING | Uses `/contact`; no dedicated sales route |
| Brand assets route | MISSING | Section on Media Kit only |
| Legal: Privacy / Terms | COMPLETE | `/privacy`, `/terms` |
| Legal: Affiliate Disclosure page | MISSING | Component exists; no dedicated route |
| Legal: Refund / Digital Product / Cookie / Disclaimer / Accessibility / DMCA | MISSING | |
| Analytics event layer | PARTIAL | GA4 helpers; no in-app dashboard |
| Revenue dashboard UI | DISABLED / PLACEHOLDER | Zeros with placeholder flags |
| Payments architecture | PLACEHOLDER | Provider slots; no SDKs; undecided |
| Checkout / cart / coupons / orders | MISSING | |
| Customers / subscriptions | PARTIAL | Architecture fixtures; not activatable |
| Premium memberships | PLACEHOLDER | |
| App promotion | PARTIAL | Product pages; many coming-soon |
| Book promotion | COMPLETE | SEAT Amazon outbound (non-affiliate) |
| Pricing page dollar amounts | STALE | Invented `$9.99` vs architecture `price: null` |
| Feature flags | PARTIAL | Affiliates env flag; commerce hard-coded false |
| Live payments | DISABLED | Fail closed |
| Fake affiliate IDs | — | None found |
| Fake partnerships | — | Catalog = prospects only |
| Fake revenue | — | Explicit placeholders / zeros |
| Editorial automation | — | Untouched (must remain SHADOW) |

## Live money paths today

1. **ACTIVE:** SEAT Amazon Kindle outbound (non-affiliate) — click ≠ CinNova purchase  
2. **ACTIVE:** Newsletter + contact lead capture  
3. **NOT LIVE:** Hosted checkout, Stripe/PayPal, paid downloads, affiliate program, ads network

## Exact blockers to first hosted revenue

1. Payment provider decision + secrets outside repo  
2. Auth / entitlement backend  
3. Legal (refund, digital terms) + attorney review  
4. Tax handling  
5. Checkout fail-closed → live activation (explicit)  
6. Affiliate dual-gate + verified partner IDs (for affiliate revenue)  
7. No fabricated metrics/partnerships/IDs

## Gap-closure plan (post-audit)

Preserve existing architecture. Add: unified feature flags (all OFF), checkout/cart fail-closed shells, digital delivery architecture, legal/disclosure pages, route aliases, pricing honesty, DEMO revenue dashboard (admin), analytics event completeness, completion report + tests. **No live payment activation.**
