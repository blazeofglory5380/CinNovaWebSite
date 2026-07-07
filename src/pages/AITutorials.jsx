// AITutorials — /?page=ai-tutorials   (hub)   CSS prefix: ait-
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

export default function AITutorials() {
    return (
        <div className="product-page ait-page">
            <SEO
                title="AI Tutorials | Step-by-Step Guides for ChatGPT, Claude, Gemini & More"
                description="Learn how to use AI tools with step-by-step tutorials for prompting, research, coding, productivity, design, video, business automation, and responsible AI use."
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
                    <a className="primary-btn" href={guideUrl(AI_TUTORIALS[0].key)}>Start Learning AI</a>
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

            {/* Popular AI Tools (quick pointer to companies section) */}
            <section className="section">
                <div className="ait-section-head">
                    <h2>Popular AI tools</h2>
                    <p>
                        There's no single "best" AI tool — the right one depends on your task. General
                        assistants like ChatGPT, Claude, and Gemini cover most everyday needs, while
                        specialized tools handle images, video, voice, and code.
                        <a href="#companies"> See the tools we cover →</a>
                    </p>
                </div>
            </section>

            {/* Step-by-step guides */}
            <section className="section">
                <div className="ait-section-head">
                    <h2>Step-by-step beginner guides</h2>
                    <p>Real, thorough walkthroughs you can follow start to finish.</p>
                </div>
                <div className="ait-guide-grid">
                    {AI_TUTORIALS.map((t) => (
                        <a className="ait-guide-card" href={guideUrl(t.key)} key={t.key}
                            onClick={() => trackAiTutorialClick({ sourcePage: "ai-tutorials", tutorialKey: t.key, tutorialTitle: t.title })}>
                            <div className="ait-guide-card-meta">
                                <span className="ait-chip">{t.level}</span>
                                <span className="ait-chip ait-chip--muted">{t.minutes} min</span>
                            </div>
                            <h3>{t.title}</h3>
                            <p>{t.blurb}</p>
                            <span className="ait-guide-card-go">Read the guide →</span>
                        </a>
                    ))}
                </div>
            </section>

            {/* Beginner guides by AI tool */}
            <section className="section">
                <div className="ait-section-head">
                    <h2>Beginner guides by AI tool</h2>
                    <p>Step-by-step walkthroughs for the most popular AI assistants.</p>
                </div>
                <div className="ait-guide-grid">
                    {AI_TOOL_TUTORIALS.map((t) => (
                        <a className="ait-guide-card" href={guideUrl(t.key)} key={t.key}
                            onClick={() => trackAiTutorialClick({ sourcePage: "ai-tutorials", tutorialKey: t.key, tutorialTitle: t.title })}>
                            <div className="ait-guide-card-meta">
                                <span className="ait-chip">{t.level}</span>
                                <span className="ait-chip ait-chip--muted">{t.minutes} min</span>
                            </div>
                            <h3>{t.title}</h3>
                            <p>{t.blurb}</p>
                            <span className="ait-guide-card-go">Read the guide →</span>
                        </a>
                    ))}
                </div>
            </section>

            {/* Claude Workflow Guides */}
            <section className="section">
                <div className="ait-section-head">
                    <h2>Claude Workflow Guides</h2>
                    <p>Practical ways to use Claude alongside your creative, website, art, and marketing work.</p>
                </div>
                <div className="ait-guide-grid">
                    {CLAUDE_WORKFLOW_GUIDES.map((t) => (
                        <a className="ait-guide-card" href={guideUrl(t.key)} key={t.key}
                            onClick={() => trackAiTutorialClick({ sourcePage: "ai-tutorials", tutorialKey: t.key, tutorialTitle: t.title })}>
                            <div className="ait-guide-card-meta">
                                <span className="ait-chip">{t.level}</span>
                                <span className="ait-chip ait-chip--muted">{t.minutes} min</span>
                            </div>
                            <h3>{t.title}</h3>
                            <p>{t.blurb}</p>
                            <span className="ait-guide-card-go">Read the guide →</span>
                        </a>
                    ))}
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
                    business automation are all in progress. Start with the three guides above.
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
