# Commerce Roadmap

## Phase 12 (this phase) — Foundation

- Unified customer model (no auth)
- Product catalog
- Subscription tier architecture
- Entitlement engine
- Licensing model
- Product relationships
- Notification models
- Customer dashboard architecture
- Internal admin summary (no public UI)
- Provider slots for future payments

## Later phases (not started)

1. **Identity** — authentication without storing payment data in the identity
   service
2. **Stripe integration** — Checkout Sessions / Customer Portal; map webhooks to
   entitlements
3. **PayPal integration** — alternate provider behind the same entitlement API
4. **Apple / Google IAP** — mobile purchase verification → entitlement grants
5. **Tax handling** — Stripe Tax or equivalent; never invent rates in content
6. **Invoicing / receipts** — provider-backed documents; dashboard placeholders
   become real
7. **Subscription activation** — flip plan status only after legal + pricing
   approval
8. **Migration** — map Phase 11 commerce entities and Amazon external retail into
   ownership records without inventing CinNova-hosted purchase history

## Migration strategy (preview)

1. Keep Phase 11 public CTAs unchanged until checkout is live
2. Introduce customer accounts only after auth ships
3. Grant entitlements from verified provider webhooks only
4. Backfill book ownership only with customer-evidenced purchases
5. Re-verify partner / affiliate posture separately (Phase 11.4) — commerce
   platform does not activate affiliates

## Provider independence

All billing providers register through `providers.js` slots. The entitlement
engine must never import a specific SDK — adapters belong in a future
`src/data/commerce/adapters/` package.
