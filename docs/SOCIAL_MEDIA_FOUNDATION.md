# CinNova Social Media Foundation

**Phase:** 9A — Organic social foundation (no ads, no auto-posting, no credentials in repo)  
**Website:** https://getcinnova.com  
**Display name:** CinNova  
**Preferred handle:** @CinNova  

This document prepares coordinated organic distribution across Facebook, Instagram, X, LinkedIn, YouTube, and TikTok. It does **not** create accounts, purchase ads, or authorize public posting.

**Safety rules**
- Do not store passwords, API keys, OAuth tokens, or recovery codes in this repository.
- Do not fabricate live profile URLs until accounts exist and are verified.
- Do not change page canonical URLs when adding UTM parameters.
- Human review is required before any public post.

---

## 1. Brand identity

### Positioning
CinNova is an AI product company that also publishes practical News and long-form analysis. Social identity should lead with **practical AI products** (education, family safety, tech support, early learning, real estate tech) and treat News + Blog as proof of expertise—not as the whole brand.

### Display name
**CinNova** (all platforms)

### Preferred handle
**@CinNova**

### Fallback handles (if @CinNova is unavailable)
Use in order; claim consistently across platforms when possible:

1. `@GetCinNova`
2. `@CinNovaAI`
3. `@CinNovaHQ`
4. `@CinNovaApps`
5. `@HelloCinNova`

Do not use handles that imply “news-only” (e.g. `@CinNovaNews`) as the primary company identity.

### Website destination
Default profile link: `https://getcinnova.com`  
Campaign links: use tracked URLs from `src/utils/socialUtm.js` (see §4).

### Approved bio variants

**1. Short bio (≤80 chars, TikTok / Instagram / X compact)**  
Practical AI for learning, safety, tech support & real estate. getcinnova.com

**2. Standard bio (Facebook / X / Instagram about)**  
CinNova builds practical AI products for education, family safety, tech support, and real estate—and publishes clear News and analysis on AI, infrastructure, and the tools shaping everyday decisions.

**3. LinkedIn / company bio**  
CinNova is building focused AI products for students, families, technicians, and real estate operators. Alongside our apps—StudyNest, PoisonGuard, TechMate AI, Kiddo, and CinNova Real Estate—we publish local-to-international News and long-form guides that explain AI, data centers, education tech, and market shifts without hype. Follow for product updates, useful explainers, and sourced reporting. Website: https://getcinnova.com

**4. YouTube channel description**  
CinNova is a practical AI company. This channel covers short explainers on AI products, education technology, family safety tools, tech support workflows, real estate analysis, and infrastructure stories that affect builders and communities. Subscribe for product walkthroughs, editorial context, and guides that stay useful after the news cycle.  
Website: https://getcinnova.com  
Newsletter: https://getcinnova.com/newsletter

**5. TikTok / Instagram short bio (with emoji sparingly — optional)**  
AI products + clear tech explainers  
Learning · Safety · Real estate · Support  
getcinnova.com

---

## 2. Platform specifications

> Account URLs are omitted until profiles are created manually. Prefer organic Page/Company/Channel types—not personal profiles for the brand.

### Facebook
| Field | Spec |
|---|---|
| Preferred account type | Facebook Page (Business) |
| Display name | CinNova |
| Preferred handle | @CinNova (username) |
| Fallback handles | @GetCinNova, @CinNovaAI |
| Bio | Standard bio |
| Website | https://getcinnova.com |
| Avatar | 180×180 min; deliver **1024×1024** PNG, CN mark on brand accent, safe margin |
| Cover | **820×312** (desktop); keep subject center for mobile crop (~640×360 visible) |
| Formats | Link posts (News/Blog with UTM), short video, carousel product education |
| Link behavior | Always use UTM tracked URLs; prefer native link posts over link-in-first-comment only |
| Security / 2FA | Business Manager ownership; 2FA on all admins; least-privilege roles |
| Recovery | Document Page ID + admin emails offline (password manager / vault—not repo) |

