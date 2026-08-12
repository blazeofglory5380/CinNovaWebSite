# Payment Provider Decision — Phase M2

**Status:** Recommendation only — **not activated**  
**Date:** 2026-08-11  
**Primary recommendation:** **Stripe**

## Options evaluated

| Provider | Digital goods | Apple/Google Pay | Tax | Subscriptions | Webhooks | Ops complexity |
|---|---|---|---|---|---|---|
| **Stripe** | Excellent | Via Stripe Payment Element | Stripe Tax | Mature | Strong | Low–medium |
| PayPal | Good | Limited vs Stripe | Separate tooling | Available | Good | Medium |
| Apple IAP / Google Play | Apps only | Native stores | Store-managed | Native | Store | High (app review) |

## Why Stripe first

1. **Digital downloads + books/products on web** — Checkout Sessions / Payment Intents fit CinNova hosted store.
2. **U.S. merchant + international customers** — multi-currency presentment with server-authoritative settlement currency.
3. **Apple Pay + Google Pay** — available through Stripe Payment Element without separate processor accounts for web.
4. **Refunds + disputes** — first-class APIs and webhook events (`charge.refunded`, `charge.dispute.created`).
5. **Tax** — Stripe Tax covers U.S. sales tax and many VAT/GST scenarios; required before LIVE (see tax architecture).
6. **Subscriptions later** — Billing/Customer Portal aligns with future memberships.
7. **Developer integration + security** — publishable keys client-side only; secrets server-only; signed webhooks.
8. **Operational complexity** — one primary stack vs PayPal + wallets + tax vendor sprawl.

## PayPal role

Keep as **secondary / future** option for buyers who prefer PayPal wallet — not primary launch processor.

## Explicit non-goals for M2

- No live keys in repo
- No LIVE mode without `CINNOVA_LIVE_PAYMENTS_APPROVED=true` + `sk_live_` + tax configured
- No client-only activation flags for LIVE

## Activation path

1. Create Stripe account + business verification  
2. Add **test** keys to server env only (`sk_test_`, `pk_test_` publishable may be client)  
3. Set `CINNOVA_PAYMENTS_MODE=TEST`  
4. Configure webhook signing secret  
5. Pass test harness + checklist  
6. Configure Stripe Tax  
7. Explicit LIVE approval gate  

See `docs/FIRST_REVENUE_ACTIVATION_CHECKLIST.md`.
