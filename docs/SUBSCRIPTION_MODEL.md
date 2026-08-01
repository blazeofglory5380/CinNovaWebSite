# Subscription Model

Architecture-only subscription tiers shared across CinNova applications.

## Tiers

`FREE` · `PLUS` · `PRO` · `FAMILY` · `TEAM` · `ENTERPRISE`

Each tier definition stores:

- Features
- Limits (`seats`, `projects`, `apiCalls` — `null` = unlimited / TBD)
- Product access list
- Upgrade paths
- Downgrade paths

## Plan records

Product-linked plans (PoisonGuard, StudyNest, Real Estate AI, StageScout,
TechMate, Team, Enterprise) are `ARCHITECTURE_ONLY` with:

- `price: null`
- `currency: null`
- `billingProvider: null`
- `activated: false`

`ACTIVE` status and purchasability are rejected until a later billing phase.

## Compatibility

Phase 11 `src/data/subscriptionPlans.js` remains for storefront placeholders.
Phase 12 `COMMERCE_SUBSCRIPTION_PLANS` is the platform source of truth for tier
ladders and entitlement linkage.