### Instagram
| Field | Spec |
|---|---|
| Preferred account type | Professional / Business |
| Display name | CinNova |
| Preferred handle | @cinnova |
| Fallback | @getcinnova, @cinnova.ai (if available) |
| Bio | Short bio + website |
| Website | Link in bio → https://getcinnova.com (or Linktree-free single destination) |
| Avatar | **1080×1080** |
| Banner | N/A (profile grid + highlights) |
| Formats | 1080×1350 feed, 1080×1920 Reels, carousels (product + tip) |
| Link behavior | Bio link + Stories stickers; caption CTAs without raw UTM clutter when possible (use short tracked links) |
| Security / 2FA | Meta Business + Instagram 2FA |
| Recovery | Backup codes in vault; remove ex-admin promptly |

### X (Twitter)
| Field | Spec |
|---|---|
| Preferred account type | Professional / Organization |
| Display name | CinNova |
| Preferred handle | @CinNova |
| Fallback | @GetCinNova, @CinNovaAI |
| Bio | Short or Standard |
| Website | https://getcinnova.com |
| Avatar | **400×400** (deliver 1024×1024) |
| Header | **1500×500** |
| Formats | Text + link, quote posts of News, short threads for Blog takeaways |
| Link behavior | One tracked URL per post; OG card should resolve to getcinnova.com |
| Security / 2FA | App-based 2FA; no shared password DM |
| Recovery | Backup code vault; document recovery email |

Note: Site meta already references `twitter:site=@CinNova`. Confirm handle ownership before treating meta as live proof of an account.

### LinkedIn
| Field | Spec |
|---|---|
| Preferred account type | Company Page |
| Display name | CinNova |
| Preferred vanity | linkedin.com/company/cinnova (or getcinnova) |
| Bio | LinkedIn/company bio |
| Website | https://getcinnova.com |
| Avatar | **300×300** (deliver 1024×1024) |
| Cover | **1128×191** |
| Formats | News for operators/policy, Blog thought leadership, product use-cases |
| Link behavior | Native article/link posts with UTM; avoid engagement bait |
| Security / 2FA | Page admin 2FA; Super Admin documented offline |
| Recovery | Company Page URL + admin list in vault |

### YouTube
| Field | Spec |
|---|---|
| Preferred account type | Brand Channel |
| Display name | CinNova |
| Preferred handle | @CinNova |
| Fallback | @GetCinNova, @CinNovaAI |
| Description | YouTube channel description |
| Website | https://getcinnova.com |
| Avatar | **800×800** |
| Banner | **2560×1440** (safe area ~1546×423 center) |
| Formats | Shorts (vertical), 5–12 min explainers, product walkthroughs |
| Link behavior | Description first-line tracked homepage or campaign URL |
| Security / 2FA | Google account 2FA; Brand Account managers listed |
| Recovery | Recovery email/phone in Google account vault |

### TikTok
| Field | Spec |
|---|---|
| Preferred account type | Business |
| Display name | CinNova |
| Preferred handle | @cinnova |
| Fallback | @getcinnova, @cinnovaai |
| Bio | TikTok/Instagram short bio |
| Website | https://getcinnova.com |
| Avatar | **200×200** min; deliver **1080×1080** |
| Banner | N/A |
| Formats | 9:16 clips 15–45s; product tips; myth-busting AI; News hooks without clickbait |
| Link behavior | Bio link (when eligible) with UTM |
| Security / 2FA | Business Center + 2FA |
| Recovery | Backup codes in vault |

---

## 3. Brand assets audit

### Existing usable assets
| Asset | Path | Notes |
|---|---|---|
| CSS “CN” mark | `src/App.css` / Media Kit | Rounded square initials; not an exportable logo file |
| OG stills 1200×630 | `public/og-image.png`, `public/og-*.png` | Good interim link previews |
| Default OG hero | `public/images/home/homepage-hero-innovation.jpg` (1400×934) | Landscape still; crop for covers |
| Blog cinematic hero | `public/images/blog/hero/cinnova-blog-hero-cinematic-editorial.webp` | Editorial mood |
| Social folder | `public/images/cinnova/social/` | **Empty** placeholder |
| Favicon | `public/favicon.svg` | Vite default-style mark — **not** CinNova brand |

### Missing assets (required before profile launch)
| Asset | Recommended deliverable |
|---|---|
| Primary logo SVG | Wordmark + CN mark, light + dark |
| Square avatar | **1024×1024** PNG (also 512, 180) |
| Facebook cover | **820×312** (+ 1640×624 master) |
| X header | **1500×500** |
| LinkedIn company cover | **1128×191** (+ 2× master) |
| YouTube banner | **2560×1440** with safe zone guide |
| Instagram / TikTok avatar | Same 1024×1024 master |
| Story / Reel end-card template | 1080×1920 |
| Watermark / lower-third | Optional for video |

