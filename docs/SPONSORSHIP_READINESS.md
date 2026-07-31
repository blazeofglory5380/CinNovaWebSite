# Sponsorship / Media Readiness Checklist

Architecture for labeled sponsorship exists. **Do not invent sponsors or rates.**

## Potential future surfaces

| Surface | Notes |
|---|---|
| Blog | Clearly labeled sponsored modules only |
| Newsletter | Separate from editorial stories |
| News | Sponsorship must be labeled and separated from reporting |
| Books launches | Launch partnerships — not reviews for hire |
| Product launches | Product marketing, not news coverage |

## Activation prerequisites

1. Audience metrics documented (GA4 traffic + newsletter size)
2. Media kit / rate card approved by owner (rates TBD — do not invent)
3. Written sponsor agreement
4. Disclosure copy approved
5. Editorial firewall: sponsors cannot alter news scoring, research, or factual claims

## Technical hooks

- `sponsorMeta.js` + `SponsoredContentDisclosure`
- Requires real `sponsorName` + `https` `sponsorUrl` before rendering
- Editorial automation must remain independent (no auto-sponsored stories)

## Status

**READY TO ACTIVATE** from an architecture perspective.  
**Not active** — no sponsors configured.
