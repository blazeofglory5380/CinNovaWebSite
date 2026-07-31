# Affiliate Activation Checklist

Architecture exists in Phase 11.1+. **Do not invent affiliate IDs.** Do not enable affiliate mode until a verified partner relationship exists.

## Prerequisites

1. Approved Amazon Associates (or other partner) account for CinNova
2. Verified website URL: `https://getcinnova.com`
3. Compliance with partner content and linking policies
4. Legal review of disclosure language

## Disclosure requirements

- Use `AffiliateDisclosure` only when `affiliateEnabled === true`
- Suggested language (already in component):
  “CinNova may earn a commission from qualifying purchases made through certain links.”
- Never show disclosure on ordinary non-affiliate retailer links

## Where tags would be configured

When a verified tag exists:

1. Store affiliate URL / tag only in commerce catalog metadata (not scattered in components)
2. Set on the entity:
   - `affiliateEnabled: true`
   - `affiliatePartner` (e.g. `amazon_associates`)
   - `affiliateCampaignId` (partner campaign id — real value only)
   - `affiliateDisclosureRequired: true`
   - `destinationType: AFFILIATE` (or keep retailer destination with affiliate URL)
3. `CommerceCTA` automatically applies `rel="noopener noreferrer sponsored nofollow"`

## Test requirements before activation

- [ ] Affiliate URL resolves to the correct product
- [ ] Disclosure renders on every affiliate destination
- [ ] Non-affiliate books/products remain disclosure-free
- [ ] Analytics still fire `commerce_outbound_click` (not `purchase`)
- [ ] No PII in GA4 params
- [ ] Preview QA on `/books` and SEAT detail

## Current SEAT status

The Southeast Asian Table Amazon link remains a **normal retailer link** (`affiliateEnabled: false`) until Associates is verified.