Do **not** redesign the CinNova brand in this phase. Export from the existing CN mark + confirmed palette when design capacity is available.

---

## 4. UTM attribution

### Convention
| Param | Values |
|---|---|
| `utm_source` | `facebook` · `instagram` · `x` · `linkedin` · `youtube` · `tiktok` |
| `utm_medium` | `organic_social` |
| `utm_campaign` | `{yyyy-mm-dd}_{contentType}_{slugShort}` e.g. `2026-07-28_news_meta-blackrock` |
| `utm_content` (optional) | `post` · `story` · `reel` · `short` · `bio` · `share_button` |
| `utm_term` (optional) | Reserved; avoid PII |

Examples:

```
https://getcinnova.com/news/meta-blackrock-el-paso-data-center-venture?utm_source=linkedin&utm_medium=organic_social&utm_campaign=2026-07-28_news_meta-blackrock&utm_content=post

https://getcinnova.com/blog/how-ai-data-centers-get-financed-joint-ventures?utm_source=facebook&utm_medium=organic_social&utm_campaign=2026-07-28_blog_ai-dc-financing&utm_content=post
```

Canonical tags must remain **without** UTM. Share buttons and social drafts append UTM only on outbound tracked URLs.

### Utility
Implementation: `src/utils/socialUtm.js`  
Tests: `npm run test:social-utm`

---

## 5. Social draft model

Platform-neutral drafts live under `src/data/social-drafts/` (JSON). Schema helpers: `src/data/socialDraftSchema.js`.

### Required fields
| Field | Type | Notes |
|---|---|---|
| `id` | string | Stable id |
| `sourceType` | `news` \| `blog` \| `product` | |
| `sourceSlug` | string | Catalog slug |
| `headline` | string | |
| `summary` | string | |
| `destinationUrl` | string | Absolute URL **with** UTM |
| `platform` | enum | facebook, instagram, x, linkedin, youtube, tiktok |
| `body` | string | Platform-ready copy |
| `cta` | string | |
| `hashtags` | string[] | |
| `mediaAsset` | string \| null | Public path or brief |
| `altText` | string | |
| `status` | enum | `draft` · `approved` · `scheduled` · `published` · `failed` |
| `createdAt` | ISO string | |
| `scheduledAt` | ISO string \| null | |
| `publishedAt` | ISO string \| null | |

**No social API connection in Phase 9A.** Status `published` is recorded only after a human confirms an external post.

---

## 6. Editorial integration design

### Target workflow (future)
```
Published News / Blog / Product page
  → social draft generation (copy + UTM + media brief)
  → human review
  → approved
  → scheduled (calendar)
  → human or assisted publish (API later)
  → GA4 landing events via UTM
```

### Near-term (manual)
1. Publish News/Blog via existing PR workflow.
2. Create social drafts in `src/data/social-drafts/` (or spreadsheet mirrored later).
3. Generate destination URLs with `buildSocialUrl(...)`.
4. Human posts on each platform.
5. Mark draft `published` + store external post id offline (not secrets).

### Future `editorial:daily` interaction
`npm run editorial:daily` remains **prep-only**. A later optional step (not enabled yet):

```
editorial:daily
  → news/blog skeletons
  → (future) social:prepare --from-published=<slug> --platforms=...
       writes social drafts with status=draft
  → human review before any post
```

Social prep must never auto-post, auto-commit tokens, or skip approval.

See also: `docs/DAILY_EDITORIAL_WORKFLOW.md` (Social extension section).

---

## 7. Analytics plan (GA4)

Preserve existing News/Blog events (`news_story_view`, `article_view`, etc.).

### New events (implemented as helpers; fire only when UI/actions exist)
| Event | When |
|---|---|
| `social_share_click` | User clicks on-site share control |
| `social_outbound_click` | User clicks footer/profile follow link to a CinNova social profile |
| `social_campaign_landing` | Page load detects organic social UTM (`utm_medium=organic_social`) |
| `social_product_click` | Social-driven CTA to a product page |
| `social_newsletter_conversion` | Newsletter signup attributed to social campaign |

