/**
 * Single source of truth for migrated public marketing / company / partnership /
 * tool / hub pages: page key ↔ clean pathname (+ crawlable metadata).
 *
 * Browser- and edge-neutral: no React imports, no browser-only APIs, and no heavy
 * data graph — safe to import from the Vercel Edge middleware (via
 * legacyRouteRedirects.js), the SPA router (App.jsx), sitemap + static-HTML
 * generation, audits, and internal links.
 *
 * Phase 2B migrates all 50 non-home public pages: Checkpoint 1 covered the 16
 * core marketing/company/tool/hub pages, Checkpoint 2 the 34 individual guide
 * pages under /guides/. The SEO audit keeps this registry in sync with
 * STATIC_PUBLIC_PAGES and asserts PUBLIC_SITE_URL matches the canonical siteUrl.
 */

/** Production origin — mirrors `siteUrl` in src/data/blogPosts.js (audit asserts equality). */
export const PUBLIC_SITE_URL = "https://getcinnova.com";

/**
 * Ordered registry of migrated public pages.
 * `title`/`description` mirror each page's existing client SEO and drive the
 * generated crawlable HTML; `schemaType` selects the JSON-LD builder.
 */
export const PUBLIC_PAGE_ROUTES = [
    // Core marketing pages → top-level
    { key: "pricing", path: "/pricing", schemaType: "WebPage",
        title: "Pricing | Cin Nova AI Products — Plans and Tiers",
        description: "Compare free and paid plans for StudyNest, PoisonGuard, TechMate AI, Kiddo, and Cin Nova Real Estate. Find the right plan for students, families, investors, and teams." },
    { key: "about", path: "/about", schemaType: "AboutPage",
        title: "About Cin Nova | Practical AI Software Company",
        description: "Cin Nova builds AI-powered products for learning, safety, real estate, tech support, and early childhood education. Learn about our products, values, and roadmap." },
    { key: "contact", path: "/contact", schemaType: "ContactPage",
        title: "Contact Cin Nova | Get in Touch",
        description: "Contact Cin Nova for product questions, partnership inquiries, school and business plans, media collaborations, or technical support." },
    { key: "newsletter", path: "/newsletter", schemaType: "WebPage",
        title: "Cin Nova Newsletter — Free Product Updates, Guides, and Early Access",
        description: "Join the Cin Nova newsletter for product launches, free downloadable guides, behind-the-scenes builds, and early access to new features." },
    { key: "languages", path: "/languages", schemaType: "CollectionPage",
        title: "Choose Your Language | CinNova AI Tools and Tutorials",
        description: "Choose a language to learn about CinNova, practical AI products, AI tutorials, and free tools for visitors around the world. Spanish, French, and German starter sections available." },
    { key: "privacy", path: "/privacy", schemaType: "WebPage",
        title: "Privacy Policy | Cin Nova",
        description: "Learn how Cin Nova handles analytics, newsletter signups, resource downloads, localStorage, contact forms, and your privacy rights." },
    { key: "terms", path: "/terms", schemaType: "WebPage",
        title: "Terms of Service | Cin Nova",
        description: "Terms governing use of the Cin Nova website, including informational disclaimers, AI limitations, acceptable use, and limitation of liability." },

    // Company & partnership pages → /company/*
    { key: "partners", path: "/company/partners", schemaType: "WebPage",
        title: "Partner Program | Cin Nova",
        description: "Work with Cin Nova as a content partner, affiliate, technology partner, or sponsor. Apply to join the Cin Nova partner network." },
    { key: "partnerships", path: "/company/partnerships", schemaType: "WebPage",
        title: "Partnerships | Cin Nova",
        description: "Partner with Cin Nova across technology, education, real estate, media, affiliate programs, and guest contributor opportunities." },
    { key: "press-center", path: "/company/press", schemaType: "WebPage",
        title: "Press Center | Cin Nova",
        description: "Press resources, company updates, media assets, and journalist contact information for Cin Nova." },
    { key: "media-kit", path: "/company/media-kit", schemaType: "WebPage",
        title: "Media Kit | Advertise with Cin Nova",
        description: "CinNova media kit: audience stats, ad placements, brand assets, and advertising contact. Reach students, parents, real estate investors, and tech professionals." },
    { key: "advertise", path: "/company/advertise", schemaType: "WebPage",
        title: "Advertise With Us | Cin Nova",
        description: "Reach the Cin Nova audience through website sponsorships, sponsored articles, newsletter sponsorships, and resource placements." },
    { key: "partner-with-us", path: "/company/partner-with-us", schemaType: "WebPage",
        title: "Partner With Us | Cin Nova",
        description: "Explore technology, education, real estate, affiliate, and guest contributor partnership opportunities with Cin Nova." },
    { key: "sponsor-newsletter", path: "/company/sponsor-newsletter", schemaType: "WebPage",
        title: "Sponsor the Newsletter | Cin Nova",
        description: "Sponsor the Cin Nova newsletter to reach AI professionals, educators, students, real estate professionals, and technology enthusiasts." },

    // Tools & hubs
    { key: "free-rental-property-calculator", path: "/tools/rental-property-calculator", schemaType: "WebApplication",
        title: "Free Rental Property Calculator | Cash Flow, Cap Rate & ROI",
        description: "Free rental property calculator for cash flow, cap rate, cash-on-cash ROI, and a deal score. Analyze any rental before you buy, then get a full AI-powered report with CinNova Real Estate AI." },
    { key: "ai-tutorials", path: "/guides", schemaType: "CollectionPage",
        title: "AI Tutorials | Step-by-Step Guides for ChatGPT, Claude, Gemini & More",
        description: "Browse 19 beginner-friendly AI guides. Find the right step-by-step tutorial for prompting, research, coding, AI tools, and Claude workflows for design, marketing, and video." },

    // Individual AI guide pages (Phase 2B, Checkpoint 2) — 34 routes under /guides/.
    // Titles/descriptions mirror each guide's existing TutorialSEO props exactly.
    { key: "ai-prompt-writing-guide", path: "/guides/ai-prompt-writing", schemaType: "TechArticle", group: "guide", language: "en", alternateGroup: "ai-prompt-writing",
        title: "How to Write Better AI Prompts | Beginner Step-by-Step Guide",
        description: "Learn how to write better AI prompts using role, task, context, format, and constraints. Includes examples, mistakes to avoid, privacy tips, and a beginner-friendly prompt formula." },
    { key: "ai-prompt-writing-guide-es", path: "/guides/ai-prompt-writing/es", schemaType: "TechArticle", group: "guide", language: "es", alternateGroup: "ai-prompt-writing",
        title: "Guía para escribir mejores prompts de IA | CinNova",
        description: "Aprende a escribir mejores prompts de IA con una guía paso a paso para principiantes. Incluye ejemplos, errores comunes, consejos de privacidad y una fórmula sencilla para mejorar tus resultados." },
    { key: "ai-prompt-writing-guide-fr", path: "/guides/ai-prompt-writing/fr", schemaType: "TechArticle", group: "guide", language: "fr", alternateGroup: "ai-prompt-writing",
        title: "Guide pour écrire de meilleurs prompts IA | CinNova",
        description: "Apprenez à écrire de meilleurs prompts IA avec un guide étape par étape pour débutants. Inclut des exemples, des erreurs à éviter, des conseils de confidentialité et une formule simple." },
    { key: "ai-prompt-writing-guide-de", path: "/guides/ai-prompt-writing/de", schemaType: "TechArticle", group: "guide", language: "de", alternateGroup: "ai-prompt-writing",
        title: "Bessere KI-Prompts schreiben | CinNova",
        description: "Lernen Sie Schritt für Schritt, bessere KI-Prompts zu schreiben. Mit Beispielen, häufigen Fehlern, Datenschutz-Tipps und einer einfachen Prompt-Formel für Anfänger." },
    { key: "ai-research-guide", path: "/guides/ai-research", schemaType: "TechArticle", group: "guide", language: "en", alternateGroup: "ai-research",
        title: "How to Use AI for Research | Step-by-Step Beginner Guide",
        description: "Learn how to use AI for research, outlines, summaries, source discovery, and study support while avoiding hallucinations and verifying facts carefully." },
    { key: "ai-research-guide-es", path: "/guides/ai-research/es", schemaType: "TechArticle", group: "guide", language: "es", alternateGroup: "ai-research",
        title: "Guía para usar la IA en la investigación | CinNova",
        description: "Aprende a usar la IA para investigar: esquemas, resúmenes, descubrir fuentes y apoyar tus estudios, evitando alucinaciones y verificando los datos con cuidado. Guía paso a paso para principiantes." },
    { key: "ai-research-guide-fr", path: "/guides/ai-research/fr", schemaType: "TechArticle", group: "guide", language: "fr", alternateGroup: "ai-research",
        title: "Guide pour utiliser l'IA dans la recherche | CinNova",
        description: "Apprenez à utiliser l'IA pour la recherche : plans, résumés, découverte de sources et soutien aux études, en évitant les hallucinations et en vérifiant les faits. Guide étape par étape pour débutants." },
    { key: "ai-research-guide-de", path: "/guides/ai-research/de", schemaType: "TechArticle", group: "guide", language: "de", alternateGroup: "ai-research",
        title: "Anleitung: KI für die Recherche nutzen | CinNova",
        description: "Lernen Sie, KI für die Recherche zu nutzen: Gliederungen, Zusammenfassungen, Quellensuche und Lernhilfe – Halluzinationen vermeiden und Fakten sorgfältig prüfen. Schritt-für-Schritt-Anleitung für Anfänger." },
    { key: "ai-coding-guide", path: "/guides/ai-coding", schemaType: "TechArticle", group: "guide", language: "en", alternateGroup: "ai-coding",
        title: "How to Use AI for Coding | Step-by-Step Beginner Guide",
        description: "Learn how to use AI coding assistants to plan projects, write small functions, debug errors, explain code, and review safely before committing." },
    { key: "ai-coding-guide-es", path: "/guides/ai-coding/es", schemaType: "TechArticle", group: "guide", language: "es", alternateGroup: "ai-coding",
        title: "Guía para usar la IA en la programación | CinNova",
        description: "Aprende a usar asistentes de código con IA para planificar proyectos, escribir funciones pequeñas, depurar errores, explicar código y revisar con seguridad antes de publicar. Guía paso a paso para principiantes." },
    { key: "ai-coding-guide-fr", path: "/guides/ai-coding/fr", schemaType: "TechArticle", group: "guide", language: "fr", alternateGroup: "ai-coding",
        title: "Guide pour utiliser l'IA en programmation | CinNova",
        description: "Apprenez à utiliser des assistants de code IA pour planifier des projets, écrire de petites fonctions, déboguer des erreurs, expliquer du code et relire en toute sécurité avant de publier. Guide étape par étape pour débutants." },
    { key: "ai-coding-guide-de", path: "/guides/ai-coding/de", schemaType: "TechArticle", group: "guide", language: "de", alternateGroup: "ai-coding",
        title: "Anleitung: KI zum Programmieren nutzen | CinNova",
        description: "Lernen Sie, KI-Coding-Assistenten zu nutzen: Projekte planen, kleine Funktionen schreiben, Fehler beheben, Code erklären und sicher prüfen, bevor Sie ihn übernehmen. Schritt-für-Schritt-Anleitung für Anfänger." },
    { key: "ai-workspace-setup-guide", path: "/guides/ai-workspace-setup", schemaType: "TechArticle", group: "guide", language: "en",
        title: "How to Set Up Your First AI Workspace: Beginner Guide",
        description: "Set up your first AI workspace with beginner-friendly steps for choosing tools, creating folders, saving prompts, organizing files, protecting privacy, and preparing for writing, research, design, coding, video, and automation workflows." },
    { key: "chatgpt-beginner-guide", path: "/guides/chatgpt", schemaType: "TechArticle", group: "guide", language: "en",
        title: "How to Use ChatGPT: Step-by-Step Beginner Guide",
        description: "Learn how to use ChatGPT for writing, research, planning, brainstorming, coding help, and productivity with beginner-friendly steps, example prompts, safety tips, and common mistakes to avoid." },
    { key: "claude-beginner-guide", path: "/guides/claude", schemaType: "TechArticle", group: "guide", language: "en",
        title: "How to Use Claude | Step-by-Step Beginner Guide",
        description: "Learn how to use Claude for writing, summarizing, planning, studying, coding help, long documents, project work, and careful revisions with beginner-friendly screen-aware steps, prompt examples, safety tips, and common mistakes to avoid." },
    { key: "gemini-beginner-guide", path: "/guides/gemini", schemaType: "TechArticle", group: "guide", language: "en",
        title: "How to Use Google Gemini | Step-by-Step Beginner Guide",
        description: "Learn how to use Google Gemini for writing, planning, research support, studying, productivity, visual workflows, brainstorming, and safe everyday AI help with beginner-friendly screen-aware steps, prompt examples, safety tips, and common mistakes to avoid." },
    { key: "microsoft-copilot-beginner-guide", path: "/guides/microsoft-copilot", schemaType: "TechArticle", group: "guide", language: "en",
        title: "How to Use Microsoft Copilot | Step-by-Step Beginner Guide",
        description: "Learn how to use Microsoft Copilot for writing, summarizing, email, documents, spreadsheets, meetings, productivity, and everyday work with beginner-friendly steps, examples, privacy tips, and mistakes to avoid." },
    { key: "perplexity-beginner-guide", path: "/guides/perplexity", schemaType: "TechArticle", group: "guide", language: "en",
        title: "How to Use Perplexity | Step-by-Step Beginner Guide",
        description: "Learn how to use Perplexity as a beginner: ask clear research questions, follow up, compare sources, and verify facts. Includes example prompts, good vs bad prompts, common mistakes, and privacy tips." },
    { key: "cursor-beginner-guide", path: "/guides/cursor", schemaType: "TechArticle", group: "guide", language: "en",
        title: "How to Use Cursor | Step-by-Step Beginner Guide",
        description: "Learn how to use Cursor, the AI code editor, as a beginner: describe your project, ask for a plan, work file by file, run and review changes, and keep secrets safe. Includes example prompts and common mistakes." },
    { key: "replit-beginner-guide", path: "/guides/replit", schemaType: "TechArticle", group: "guide", language: "en",
        title: "How to Use Replit AI | Step-by-Step Beginner Guide",
        description: "Learn how to use Replit AI as a beginner: start a small project, ask for a plan, build one feature at a time, run and test, use errors as context, and keep secrets safe. Includes example prompts and common mistakes." },
    { key: "canva-ai-beginner-guide", path: "/guides/canva-ai", schemaType: "TechArticle", group: "guide", language: "en",
        title: "How to Use Canva AI | Step-by-Step Beginner Guide",
        description: "Learn how to use Canva AI as a beginner: choose a design type, write a clear prompt, add audience and style details, edit the result, keep brand consistency, and export safely. Includes example prompts and common mistakes." },
    { key: "higgsfield-ai-video-setup-guide", path: "/guides/higgsfield-ai-video-setup", schemaType: "TechArticle", group: "guide", language: "en",
        title: "How to Set Up Higgsfield for AI Video Creation | Beginner Guide",
        description: "Learn how to set up Higgsfield for AI video creation with beginner-friendly steps for organizing assets, starting a video workflow, creating image-to-video prompts, planning website hero videos, saving exports, and avoiding common mistakes." },
    { key: "runway-ai-video-guide", path: "/guides/runway-ai-video", schemaType: "TechArticle", group: "guide", language: "en",
        title: "How to Use Runway for AI Video | Beginner Guide",
        description: "Learn how to use Runway for AI video creation with beginner-friendly steps for setting up a video workspace, choosing a simple workflow, writing video prompts, generating clips, reviewing results, exporting videos, and avoiding common mistakes." },
    { key: "higgsfield-vs-runway-vs-google-flow", path: "/guides/higgsfield-vs-runway-vs-google-flow", schemaType: "TechArticle", group: "guide", language: "en",
        title: "Higgsfield vs Runway vs Google Flow | AI Video Tool Comparison",
        description: "Compare Higgsfield, Runway, and Google Flow for AI video creation, website hero videos, social clips, cinematic product visuals, character motion tests, marketing videos, and beginner creator workflows." },
    { key: "cinnova-cinematic-asset-library-guide", path: "/guides/cinnova-cinematic-asset-library", schemaType: "TechArticle", group: "guide", language: "en",
        title: "Build the CinNova Cinematic Asset Library | AI Creator Workflow",
        description: "Plan and organize a cinematic AI asset library for CinNova products, including website hero images, hero videos, social clips, prompt versions, source images, exports, screenshots, naming conventions, and quality checklists." },
    { key: "higgsfield-website-hero-video-guide", path: "/guides/higgsfield-website-hero-video", schemaType: "TechArticle", group: "guide", language: "en",
        title: "How to Create Website Hero Videos with Higgsfield | AI Creator Guide",
        description: "Learn how to create clean, loop-friendly website hero videos with Higgsfield for product pages, blog pages, app websites, and cinematic brand assets." },
    { key: "claude-with-adobe-guide", path: "/guides/claude-with-adobe", schemaType: "TechArticle", group: "guide", language: "en",
        title: "How to Use Claude with Adobe | Creative Workflow Guide",
        description: "Learn how to use Claude alongside Adobe tools to plan creative projects: write briefs, generate mood board ideas, draft copy, request design variations, and review your work. Includes example prompts and privacy tips." },
    { key: "claude-website-design-guide", path: "/guides/claude-website-design", schemaType: "TechArticle", group: "guide", language: "en",
        title: "How to Use Claude to Design a Website | Step-by-Step Guide",
        description: "Learn how to use Claude to plan a website: define goals, build a sitemap, draft homepage copy, write wireframe notes, improve UX, and prepare developer handoff. Includes example prompts, safety tips, and common mistakes." },
    { key: "claude-art-prompts-guide", path: "/guides/claude-art-prompts", schemaType: "TechArticle", group: "guide", language: "en",
        title: "How to Use Claude for Art Prompts | Beginner Guide",
        description: "Learn how to use Claude to write better art prompts: describe subject, style, mood, lighting, camera, color, and composition, add constraints, and create variations. Includes before/after examples and copyright safety tips." },
    { key: "claude-branding-marketing-guide", path: "/guides/claude-branding-marketing", schemaType: "TechArticle", group: "guide", language: "en",
        title: "How to Use Claude for Branding and Marketing | Beginner Guide",
        description: "Learn how to use Claude for branding and marketing: define your audience, build positioning, create a voice and tone guide, generate content pillars, and draft landing, social, and email copy. Includes example prompts and safety tips." },
    { key: "claude-with-canva-guide", path: "/guides/claude-with-canva", schemaType: "TechArticle", group: "guide", language: "en",
        title: "How to Use Claude with Canva | Design Workflow Guide",
        description: "Learn how to use Claude alongside Canva to plan designs: write creative briefs, draft copy and layout ideas, request variations, and review for brand consistency. Includes example prompts and privacy tips." },
    { key: "claude-with-figma-guide", path: "/guides/claude-with-figma", schemaType: "TechArticle", group: "guide", language: "en",
        title: "How to Use Claude with Figma | UX Design Workflow Guide",
        description: "Learn how to use Claude alongside Figma to plan UX and product design: map user flows, write wireframe notes and microcopy, improve usability, and prepare developer handoff. Includes example prompts and safety tips." },
    { key: "claude-with-cursor-guide", path: "/guides/claude-with-cursor", schemaType: "TechArticle", group: "guide", language: "en",
        title: "How to Use Claude with Cursor | Coding Workflow Guide",
        description: "Learn how to use Claude alongside Cursor to plan features, break work into small tasks, write prompts for the editor, run and debug code, review risk, and check changes before committing. Includes example prompts and safety tips." },
    { key: "claude-with-higgsfield-guide", path: "/guides/claude-with-higgsfield", schemaType: "TechArticle", group: "guide", language: "en",
        title: "How to Use Claude with Higgsfield | AI Video Prompt Guide",
        description: "Learn how to use Claude alongside Higgsfield to plan AI video: define the goal, write a concept, build scene-by-scene prompts with style, camera, lighting, and mood, and create platform variations. Includes example prompts and copyright tips." },

    // ─────────────────────────────────────────────────────────────────────
    // Phase 11 revenue pages — legal, newsletter, and company surfaces.
    //
    // Tagged `phase: "revenue"` so the Phase 2B migration invariants in
    // audit-seo.mjs keep counting the original 50 (16 core + 34 guides)
    // rather than drifting whenever a policy or company page is added.
    //
    // Commerce, affiliate, and partner surfaces are deliberately NOT here:
    // those already exist on main (src/data/commerce/*, src/data/affiliate/*)
    // and must not be duplicated.
    // ─────────────────────────────────────────────────────────────────────

    { key: "press-kit", path: "/company/press-kit", schemaType: "WebPage", phase: "revenue",
        title: "Press Kit | Cin Nova",
        description: "Download the Cin Nova press kit: company boilerplate, product one-liners, approved facts, downloadable assets, and journalist contact details for accurate reporting." },
    { key: "brand-assets", path: "/company/brand-assets", schemaType: "WebPage", phase: "revenue",
        title: "Brand Assets & Usage Guidelines | Cin Nova",
        description: "Official Cin Nova logos, wordmarks, colour values, typography, and clear-space rules — with the permitted and prohibited uses spelled out for partners, press, and affiliates." },
    { key: "contact-sales", path: "/company/contact-sales", schemaType: "ContactPage", phase: "revenue",
        title: "Contact Sales | Advertising & Partnerships at Cin Nova",
        description: "Talk to Cin Nova about sponsorships, newsletter placements, sponsored articles, and partnership packages. See what to include in an enquiry and what happens after you send it." },

    { key: "newsletter-archive", path: "/newsletter/archive", schemaType: "CollectionPage", phase: "revenue",
        title: "Newsletter Archive | Cin Nova",
        description: "Every past edition of the Cin Nova newsletter, kept as a permanent linkable page — plus what each edition covers and how often it is sent, so you know before you subscribe." },
    { key: "newsletter-preferences", path: "/newsletter/preferences", schemaType: "WebPage", phase: "revenue",
        title: "Email Preferences & Privacy Controls | Cin Nova Newsletter",
        description: "Choose which Cin Nova editions you receive, cap delivery to a weekly or monthly digest, switch to tracking-free plain text, or request a data export or deletion at any time." },

    { key: "legal", path: "/legal", schemaType: "CollectionPage", phase: "revenue",
        title: "Legal Center | Cin Nova Policies and Disclosures",
        description: "Every Cin Nova policy in one place: privacy, terms, affiliate disclosure, cookies, disclaimer, accessibility, DMCA, and copyright — with an honest note on their review status." },
    { key: "legal-affiliate-disclosure", path: "/legal/affiliate-disclosure", schemaType: "WebPage", phase: "revenue",
        title: "Affiliate Disclosure | Cin Nova",
        description: "How Cin Nova handles partner recommendations: no affiliate link is active today, the two switches that must both be on before one is, and why a commission never buys a recommendation." },
    { key: "legal-cookie-policy", path: "/legal/cookie-policy", schemaType: "WebPage", phase: "revenue",
        title: "Cookie Policy | Cin Nova",
        description: "What Cin Nova stores in your browser and why — session flags, newsletter preferences, and analytics cookies — plus how to remove all of it in any browser." },
    { key: "legal-disclaimer", path: "/legal/disclaimer", schemaType: "WebPage", phase: "revenue",
        title: "Disclaimer | Cin Nova",
        description: "Cin Nova content is informational, not professional advice. Read the limits that apply to financial, real estate, health, safety, and AI-assisted content before relying on any of it." },
    { key: "legal-accessibility", path: "/legal/accessibility", schemaType: "WebPage", phase: "revenue",
        title: "Accessibility Statement | Cin Nova",
        description: "The WCAG 2.1 AA standard Cin Nova builds to, what is already in place, the limitations we know about and have not fixed yet, and how to report a barrier and get a reply." },
    { key: "legal-dmca", path: "/legal/dmca", schemaType: "WebPage", phase: "revenue",
        title: "DMCA Notice & Takedown | Cin Nova",
        description: "How to send Cin Nova a copyright infringement notice, exactly what a valid notice must contain, what happens after one is received, and how to file a counter-notice." },
    { key: "legal-copyright", path: "/legal/copyright", schemaType: "WebPage", phase: "revenue",
        title: "Copyright & Content Use | Cin Nova",
        description: "Who owns Cin Nova content, what you may quote or share without asking, what needs written permission, and the terms attached to CinNova books sold through external retailers." },
];

