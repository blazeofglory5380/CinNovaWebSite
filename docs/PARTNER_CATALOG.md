# Partner Catalog & Application Tracker (Phase 11.4B / 11.4D)

Centralized **AI & Technology Partner Catalog**, **Partner Application Tracker**,
**Partner Enrollment verification**, and **Revenue Opportunities** dashboard for
CinNova.

Enrollment verification procedures live in `docs/PARTNER_ENROLLMENT.md`
(Phase 11.4D).

**Important:** Catalog entries are research / prospect records only.
Listing a company does **not** claim a partnership, affiliate approval,
referral relationship, or commercial agreement exists.

No affiliate IDs, referral IDs, tracked commercial URLs, ads, or payment
processing are introduced in this phase. Every company defaults to:

| Field | Default |
|---|---|
| Application status | `not_started` |
| Approval status | `not_approved` |
| Activation status | `disabled` |
| Affiliate / referral IDs | `null` |
| Commercial links | none |

## Categories

- AI Companies
- Creative Tools
- Developer Platforms
- Cloud Providers
- Hardware Companies

## Architecture

| Module | Path |
|---|---|
| Categories | `src/data/affiliate/catalogCategories.js` |
| Status enums | `src/data/affiliate/catalogStatuses.js` |
| Enrollment program types | `src/data/affiliate/enrollmentProgramTypes.js` |
| Partner Catalog | `src/data/affiliate/partnerCatalog.js` |
| Application Tracker | `src/data/affiliate/applicationTracker.js` |
| Verification report | `src/data/affiliate/verificationReport.js` |
| Revenue Opportunities metrics | `src/data/affiliate/revenueOpportunities.js` |
| Runtime affiliate registry (11.4A) | `src/data/affiliate/partnerRegistry.js` |
| Dashboard UI (admin-gated) | `src/pages/RevenueOpportunities.jsx` |

Public API re-exports live in `src/data/affiliate/index.js`.

### Catalog vs runtime registry

- **Partner Catalog** = prospect inventory + application state (this phase).
- **Partner Registry** = runtime activation / link resolution (Phase 11.4A).
- Optional `registryPartnerId` may point a catalog row at a registry id
  (for example Canva / Notion). That link does **not** activate anything.

## Record fields

Each catalog record includes:

- Company name
- Official website (HTTPS reference URL)
- Category
- Partner type (`affiliate` \| `referral` \| `partner` \| `official`)
- Enrollment program type (`affiliate` \| `referral` \| `technology_partner` \|
  `marketplace` \| `reseller` \| `enterprise` \| `none` \| `unknown`)
- Official program URL, eligibility, country restrictions, application/approval
  required flags, estimated review time, public/private, verification source
- Program status
- Application status (`not_started` \| `preparing` \| `applied` \| `pending` \|
  `approved` \| `rejected` \| `paused` \| `inactive` \| `archived`)
- Approval status
- Activation status
- Document storage dates/notes (`applicationDate`, `approvalDate`, `renewalDate`, …)
- Compliance fields (FTC / trademark / brand guidelines / logo permissions)
- Allowed domains
- FTC disclosure requirement
- Notes
- Last reviewed / last verified (`YYYY-MM-DD`)

## Revenue Opportunities dashboard

Internal page key: `revenue-opportunities`  
URL (local only when admin routes enabled): `/?page=revenue-opportunities`

Shows placeholder KPIs (all **0** until real telemetry / filed applications):

- Total partners
- Applications / Applications submitted
- Approved / Pending review / Rejected / Inactive
- Active
- Affiliate clicks
- Revenue
- Conversion rate
- Programs available / Programs verified (placeholders)

Also shows research inventory (verification counts), the application tracker
table (all rows Not Started / Disabled in this phase), and a verification
report by category.

Gated by `VITE_ENABLE_ADMIN_ROUTES=true` (same gate as Blog Manager /
Newsletter Admin). Production must leave that flag unset/`false`.
Robots disallow: `/?page=revenue-opportunities`.

---

## Adding a company

1. Choose the correct category in `catalogCategories.js` (do not invent new
   categories without updating docs + tests).
2. Add a frozen entry via `catalogEntry({...})` in `partnerCatalog.js`.
3. Set:
   - `companyName`, `officialWebsite` (https only)
   - `partnerType`
   - `programStatus` (usually `researching`)
   - `allowedDomains` (must include the official website host)
   - `ftcDisclosureRequired`
   - `notes` (state clearly that this is a prospect only)
