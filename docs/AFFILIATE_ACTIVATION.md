# Affiliate Activation Checklist

Architecture exists in Phase 11.1+ and the Phase 11.4A partner registry.
**Do not invent affiliate IDs.** Do not enable affiliate mode until a verified partner relationship exists.

Primary operator guide: `docs/AFFILIATE_MANAGEMENT.md`.

## Prerequisites

1. Approved Amazon Associates (or other partner) account for CinNova
2. Verified website URL: `https://getcinnova.com`
3. Compliance with partner content and linking policies
4. Legal review of disclosure language
5. Partner present in `src/data/affiliate/partnerRegistry.js` with `enabled: false` until ready

## Disclosure requirements

- Use `AffiliateDisclosure` only when commercial affiliate/referral destinations are shown
- Suggested language (component default):
  “CinNova may earn a commission from qualifying purchases made through certain links.”
- Never show disclosure on ordinary non-affiliate retailer links
- Visible disclosure text is required; `data-ftc-disclosure` is metadata only

## Where destinations are configured

When a verified tag exists:

1. Store the tracked URL in the partner `urlEnvKey` environment variable (not in git)
2. Optionally store a non-secret campaign label in `campaignIdEnvKey` (not rendered in DOM by default)
3. Set registry `enabled: true` for that partner
4. Set `VITE_AFFILIATES_ENABLED=true` for the target environment (**both gates required**)
5. For commerce catalog entities (books), also set affiliate fields only after Associates verification
6. `PartnerOutboundLink` applies `rel` including `sponsored` for affiliate/referral

## Test requirements before activation

- [ ] Affiliate URL resolves to the correct product on an allowlisted host
- [ ] Disclosure renders on every affiliate/referral destination
- [ ] Non-affiliate books/products remain disclosure-free
- [ ] Analytics fire `affiliate_outbound_click` (not `purchase`)
- [ ] No PII / full query strings in GA4 params
- [ ] `npm run test:affiliate-foundation` passes
- [ ] Preview QA on surfaces that will show partner links

## Current status

- Global program flag default: **off**
- Registry partners: **all `enabled: false`**
- SEAT Amazon Kindle link: **normal retailer link** (`affiliateEnabled: false`) until Associates is verified
- Hardcoded `?ref=cinnova` stubs: **removed**
- Partner Admin UI: **not shipped** (registry + docs only)
