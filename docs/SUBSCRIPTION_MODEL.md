# Subscription Model

## CURRENTLY IMPLEMENTED (architecture plans)

Tiers: `FREE` · `PLUS` · `PRO` · `FAMILY` · `TEAM` · `ENTERPRISE`

Each tier has features, limits, upgrade paths, and downgrade paths.
Product-linked plans (PoisonGuard, StudyNest, Real Estate AI, StageScout,
TechMate, Team, Enterprise) are `ARCHITECTURE_ONLY` with:

- `price: null`, `currency: null`, `billingProvider: null`, `activated: false`
- `planScope: "product"` (not global CinNova access)
- `featuresAreArchitectureExamples: true`

## Not implied

- Features/limits do **not** claim currently shipping product behavior
- Billing intervals do **not** create an active offer
- Not every product needs every tier

## BLOCKED UNTIL PAYMENT PROVIDER

Purchasable / `ACTIVE` plans. Creating `ACTIVE` or `activated: true` throws.
