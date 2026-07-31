# Zero-Budget Revenue Priority (Phase 11.1)

Paths that can start with little or no upfront paid infrastructure.

## ACTIVE NOW

### A. Amazon book sales (The Southeast Asian Table)

- Traffic → `/books` → detail → Amazon Kindle
- $0 CinNova checkout infrastructure (retailer handles payment)
- Track outbound/CTA clicks only — do not infer purchase completion

### B. Newsletter audience growth

- Content / products / books → newsletter signup → future commercial conversion
- Uses existing subscriber system
- Attribution via `newsletter_source`, `newsletter_placement`, `entity_slug`, `campaign_id` (no email in GA4)

### C. Organic search

- News, Blog, Books, Products → commercial destinations
- Already live editorial + SEO surfaces

## READY TO ACTIVATE

### D. Affiliate program applications

- Architecture ready (`affiliateEnabled`, partner/campaign fields, disclosure component)
- Activation blocked until verified partner relationships and IDs exist
- Do not invent Amazon Associates tags

### E. Sponsorship conversations

- Architecture ready (sponsor metadata + disclosure)
- Requires audience growth + sales process; no fake sponsors

## FUTURE

### F. Advertising networks

- Placement map prepared; network status `NOT_INSTALLED`
- Activate only after traffic thresholds and policy review
- Never on PoisonGuard emergency/safety guidance or purchase CTAs

### G. Premium app subscriptions

- Plan objects exist with `price: null`
- Requires Stripe/checkout phase later — not Phase 11.1

## Status legend

| Label | Meaning |
|---|---|
| ACTIVE NOW | Can earn or convert without new paid infra |
| READY TO ACTIVATE | Code/disclosure ready; needs verified partnership or ops |
| FUTURE | Architecture only; payments/networks not installed |
