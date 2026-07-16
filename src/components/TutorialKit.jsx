// Reusable building blocks for AI tutorial pages. Prefix: ait-
import SEO from "./SEO.jsx";
import { trackAiTutorialClick } from "../utils/analytics.js";
import {
    PUBLIC_SITE_URL,
    getGuideAlternates,
    getPublicPageKeyFromPath,
    getPublicPagePath,
    getPublicPageUrl,
} from "../data/publicPageRoutes.js";

export const HUB_URL = "/guides";

// Current page key, used as the source_page for related-guide clicks.
// Clean routes resolve via the shared registry; legacy ?page= is the fallback.
function currentPageKey() {
    if (typeof window === "undefined") return "";
    return (
        getPublicPageKeyFromPath(window.location.pathname) ||
        new URLSearchParams(window.location.search).get("page") ||
        ""
    );
}

// Language versions of the AI prompt writing guide (multilingual starter pilot).
// Clean routes come from the shared registry, so the switcher never produces a
// dead link and never drifts from routing/sitemap/redirects.
const PROMPT_GUIDE_LANGS = [
    { code: "en", label: "English",  href: getPublicPagePath("ai-prompt-writing-guide") },
    { code: "es", label: "Español",  href: getPublicPagePath("ai-prompt-writing-guide-es") },
    { code: "fr", label: "Français", href: getPublicPagePath("ai-prompt-writing-guide-fr") },
    { code: "de", label: "Deutsch",  href: getPublicPagePath("ai-prompt-writing-guide-de") },
];

// Language versions of the AI research guide (multilingual starter pilot).
const RESEARCH_GUIDE_LANGS = [
    { code: "en", label: "English",  href: getPublicPagePath("ai-research-guide") },
    { code: "es", label: "Español",  href: getPublicPagePath("ai-research-guide-es") },
    { code: "fr", label: "Français", href: getPublicPagePath("ai-research-guide-fr") },
    { code: "de", label: "Deutsch",  href: getPublicPagePath("ai-research-guide-de") },
];

// Shared renderer so both switchers behave identically (active = non-link span).
function LangNav({ langs, current }) {
    return (
        <div className="ait-langnav" aria-label="Guide language">
            {langs.map((l) =>
                l.code === current ? (
                    <span key={l.code} className="ait-langnav-link ait-langnav-link--active" aria-current="true" lang={l.code}>
                        {l.label}
                    </span>
                ) : (
                    <a key={l.code} className="ait-langnav-link" href={l.href} lang={l.code}>
                        {l.label}
                    </a>
                ),
            )}
        </div>
    );
}

/** Language switcher shown on each version of the AI prompt writing guide. */
export function PromptGuideLangNav({ current = "en" }) {
    return <LangNav langs={PROMPT_GUIDE_LANGS} current={current} />;
}

/** Language switcher shown on each version of the AI research guide. */
export function ResearchGuideLangNav({ current = "en" }) {
    return <LangNav langs={RESEARCH_GUIDE_LANGS} current={current} />;
}

// Language versions of the AI coding guide (multilingual starter pilot).
const CODING_GUIDE_LANGS = [
    { code: "en", label: "English",  href: getPublicPagePath("ai-coding-guide") },
    { code: "es", label: "Español",  href: getPublicPagePath("ai-coding-guide-es") },
    { code: "fr", label: "Français", href: getPublicPagePath("ai-coding-guide-fr") },
    { code: "de", label: "Deutsch",  href: getPublicPagePath("ai-coding-guide-de") },
];

/** Language switcher shown on each version of the AI coding guide. */
export function CodingGuideLangNav({ current = "en" }) {
    return <LangNav langs={CODING_GUIDE_LANGS} current={current} />;
}

/** Page-top hero for a single tutorial. */
export function TutorialHero({ eyebrow, title, intro, level, minutes }) {
    return (
        <section className="section ait-guide-hero">
            <a className="ait-breadcrumb" href={HUB_URL}>← AI Tutorials</a>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="ait-guide-intro">{intro}</p>
            {(level || minutes) && (
                <div className="ait-meta">
                    {level && <span className="ait-chip">{level}</span>}
                    {minutes && <span className="ait-chip ait-chip--muted">{minutes} min read</span>}
                    <span className="ait-chip ait-chip--muted">Evergreen guide</span>
                </div>
            )}
        </section>
    );
}

/** A numbered step block. */
export function Step({ n, title, children }) {
    return (
        <div className="ait-step">
            <div className="ait-step-num">{n}</div>
            <div className="ait-step-body">
                <h3 className="ait-step-title">{title}</h3>
                {children}
            </div>
        </div>
    );
}

