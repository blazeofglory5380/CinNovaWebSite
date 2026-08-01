# Partner Enrollment & Program Verification (Phase 11.4D)

Administrative enrollment layer on top of the Phase 11.4B Partner Catalog.

**Important:** Verification and enrollment tracking do **not** activate affiliate
links, insert affiliate IDs, claim partnerships, or enable commercial
destinations. Every company remains `not_started` / `not_approved` / `disabled`
until a later, explicit activation phase.

## Goals

- Verify whether each catalog company has a public affiliate, referral,
  technology partner, marketplace, reseller, or enterprise program.
- Record eligibility, restrictions, application/approval requirements, and
  official program URLs from primary sources only.
- Track application lifecycle without inventing SLAs or inventing programs.
- Document FTC / trademark / logo compliance posture before any future activation.

## How to verify a partner

1. Start from the catalog row in `src/data/affiliate/partnerCatalog.js`.
2. Prefer **official first-party pages** (vendor domain, Help Center, Partner
   Portal, or vendor-hosted network pages such as PartnerStack/Dub/CJ only when
   linked from the vendor).
3. Classify `enrollmentProgramType`:
   - `affiliate` | `referral` | `technology_partner` | `marketplace` |
     `reseller` | `enterprise` | `none` | `unknown`
4. If uncertain, set:
   - `enrollmentProgramType: unknown`
   - eligibility / country / review fields to `UNKNOWN – Verification Required`
5. Never invent:
   - programs that are not published
   - approval requirements
   - review timelines (use `Not published by vendor` or `UNKNOWN – Verification Required`)
6. Record `lastVerifiedDate` (`YYYY-MM-DD`) and `verificationSource` (HTTPS URL).
7. Keep `affiliateId` / `referralId` null. Do not paste tracked commercial URLs.

## How to apply

1. Confirm verification bucket is **Verified** and program status is **Open**
   (or explicitly Invite Only if you have an invitation).
2. Change application status only when work actually begins:
   - `not_started` → `preparing` → `applied` → `pending` → `approved` / `rejected`
3. Store `applicationDate` when the application is submitted.
4. Store `programDocumentationUrl`, `reviewNotes`, and `internalNotes`.
5. Do **not** flip `activationStatus` to `active` in this phase.
6. Do **not** add affiliate/referral IDs here.

## Required documentation (document storage)

Each catalog row supports:

| Field | Purpose |
|---|---|
| `applicationDate` | Date application was filed (null until filed) |
| `approvalDate` | Date approval received (null until approved) |
| `renewalDate` | Renewal / re-cert date if applicable |
| `reviewNotes` | External/program reviewer notes |
| `internalNotes` | CinNova internal ops notes |
| `programDocumentationUrl` | Official terms / guide / agreement URL |

## Approval workflow

1. **Preparing** — gather business info, FTC plan, brand-guideline review.
2. **Applied** — submission confirmed with vendor/network.
3. **Pending** — awaiting vendor decision.
4. **Approved** — written approval recorded; still **not activated**.
5. **Rejected / Paused / Inactive / Archived** — record reason; no commercial links.

Activation remains a separate future phase after legal/compliance sign-off.

## Compliance checklist

Before any future commercial recommendation:

- [ ] FTC disclosure text drafted and placement planned (near the recommendation)
- [ ] Program-specific disclosure rules reviewed (`programSpecificDisclosureRules`)
- [ ] Trademark usage restrictions reviewed
- [ ] Brand guidelines located (`brandGuidelinesAvailable`)
- [ ] Logo usage permission obtained in writing (`logoUsagePermissions`)
- [ ] No partnership/endorsement claims in copy
- [ ] Affiliate/referral IDs still absent until activation phase
- [ ] Global affiliate program gate remains disabled unless intentionally enabled later

Default compliance text lives in `src/data/affiliate/complianceDefaults.js`.

## Renewal workflow

1. Set / update `renewalDate` from vendor agreement.
2. Re-verify program URL and terms 30 days before renewal when possible.
3. Update `lastVerifiedDate` / `verificationSource`.
4. If the program closes or terms change materially, set `programStatus` and
   pause or archive the tracker row.
5. Never leave active commercial links after expiry (activation phase concern).

## Reporting

Use `getPartnerVerificationReport()` for category summaries:

- AI Companies
- Creative Tools
- Developer Platforms
- Cloud Providers
- Hardware Companies

Each category reports **Verified**, **Needs Verification**, and **No Public Program**.

Dashboard: `/?page=revenue-opportunities` (admin-gated, `noindex`).

## Related docs

- `docs/PARTNER_CATALOG.md` — catalog architecture / add-company procedures
- `docs/AFFILIATE_MANAGEMENT.md` — runtime affiliate foundation (11.4A)

## Guardrails

- No affiliate activation
- No affiliate/referral IDs
- No invented programs or review SLAs
- No partnership claims
- No ads / payments / checkout
- No editorial automation changes
- No production deployment from this phase alone
