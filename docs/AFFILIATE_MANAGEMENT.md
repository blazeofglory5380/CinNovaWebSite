# Affiliate Management Foundation (Phase 11.4A)

Centralized affiliate / partner management for future CinNova monetization.
**No affiliate links are active in production by default.**

## Goals

- One partner registry (no scattered hardcoded affiliate URLs)
- Partner types: `affiliate`, `referral`, `partner`, `official`
- Global enable/disable (`VITE_AFFILIATES_ENABLED`)
- Per-partner `enabled` flag
- FTC disclosure component
- GA4 outbound click tracking (`affiliate_outbound_click`)
- Link validation before render
- Internal admin configuration view (`/partner-admin`)
- No ads, checkout, or payment processing in this phase

## Architecture

| Module | Path |
|---|---|
| Types | `src/data/affiliate/partnerTypes.js` |
| Global config | `src/data/affiliate/affiliateConfig.js` |
| Registry | `src/data/affiliate/partnerRegistry.js` |
| Validation | `src/data/affiliate/linkValidation.js` |
| Resolve | `src/data/affiliate/resolvePartnerLink.js` |
| Public API | `src/data/affiliate/index.js` |
| Article compatibility | `src/data/affiliateLinks.js` |
| Disclosure UI | `src/components/commerce/AffiliateDisclosure.jsx` |
| Outbound link UI | `src/components/commerce/PartnerOutboundLink.jsx` |
| Admin UI | `src/pages/PartnerAdmin.jsx` |

## Adding a new partner

1. Add a frozen record to `PARTNER_REGISTRY` in `partnerRegistry.js`:
   - Unique string `id`
   - `type` from `PARTNER_TYPES`
   - `enabled: false` initially
   - `disclosureRequired: true` for affiliate/referral
   - `officialWebsite` (https public site only — not an affiliate deep link)
   - `urlEnvKey` / `campaignIdEnvKey` for commercial types (env var names only)
2. Do **not** commit production affiliate IDs or tracked affiliate URLs.
3. Run `npm run test:affiliate-foundation`.
4. Document the env keys in `.env.example` as commented placeholders.

## Enabling a partner

All of the following must be true before a link renders:

1. Partner `enabled: true` in the registry
2. `VITE_AFFILIATES_ENABLED=true` for that build/deploy
3. For affiliate/referral: a valid https URL in the partner's `urlEnvKey` env var
4. For official/partner (optional): may use `officialWebsite` when no env URL is set
5. Validation must pass (`validateResolvedPartnerLink`)

Until then, `resolvePartnerLink` returns `renderable: false` and UI renders nothing.

Also see `docs/AFFILIATE_ACTIVATION.md` for commerce-catalog Associates activation.

## Required disclosures

- Use `AffiliateDisclosure` whenever a commercial (affiliate/referral) destination is shown.
- Default copy: “CinNova may earn a commission from qualifying purchases made through certain links.”
- Do **not** show disclosure on ordinary non-affiliate retailer links (`affiliateEnabled: false`).
- Official/partner recommendations without commission should set `disclosureRequired: false`.

## Analytics events

| Event | When | Params (no PII) |
|---|---|---|
| `affiliate_outbound_click` | Click on `PartnerOutboundLink` | `partner_id`, `partner_name`, `partner_type`, `placement`, `destination_url_host`, `campaign_id` (truncated), `disclosure_shown` |

Preserved separately:

- `outbound_link_click` — generic delegated outbound listener
- `commerce_outbound_click` — commerce catalog CTAs

Reserved / never fire from this phase: `begin_checkout`, `purchase`, `subscribe`.

GA4 Measurement ID remains `G-CD944CHBK6` (via `VITE_GA_MEASUREMENT_ID`).

## Admin configuration

- Route: `/partner-admin` (also `?page=partner-admin`)
- Gated by `VITE_ENABLE_ADMIN_ROUTES=true` (local only; leave off in production)
- Read-only status of global flag, registry, env URL presence, renderability
- Disallowed in `robots.txt`

## Explicit non-goals (this phase)

- No production affiliate IDs in git
- No ads / ad networks
- No checkout UI
- No payment processing
- No auto-insertion of affiliate modules into News editorial automation
