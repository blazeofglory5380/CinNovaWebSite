// AITutorials — /?page=ai-tutorials   (hub)   CSS prefix: ait-
import { useMemo, useState } from "react";
import "../App.css";
import "./AITutorials.css";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/blogPosts.js";
import {
    AI_TUTORIALS,
    AI_TOOL_TUTORIALS,
    CLAUDE_WORKFLOW_GUIDES,
    AI_CATEGORIES,
    AI_COMPANIES,
    CREATOR_AI_PLATFORM_COLLECTIONS,
    WEEKLY_TUTORIAL_CARDS,
    LEARNING_LEVELS,
    LEARNING_TOPICS,
    AI_PROJECT_TRACKS,
    YOUTUBE_LEARNING_PATHS,
    AI_TUTORIAL_ROADMAP_100,
} from "../data/aiTutorials.js";
import { trackAiTutorialClick, trackEvent } from "../utils/analytics.js";

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

// Level chip color: Beginner = green, Intermediate = gold, Advanced = base blue.
const LEVEL_CHIP = { Beginner: "ait-chip--green", Intermediate: "ait-chip--gold", Advanced: "" };
const levelChip = (lv) => `ait-chip ${LEVEL_CHIP[lv] ?? "ait-chip--muted"}`.trim();

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

// Creator platforms: Higgsfield is featured first-class; the rest form the grid.
const HIGGSFIELD = CREATOR_AI_PLATFORM_COLLECTIONS.find((c) => c.id === "higgsfield");
const OTHER_CREATORS = CREATOR_AI_PLATFORM_COLLECTIONS.filter((c) => c.id !== "higgsfield");

// 100 Tutorial Roadmap — derived counts + filter chips.
const ROADMAP_TOTAL = AI_TUTORIAL_ROADMAP_100.length;
const ROADMAP_BEGINNER = AI_TUTORIAL_ROADMAP_100.filter((t) => t.level === "Beginner").length;
const ROADMAP_INTERMEDIATE = AI_TUTORIAL_ROADMAP_100.filter((t) => t.level === "Intermediate").length;
const ROADMAP_ADVANCED = AI_TUTORIAL_ROADMAP_100.filter((t) => t.level === "Advanced").length;
const ROADMAP_PRIORITY1 = AI_TUTORIAL_ROADMAP_100.filter((t) => t.priority === 1).length;

