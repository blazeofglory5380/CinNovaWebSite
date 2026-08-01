# Partner Enrollment & Program Verification (Phase 11.4D)

Administrative enrollment layer on top of the Partner Catalog.

**Important:** Verification and enrollment tracking do **not** activate affiliate
links, insert affiliate IDs, claim partnerships, or enable commercial
destinations. Every company remains `not_started` / `not_approved` / `disabled`
until a later, explicit activation phase with evidence.

## Affiliate vs partner programs

| Kind | What it is | Direct commission? |
|---|---|---|
| Creator affiliate | Publishers promote with tracked links | Often yes — only if official terms say so |
| Customer referral | Existing customers invite others | Usually account credits/discounts |
| Reseller / agency / consulting / technology / marketplace / enterprise | Channel or implementation partnership | Usually **not** a creator affiliate commission |
| Startup / education / VC portfolio | Credits, curriculum, or fund programs | Usually not publisher commission |
| Invite-only | Limited acceptance | May pay, but not openly applyable |

Do **not** treat the words partner, ecosystem, marketplace, technology partner,
or implementation partner as proof of commission.

## Commission verification rules (`directRevenuePotential`)

Allowed values:

- `verified_commission` — official source clearly establishes compensation
  structure, eligibility, qualifying transactions, and payment mechanism
- `possible_revenue_not_publicly_specified` — program exists / apply path exists,
  but full commission terms are not public
- `non_commission_partner_program` — verified partner program without publisher
  commission terms
- `none` — no public program
- `unknown` — insufficient official evidence

Third-party affiliate directories are **supplemental only**. They cannot be the
sole source for `verified_commission`.

## `applicationReady` vs `revenueReady`

- **applicationReady** — official apply path exists, CinNova plausibly fits the
  published applicant type, not invite-only/closed, and applying would not create
  a misleading relationship claim.
- **revenueReady** — `applicationReady` **and** `directRevenuePotential ===
  verified_commission`.

An enterprise partner application can be application-ready while offering **no**
direct affiliate commission (`revenueReady=false`).

## Exact program types

`creator_affiliate`, `customer_referral`, `reseller`, `agency_partner`,
`consulting_implementation_partner`, `technology_integration_partner`,
`cloud_marketplace`, `startup_program`, `education_program`,
`vc_portfolio_program`, `invite_only_partner`, `enterprise_partner`,
`no_public_program`, `unknown`.

Companies may list multiple types; `enrollmentProgramType` is the primary.

## Official-source requirement

Every verified record must include:

- `sourceTitle`
- `verificationSource` (HTTPS URL)
- `evidenceSummary`
- `lastVerifiedDate` (`YYYY-MM-DD`)
- official program URL and/or terms/help docs when available

Review times:

- published vendor text only
- `NOT_PUBLISHED`
- `UNKNOWN`

Never invent numeric day SLAs. Never invent country eligibility.

## How the owner submits an application

1. Confirm `applicationReady=true` (or knowingly pursue a non-ready enterprise
   path with clear fit).
2. Complete the vendor application **outside** this repo.
3. Collect evidence: confirmation email, portal screenshot date, ticket ID
   (no secrets).
4. Open a dedicated PR that sets:
   - `applicationStatus: preparing` → `applied` → `pending`
   - `applicationDate`
   - notes referencing non-secret evidence
5. Keep `activationStatus: disabled` and IDs null.

## Evidence before Applied / Approved

| Status | Required evidence |
|---|---|
| `applied` | Submission confirmation from vendor/network |
| `pending` | Vendor acknowledges review in progress |
| `approved` | Written approval / portal approved state |
| `active` | Separate activation phase after legal + FTC + dual gates |

Without evidence, status must remain `not_started` (or `preparing` while drafting).

## Activation after approval

Follow `docs/AFFILIATE_MANAGEMENT.md` + catalog activating section:

1. Legal/FTC review
2. Registry enablement + env destination (never commit IDs)
3. Global affiliate gate only when intentionally enabling
4. Preview QA for disclosure, validation, analytics
5. Then catalog `activationStatus: active`

Phase 11.4D does **not** activate anyone.

## FTC / program disclosures / trademarks

- Use `programSpecificDisclosureRules` + default compliance text
- Trademark/logo use is not granted by catalog listing
- Obtain written brand permission before any mark use
- Never imply partnership/endorsement from catalog membership alone

## Renewal / reverification

1. Set `renewalDate` from vendor agreement when known
2. Re-check official program URL/terms before renewal
3. Update `lastVerifiedDate`, sources, and classification fields
4. Pause/archive if the program closes

## Classification inventory (no public admin UI)

Use:

```js
import {
  getPartnerVerificationReport,
  getEnrollmentInventoryMetrics,
  listHighPriorityZeroCostPrograms,
} from "../src/data/affiliate/index.js";
```

Dashboard counts (research inventory, not revenue):

- Verified commission programs
- Verified non-commission partner programs
- Invite-only programs
- Application-ready / revenue-ready
- Needs verification / no public program
- Applications submitted / approved / active (must stay 0 until evidence)

**Admin route decision:** `/?page=revenue-opportunities` UI removed. Robots
disallow retained as defense-in-depth. Inventory is data/docs only because a
robots rule is not access control and this surface has no production need.

## Related docs

- `docs/PARTNER_CATALOG.md`
- `docs/AFFILIATE_MANAGEMENT.md`

## Guardrails

- No affiliate activation
- No affiliate/referral IDs
- No invented programs, SLAs, or country rules
- No Applied/Approved without evidence
- No partnership claims
- No ads / payments / checkout
- No editorial automation changes
- No production deployment from this phase alone
