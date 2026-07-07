// AITutorials — /?page=ai-tutorials   (hub)   CSS prefix: ait-
import { useMemo, useState } from "react";
import "../App.css";
import "./AITutorials.css";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/blogPosts.js";
import { AI_TUTORIALS, AI_TOOL_TUTORIALS, CLAUDE_WORKFLOW_GUIDES, AI_CATEGORIES, AI_COMPANIES } from "../data/aiTutorials.js";
import { trackAiTutorialClick } from "../utils/analytics.js";

const PAGE_URL = `${siteUrl}/?page=ai-tutorials`;
const guideUrl = (key) => `/?page=${key}`;

const hubSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Tutorials",
    description:
        "Step-by-step AI tutorials for prompting, research, coding, productivity, design, video, business automation, and responsible AI use.",
    url: PAGE_URL,
    publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
};

const STATUS_CLASS = {
    Available: "ait-chip--green",
    "Guide Planned": "ait-chip--gold",
    "Coming Soon": "ait-chip--gray",
};

// Hub-only presentation metadata for the guide finder: topic tags (for filtering)
// and a short "Best for…" line. Keyed by guide key so guide data stays untouched.
const GUIDE_META = {
    "ai-prompt-writing-guide":        { tags: ["prompting"],              bestFor: "Best for writing clearer prompts for any AI tool." },
    "ai-research-guide":              { tags: ["research"],               bestFor: "Best for gathering and verifying information with AI." },
    "ai-coding-guide":                { tags: ["coding"],                 bestFor: "Best for planning and reviewing code with AI safely." },
    "chatgpt-beginner-guide":         { tags: ["writing"],                bestFor: "Best for everyday writing, planning, and Q&A." },
    "claude-beginner-guide":          { tags: ["writing"],                bestFor: "Best for long documents, drafting, and analysis." },
    "gemini-beginner-guide":          { tags: ["writing"],                bestFor: "Best for everyday help across common workflows." },
    "microsoft-copilot-beginner-guide": { tags: ["productivity"],         bestFor: "Best for email, documents, and spreadsheet help at work." },
    "perplexity-beginner-guide":      { tags: ["research"],               bestFor: "Best for quick research with sources you can check." },
    "cursor-beginner-guide":          { tags: ["coding"],                 bestFor: "Best for editing code in an AI-assisted editor." },
    "replit-beginner-guide":          { tags: ["coding"],                 bestFor: "Best for building small projects in the browser." },
    "canva-ai-beginner-guide":        { tags: ["design"],                 bestFor: "Best for quick designs and social graphics." },
    "claude-with-adobe-guide":        { tags: ["design"],                 bestFor: "Best for planning creative projects before Adobe work." },
    "claude-website-design-guide":    { tags: ["design"],                 bestFor: "Best for planning a website before you build it." },
    "claude-art-prompts-guide":       { tags: ["design"],                 bestFor: "Best for writing detailed prompts for image tools." },
    "claude-branding-marketing-guide": { tags: ["marketing"],             bestFor: "Best for brand voice, positioning, and marketing copy." },
    "claude-with-canva-guide":        { tags: ["design"],                 bestFor: "Best for planning Canva designs and copy." },
    "claude-with-figma-guide":        { tags: ["design"],                 bestFor: "Best for planning UX flows before Figma work." },
    "claude-with-cursor-guide":       { tags: ["coding"],                 bestFor: "Best for planning and reviewing code alongside Cursor." },
    "claude-with-higgsfield-guide":   { tags: ["video"],                  bestFor: "Best for planning AI video concepts and prompts." },
};

// Structural groups: each guide keeps its link + analytics; we only add a label + meta.
const GROUPS = [
    { id: "foundation",       label: "Foundation",      heading: "Foundation Guides",     note: "Core skills that make every AI tool easier to use.",                 guides: AI_TUTORIALS },
    { id: "tools",            label: "Tool Guide",      heading: "AI Tool Guides",         note: "Step-by-step walkthroughs for the most popular AI assistants.",       guides: AI_TOOL_TUTORIALS },
    { id: "claude-workflows", label: "Workflow Guide",  heading: "Claude Workflow Guides", note: "Use Claude alongside design, website, coding, and video work.",       guides: CLAUDE_WORKFLOW_GUIDES },
];

const ALL_GUIDES = GROUPS.flatMap((group) =>
    group.guides.map((g) => ({
        ...g,
        group: group.id,
        groupLabel: group.label,
        tags: GUIDE_META[g.key]?.tags || [],
        bestFor: GUIDE_META[g.key]?.bestFor || "",
    })),
);

