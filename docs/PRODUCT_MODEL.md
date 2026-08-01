# Product Model

## CURRENTLY IMPLEMENTED

Central catalog adapted from authoritative sources (not competing truths):

- Books → `booksCatalog.js` (title, slug, availability, description, image)
- Apps already in Phase 11 → `commerceCatalog.js` product entities (availability,
  title, subscriptionEligible)
- Marketing-only apps (e.g. TechMate) → `products.js`
- Placeholders → architecture-only records

## Fields

Includes `slug`, `recordKind` (`authoritative` | `architecture_placeholder`),
`isPublicSurface`, null `futurePricePlaceholder` / `futureSkuPlaceholder` /
`checkoutUrl` / `billingProvider` / `paymentProductId`, and always
`commerceEligible: false`.

## Placeholder isolation — ARCHITECTURE ONLY

Course / download / resource / membership / bundle / service placeholders are:

- `recordKind=architecture_placeholder`
- `isPublicSurface=false`
- `availability=UNAVAILABLE`
- not purchasable / not launched / not active commercial inventory
- excluded from `listPublicCommerceProducts()`

They must not appear in sitemap, recommendation rails, Offer schema, or public UI.

## Fail-closed hosted commerce

`canOfferHostedCheckout()` always returns `false` in Phase 12.
Attempting `commerceEligible: true` throws.

## External retail note

SEAT Amazon availability is represented by Phase 11 `commerceCatalog` /
Books — an outbound retail click is **not** CinNova-hosted checkout and does
**not** create ownership or entitlements.
