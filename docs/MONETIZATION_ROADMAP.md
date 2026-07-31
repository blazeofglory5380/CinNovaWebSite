# CinNova Monetization Roadmap

No projected revenue figures. Stages describe mechanisms and prerequisites.

## STAGE A — External retail + newsletter

| Field | Detail |
|---|---|
| Mechanism | Amazon Kindle outbound + newsletter leads |
| Prerequisites | Verified retailer URL (done for SEAT); subscriber API (done) |
| Dependencies | Books storefront, GA4 commerce helpers |
| $0 upfront | Yes |
| Analytics | `commerce_*`, `book_external_purchase_click`, newsletter events |
| Legal/disclosure | Standard retailer link (non-affiliate until verified) |
| Status | **ACTIVE NOW** |

## STAGE B — Affiliate partnerships

| Field | Detail |
|---|---|
| Mechanism | Verified partner links with disclosure |
| Prerequisites | Approved partner accounts; real campaign IDs |
| Dependencies | `AffiliateDisclosure`, commerce affiliate fields |
| $0 upfront | Often yes (application-based) |
| Analytics | outbound + affiliate flags (when enabled) |
| Legal/disclosure | Required when affiliate-enabled |
| Status | **READY TO ACTIVATE** (architecture only today) |

## STAGE C — Sponsorships

| Field | Detail |
|---|---|
| Mechanism | Clearly labeled sponsored placements |
| Prerequisites | Audience metrics; sponsor agreements |
| Dependencies | `SponsoredContentDisclosure`, sponsor meta |
| $0 upfront | Sales effort; no network fee required |
| Analytics | sponsor CTA events (existing) |
| Legal/disclosure | Sponsored labeling mandatory |
| Status | **FUTURE / architecture ready** |

## STAGE D — Advertising

| Field | Detail |
|---|---|
| Mechanism | Third-party ad networks on approved placements |
| Prerequisites | Traffic thresholds; privacy review |
| Dependencies | `advertisingPlacements.js` |
| $0 upfront | Network-dependent |
| Analytics | Ad revenue dashboards external to site |
| Legal/disclosure | Privacy policy updates |
| Status | **FUTURE** (network not installed) |

## STAGE E — Premium application subscriptions

| Field | Detail |
|---|---|
| Mechanism | PoisonGuard / StudyNest / Real Estate / StageScout premium |
| Prerequisites | Product readiness; payment provider; pricing approval |
| Dependencies | `subscriptionPlans.js`; future Stripe phase |
| $0 upfront | No (payment infra) |
| Analytics | Reserved `subscribe` / purchase events later |
| Legal/disclosure | Terms, refund, billing disclosures |
| Status | **FUTURE** (`price: null`) |

## STAGE F — Direct commerce, bundles, cross-product offers

| Field | Detail |
|---|---|
| Mechanism | Direct sale, bundles, cross-sell |
| Prerequisites | Catalog, fulfillment, payments |
| Dependencies | Commerce catalog expansion |
| $0 upfront | No |
| Analytics | Full ecommerce funnel |
| Legal/disclosure | Consumer commerce rules |
| Status | **FUTURE** |

## Cross-product funnel groundwork

Prepared conceptually (not aggressively inserted):

- Cookbook reader → companion site/app later
- Blog/News reader → newsletter → relevant product when appropriate
- StageScout visitor → premium later

Editorial automation must not auto-insert commercial recommendations into news.
