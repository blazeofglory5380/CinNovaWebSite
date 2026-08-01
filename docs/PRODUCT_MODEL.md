# Product Model

Centralized commerce product catalog covering:

`book` · `application` · `course` · `download` · `membership` · `service` ·
`bundle` · `resource`

## Fields

| Field | Notes |
|---|---|
| `id` | `commerce-…` stable id |
| `name` | Display name |
| `category` | One of the supported categories |
| `description` | Short description |
| `currentStatus` | Human / marketing status string |
| `availability` | `AVAILABLE` / `COMING_SOON` / `IN_DEVELOPMENT` / `BETA` / `UNAVAILABLE` |
| `version` | Semver-ish architecture version |
| `heroImage` | Optional path |
| `platforms` | `web`, `ios`, `android`, `desktop`, `kindle`, `print`, `api`, `multi` |
| `ownershipType` | purchase / subscription / license / free / bundle / enterprise / unknown |
| `subscriptionEligible` | Whether subscription tiers may apply |
| `commerceEligible` | CinNova-hosted checkout eligibility (**false** in Phase 12) |
| `futurePricePlaceholder` | Always `null` |
| `futureSkuPlaceholder` | Always `null` |
| `launchStatus` | concept → retired ladder |
| `relationshipIds` | Optional edge ids |
| `legacyBookId` / `legacyProductPage` | Bridges to existing catalogs |
| `internalRoute` | Optional site route |

## Seed sources

- Books from `booksCatalog.js`
- Marketing apps from `products.js`
- Architecture placeholders: StageScout, courses, downloads, membership, bundles,
  enterprise services

## Validation rule

`commerceEligible` must remain `false` until a real checkout provider ships.