// Finder filter chips. Each is a predicate over ALL_GUIDES so counts stay accurate.
const FILTERS = [
    { id: "all",              label: "All guides",         match: () => true },
    { id: "foundation",       label: "Foundation",         match: (g) => g.group === "foundation" },
    { id: "tools",            label: "AI Tools",           match: (g) => g.group === "tools" },
    { id: "claude-workflows", label: "Claude Workflows",   match: (g) => g.group === "claude-workflows" },
    { id: "coding",           label: "Coding",             match: (g) => g.tags.includes("coding") },
    { id: "design",           label: "Design & Creative",  match: (g) => g.tags.includes("design") },
    { id: "research",         label: "Research",           match: (g) => g.tags.includes("research") },
    { id: "video",            label: "Video & Content",    match: (g) => g.tags.includes("video") || g.tags.includes("marketing") },
];

function GuideCard({ g }) {
    return (
        <a
            className="ait-guide-card"
            href={guideUrl(g.key)}
            onClick={() => trackAiTutorialClick({ sourcePage: "ai-tutorials", tutorialKey: g.key, tutorialTitle: g.title })}
        >
            <div className="ait-guide-card-meta">
                <span className="ait-chip">{g.groupLabel}</span>
                {g.level === "Beginner" && <span className="ait-chip ait-chip--muted">Beginner</span>}
                <span className="ait-chip ait-chip--muted">{g.minutes} min</span>
            </div>
            <h3>{g.title}</h3>
            <p>{g.blurb}</p>
            {g.bestFor && <p className="ait-guide-best">{g.bestFor}</p>}
            <span className="ait-guide-card-go">Read the guide →</span>
        </a>
    );
}

