# Legal Activation Matrix — Phase M2

Do **not** mark attorney review complete unless documented outside this engineering matrix.

| Document | Route | Engineering | Classification |
|---|---|---|---|
| Terms of Service | `/terms` | Present | BUSINESS_REVIEW_REQUIRED + ATTORNEY_REVIEW_REQUIRED (payments) |
| Privacy Policy | `/privacy` | Present | BUSINESS_REVIEW_REQUIRED + ATTORNEY_REVIEW_REQUIRED (payments) |
| Cookie Policy | `/cookie-policy` | ENGINEERING_COMPLETE | ATTORNEY_REVIEW_REQUIRED |
| Affiliate Disclosure | `/affiliate-disclosure` | ENGINEERING_COMPLETE | ATTORNEY_REVIEW_REQUIRED |
| Refund Policy | `/refund-policy` | ENGINEERING_COMPLETE | ATTORNEY_REVIEW_REQUIRED — **blocks LIVE** |
| Digital Product Terms | `/digital-product-terms` | ENGINEERING_COMPLETE | ATTORNEY_REVIEW_REQUIRED — **blocks LIVE** |
| Sponsorship Disclosure | `/sponsorship-disclosure` | ENGINEERING_COMPLETE | ATTORNEY_REVIEW_REQUIRED |
| Accessibility Statement | `/accessibility` | ENGINEERING_COMPLETE | BUSINESS_REVIEW_REQUIRED |
| DMCA / Copyright | `/dmca` | ENGINEERING_COMPLETE | ATTORNEY_REVIEW_REQUIRED |
| Disclaimer | `/disclaimer` | ENGINEERING_COMPLETE | BUSINESS_REVIEW_REQUIRED |

## Status legend

- **ENGINEERING_COMPLETE** — page/content exists in codebase  
- **BUSINESS_REVIEW_REQUIRED** — owner must confirm operational accuracy  
- **ATTORNEY_REVIEW_REQUIRED** — counsel must review before relying for LIVE sales  
- **READY** — only after documented attorney + business sign-off (none yet)

## Live payment gate

Refund Policy + Digital Product Terms + Privacy/Terms payment sections must leave `ATTORNEY_REVIEW_REQUIRED` before LIVE activation.