/** A labeled callout box (tone: info | good | bad | warn). */
export function Callout({ tone = "info", title, children }) {
    return (
        <div className={`ait-callout ait-callout--${tone}`}>
            {title && <p className="ait-callout-title">{title}</p>}
            <div className="ait-callout-body">{children}</div>
        </div>
    );
}

/** A prompt example block shown in a monospace card. */
export function PromptExample({ label, children }) {
    return (
        <div className="ait-prompt">
            {label && <span className="ait-prompt-label">{label}</span>}
            <pre className="ait-prompt-text">{children}</pre>
        </div>
    );
}

/**
 * A labeled detail row for click-by-click, screen-aware beginner steps.
 * Use inside <Step> with labels like "Where to look", "What to click",
 * "What you should see", "If you don't see it", "Common mistake".
 */
export function StepDetail({ label, children }) {
    return (
        <div className="ait-stepdetail">
            <span className="ait-stepdetail-label">{label}</span>
            <div className="ait-stepdetail-body">{children}</div>
        </div>
    );
}

/** A screenshot placeholder block for beginner tutorials. */
export function ScreenshotPlaceholder({ children }) {
    return (
        <div className="ait-shot">
            <span className="ait-shot-icon" aria-hidden="true">📷</span>
            <span className="ait-shot-text">{children}</span>
        </div>
    );
}

/** FAQ list rendered as accessible detail/summary items. */
export function FAQ({ items }) {
    return (
        <div className="ait-faq">
            {items.map((item) => (
                <details className="ait-faq-item" key={item.q}>
                    <summary>{item.q}</summary>
                    <p>{item.a}</p>
                </details>
            ))}
        </div>
    );
}

/** Standard bottom CTA back to the hub. */
export function BackToHubCta({ note }) {
    return (
        <section className="section ait-guide-cta">
            <div className="ait-guide-cta-card">
                <h2>Keep learning AI</h2>
                <p>{note || "Explore more beginner-friendly, step-by-step AI tutorials on the CinNova AI Tutorials hub."}</p>
                <div className="ait-guide-cta-actions">
                    <a className="primary-btn" href={HUB_URL}>← Back to AI Tutorials</a>
                    <a className="ait-link-btn" href="/blog">Read the CinNova blog</a>
                </div>
            </div>
        </section>
    );
}

/** Links back to the hub and the three foundational skill guides. */
export function RelatedGuides() {
    return (
        <section className="section">
            <div className="ait-section-head">
                <h2>Keep going</h2>
                <p>These foundational guides make every AI tool easier to use.</p>
            </div>
            <div className="ait-related">
                {[
                    { href: HUB_URL, key: "ai-tutorials", label: "All AI Tutorials" },
                    { href: getPublicPagePath("ai-prompt-writing-guide"), key: "ai-prompt-writing-guide", label: "Prompt Writing Guide" },
                    { href: getPublicPagePath("ai-research-guide"), key: "ai-research-guide", label: "AI Research Guide" },
                    { href: getPublicPagePath("ai-coding-guide"), key: "ai-coding-guide", label: "AI Coding Guide" },
                ].map((l) => (
                    <a
                        key={l.key}
                        className="ait-link-btn"
                        href={l.href}
                        onClick={() => trackAiTutorialClick({ sourcePage: currentPageKey(), tutorialKey: l.key, tutorialTitle: l.label })}
                    >
                        {l.label}
                    </a>
                ))}
            </div>
        </section>
    );
}

/** Shared privacy/safety reminder used across every guide. */
export function SafetyNote() {
    return (
        <Callout tone="warn" title="Privacy & safety reminder">
            <ul className="ait-list">
                <li>Do not paste private data, passwords, API keys, or confidential files into AI tools.</li>
                <li>Interfaces change often — check the latest official tool settings and terms.</li>
                <li>Review every output before you trust it, publish it, or act on it.</li>
            </ul>
        </Callout>
    );
}

/** Convenience SEO wrapper for a tutorial page. */
// hreflang alternates come from the shared registry (translated families only);
// English-only guides get none. URLs are always clean — never query forms.
function alternatesForPageKey(pageKey) {
    const alternates = getGuideAlternates(pageKey);
    if (!alternates) return undefined;
    return alternates.map((alt) => ({ hreflang: alt.hreflang, href: `${PUBLIC_SITE_URL}${alt.path}` }));
}

export function TutorialSEO({ title, description, pageKey, siteUrl }) {
    // All guide pages are migrated to clean routes; the legacy form remains only
    // as a defensive fallback for a pageKey missing from the registry.
    const url = getPublicPageUrl(pageKey) || `${siteUrl}/?page=${pageKey}`;
    const alternates = alternatesForPageKey(pageKey);
    const schema = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: title,
        description,
        url,
        publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
    };
    return <SEO title={title} description={description} url={url} type="article" schema={schema} alternates={alternates} />;
}