/** Phase 11 revenue routes — excluded from the Phase 2B migration invariants. */
export const REVENUE_PAGE_ROUTES = PUBLIC_PAGE_ROUTES.filter((route) => route.phase === "revenue");

/** The original Phase 2B set (16 core marketing/company/tool pages + 34 guides). */
export const PHASE_2B_PAGE_ROUTES = PUBLIC_PAGE_ROUTES.filter((route) => route.phase !== "revenue");

/** Set of migrated page keys. */
export const MIGRATED_PUBLIC_PAGE_KEYS = new Set(PUBLIC_PAGE_ROUTES.map((route) => route.key));

const KEY_TO_ROUTE = new Map(PUBLIC_PAGE_ROUTES.map((route) => [route.key, route]));
const PATH_TO_KEY = new Map(PUBLIC_PAGE_ROUTES.map((route) => [route.path, route.key]));

function normalizePath(pathname) {
    if (typeof pathname !== "string") return null;
    return pathname.replace(/\/+$/, "") || "/";
}

/** @returns {string|null} clean pathname for a migrated page key, else null. */
export function getPublicPagePath(pageKey) {
    return KEY_TO_ROUTE.get(pageKey)?.path || null;
}

/** @returns {string|null} absolute canonical URL for a migrated page key, else null. */
export function getPublicPageUrl(pageKey) {
    const path = getPublicPagePath(pageKey);
    return path ? `${PUBLIC_SITE_URL}${path}` : null;
}