### Standard parameters
`platform`, `content_type` (`news`\|`blog`\|`product`\|`site`), `slug`, `campaign`, `cta`, `destination`

Do not invent conversion counts. Helpers live in `src/utils/analytics.js`.

---

## 8. Website social presence audit (current)

| Area | Status |
|---|---|
| Footer social icons | **Missing** |
| Live profile links | **None** (correct until accounts exist) |
| Blog article share buttons | **Present** (FB / X / LinkedIn / Email intents) |
| News story share buttons | **Missing** |
| Open Graph | **Present** (`SEO.jsx`, route metadata) |
| Twitter cards | **Present** (`summary_large_image`, `twitter:site=@CinNova`) |
| Social image quality | Mixed — OG 1200×630 OK; no branded avatar/banner set |
| Organization `sameAs` | Blog + newsletter only — **no social profiles yet** |
| Newsletter cross-promo | Strong on-site; not tied to social follows |

### Recommended website changes (later phases — not in 9A code wiring of fake URLs)
1. Add footer social icons **only after** live profile URLs exist.
2. Add News story share controls (parity with Blog), with `social_share_click` + UTM.
3. Extend `sameAs` when profiles are public.
4. Export logo/avatar/banner set into `public/images/cinnova/social/`.
5. Optional: detect `utm_medium=organic_social` on landing and fire `social_campaign_landing`.

---

## 9. 30-day zero-budget organic launch plan

Assumes accounts are created manually when ready. Frequencies are ceilings—skip days rather than spam.

### Cadence (per week)
| Platform | Posts / week | Focus |
|---|---|---|
| LinkedIn | 3–4 | News for operators/policy + Blog synthesis |
| X | 4–5 | News links + 1 thread from Blog |
| Facebook | 3 | Evergreen Blog + product education |
| Instagram | 3–4 (incl. Reels) | Visual tips, product, short News hooks |
| TikTok | 3 | Short explainers / myths |
| YouTube | 1 Short + 1 longer / week | Product + editorial explainer |

### Content mix (30 days)
- **40%** News promotion from the 27 public stories (prioritize AI, infrastructure, policy)
- **30%** Evergreen Blog from the 40 published articles (guides, financing, education, safety)
- **20%** Product education (StudyNest, PoisonGuard, TechMate, Kiddo, Real Estate)
- **10%** Newsletter + “how we report” trust posts

### Cross-platform reuse
1. Write once for LinkedIn/X (text-forward).
2. Cut vertical video for TikTok/Reels/Shorts from the same script.
3. Still + caption for Instagram/Facebook.
4. Always unique UTM `utm_campaign` per content item; vary `utm_content` by format.

### Short-form video concepts (organic)
- “How to read a $14B data center headline” (from financing Blog)
- “3 questions before a county data center vote”
- “What TechMate / StudyNest / PoisonGuard each solve” (30s each)
- “EU AI labelling in plain language”

### Days 1–7 checklist
1. Claim handles; enable 2FA; store recovery offline.
2. Upload interim avatar (CN export) + covers when ready.
3. Publish bio variants; set website link.
4. Seed 5 evergreen Blog posts + 5 News posts across LinkedIn/X/Facebook.
5. Verify GA4 sees `utm_medium=organic_social` landings.

---

## 10. Implementation map

| Piece | Location |
|---|---|
| This foundation doc | `docs/SOCIAL_MEDIA_FOUNDATION.md` |
| UTM helper | `src/utils/socialUtm.js` |
| UTM tests | `scripts/test-social-utm.mjs` → `npm run test:social-utm` |
| Draft schema | `src/data/socialDraftSchema.js` |
| Draft folder | `src/data/social-drafts/` |
| Analytics helpers | `src/utils/analytics.js` |
| Editorial note | `docs/DAILY_EDITORIAL_WORKFLOW.md` |
| Asset placeholder | `public/images/cinnova/social/README.md` |

---

## 11. Explicit non-goals (Phase 9A)

- No Meta/X/LinkedIn/YouTube/TikTok API posting
- No ads / boosts / paid amplification
- No credentials in git
- No fabricated `sameAs` profile URLs on the live site
- No automatic public posting from `editorial:daily`
