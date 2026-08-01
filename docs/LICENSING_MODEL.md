# Licensing Model

Future licensing types:

- Digital Book
- Application
- Enterprise
- Course
- Bundle
- Membership

## States

`active` · `expired` · `pending` · `suspended` · `cancelled`

## Phase 12 rules

- `LICENSE_STORE` is empty
- `activated` is always `false`
- Creating a license with `activated: true` throws
- No license activation workflows ship in this phase

Licenses may later mint entitlements; entitlements remain the access check.
