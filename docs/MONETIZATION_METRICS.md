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
| `book_detail_to_cta_rate` | `commerce_cta_click` where `placement` ∈ {`hero`,`footer`} ÷ `commerce_item_view` where `placement=book_detail` |
| `cta_to_outbound_rate` | `commerce_outbound_click` ÷ `commerce_cta_click` (same placement filter when comparing SEAT detail) |
| `book_detail_to_outbound_rate` | `commerce_outbound_click` (SEAT detail placements) ÷ `commerce_item_view` (`placement=book_detail`) |
| `newsletter_conversion_rate` | `commerce_lead_complete` ÷ `commerce_lead_start` (same `newsletter_placement` / `campaign_id` scope) |
| `organic_to_book_rate` | Book detail / Books index engagement from organic landing sessions ÷ organic sessions (GA4 channel grouping; definition only) |
| `organic_to_product_rate` | Product page views from organic sessions ÷ organic sessions |
| `organic_to_newsletter_rate` | `commerce_lead_complete` attributed to organic sessions ÷ organic sessions |
| `organic_to_outbound_rate` | `commerce_outbound_click` from organic sessions ÷ organic sessions |

These are definition-only. Do **not** invent measured production values.

SEAT detail commercial CTAs (trust-first): `hero` + `footer` only. Mid-page Amazon CTA was removed to avoid repetitive purchase pressure.

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
