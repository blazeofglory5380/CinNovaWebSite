# CinNova Commerce Platform (Phase 12)

Shared commerce **architecture** for every current and future CinNova product.

## Status legend

| Label | Meaning |
|---|---|
| **CURRENTLY IMPLEMENTED** | Shipped data models, validators, and tests |
| **ARCHITECTURE ONLY** | Shapes/examples with no live behavior |
| **FUTURE** | Planned capability |
| **BLOCKED UNTIL AUTHENTICATION** | Requires real auth before production use |
| **BLOCKED UNTIL PAYMENT PROVIDER** | Requires chosen billing provider |
| **BLOCKED UNTIL LEGAL/TAX REVIEW** | Requires legal/tax approval |

Provider selection (Stripe / PayPal / Apple / Google) is **undecided**. Declaring
a provider slot does **not** mean that integration exists.

## CURRENTLY IMPLEMENTED

- Frozen customer / product / subscription / entitlement / license models
- Product catalog adapted from Books + Phase 11 `commerceCatalog` + marketing products
- Architecture placeholders isolated (`recordKind=architecture_placeholder`)
- Fail-closed access evaluation
- Internal admin summary + dashboard view-model builders
- Documentation + `test:commerce` / `test:subscriptions`

## ARCHITECTURE ONLY

- Subscription tier ladders and product-linked plans (not purchasable)
- Entitlement / license **examples** (pending; not grants)
- Cross-product relationships (recommend/companion only)
- Notification category models
- Invoice/receipt dashboard placeholders (empty)

## FUTURE / BLOCKED

| Capability | Blocker |
|---|---|
| Production customers | BLOCKED UNTIL AUTHENTICATION |
| Entitlement grants | BLOCKED UNTIL AUTHENTICATION |
| License activation | BLOCKED UNTIL AUTHENTICATION + PAYMENT PROVIDER |
| Hosted checkout / Buy / Subscribe | BLOCKED UNTIL PAYMENT PROVIDER |
| Tax / invoices / receipts | BLOCKED UNTIL LEGAL/TAX REVIEW + PAYMENT PROVIDER |
| Provider webhooks | FUTURE (provider undecided) |

## Identity boundary

Phase 12 does **not** provide authentication. A commerce `customerId` is **not**
an authenticated identity. User-supplied customer IDs must never be trusted for
ownership or entitlement access.

## Modules

See `src/data/commerce/platform/`. Public API: `src/data/commerce/index.js`.

## Guardrails

- No Stripe / PayPal / Apple Pay / Google Pay
- No checkout or payment processing
- No taxes, invoices, or receipts (empty placeholders only)
- No subscription activation
- No production customers
- No public commerce admin / customer dashboard routes
- No affiliate activation changes
- Amazon outbound (SEAT) remains Phase 11 external retail — not ownership

## Validation

```bash
npm run test:commerce
npm run test:subscriptions
```
