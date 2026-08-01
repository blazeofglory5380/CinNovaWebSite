# Commerce Roadmap

## Phase 12 (this phase) — Foundation — CURRENTLY IMPLEMENTED

Architecture models, fail-closed access, placeholder isolation, docs, tests.

## Provider selection — UNDECIDED

Stripe, PayPal, Apple, and Google are **future slots only**. None are integrated.
Choosing a provider requires a later explicit phase.

## Later phases

| Step | Status |
|---|---|
| Identity / authentication | BLOCKED UNTIL AUTHENTICATION |
| Stripe adapter | FUTURE — BLOCKED UNTIL PAYMENT PROVIDER |
| PayPal adapter | FUTURE — BLOCKED UNTIL PAYMENT PROVIDER |
| Apple / Google IAP | FUTURE — BLOCKED UNTIL PAYMENT PROVIDER |
| Tax handling | BLOCKED UNTIL LEGAL/TAX REVIEW |
| Invoicing / receipts | BLOCKED UNTIL PAYMENT PROVIDER |
| Subscription activation | BLOCKED UNTIL PAYMENT PROVIDER + legal pricing |
| Migration from Phase 11 external retail | FUTURE — Amazon clicks ≠ ownership |

## Migration strategy (preview)

1. Keep Phase 11 public CTAs unchanged until hosted checkout is live
2. Introduce customer accounts only after auth ships
3. Grant entitlements from verified provider webhooks only
4. Backfill book ownership only with customer-evidenced purchases
5. Partner/affiliate posture remains Phase 11.4 — commerce does not activate affiliates

## Provider independence

Billing providers register through `providers.js` slots. The entitlement engine
must never import a specific SDK — adapters belong in a future
`src/data/commerce/adapters/` package.