/** @returns {object|null} the full route entry (key, path, title, description, schemaType). */
export function getPublicPageRoute(pageKey) {
    return KEY_TO_ROUTE.get(pageKey) || null;
}

/** @returns {string|null} the migrated page key for a clean pathname, else null. */
export function getPublicPageKeyFromPath(pathname) {
    const clean = normalizePath(pathname);
    return clean ? PATH_TO_KEY.get(clean) || null : null;
}

/** @returns {boolean} whether a page key has been migrated to a clean route. */
export function isMigratedPublicPageKey(pageKey) {
    return MIGRATED_PUBLIC_PAGE_KEYS.has(pageKey);
}

/** @returns {boolean} whether a clean pathname belongs to a migrated public page. */
export function isMigratedPublicPagePath(pathname) {
    return getPublicPageKeyFromPath(pathname) !== null;
}

// ─────────────────────────────────────────────────────────────────────────
// Guide-specific helpers (Phase 2B, Checkpoint 2)
// ─────────────────────────────────────────────────────────────────────────

/** All individual guide routes (group === "guide"). */
export const GUIDE_PAGE_ROUTES = PUBLIC_PAGE_ROUTES.filter((route) => route.group === "guide");

/** Members of each translated-guide family, keyed by alternateGroup. */
const ALTERNATE_GROUPS = new Map();
for (const route of GUIDE_PAGE_ROUTES) {
    if (!route.alternateGroup) continue;
    if (!ALTERNATE_GROUPS.has(route.alternateGroup)) ALTERNATE_GROUPS.set(route.alternateGroup, []);
    ALTERNATE_GROUPS.get(route.alternateGroup).push(route);
}

/**
 * Clean hreflang alternates for a translated-guide page key.
 * Returns [{ hreflang, path }] covering every language in the family plus an
 * x-default pointing at the English route, or null for pages that are not part
 * of a translated family (English-only guides get no invented translations).
 */
export function getGuideAlternates(pageKey) {
    const route = KEY_TO_ROUTE.get(pageKey);
    if (!route?.alternateGroup) return null;
    const family = ALTERNATE_GROUPS.get(route.alternateGroup) || [];
    const alternates = family.map((member) => ({ hreflang: member.language, path: member.path }));
    const english = family.find((member) => member.language === "en");
    if (english) alternates.push({ hreflang: "x-default", path: english.path });
    return alternates;
}
