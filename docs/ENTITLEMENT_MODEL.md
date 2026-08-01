# Entitlement Model

Entitlements determine **access only**. They do not charge cards or activate
billing.

## Kinds

`own` · `access` · `download` · `feature` · `seat`

## Statuses

`active` · `pending` · `expired` · `revoked` · `suspended`

## Engine API

- `customerHasProductAccess(customerId, productId)`
- `customerHasFeature(customerId, productId, featureKey)`

## Phase 12 store

`ENTITLEMENT_STORE` is **empty**. Named architecture examples (Beyond the Last
Light, Southeast Asian Table, PoisonGuard Premium, StageScout Premium, StudyNest
Pro, Real Estate AI Professional) live in `ENTITLEMENT_ARCHITECTURE_EXAMPLES`
with `pending` status for documentation and tests — they are not production
grants.

## Rule

Live `active` entitlements are forbidden in the Phase 12 store.