4. Do **not** set affiliate/referral IDs (fields stay `null`).
5. Do **not** set `applicationStatus`, `approvalStatus`, or `activationStatus`
   to anything other than the defaults (`not_started` / `not_approved` /
   `disabled`) unless a later phase documents a real workflow change.
6. Fill enrollment verification fields per `docs/PARTNER_ENROLLMENT.md`
   (program type, official URL, sources). Use `unknown` when unsure.
7. Optionally set `registryPartnerId` if a matching 11.4A registry shell exists.
8. Run `npm run test:partner-catalog` and `npm run test:affiliate-foundation`.

## Applying to a program

1. Confirm the company has a real, public partner / affiliate / referral program
   (see `docs/PARTNER_ENROLLMENT.md`).
2. Complete the vendor application **outside** this repo (vendor portal / email).
3. Update catalog fields in a dedicated PR only after the application is filed:
   - `applicationStatus`: `preparing` → `applied` → `pending`
   - `applicationDate`: ISO date filed
   - `programStatus`: reflect known program state (`open`, `invite_only`, etc.)
   - `notes`: date filed + non-secret reference (ticket / portal name)
   - `lastReviewed`: today
4. Keep `approvalStatus: not_approved` and `activationStatus: disabled`.
5. Do **not** add affiliate IDs or env commercial URLs yet.
6. Loosen Phase 11.4D validation guards in the same PR if statuses leave
   `not_started` (tests must be updated intentionally).

Until a later phase changes the validators, the shipped catalog must remain
`not_started` so CI continues to prove no silent activation.

## Activating a partner

Activation is a **separate** dual-gated process from Phase 11.4A. Catalog
approval alone never renders commercial links.

1. Legal / partner terms approved; FTC disclosure copy reviewed.
2. Set catalog `approvalStatus: approved` only after written confirmation.
3. Add or update the matching `PARTNER_REGISTRY` record if needed.
4. Store the verified HTTPS destination in the partner `urlEnvKey` env var
   (never commit affiliate IDs / tracked URLs).
5. Set registry `enabled: true` in a dedicated PR.
6. Set `VITE_AFFILIATES_ENABLED=true` only for the target environment.
7. Set catalog `activationStatus: active` only after preview QA confirms
   disclosure + validation + analytics.
8. Follow `docs/AFFILIATE_MANAGEMENT.md` rollback steps if anything fails.

**Phase 11.4B does not activate any partner.**

## Removing a partner

1. Prefer soft-remove: set `activationStatus: disabled`, clear env destination,
   keep historical notes.
2. If the company should leave the catalog entirely, delete the catalog entry
   in a dedicated PR and remove any unused `registryPartnerId` linkage notes.
3. If a runtime registry partner exists, set `enabled: false` (or remove the
   record) in the same or follow-up PR.
4. Blank related env URLs in hosting so resolve stays fail-closed.
5. Confirm Revenue Opportunities no longer lists the company (or shows it
   disabled, if soft-removed).
6. Re-run partner catalog + affiliate foundation tests.

## FTC compliance

- Any future commercial affiliate/referral destination requires visible
  disclosure via `AffiliateDisclosure` (see Phase 11.4A).
- Catalog `ftcDisclosureRequired: true` marks expected commercial types.
- Do not show disclosure for ordinary official reference links.
- Do not claim “partner,” “sponsored,” or “affiliate” in public copy for a
  company that is only listed in this catalog.
- Never put affiliate tags, click IDs, or secrets in git, docs samples, or
  analytics payloads.

## Link validation

Catalog official websites and future commercial destinations must:

- Use absolute `https:` URLs only
- Reject relative / scheme-less / credential-bearing / private-network hosts
- Keep destination hosts inside `allowedDomains`
- Pass `validatePartnerCatalog` / `validateHttpsUrl` / registry validation

Runtime commercial links still go through `resolvePartnerLink` + dual gates.
Official websites shown on the internal dashboard are **research reference
links**, not affiliate destinations.

## Tests

```bash
npm run test:partner-catalog
npm run test:affiliate-foundation
npm run lint
npm run build
```

## Explicit non-goals (this phase)

- No affiliate / referral IDs in git
- No activated partners
- No claims that partnerships exist
- No payment processing / checkout
- No advertisements / ad networks
- No editorial automation changes
- No production enablement of admin routes
