# CinNova Monetization Foundation (Phase 11.1)

Reusable commerce, attribution, and conversion architecture for CinNova.
This phase does **not** add Stripe, checkout, payment processing, ad networks,
invented affiliate IDs, invented prices, or fake purchase events.

## Active now

| Path | Mechanism | Destination |
|---|---|---|
| The Southeast Asian Table | `EXTERNAL_RETAIL` | Verified Amazon Kindle `https://www.amazon.com/dp/B0H8YL3L5L` (non-affiliate) |
| Newsletter | `LEAD_GENERATION` | Existing `/api/subscribe` + local subscriber store |

An Amazon outbound click is **not** a completed purchase.

## Architecture modules

| Module | Path |
|---|---|
| Revenue / availability / funnel primitives | `src/data/commerceModels.js` |
| Commerce catalog (books, products, surfaces) | `src/data/commerceCatalog.js` |
| Future subscription plans (`price: null`) | `src/data/subscriptionPlans.js` |
| Advertising readiness (no network installed) | `src/data/advertisingPlacements.js` |
| Sponsored metadata helpers | `src/data/sponsorMeta.js` |
| `CommerceCTA` | `src/components/commerce/CommerceCTA.jsx` |
| `AvailabilityBadge` | `src/components/commerce/AvailabilityBadge.jsx` |
| `AffiliateDisclosure` (gated) | `src/components/commerce/AffiliateDisclosure.jsx` |
| `SponsoredContentDisclosure` (gated) | `src/components/commerce/SponsoredContentDisclosure.jsx` |
| Channel summary helpers | `getMonetizationChannelSummary()` in `commerceCatalog.js` |

Internal monetization dashboard UI is **not** publicly routed in Phase 11.1
(robots.txt is not access control; no authentication system was added).
Reporting architecture remains in data modules + docs only.

## Availability behavior

- `AVAILABLE` + verified URL → may show View on Amazon / external CTA
- `COMING_SOON` / `IN_DEVELOPMENT` → no Buy; Join Updates via existing newsletter
- `BETA` / `UNAVAILABLE` → no purchase action

## Funnel stages

Active/measurable: `DISCOVERY → INTEREST → INTENT → OUTBOUND → LEAD`  
Reserved future: `CHECKOUT → PURCHASE / SUBSCRIPTION`

## GA4 events (Measurement ID unchanged)

Active helpers:

- `commerce_item_view`
- `commerce_cta_click`
- `commerce_outbound_click`
- `commerce_lead_start`
- `commerce_lead_complete`

Preserved: `book_external_purchase_click` (outbound compatibility; not a purchase)

Reserved — do **not** fire: `begin_checkout`, `purchase`, `subscribe`

No PII in analytics parameters (email/name/phone/address stripped).

## Affiliate / sponsorship / ads

- Amazon SEAT link: `affiliateEnabled: false` until a verified Associates relationship exists
- Affiliate disclosure renders only when `affiliateEnabled === true`
- Sponsored disclosure renders only with verified sponsor name + https URL
- No AdSense/Ad Manager/Mediavine/Raptive installed; placements are architecture-only

## Editorial separation

Phase 11.1 does not modify research feeds, clustering, corroboration, fact checking,
editorial schedule, cron, PR gates, publishing, or social automation.

## Related docs

- `docs/ZERO_BUDGET_REVENUE.md`
- `docs/MONETIZATION_ROADMAP.md`
- `docs/MONETIZATION_METRICS.md`
