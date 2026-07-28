# CinNova News images

Preferred location for **new** News heroes:

```text
public/images/news/
  local/
  state/
  national/
  international/
```

Match the folder to the story `coverageLevel`. Example:

`/images/news/national/meta-iris-ai-chip-production-september-2026.jpg`

## Rules

- Existing production heroes under `/images/blog/…`, `/images/ai/…`, etc. may keep their paths — do not mass-migrate them.
- Prefer descriptive filenames that match the story slug.
- Published stories still need `heroAlt` + a caption that discloses library/illustration use when the image is not event photography.
- `npm run validate:news` and `npm run news:publish` check that non-URL hero paths exist on disk.
