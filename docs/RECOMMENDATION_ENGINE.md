# Recommendation Engine (Phase 11.4C)

Deterministic, editorial-safe recommendation engine for CinNova.

**This is not an affiliate activation phase.**  
No commercial recommendations appear. No affiliate links become active.
No partnership claims are introduced. No ads, payments, or checkout.

## Architecture

| Module | Path |
|---|---|
| Types | `src/data/recommendations/recommendationTypes.js` |
| Config | `src/data/recommendations/recommendationConfig.js` |
| Category / entity mappings | `src/data/recommendations/categoryMappings.js` |
| Rule engine | `src/data/recommendations/ruleEngine.js` |
| Public API | `src/data/recommendations/index.js` |
| UI rail | `src/components/recommendations/RecommendationRail.jsx` |

Flow:

1. Page builds a **context** (route, page type, category, tags, entities, related IDs, product/book keys).
2. Engine resolves **topic keys** from context + deterministic category mappings.
3. Rule collectors gather candidates by type (news, blog, resource, guide, book, product, official).
4. Candidates are ranked by **priority weights**, then diversified to a configurable maximum.
5. `RecommendationRail` renders accessible cards and fires analytics.

No LLM. No AI inference. No personalization. Rules only.

## Recommendation types

| Type | Description | Status |
|---|---|---|
| `NEWS` | Related CinNova News | Enabled |
| `BLOG` | Related Blog articles | Enabled |
| `RESOURCE` | Resource library items | Enabled |
| `GUIDE` | `/guides` tutorial pages | Enabled |
| `PRODUCT` | CinNova products | Enabled |
| `BOOK` | CinNova Books (respects availability) | Enabled |
| `OFFICIAL_RESOURCE` | Public company websites for context | Enabled |
| `FUTURE_COMMERCIAL` | Reserved commercial slot | **Disabled** |

Official resources are labeled as public company websites and explicitly state
they are **not** affiliate or partnership links.

## Priority

Default priority (lower = higher):

1. Related CinNova article (News)
2. Related Blog
3. Resource
4. Guide
5. Book
6. Product
7. Official company
8. Future commercial (OFF)

Configurable via `priorityWeights` in `recommendationConfig.js`.

## Admin configuration (code only)

No public admin UI.

```js
RECOMMENDATION_CONFIG = {
  enableRecommendations: true,
  maximumRecommendations: 8,
  categoryMappings: // see categoryMappings.js
  priorityWeights: { NEWS: 1, BLOG: 2, ... },
  bookOrdering: [...],
  commercialSlotEnabled: false, // DEFAULT FALSE
}
```

Hard fail-closed: when `commercialSlotEnabled` is false, `FUTURE_COMMERCIAL`
is stripped from enabled types and never emitted.

Impression analytics use stable per-route/item dedupe keys so React remounts
do not double-fire. Click analytics include `is_external` and host-only
`destination_host` for official external destinations.

## Analytics flake note

`npm run test:analytics` asserts SPA `page_view` behavior primarily through the
app `dataLayer` abstraction. `/g/collect` network interception is retained as a
probe because sendBeacon timing can be unreliable in some local Playwright
environments even when dataLayer correctly queues events.

## Category mapping examples

- **Anthropic news** → official Anthropic site, related AI news/blog, AI safety resources, Claude guide
- **OpenAI article** → official OpenAI site, related coverage, LLM guides/resources
- **Data center article** → NVIDIA / AWS / Azure / Google Cloud / AMD / Intel official sites + infrastructure coverage
- **Cookbook** → The Southeast Asian Table + related books/resources
- **Nightmare Forest** → Beyond the Last Light + other books (no preorder inventing; status labels respected)

## Adding recommendation types

1. Add the type to `RECOMMENDATION_TYPES` (closed list).
2. Add a default priority weight.
3. Add a collector in `ruleEngine.js`.
4. Include the type in `enabledTypes` only if it is editorial-safe.
5. Update docs + `npm run test:recommendations`.

Do **not** enable `FUTURE_COMMERCIAL` without a dedicated monetization phase.

## Analytics

Events (no PII, no revenue, no purchase, no checkout):

| Event | Params |
|---|---|
| `recommendation_impression` | `recommendation_type`, `recommendation_position`, `recommendation_category`, `page_type`, `item_id` |
| `recommendation_click` | same |

## Accessibility & SEO

- Keyboard focusable cards with visible focus rings
- `aria-labelledby` section heading + per-card `aria-label`
- Responsive grid; `prefers-reduced-motion` disables transform transitions
- Stable min-heights to reduce layout shift
- Does not alter page canonical URLs
- Does not inject hidden links or keyword stuffing
- Does not duplicate full article bodies

## Future affiliate activation

Commercial recommendations remain off until:

1. Phase 11.4A dual gates are intentionally enabled for verified partners
2. `commercialSlotEnabled` is flipped in a dedicated PR
3. FTC disclosure + link validation path is reviewed
4. Tests assert commercial items only appear when explicitly enabled

Until then, collectors never emit `FUTURE_COMMERCIAL` items.

## Future personalization

Out of scope. A future phase may add consented preferences or cohort rules.
Any personalization must remain deterministic, documented, and privacy-safe —
not LLM-driven inference over private content.

## Rollback

1. Set `enableRecommendations: false` in `recommendationConfig.js` and redeploy, **or**
2. Remove `<RecommendationRail />` placements from pages, **or**
3. Revert the Phase 11.4C PR

With the config flag off, the rail returns `null` and emits no analytics.

## Tests

```bash
npm run test:recommendations
npm run test:partner-catalog
npm run test:affiliate-foundation
npm run test:seo
npm run test:analytics
npm run lint
npm run build
```

## Explicit non-goals

- No affiliate activation
- No commercial recommendations
- No partnership claims
- No ads / payments / checkout
- No editorial automation or scheduled publishing changes
- No rewrites of existing article body content
- No production deployment from this phase alone
