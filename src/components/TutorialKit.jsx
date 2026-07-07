// Reusable building blocks for AI tutorial pages. Prefix: ait-
import SEO from "./SEO.jsx";

export const HUB_URL = "/?page=ai-tutorials";

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
export function TutorialSEO({ title, description, pageKey, siteUrl }) {
    const url = `${siteUrl}/?page=${pageKey}`;
    const schema = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: title,
        description,
        url,
        publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
    };
    return <SEO title={title} description={description} url={url} type="article" schema={schema} />;
}
