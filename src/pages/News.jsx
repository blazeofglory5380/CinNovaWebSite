import { useEffect, useMemo, useState } from "react";
import SEO from "../components/SEO.jsx";
import { siteUrl } from "../data/seoConfig.js";
import {
    NEWS_COVERAGE_LEVELS,
    getLatestNewsStories,
    getNewsIndexUrl,
    getNewsStoriesByCoverage,
    getNewsStoryUrl,
    getPublishedNewsStories,
    hasDemoNewsFixtures,
} from "../data/newsPosts.js";
import {
    NewsCompactCard,
    NewsHeadlineItem,
    NewsLeadCard,
} from "../components/news/NewsCards.jsx";
import {
    trackNewsFilterChange,
    trackNewsNewsletterClick,
    trackNewsPageView,
    trackNewsStoryClick,
} from "../utils/analytics.js";
import "./News.css";

const newsDesks = [
    {
        key: "local",
        label: "Local",
        kicker: "Your community",
        title: "The decisions and stories closest to home",
        description:
            "Community updates, schools, small businesses, public services, and the people shaping the places where we live.",
        topics: ["Community", "Education", "Small business"],
    },
    {
        key: "state",
        label: "State",
        kicker: "Across the state",
        title: "Policy, progress, and statewide impact",
        description:
            "Clear reporting on state government, the economy, infrastructure, education, and issues affecting communities statewide.",
        topics: ["Government", "Economy", "Public services"],
    },
    {
        key: "national",
        label: "National",
        kicker: "Across the country",
        title: "The national stories that shape everyday life",
        description:
            "Essential coverage of U.S. policy, business, technology, culture, and major developments with practical context.",
        topics: ["U.S. policy", "Business", "Technology"],
    },
    {
        key: "international",
        label: "International",
        kicker: "Around the world",
        title: "Global events, explained with perspective",
        description:
            "International developments across geopolitics, markets, science, climate, and culture—connected back to why they matter.",
        topics: ["World affairs", "Global markets", "Science & climate"],
    },
];

const LATEST_LIMIT = 6;

/* Each coverage section renders a different composition so the page does not
   repeat one card shape four times. */
const sectionLayouts = {
    local: "lead-list",
    state: "compact-grid",
    national: "lead-compact",
    international: "headline-list",
};

