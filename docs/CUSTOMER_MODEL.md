# Customer Model

Unified customer record for every CinNova surface.

## Fields

| Field | Notes |
|---|---|
| `customerId` | Stable opaque id |
| `displayName` | Public display name |
| `email` | Optional; may be null in fixtures |
| `avatarUrl` | Optional |
| `language` | BCP 47-ish code (default `en`) |
| `timeZone` | IANA zone |
| `newsletterPreferences` | Product / books / apps / partner / system flags |
| `productsOwned` | Commerce product ids |
| `subscriptionIds` | Plan instance ids (future) |
| `entitlementIds` | Entitlement ids |
| `downloadIds` | Download grant ids |
| `notificationIds` | Notification ids |
| `savedRecommendationIds` | Saved cross-product recommendations |
| `connectedApplicationIds` | Linked CinNova apps |
| `supportStatus` | `none` \| `open` \| `pending` \| `resolved` \| `escalated` |

## Explicitly excluded (Phase 12)

- Passwords / password hashes
- Authentication sessions
- Payment methods
- Billing addresses
- Production accounts (`isProductionAccount` must stay `false`; creating `true` throws)

## Store

`CUSTOMER_CATALOG` ships **empty**. Use `createArchitectureFixtureCustomer()` only
in tests / docs — never as a live production account.

## API

```js
import {
  createCustomerRecord,
  validateCustomerRecord,
  listCustomers,
  createArchitectureFixtureCustomer,
} from "../src/data/commerce/index.js";
```
