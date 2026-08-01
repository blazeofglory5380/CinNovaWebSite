# Affiliate Management Foundation (Phase 11.4A)

Centralized affiliate / partner management for future CinNova monetization.
**No affiliate links are active in production by default.**

## Goals

- One partner registry (no scattered hardcoded affiliate URLs)
- Partner types: `affiliate`, `referral`, `partner`, `official`
- Dual activation gates (global + per-partner)
- FTC disclosure component
- GA4 outbound click tracking (`affiliate_outbound_click` for commercial types only)
- HTTPS + host-allowlist validation before render
- Documentation-driven activation (no unauthenticated Partner Admin UI)
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

There is **no** Partner Admin page in Phase 11.4A. `/partner-admin` is not routed;
robots.txt still disallows it for defense in depth. Configuration is code + env + docs.

## Exact gates

### Global gate

- Env flag: `VITE_AFFILIATES_ENABLED`
- Enabled only when the value is exactly `"true"`
- Missing, empty, `false`, or any other value → **OFF** (fail closed)

### Per-partner gate

- Registry field: `enabled: true`
- Default for every partner today: `enabled: false`

### Both required

`PartnerOutboundLink` / `resolvePartnerLink` render a destination only when:

1. `VITE_AFFILIATES_ENABLED=true`, **and**
2. `partner.enabled === true`, **and**
3. A validated HTTPS destination is available (env URL or, for official/partner types only, `officialWebsite`), **and**
4. Destination host matches the partner allowlist derived from `officialWebsite` (+ optional `allowedHosts`)

One gate alone never activates a link.

## Env key naming

| Purpose | Pattern | Example |
|---|---|---|
| Global master switch | `VITE_AFFILIATES_ENABLED` | unset / `false` in production |
| Commercial destination URL | `VITE_AFFILIATE_URL_<PARTNER>` | `VITE_AFFILIATE_URL_NOTION` |
| Optional campaign label (not shipped to DOM) | `VITE_AFFILIATE_CAMPAIGN_<PARTNER>` | `VITE_AFFILIATE_CAMPAIGN_NOTION` |

Never commit real production affiliate IDs, tags, or tracked URLs to git.
Store them only in hosting env / local `.env.local` (gitignored).

## URL validation requirements

Allowed:

- Absolute `https:` URLs only

Rejected (fail closed):

- `http:`, `javascript:`, `data:`, `file:`, other schemes
- Relative / scheme-less strings
- Empty / malformed URLs
- Credential-bearing URLs (`https://user:pass@host/...`)
- localhost / example.com / private-network destinations
- Hosts outside the partner allowlist

Raw env values are never written into documentation samples as secrets, never logged by the resolver, and never rendered in the DOM when invalid.

## Partner type behavior

| Type | Disclosure | `rel` | Analytics |
|---|---|---|---|
| `affiliate` | Required when shown | `noopener noreferrer sponsored nofollow` | `affiliate_outbound_click` |
| `referral` | Required when shown | `noopener noreferrer sponsored nofollow` | `affiliate_outbound_click` |
| `partner` | Not by default | `noopener noreferrer` | generic outbound only |
| `official` | Never for commission | `noopener noreferrer` | generic outbound only |

Do not label every external company a “partner” in user-facing copy unless the relationship is intentional and disclosed when commercial.

## Adding a new partner

1. Add a frozen record to `PARTNER_REGISTRY` with `enabled: false`
2. Set `type`, `disclosureRequired`, `officialWebsite`, and commercial `urlEnvKey`
3. Add `allowedHosts` when destinations may use hosts beyond the official apex
4. Document env placeholders in `.env.example` (commented, empty)
5. Run `npm run test:affiliate-foundation`

## Enabling a partner (safe activation)

1. Legal/partner terms approved; disclosure copy reviewed
2. Put the verified HTTPS destination in the partner `urlEnvKey` env var (not in git)
3. Set registry `enabled: true` in a dedicated PR
4. Set `VITE_AFFILIATES_ENABLED=true` only for the target environment
5. Confirm `AffiliateDisclosure` renders next to commercial links
6. Confirm `affiliate_outbound_click` in GA4 DebugView (host + partner_id only)
7. Preview QA: no secrets in HTML, correct `rel`, no purchase events

## Rollback procedure

1. Set `VITE_AFFILIATES_ENABLED` to unset/`false` and redeploy (immediate global off), **or**
2. Set the partner’s `enabled: false` and redeploy, **or**
3. Remove/blank the env destination URL (fail closed → no href)

Prefer the global flag for emergency rollback.

## Disclosure requirements

- Use `AffiliateDisclosure` whenever an enabled affiliate/referral destination is shown
- Default copy: “CinNova may earn a commission from qualifying purchases made through certain links.”
- Must be visible text near the links (`data-ftc-disclosure` is metadata only — not a substitute)
- Do not show disclosure for ordinary official links or non-affiliate retailer links

## Analytics verification

| Event | When | Safe params |
|---|---|---|
| `affiliate_outbound_click` | Enabled affiliate/referral click via `PartnerOutboundLink` | `partner_id`, `partner_type`, `destination_url_host`, `placement`, `disclosure_shown`, optional `entity_slug` / non-secret `campaign_id` |

Never send: full URL + query strings, affiliate tags/secrets, email, name, phone, or other PII.

Do not fire: `purchase`, `begin_checkout`, `subscribe`.

Duplicate clicks within a short window are de-duplicated.

GA4 Measurement ID remains unchanged (`VITE_GA_MEASUREMENT_ID` / `G-CD944CHBK6`).

## Production approval checklist

- [ ] `VITE_AFFILIATES_ENABLED` unset/false in production
- [ ] Every registry partner `enabled: false` (or intentionally reviewed)
- [ ] No affiliate IDs / tracked URLs in git
- [ ] SEAT Amazon remains ordinary EXTERNAL_RETAIL until Associates verified
- [ ] Zero affiliate disclosures on production pages
- [ ] `/partner-admin` not a live UI route
- [ ] `npm run test:affiliate-foundation` passes
- [ ] Lint 0 errors; build passes

## Explicit non-goals (this phase)

- No production affiliate IDs in git
- No ads / ad networks
- No checkout UI / payment processing
- No authenticated admin console
- No auto-insertion of affiliate modules into News editorial automation
- No Phase 11.4B activation work in this PR
