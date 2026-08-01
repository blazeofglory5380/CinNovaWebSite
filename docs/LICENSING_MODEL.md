# Licensing Model

## CURRENTLY IMPLEMENTED

License record factory + empty `LICENSE_STORE` + `licenseGrantsAccess()`.

## Types (ARCHITECTURE ONLY)

Digital Book · Application · Enterprise · Course · Bundle · Membership

## States

`active` · `expired` · `pending` · `suspended` · `cancelled`

Only `active` **and** `activated === true` can qualify for access — and only
after authentication + payment provider wiring.

## Phase 12 rules

- `activated` is always `false`; `activated: true` throws
- Expired / pending / suspended / cancelled never grant access
- Active+unactivated never grants access
- No license activation, key generation, or validation endpoints
- Do not imply software licenses are currently sold

## BLOCKED UNTIL AUTHENTICATION + PAYMENT PROVIDER

Real license issuance and activation.