function CoverageSection({ level, stories, onOpenStory, onViewAll }) {
    if (!stories.length) return null;

    const layout = sectionLayouts[level.key] || "compact-grid";
    const headingId = `news-coverage-${level.key}-title`;
    const [lead, ...rest] = stories;

    return (
        <section
            className={`news-coverage-section news-coverage-section--${level.key}`}
            id={`news-coverage-${level.key}`}
            aria-labelledby={headingId}
        >
            <div className="news-coverage-heading">
                <div>
                    <span className="news-eyebrow">{level.kicker.toUpperCase()}</span>
                    <h3 id={headingId}>{level.label}</h3>
                    <p>{level.blurb}</p>
                </div>
                <button
                    type="button"
                    className="news-view-all"
                    onClick={() => onViewAll(level.key)}
                >
                    View all {level.label}
                    <span aria-hidden="true"> →</span>
                </button>
            </div>

            {layout === "lead-list" && (
                <div className="news-layout-lead-list">
                    <NewsLeadCard
                        story={lead}
                        onOpenStory={onOpenStory}
                        surface={`coverage-${level.key}-lead`}
                    />
                    <ul className="news-headline-list">
                        {rest.map((story) => (
                            <NewsHeadlineItem
                                key={story.id}
                                story={story}
                                onOpenStory={onOpenStory}
                                surface={`coverage-${level.key}-headline`}
                            />
                        ))}
                    </ul>
                </div>
            )}

            {layout === "compact-grid" && (
                <div className="news-layout-grid">
                    {stories.map((story) => (
                        <NewsCompactCard
                            key={story.id}
                            story={story}
                            onOpenStory={onOpenStory}
                            surface={`coverage-${level.key}-compact`}
                        />
                    ))}
                </div>
            )}

            {layout === "lead-compact" && (
                <div className="news-layout-lead-compact">
                    <NewsLeadCard
                        story={lead}
                        onOpenStory={onOpenStory}
                        surface={`coverage-${level.key}-lead`}
                    />
                    <div className="news-layout-grid news-layout-grid--stacked">
                        {rest.slice(0, 2).map((story) => (
                            <NewsCompactCard
                                key={story.id}
                                story={story}
                                onOpenStory={onOpenStory}
                                surface={`coverage-${level.key}-compact`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {layout === "headline-list" && (
                <ul className="news-headline-list news-headline-list--wide">
                    {stories.map((story) => (
                        <NewsHeadlineItem
                            key={story.id}
                            story={story}
                            onOpenStory={onOpenStory}
                            surface={`coverage-${level.key}-headline`}
                        />
                    ))}
                </ul>
            )}
        </section>
    );
}

function News({ onNavigate, onOpenStory, initialCoverage = "all" }) {
    // `initialCoverage` lets a story breadcrumb return to its own coverage level.
    const [activeDesk, setActiveDesk] = useState(initialCoverage);

    const allStories = useMemo(() => getPublishedNewsStories(), []);
    const isDemoFeed = useMemo(() => hasDemoNewsFixtures(), []);

    const latestStories = useMemo(
        () => getLatestNewsStories({ coverageLevel: activeDesk, limit: LATEST_LIMIT }),
        [activeDesk],
    );

    const visibleDesks = activeDesk === "all"
        ? newsDesks
        : newsDesks.filter((desk) => desk.key === activeDesk);

    const visibleCoverageLevels = activeDesk === "all"
        ? NEWS_COVERAGE_LEVELS
        : NEWS_COVERAGE_LEVELS.filter((level) => level.key === activeDesk);

    const newsSchema = useMemo(
        () => ({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Cin Nova News",
            description:
                "Cin Nova News brings together local, state, national, and international coverage with useful context and a clear point of view.",
            url: getNewsIndexUrl(),
            publisher: { "@type": "Organization", name: "Cin Nova", url: siteUrl },
            about: newsDesks.map((desk) => desk.label),
            hasPart: allStories
                .filter((story) => !story.isDemo)
                .map((story) => ({
                    "@type": "NewsArticle",
                    headline: story.title,
                    url: getNewsStoryUrl(story),
                })),
        }),
        [allStories],
    );

    useEffect(() => {
        trackNewsPageView({ storyCount: allStories.length, isDemoFeed });
    }, [allStories.length, isDemoFeed]);

    function selectDesk(nextDesk, source) {
        setActiveDesk(nextDesk);
        trackNewsFilterChange({
            coverageLevel: nextDesk,
            source,
            resultCount: getLatestNewsStories({ coverageLevel: nextDesk }).length,
        });
    }

    function handleViewAll(coverageKey) {
        selectDesk(coverageKey, "section_view_all");
        document.getElementById("news-latest")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function handleOpenStory(story, surface) {
        trackNewsStoryClick(story, { surface });
        onOpenStory?.(story);
    }

    function handleNewsletterClick(location) {
        trackNewsNewsletterClick({ location });
        onNavigate?.("newsletter");
    }

    return (
        <main className="news-page">
            <SEO
                title="News: Local, State, National & International | Cin Nova"
                description="Follow Cin Nova News for clear local, state, national, and international coverage, organized so you can quickly find the stories that matter to you."
                url={getNewsIndexUrl()}
                type="website"
                schema={newsSchema}
            />

            <section className="news-hero" aria-labelledby="news-title">
                <div className="news-shell news-hero-grid">
                    <div>
                        <span className="news-eyebrow">CIN NOVA NEWS</span>
                        <h1 id="news-title">Your world, from the block to the globe.</h1>
                        <p>
                            A clear view of the stories shaping daily life—organized across local,
                            state, national, and international coverage.
                        </p>
                        <div className="news-hero-actions">
                            <a className="news-primary-button" href="#news-desks">Explore coverage</a>
                            <button type="button" className="news-secondary-button" onClick={() => handleNewsletterClick("news_hero")}>
                                Get news updates
                            </button>
                        </div>
                    </div>

                    <div className="news-hero-panel" aria-label="Cin Nova news coverage areas">
                        <span className="news-panel-label">FOUR LEVELS OF COVERAGE</span>
                        {newsDesks.map((desk, index) => (
                            <div className="news-panel-row" key={desk.key}>
                                <span className="news-panel-number">0{index + 1}</span>
                                <div>
                                    <strong>{desk.label}</strong>
                                    <small>{desk.kicker}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="news-section" id="news-desks" aria-labelledby="news-desks-title">
                <div className="news-shell">
                    <div className="news-section-heading">
                        <div>
                            <span className="news-eyebrow">NEWS DESKS</span>
                            <h2 id="news-desks-title">Choose the view that matters to you</h2>
                        </div>
                        <p>Move from neighborhood context to worldwide perspective without losing the thread.</p>
                    </div>

                    <div className="news-filters" aria-label="Filter news desks">
                        <button
                            type="button"
                            className={activeDesk === "all" ? "is-active" : ""}
                            aria-pressed={activeDesk === "all"}
                            onClick={() => selectDesk("all", "filter_pills")}
                        >
                            All coverage
                        </button>
                        {newsDesks.map((desk) => (
                            <button
                                type="button"
                                key={desk.key}
                                className={activeDesk === desk.key ? "is-active" : ""}
                                aria-pressed={activeDesk === desk.key}
                                onClick={() => selectDesk(desk.key, "filter_pills")}
                            >
                                {desk.label}
                            </button>
                        ))}
                    </div>

                    <div className={`news-desk-grid${visibleDesks.length === 1 ? " is-filtered" : ""}`}>
                        {visibleDesks.map((desk) => (
                            <article className={`news-desk-card news-desk-card--${desk.key}`} key={desk.key}>
                                <div className="news-desk-topline">
                                    <span>{desk.kicker}</span>
                                    <span aria-hidden="true">0{newsDesks.findIndex((item) => item.key === desk.key) + 1}</span>
                                </div>
                                <h3>{desk.title}</h3>
                                <p>{desk.description}</p>
                                <ul aria-label={`${desk.label} coverage topics`}>
                                    {desk.topics.map((topic) => <li key={topic}>{topic}</li>)}
                                </ul>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Story feed ─────────────────────────────────────────────── */}
            <section className="news-section news-section--feed" id="news-latest" aria-labelledby="news-latest-title">
                <div className="news-shell">
                    <div className="news-section-heading">
                        <div>
                            <span className="news-eyebrow">LATEST NEWS</span>
                            <h2 id="news-latest-title">The newest stories across every level</h2>
                        </div>
                        <p>
                            The feed follows the coverage filter above. Every story links to its full
                            report, sources, and related coverage.
                        </p>
                    </div>

                    {isDemoFeed && (
                        <p className="news-demo-banner" role="note">
                            <strong>Mixed feed.</strong> Stories without a badge are real, sourced
                            reporting. Entries marked <em>Demo fixture</em> are layout scaffolding
                            left in place while the desks ramp up: they describe how each desk will
                            operate rather than reporting an event, and they are excluded from search
                            indexing and the sitemap.
                        </p>
                    )}

                    <p className="news-feed-status" aria-live="polite">
                        {activeDesk === "all"
                            ? `Showing the ${latestStories.length} most recent stories across all coverage levels.`
                            : `Showing ${latestStories.length} ${newsDesks.find((desk) => desk.key === activeDesk)?.label} ${latestStories.length === 1 ? "story" : "stories"}.`}
                    </p>

                    {latestStories.length ? (
                        <div className="news-layout-grid news-layout-grid--latest">
                            {latestStories.map((story) => (
                                <NewsCompactCard
                                    key={story.id}
                                    story={story}
                                    onOpenStory={handleOpenStory}
                                    surface="latest-news"
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="news-empty">
                            No stories have been published at this coverage level yet.
                        </p>
                    )}
                </div>
            </section>

            {/* ── Coverage-specific sections ─────────────────────────────── */}
            <section className="news-section news-section--coverage" aria-labelledby="news-coverage-title">
                <div className="news-shell">
                    <div className="news-section-heading">
                        <div>
                            <span className="news-eyebrow">BY COVERAGE LEVEL</span>
                            <h2 id="news-coverage-title">Local to international, in one place</h2>
                        </div>
                        <p>Each desk keeps its own recent file, so you can go straight to the layer you care about.</p>
                    </div>

                    <div className="news-coverage-stack">
                        {visibleCoverageLevels.map((level) => (
                            <CoverageSection
                                key={level.key}
                                level={level}
                                stories={getNewsStoriesByCoverage(level.key, 4)}
                                onOpenStory={handleOpenStory}
                                onViewAll={handleViewAll}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="news-principles" aria-labelledby="news-principles-title">
                <div className="news-shell news-principles-grid">
                    <div>
                        <span className="news-eyebrow">OUR APPROACH</span>
                        <h2 id="news-principles-title">Useful context. Human impact. No noise.</h2>
                    </div>
                    <div className="news-principle-list">
                        <div><strong>Clear</strong><span>Direct reporting and plain-language context.</span></div>
                        <div><strong>Relevant</strong><span>A focus on what changes decisions and daily life.</span></div>
                        <div><strong>Connected</strong><span>Local consequences and global forces in one view.</span></div>
                    </div>
                </div>
            </section>

            <section className="news-cta" aria-labelledby="news-cta-title">
                <div className="news-shell news-cta-card">
                    <div>
                        <span className="news-eyebrow">STAY INFORMED</span>
                        <h2 id="news-cta-title">The signal, delivered.</h2>
                        <p>Get the most important Cin Nova stories and perspectives in your inbox.</p>
                    </div>
                    <button type="button" className="news-primary-button" onClick={() => handleNewsletterClick("news_footer_cta")}>
                        Join the newsletter
                    </button>
                </div>
            </section>
        </main>
    );
}

export default News;
