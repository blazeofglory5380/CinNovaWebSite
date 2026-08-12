# Legal Activation Matrix — Phase M3

Inherits M2 matrix (`docs/LEGAL_ACTIVATION_MATRIX_M2.md`). Engineering did **not** mark attorney review complete.

| Document | Route | Engineering | Classification | LIVE gate |
|---|---|---|---|---|
| Terms of Service | `/terms` | Present | BUSINESS_REVIEW_REQUIRED + ATTORNEY_REVIEW_REQUIRED (payments) | Blocks LIVE |
| Privacy Policy | `/privacy` | Present | BUSINESS_REVIEW_REQUIRED + ATTORNEY_REVIEW_REQUIRED (payments) | Blocks LIVE |
| Cookie Policy | `/cookie-policy` | ENGINEERING_COMPLETE | ATTORNEY_REVIEW_REQUIRED | — |
| Affiliate Disclosure | `/affiliate-disclosure` | ENGINEERING_COMPLETE | ATTORNEY_REVIEW_REQUIRED | Blocks live affiliate links |
| Refund Policy | `/refund-policy` | ENGINEERING_COMPLETE | ATTORNEY_REVIEW_REQUIRED | **Blocks LIVE** |
| Digital Product Terms | `/digital-product-terms` | ENGINEERING_COMPLETE | ATTORNEY_REVIEW_REQUIRED | **Blocks LIVE** |
| Sponsorship Disclosure | `/sponsorship-disclosure` | ENGINEERING_COMPLETE | ATTORNEY_REVIEW_REQUIRED | — |
| Accessibility Statement | `/accessibility` | ENGINEERING_COMPLETE | BUSINESS_REVIEW_REQUIRED | — |
| DMCA / Copyright | `/dmca` | ENGINEERING_COMPLETE | ATTORNEY_REVIEW_REQUIRED | — |
| Disclaimer | `/disclaimer` | ENGINEERING_COMPLETE | BUSINESS_REVIEW_REQUIRED | — |

## Additional LIVE blockers (M3)

- Tax responsibilities: Stripe Tax (or equivalent) not configured — **LIVE BLOCKED**
- Support / refund operating process: not established
- Entitlement revocation on refund: `PENDING_POLICY` until attorney + business sign-off
- No 24/7 support claim; no invented sponsorship pricing

Do **not** activate LIVE payments or live affiliate links until the above leave `ATTORNEY_REVIEW_REQUIRED` / tax / ops blockers.
