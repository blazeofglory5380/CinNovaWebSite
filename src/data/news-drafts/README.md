# News drafts (local editorial)

JSON draft files in this folder are **not** part of the public News catalog.

- Created by: `npm run news:new -- --slug=<slug> --coverage=<local|state|national|international>`
- Validated by: `npm run validate:news`
- Previewed by: `http://localhost:5173/?page=news-preview&slug=<slug>` (Vite DEV only)
- Published by: `npm run news:publish -- <slug>` (promotes into `src/data/newsPosts.js`)

Rules:

1. Never set `isPublished: true` here.
2. Never copy a draft into `newsPosts.js` by hand unless you also run validation.
3. Do not invent events, quotes, statistics, or sources.
4. Prefer hero images under `/images/news/<coverageLevel>/`.

See `docs/NEWS_EDITORIAL_WORKFLOW.md`.
