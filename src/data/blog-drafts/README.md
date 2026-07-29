# CinNova Blog drafts

Local editorial drafts only. Never merged into production feeds, sitemap, or prerender.

```bash
npm run blog:new -- --slug=example-post --category="Artificial Intelligence"
# edit this folder's JSON, then:
npm run validate:blog
# DEV preview: /?page=blog-preview&slug=example-post
npm run blog:publish -- example-post --dry-run
```

Do not invent sources or current events. Promote only after sourced reporting is complete.
