# CinNova Commerce Platform (Phase 12)

Shared commerce **architecture** for every current and future CinNova product:
books, applications, courses, downloads, memberships, services, bundles, and
resources.

This phase does **not** implement payments, checkout, taxes, invoices, receipts,
authentication, or production customer accounts.

## Modules

| Area | Path |
|---|---|
| Constants / enums | `src/data/commerce/platform/constants.js` |
| Customer model | `src/data/commerce/platform/customerModel.js` |
| Product catalog | `src/data/commerce/platform/productCatalog.js` |
| Subscriptions | `src/data/commerce/platform/subscriptionModel.js` |
| Entitlements | `src/data/commerce/platform/entitlementEngine.js` |
| Licensing | `src/data/commerce/platform/licensingModel.js` |
| Relationships | `src/data/commerce/platform/productRelationships.js` |
| Notifications | `src/data/commerce/platform/notificationModel.js` |
| Customer dashboard | `src/data/commerce/platform/customerDashboard.js` |
| Admin foundation | `src/data/commerce/platform/adminFoundation.js` |
| Future providers | `src/data/commerce/platform/providers.js` |
| Public API | `src/data/commerce/index.js` |

## Architecture principles

- **Modular** — each concern is an isolated module with frozen records
- **Strongly typed** — JSDoc typedefs + runtime validators
- **Provider independent** — Stripe / PayPal / Apple / Google are slots only
- **Reusable** — one catalog and entitlement engine for every CinNova app
- **Safe defaults** — empty customer store, null prices/SKUs, no activated plans

## Relationships to Phase 11

Phase 11 monetization (`commerceCatalog.js`, `subscriptionPlans.js`) remains the
public-storefront / CTA layer. Phase 12 adds the **customer / entitlement /
licensing** platform that future checkout will plug into. Do not treat Phase 11
external Amazon links as CinNova-hosted commerce eligibility.

## Guardrails (Phase 12)

- No Stripe / PayPal / Apple Pay / Google Pay
- No checkout or payment processing
- No taxes, invoices, or receipts (placeholders only)
- No subscription activation
- No production customers
- No public commerce admin UI
- No affiliate activation changes

## Validation

```bash
npm run test:commerce
npm run test:subscriptions
```

See also: `CUSTOMER_MODEL.md`, `PRODUCT_MODEL.md`, `SUBSCRIPTION_MODEL.md`,
`ENTITLEMENT_MODEL.md`, `LICENSING_MODEL.md`, `COMMERCE_ROADMAP.md`.
