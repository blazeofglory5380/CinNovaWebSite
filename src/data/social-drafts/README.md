# Social drafts

Human-reviewed organic social post drafts for CinNova.

- Schema: `../socialDraftSchema.js`
- Foundation: `../../../docs/SOCIAL_MEDIA_FOUNDATION.md`
- UTM helper: `../../utils/socialUtm.js`

**Rules**
- Status starts as `draft`.
- Never store API keys, passwords, or platform tokens here.
- Never auto-publish from CI or `editorial:daily`.
- `published` means a human confirmed an external post — not an API callback (yet).
