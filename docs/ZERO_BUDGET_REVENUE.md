# Zero-Budget Revenue Priority (Phase 11.2)

Paths that can start with little or no upfront paid infrastructure.

## ACTIVE NOW

### A. Amazon book sales (The Southeast Asian Table)

```
Organic / direct / social traffic
→ Books / Products / Homepage / Blog (manual module)
→ SEAT detail
→ Amazon outbound
```

- Traffic → `/books` → detail → Amazon Kindle
- CTA placements on detail: `hero`, `mid_page`, `footer`
- $0 CinNova checkout infrastructure (retailer handles payment)
- Track outbound/CTA clicks only — **do not infer purchase completion**
- Amazon completed purchases are not yet visible to CinNova unless external reporting is added

### B. Newsletter audience growth

```
traffic → newsletter → future launches
```

- Content / products / books → newsletter signup → future commercial conversion
- Uses existing subscriber system
- Attribution via `newsletter_source`, `newsletter_placement`, `entity_slug`, `campaign_id` (no email in GA4)
- Coming Soon / In Development titles use Join Updates on book detail pages

### C. Organic search

- News, Blog, Books, Products → commercial destinations
- News remains editorial-first (newsletter only; no broad cookbook CTAs)

## READY TO ACTIVATE

### D. Affiliate program applications

- See `docs/AFFILIATE_ACTIVATION.md`
- Architecture ready; no invented Amazon Associates tags

### E. Sponsorship conversations

- See `docs/SPONSORSHIP_READINESS.md`
- Architecture ready; no fake sponsors or rates

## FUTURE

### F. Advertising networks

- Placement map prepared; network status `NOT_INSTALLED`

### G. Premium app subscriptions

- Plan objects exist with `price: null`
- Requires Stripe/checkout later

## Status legend

| Label | Meaning |
|---|---|
| ACTIVE NOW | Can earn or convert without new paid infra |
| READY TO ACTIVATE | Code/disclosure ready; needs verified partnership or ops |
| FUTURE | Architecture only; payments/networks not installed |
