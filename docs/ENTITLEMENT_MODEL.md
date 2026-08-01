# Entitlement Model

## CURRENTLY IMPLEMENTED

Entitlement records + fail-closed access evaluation (`evaluateProductAccess`,
`customerHasProductAccess`).

## Access rules

| Condition | Result |
|---|---|
| Empty store | Deny |
| Pending / expired / revoked / suspended | Deny |
| Unknown product id | Deny |
| Unknown entitlement kind | Deny |
| Product relationship exists | Deny (not an entitlement) |
| Newsletter preference | Deny (not paid access) |
| Amazon outbound click | Deny (not ownership) |
| Unauthenticated principal | Deny — BLOCKED UNTIL AUTHENTICATION |
| User-supplied customer id alone | Deny |

## ARCHITECTURE ONLY

`ENTITLEMENT_ARCHITECTURE_EXAMPLES` stay `pending` and never grant access.

## Live store

`ENTITLEMENT_STORE` is empty. Active production grants are forbidden in Phase 12.
