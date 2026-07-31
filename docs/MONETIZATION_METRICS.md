# Monetization Metrics Foundation

## Metrics we will evaluate

### Current / measurable in product analytics

| Metric | Event / signal |
|---|---|
| Product views | Existing product page views + future commerce_item_view |
| Book views | `commerce_item_view` (books) |
| Commercial CTA clicks | `commerce_cta_click` |
| Retailer outbound clicks | `commerce_outbound_click` (+ preserved `book_external_purchase_click`) |
| Newsletter starts | `commerce_lead_start` |
| Newsletter completions | `commerce_lead_complete` / `newsletter_signup` |
| Outbound CTR | Derived in GA4 (views → outbound) |
| Lead conversion rate | Derived in GA4 (views → lead complete) |
| `book_detail_to_cta_rate` | `commerce_cta_click` ÷ `commerce_item_view` (book detail) |
| `cta_to_outbound_rate` | `commerce_outbound_click` ÷ `commerce_cta_click` |
| `book_detail_to_outbound_rate` | `commerce_outbound_click` ÷ `commerce_item_view` (book detail) |
| `newsletter_conversion_rate` | `commerce_lead_complete` ÷ `commerce_lead_start` |

Placement dimensions for SEAT CTAs: `hero`, `mid_page`, `footer`.

### Future (not fired / not claimed)

| Metric | Notes |
|---|---|
| Checkout starts | Reserved `begin_checkout` — do not fire |
| Purchases | Reserved `purchase` — Amazon completion unknown |
| Revenue | Not available inside the site |
| Subscription starts | Reserved `subscribe` |
| MRR | Future billing system |
| Affiliate conversions | Requires partner dashboards |
| Ad revenue | Requires ad network |
| Sponsor revenue | Offline / CRM |

## Dashboard policy

Phase 11.1 does **not** expose a public monetization-admin UI (no auth system;
robots.txt is not access control). Configuration summaries live in
`getMonetizationChannelSummary()` and these docs.
Live GA4 numbers are labeled **Unavailable / not connected** when discussed.
Do not display `0` as if it were a measured revenue result.
