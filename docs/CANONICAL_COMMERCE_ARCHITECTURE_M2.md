# Canonical Commerce Architecture — Phase M2

## Decision

**Canonical stack:** Phase 12 `src/data/commerce/platform/*` + M1/M2 flags & activation modules.

**Catalog bridge (not a second runtime):** Phase 11 `commerceCatalog.js` / `commerceModels.js` / `booksCatalog.js` for books/SEAT outbound and editorial CTAs.

**Do not create a third commerce architecture.**

## Deprecation / migration notes

| Module | Role going forward |
|---|---|
| `commerce/platform/*` | **Canonical** for hosted checkout, orders, entitlements, payments, tax, webhooks |
| `commerceCatalog.js` | Bridge for external retail + article CTAs; map into platform products when hosting SKUs |
| `commerceModels.js` | Shared primitives (availability, rel attrs, analytics sanitize) — keep |
| M1 `checkoutArchitecture.js` | Fail-closed shells; M2 `checkoutFlow.js` + `serverPricing.js` are authoritative for quotes |
| Duplicate product lists | Prefer platform `productCatalog.js`; Phase 11 entities remain for SEAT Amazon |

## Payment mode

See `paymentMode.js`: `UNCONFIGURED` | `TEST` | `LIVE_DISABLED` | `LIVE`.

Client Vite flags alone cannot enable LIVE.

## Phase M3 canonical modules (no duplicate architecture)

| Concern | Canonical module |
|---|---|
| Payment mode / Stripe TEST client | `paymentMode.js`, `stripeTestClient.js` |
| Checkout quote + session | `serverPricing.js`, `checkoutFlow.js`, `api/commerce/create-checkout-session.js` |
| Orders + persistence | `orderModel.js`, `orderPersistence.js` (`data/commerce-test/`, gitignored) |
| Entitlements | `entitlementEngine.js` + `entitlementGrants.js` |
| Affiliates | `src/data/affiliate/*` (`applicationPack.js`, `applicationWorkflow.js`) |
| Newsletter | existing subscribe/lead APIs — not a paid entitlement |
| Sponsorships | `sponsorshipLeads.js`, `sponsorshipInquiryFlow.js` |