export default function AITutorials() {
    const [filter, setFilter] = useState("all");
    const activeFilter = FILTERS.find((f) => f.id === filter) || FILTERS[0];
    const visibleGuides = useMemo(() => ALL_GUIDES.filter(activeFilter.match), [activeFilter]);

    return (
        <div className="product-page ait-page">
            <SEO
                title="AI Tutorials | Step-by-Step Guides for ChatGPT, Claude, Gemini & More"
                description="Browse 19 beginner-friendly AI guides. Find the right step-by-step tutorial for prompting, research, coding, AI tools, and Claude workflows for design, marketing, and video."
                url={PAGE_URL}
                type="website"
                schema={hubSchema}
            />

            {/* Hero */}
            <section className="section ait-hub-hero">
                <p className="eyebrow">FREE · AI EDUCATION</p>
                <h1>AI Tutorials</h1>
                <p className="ait-hub-sub">
                    Step-by-step guides for learning how to use AI tools for writing, research, coding,
                    productivity, design, video, business automation, and safer decision-making.
                </p>
                <div className="ait-hub-ctas">
                    <a className="primary-btn" href="#find-guide">Find the Right AI Guide</a>
                    <a className="ait-link-btn" href="#companies">Browse AI Companies</a>
                </div>
            </section>

            {/* Start Here */}
            <section className="section">
                <div className="ait-section-head">
                    <h2>Start here</h2>
                    <p>New to AI? These three ideas make everything else easier.</p>
                </div>
                <div className="ait-starthere">
                    <div className="ait-starthere-card">
                        <strong>Give clear instructions</strong>
                        <p>AI tools respond to how you ask. A little structure — role, task, context — dramatically improves results.</p>
                    </div>
                    <div className="ait-starthere-card">
                        <strong>Always verify</strong>
                        <p>AI can sound confident and still be wrong. Treat output as a first draft and check anything that matters.</p>
                    </div>
                    <div className="ait-starthere-card">
                        <strong>Protect your privacy</strong>
                        <p>Never paste passwords, API keys, or confidential files. Interfaces change — review official settings.</p>
                    </div>
                </div>
            </section>

            {/* Find the Right AI Guide (finder) */}
            <section className="section" id="find-guide">
                <div className="ait-section-head">
                    <h2>Find the Right AI Guide</h2>
                    <p>
                        <strong className="ait-count">{ALL_GUIDES.length} beginner-friendly AI guides</strong>,
                        organized so you can jump straight to what you need. Pick a category to filter.
                    </p>
                </div>

                <div className="ait-filters" role="tablist" aria-label="Filter AI guides by category">
                    {FILTERS.map((f) => {
                        const count = ALL_GUIDES.filter(f.match).length;
                        const active = f.id === filter;
                        return (
                            <button
                                key={f.id}
                                type="button"
                                className={`ait-filter${active ? " ait-filter--active" : ""}`}
                                aria-pressed={active}
                                onClick={() => setFilter(f.id)}
                            >
                                {f.label} <span className="ait-filter-count">{count}</span>
                            </button>
                        );
                    })}
                </div>

                {filter === "all" ? (
                    // Grouped view: clear guide groupings with section labels.
                    GROUPS.map((group) => (
                        <div className="ait-group" key={group.id}>
                            <div className="ait-group-head">
                                <h3>{group.heading}</h3>
                                <p>{group.note}</p>
                            </div>
                            <div className="ait-guide-grid">
                                {ALL_GUIDES.filter((g) => g.group === group.id).map((g) => (
                                    <GuideCard g={g} key={g.key} />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    // Filtered view: a single grid of matching guides.
                    <div className="ait-group">
                        <p className="ait-filter-summary">
                            Showing <strong>{visibleGuides.length}</strong> {activeFilter.label.toLowerCase()} {visibleGuides.length === 1 ? "guide" : "guides"}.
                        </p>
                        <div className="ait-guide-grid">
                            {visibleGuides.map((g) => (
                                <GuideCard g={g} key={g.key} />
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Multilingual starter pilot */}
            <section className="section">
                <div className="ait-section-head">
                    <h2>Available in other languages</h2>
                    <p>A growing multilingual starter library. Read the AI prompt writing guide in your language.</p>
                </div>
                <div className="ait-langnav">
                    <a className="ait-langnav-link" href={guideUrl("ai-prompt-writing-guide-es")} lang="es">Español</a>
                    <a className="ait-langnav-link" href={guideUrl("ai-prompt-writing-guide-fr")} lang="fr">Français</a>
                    <a className="ait-langnav-link" href={guideUrl("ai-prompt-writing-guide-de")} lang="de">Deutsch</a>
                    <a className="ait-langnav-link" href={guideUrl("languages")}>More languages →</a>
                </div>
            </section>

            {/* Categories */}
            <section className="section">
                <div className="ait-section-head">
                    <h2>AI tutorial categories</h2>
                    <p>Where we're focused now, and where guides are on the way.</p>
                </div>
                <div className="ait-cat-grid">
                    {AI_CATEGORIES.map((c) => (
                        <div className="ait-cat" key={c.name}>
                            <div>
                                <div className="ait-cat-name">{c.name}</div>
                                <div className="ait-cat-note">{c.note}</div>
                            </div>
                            <span className={`ait-chip ${c.available > 0 ? "ait-chip--green" : "ait-chip--gray"}`}>
                                {c.available > 0 ? `${c.available} guide` : "Planned"}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Companies covered */}
            <section className="section" id="companies">
                <div className="ait-section-head">
                    <h2>AI companies covered</h2>
                    <p>
                        Beginner-friendly, vendor-neutral overviews. CinNova is independent and not
                        affiliated with these companies. Guides marked "Planned" are on the roadmap.
                    </p>
                </div>
                <div className="ait-co-grid">
                    {AI_COMPANIES.map((co) => {
                        const CardTag = co.guide ? "a" : "div";
                        const linkProps = co.guide
                            ? { href: guideUrl(co.guide), onClick: () => trackAiTutorialClick({ sourcePage: "ai-tutorials", tutorialKey: co.guide, tutorialTitle: co.name }) }
                            : {};
                        return (
                            <CardTag className="ait-co" key={co.name} {...linkProps}>
                                <div className="ait-co-top">
                                    <span className="ait-co-name">{co.name}</span>
                                    <span className="ait-co-use">{co.use}</span>
                                </div>
                                <p className="ait-co-desc">{co.desc}</p>
                                <span className={`ait-co-status ait-chip ${STATUS_CLASS[co.status] || "ait-chip--gray"}`}>
                                    {co.status}
                                </span>
                                {co.guide && <span className="ait-co-go">Read the guide →</span>}
                            </CardTag>
                        );
                    })}
                </div>
            </section>

            {/* More guides coming soon */}
            <section className="section">
                <div className="ait-soon">
                    More guides coming soon — image generation, video, voice, productivity, and
                    business automation are all in progress. Start with the guides above.
                </div>
            </section>

            {/* Learn AI with CinNova */}
            <section className="section">
                <div className="ait-cinnova">
                    <h2>Learn AI with CinNova</h2>
                    <p>
                        CinNova builds practical AI products and publishes beginner-friendly AI education
                        to help people use AI with confidence.
                    </p>
                    <div className="ait-cinnova-links">
                        <a className="ait-link-btn" href="/blog">Blog</a>
                        <a className="ait-link-btn" href="/?page=products">Products</a>
                        <a className="ait-link-btn" href="/?page=real-estate">Real Estate AI</a>
                        <a className="ait-link-btn" href="/?page=free-rental-property-calculator">Free Rental Calculator</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
