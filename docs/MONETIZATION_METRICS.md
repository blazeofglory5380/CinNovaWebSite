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

`MonetizationAdmin` (admin-gated) shows configuration and event definitions.
Live GA4 numbers are labeled **Unavailable / not connected**.
Do not display `0` as if it were a measured revenue result.
