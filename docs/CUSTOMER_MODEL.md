# Customer Model

## CURRENTLY IMPLEMENTED

Unified customer record factory + empty production catalog + validators.

## Fields

`customerId`, `displayName`, optional `email`, `avatarUrl`, `language`,
`timeZone`, newsletter preferences, owned-product / subscription / entitlement /
download / notification / recommendation / connected-app id lists, `supportStatus`.

## Explicitly excluded (factory rejects non-null values)

Passwords / password hashes, card/bank data, tax IDs, auth/session tokens,
payment methods, billing addresses.

## Guards

- `isProductionAccount: true` → throws
- `isAuthenticatedIdentity: true` → throws
- Architecture fixtures (`isArchitectureFixture: true`) must keep `email: null`
- `CUSTOMER_CATALOG` ships empty

## Identity boundary — BLOCKED UNTIL AUTHENTICATION

Phase 12 does **not** provide authentication. A commerce customer record must
**not** be treated as an authenticated identity. Do not trust a user-supplied
customer ID for ownership or entitlement access. Future authentication and
authorization are required before production customer accounts or entitlements
exist.

## ARCHITECTURE ONLY

`createArchitectureFixtureCustomer()` — test/docs fixture only.
