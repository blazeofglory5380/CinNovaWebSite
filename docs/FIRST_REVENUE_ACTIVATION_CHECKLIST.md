# First Revenue Activation Checklist

Before CinNova accepts its **first hosted payment**, every item must be complete.

## Provider & business

- [ ] Stripe account created (recommended primary — `docs/PAYMENT_PROVIDER_DECISION_M2.md`)
- [ ] Business verification complete
- [ ] Bank / payout setup complete
- [ ] Test credentials provisioned in **server env only** (`sk_test_…`, webhook secret)
- [ ] Publishable test key available for client (`pk_test_…` only)

## Technical

- [ ] `CINNOVA_PAYMENTS_MODE=TEST` with test credentials resolving to TEST mode
- [ ] Webhook endpoint configured with signature verification
- [ ] Test purchase passed (provider-confirmed, not browser redirect alone)
- [ ] Failed payment path verified
- [ ] Cancelled checkout path verified
- [ ] Refund test passed
- [ ] Entitlement grant test passed
- [ ] Entitlement revoke / refund policy alignment verified
- [ ] Secure download authorization test passed (no permanent raw URLs)
- [ ] Tax configured (Stripe Tax or equivalent) — **LIVE blocked until done**
- [ ] Server-authoritative pricing tests green
- [ ] Monitoring / alerting for payment failures & webhook errors
- [ ] Customer support path working (email/contact for order issues)

## Legal & compliance

- [ ] Attorney review of Refund Policy
- [ ] Attorney review of Digital Product Terms
- [ ] Attorney review of Privacy / Terms updates for payments
- [ ] Affiliate Disclosure current (if affiliates will be used)
- [ ] Sponsorship disclosure current (if selling sponsors)
- [ ] Policies published on live site routes
- [ ] Accessibility spot-check on checkout

## Explicit LIVE gate

- [ ] Tax configured in production
- [ ] `CINNOVA_LIVE_PAYMENTS_APPROVED=true` set **only** after business owner approval
- [ ] Live secret key installed in server env (never committed)
- [ ] `CINNOVA_PAYMENTS_MODE=LIVE` with dual gate satisfied
- [ ] Smoke test with real small-value purchase + refund in production
- [ ] LIVE flag explicitly approved and recorded (date + approver)

## Still out of scope until separately approved

- [ ] Affiliate link activation (dual gate + verified IDs)
- [ ] Ads network placements
- [ ] Premium membership billing
- [ ] Editorial auto-publish (remains SHADOW)

**Rule:** No item may be checked from wishful thinking. Provider-dependent tests must SKIP honestly without credentials — never fabricate a pass.