const ROADMAP_FILTERS = [
    { id: "all", label: "All", match: () => true },
    { id: "beginner", label: "Beginner", match: (t) => t.level === "Beginner" },
    { id: "intermediate", label: "Intermediate", match: (t) => t.level === "Intermediate" },
    { id: "advanced", label: "Advanced", match: (t) => t.level === "Advanced" },
    { id: "priority1", label: "Priority 1", match: (t) => t.priority === 1 },
    { id: "openai", label: "OpenAI", match: (t) => t.platforms.includes("OpenAI") || t.category === "OpenAI" },
    { id: "anthropic", label: "Anthropic", match: (t) => t.platforms.includes("Anthropic") || t.category === "Anthropic" },
    { id: "google", label: "Google AI", match: (t) => t.platforms.includes("Google AI") || t.category === "Google AI" },
    { id: "microsoft", label: "Microsoft", match: (t) => t.platforms.includes("Microsoft") || t.category === "Microsoft" },
    { id: "creators", label: "Creators", match: (t) => t.category === "Creator Tools" || t.topics.includes("Creator Tools") },
    { id: "coding", label: "Coding", match: (t) => t.topics.includes("Coding") },
    { id: "automation", label: "Automation", match: (t) => t.topics.includes("Automation") },
    { id: "youtube", label: "YouTube", match: (t) => t.category === "YouTube Learning Paths" || t.topics.includes("YouTube Learning Paths") },
    { id: "safety", label: "Safety", match: (t) => t.topics.includes("Safety & Privacy") },
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

    const [roadmapFilter, setRoadmapFilter] = useState("all");
    const activeRoadmapFilter = ROADMAP_FILTERS.find((f) => f.id === roadmapFilter) || ROADMAP_FILTERS[0];
    const visibleRoadmap = useMemo(() => AI_TUTORIAL_ROADMAP_100.filter(activeRoadmapFilter.match), [activeRoadmapFilter]);

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
                    Learn AI by skill, company, creator tool, and project. Follow beginner-friendly tutorials
                    for setup, creation, design, automation, coding, video, business workflows, and safe
                    publishing across today's major AI platforms.
                </p>
                <div className="ait-hub-ctas">
                    <a className="primary-btn" href="#find-guide">Find the Right AI Guide</a>
                    <a className="ait-link-btn" href="#companies">Browse AI Companies</a>
                </div>
            </section>

            {/* New Tutorial Every Week */}
            <section className="section">
                <div className="ait-section-head">
                    <h2>New Tutorial Every Week</h2>
                    <p>
                        CinNova publishes a new AI tutorial every week. Start with beginner step-by-step guides,
                        then move into intermediate workflows, advanced projects, creator tools, automation, and
                        platform-specific tutorials.
                    </p>
                </div>
                <div className="ait-weekly-grid">
                    {WEEKLY_TUTORIAL_CARDS.map((c) => (
                        <div className="ait-weekly-card" key={c.id}>
                            <span className="ait-weekly-label">{c.label}</span>
                            <p className="ait-weekly-title">{c.title}</p>
                            <span className="ait-chip ait-chip--gold ait-weekly-status">{c.status}</span>
                        </div>
                    ))}
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
                                onClick={() => { trackEvent("ai_tutorial_filter_click", { filter: f.id, source_page: "ai-tutorials" }); setFilter(f.id); }}
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

            {/* Browse by Level */}
            <section className="section" id="browse-level">
                <div className="ait-section-head">
                    <h2>Browse by Level</h2>
                    <p>
                        Choose the path that matches your experience. Beginner guides are click-by-click,
                        intermediate guides improve workflows, and advanced guides build full systems.
                    </p>
                </div>
                <div className="ait-level-grid">
                    {LEARNING_LEVELS.map((l) => (
                        <div className="ait-level-card" key={l.id}>
                            <span className={levelChip(l.level)}>{l.level}</span>
                            <p>{l.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Browse by Topic */}
            <section className="section" id="browse-topic">
                <div className="ait-section-head">
                    <h2>Browse by Topic</h2>
                    <p>
                        Find tutorials by what you want to learn: setup, prompting, video creation, design,
                        coding, automation, business workflows, safety, SEO, and advanced project builds.
                    </p>
                </div>
                <div className="ait-topic-grid">
                    {LEARNING_TOPICS.map((t) => (
                        <div className="ait-topic-card" key={t.id}>
                            <div className="ait-topic-name">{t.topic}</div>
                            <p className="ait-topic-desc">{t.description}</p>
                            <div className="ait-topic-foot">
                                <span className={`ait-chip ${t.status === "Available guides" ? "ait-chip--green" : "ait-chip--gray"}`}>
                                    {t.status}
                                </span>
                                {t.levels?.map((lv) => (
                                    <span className="ait-chip ait-chip--muted" key={lv}>{lv}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 100 Tutorial Roadmap */}
            <section className="section" id="roadmap">
                <div className="ait-section-head">
                    <h2>100 Tutorial Roadmap</h2>
                    <p>
                        Explore the full CinNova tutorial roadmap: beginner step-by-step guides, intermediate
                        workflows, advanced systems, creator tools, automation, coding, business, and project builds.
                    </p>
                </div>

                <div className="ait-roadmap-stats">
                    <div className="ait-roadmap-stat"><strong>{ROADMAP_TOTAL}</strong><span>Tutorials</span></div>
                    <div className="ait-roadmap-stat"><strong>{ROADMAP_BEGINNER}</strong><span>Beginner</span></div>
                    <div className="ait-roadmap-stat"><strong>{ROADMAP_INTERMEDIATE}</strong><span>Intermediate</span></div>
                    <div className="ait-roadmap-stat"><strong>{ROADMAP_ADVANCED}</strong><span>Advanced</span></div>
                    <div className="ait-roadmap-stat"><strong>{ROADMAP_PRIORITY1}</strong><span>Priority 1</span></div>
                </div>

                <div className="ait-filters" role="tablist" aria-label="Filter roadmap tutorials">
                    {ROADMAP_FILTERS.map((f) => {
                        const count = AI_TUTORIAL_ROADMAP_100.filter(f.match).length;
                        const active = f.id === roadmapFilter;
                        return (
                            <button
                                key={f.id}
                                type="button"
                                className={`ait-filter${active ? " ait-filter--active" : ""}`}
                                aria-pressed={active}
                                onClick={() => { trackEvent("ai_tutorial_filter_click", { filter: `roadmap-${f.id}`, source_page: "ai-tutorials" }); setRoadmapFilter(f.id); }}
                            >
                                {f.label} <span className="ait-filter-count">{count}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="ait-roadmap-grid">
                    {visibleRoadmap.map((t) => {
                        const CardTag = t.status === "Available" ? "a" : "div";
                        const linkProps = t.status === "Available"
                            ? { href: guideUrl(t.key), onClick: () => trackAiTutorialClick({ sourcePage: "ai-tutorials", tutorialKey: t.key, tutorialTitle: t.title }) }
                            : {};
                        return (
                            <CardTag className="ait-roadmap-card" key={t.key} {...linkProps}>
                                <div className="ait-roadmap-card-meta">
                                    <span className={levelChip(t.level)}>{t.level}</span>
                                    <span className="ait-chip ait-chip--muted">{t.category}</span>
                                    <span className={`ait-chip ${t.status === "Available" ? "ait-chip--green" : "ait-chip--gray"}`}>{t.status}</span>
                                </div>
                                <h3>{t.title}</h3>
                                <p>{t.blurb}</p>
                                <div className="ait-roadmap-tags">
                                    {t.platforms.map((pf) => (
                                        <span className="ait-chip ait-chip--muted" key={pf}>{pf}</span>
                                    ))}
                                </div>
                                <div className="ait-roadmap-topics">{t.topics.join(" · ")}</div>
                                <div className="ait-roadmap-card-foot">
                                    <span className="ait-roadmap-min">{t.minutes} min</span>
                                    <span className="ait-roadmap-cta">{t.status === "Available" ? "Read the guide →" : "Planned tutorial"}</span>
                                </div>
                            </CardTag>
                        );
                    })}
                </div>
            </section>

            {/* Multilingual starter pilot */}
            <section className="section">
                <div className="ait-section-head">
                    <h2>Available in other languages</h2>
                    <p>A growing multilingual starter library. Read these beginner guides in your language.</p>
                </div>
                <p className="ait-langgroup-label">Prompt Writing Guide</p>
                <div className="ait-langnav">
                    <a className="ait-langnav-link" href={guideUrl("ai-prompt-writing-guide-es")} lang="es">Español</a>
                    <a className="ait-langnav-link" href={guideUrl("ai-prompt-writing-guide-fr")} lang="fr">Français</a>
                    <a className="ait-langnav-link" href={guideUrl("ai-prompt-writing-guide-de")} lang="de">Deutsch</a>
                </div>
                <p className="ait-langgroup-label">AI Research Guide</p>
                <div className="ait-langnav">
                    <a className="ait-langnav-link" href={guideUrl("ai-research-guide-es")} lang="es">Español</a>
                    <a className="ait-langnav-link" href={guideUrl("ai-research-guide-fr")} lang="fr">Français</a>
                    <a className="ait-langnav-link" href={guideUrl("ai-research-guide-de")} lang="de">Deutsch</a>
                </div>
                <p className="ait-langgroup-label">AI Coding Guide</p>
                <div className="ait-langnav">
                    <a className="ait-langnav-link" href={guideUrl("ai-coding-guide-es")} lang="es">Español</a>
                    <a className="ait-langnav-link" href={guideUrl("ai-coding-guide-fr")} lang="fr">Français</a>
                    <a className="ait-langnav-link" href={guideUrl("ai-coding-guide-de")} lang="de">Deutsch</a>
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

            {/* AI for Creators */}
            <section className="section" id="creators">
                <div className="ait-section-head">
                    <h2>AI for Creators</h2>
                    <p>
                        Tutorials for creators building videos, images, ads, voiceovers, music, avatars,
                        brand assets, cinematic scenes, and social content with AI.
                    </p>
                </div>

                {/* Featured first-class creator platform: Higgsfield */}
                {HIGGSFIELD && (
                    <div className="ait-creator-featured" id="higgsfield-tutorials">
                        <div className="ait-creator-featured-head">
                            <div className="ait-creator-featured-intro">
                                <span className="ait-chip ait-chip--gold">Featured creator platform</span>
                                <h3>{HIGGSFIELD.platform}</h3>
                                <p>{HIGGSFIELD.description}</p>
                                <div className="ait-creator-chips">
                                    {HIGGSFIELD.creatorUseCases.map((u) => (
                                        <span className="ait-chip ait-chip--muted" key={u}>{u}</span>
                                    ))}
                                </div>
                            </div>
                            <span className={`ait-chip ${STATUS_CLASS[HIGGSFIELD.status] || "ait-chip--gray"}`}>
                                {HIGGSFIELD.status}
                            </span>
                        </div>
                        <p className="ait-creator-count">
                            {HIGGSFIELD.tutorials.length} planned {HIGGSFIELD.platform} tutorials
                        </p>
                        <div className="ait-creator-tut-grid">
                            {HIGGSFIELD.tutorials.map((t) => (
                                <div className="ait-creator-tut" key={t.title}>
                                    <span className="ait-creator-tut-title">{t.title}</span>
                                    <span className="ait-chip ait-chip--gold">Planned</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Other creator platforms */}
                <div className="ait-creator-grid">
                    {OTHER_CREATORS.map((c) => {
                        const CardTag = c.guide ? "a" : "div";
                        const linkProps = c.guide
                            ? { href: guideUrl(c.guide), onClick: () => trackAiTutorialClick({ sourcePage: "ai-tutorials", tutorialKey: c.guide, tutorialTitle: c.platform }) }
                            : {};
                        return (
                            <CardTag className="ait-creator-card" key={c.id} {...linkProps}>
                                <div className="ait-creator-card-top">
                                    <span className="ait-creator-card-name">{c.platform}</span>
                                    <span className={`ait-chip ${STATUS_CLASS[c.status] || "ait-chip--gray"}`}>{c.status}</span>
                                </div>
                                <p className="ait-creator-card-desc">{c.description}</p>
                                <div className="ait-creator-chips">
                                    {c.creatorUseCases.map((u) => (
                                        <span className="ait-chip ait-chip--muted" key={u}>{u}</span>
                                    ))}
                                </div>
                                <div className="ait-creator-card-foot">
                                    <span className="ait-creator-card-count">
                                        {c.tutorials.length} {c.tutorials.length === 1 ? "tutorial" : "tutorials"}
                                    </span>
                                    <span className="ait-creator-card-cta">{c.guide ? "View tutorials →" : "Coming soon"}</span>
                                </div>
                            </CardTag>
                        );
                    })}
                </div>
            </section>

            {/* Build Real AI Projects */}
            <section className="section" id="projects">
                <div className="ait-section-head">
                    <h2>Build Real AI Projects</h2>
                    <p>
                        Move from tutorials to real builds. Follow beginner, intermediate, and advanced project
                        tracks for websites, creator assets, automation, coding, real estate, and CinNova product systems.
                    </p>
                </div>
                <div className="ait-track-grid">
                    {AI_PROJECT_TRACKS.map((tr) => (
                        <div className="ait-track-card" key={tr.id}>
                            <div className="ait-track-head">
                                <h3>{tr.title}</h3>
                                <div className="ait-track-levels">
                                    {tr.levels.map((lv) => (
                                        <span className={levelChip(lv)} key={lv}>{lv}</span>
                                    ))}
                                </div>
                            </div>
                            <p className="ait-track-desc">{tr.description}</p>
                            <ul className="ait-track-examples">
                                {tr.examples.map((ex) => (
                                    <li key={ex}>{ex}</li>
                                ))}
                            </ul>
                            <span className="ait-track-cta">{tr.cta}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* YouTube Learning Paths */}
            <section className="section" id="youtube-paths">
                <div className="ait-section-head">
                    <h2>YouTube Learning Paths</h2>
                    <p>
                        Curated video learning paths that help you find the best AI tutorials faster — paired with
                        CinNova checklists, prompts, and project steps.
                    </p>
                </div>
                <div className="ait-yt-flow" aria-hidden="true">
                    <span className="ait-chip ait-chip--muted">Watch</span>
                    <span className="ait-yt-arrow">→</span>
                    <span className="ait-chip ait-chip--muted">Do</span>
                    <span className="ait-yt-arrow">→</span>
                    <span className="ait-chip ait-chip--muted">Build</span>
                </div>
                <p className="ait-yt-note">
                    CinNova curates, credits, and organizes the best videos — we never copy creators' tutorials —
                    and adds our own checklists, prompts, and project steps.
                </p>
                <div className="ait-yt-grid">
                    {YOUTUBE_LEARNING_PATHS.map((y) => (
                        <div className="ait-yt-card" key={y.id}>
                            <span className="ait-yt-title">{y.title}</span>
                            <span className="ait-chip ait-chip--gray">{y.status}</span>
                        </div>
                    ))}
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
