# Admin Access Rules

This note explains how the internal admin pages are accessed and why they are
blocked in production. It is documentation only — it does not change any
behavior.

## Admin routes

- `/blog-admin` (path route; resolves to the Blog Manager)
- `?page=blog-manager`
- `?page=newsletter-admin`

These pages are internal tools and are **not** protected by authentication.
Access is controlled entirely by a build-time environment flag.

Phase 11.4A does **not** ship a Partner Admin UI for affiliate activation.
Affiliate link configuration remains registry + environment + docs
(`docs/AFFILIATE_MANAGEMENT.md`). `/partner-admin` is not a live page and remains
robots-disallowed for defense in depth.

Phase 11.4D **removed** the public `/?page=revenue-opportunities` UI. Partner
enrollment inventory remains in data modules + docs
(`docs/PARTNER_CATALOG.md`, `docs/PARTNER_ENROLLMENT.md`). Robots still
disallow the old query path for defense in depth.

## How the gate works

A single flag decides whether admin routes are reachable:

```
VITE_ENABLE_ADMIN_ROUTES === "true"
```

When the flag is not `"true"`, the router returns the **NotFound** page for every
admin route, and the admin components are never rendered.

## 1. Production behavior

- Admin routes resolve to **NotFound**.
- `VITE_ENABLE_ADMIN_ROUTES` must stay **unset or `false`** in Vercel production.
- This keeps the unauthenticated admin pages from being reachable by the public.

With the flag off, all of the following return NotFound:

- `/blog-admin`
- `/?page=blog-manager`
- `/?page=newsletter-admin`

## 2. Local development behavior

To work on the admin pages locally:

1. Add the flag to `.env.local` (git-ignored):

   ```
   VITE_ENABLE_ADMIN_ROUTES=true
   ```

2. Start the dev server:

   ```
   npm run dev
   ```

3. Open the admin routes (default Vite dev port `5173`):

   - http://localhost:5173/blog-admin
   - http://localhost:5173/?page=blog-manager
   - http://localhost:5173/?page=newsletter-admin

Remove the flag (or set it to `false`) to return to production-equivalent
behavior locally.

## 3. Warning

- This is a **route gate, not real authentication**. It only hides the routes;
  it does not verify who the visitor is.
- **Do not enable admin routes on production** until proper authentication or
  hosting-level protection (for example, access control in front of the site) is
  in place.
