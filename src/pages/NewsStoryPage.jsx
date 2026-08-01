import { useEffect, useMemo } from "react";
import SEO from "../components/SEO.jsx";
import {
    NEWS_SOURCE_TYPES,
    NEWS_STATUS_LABELS,
    buildNewsArticleSchema,
    formatNewsDate,
    getCoverageLabel,
    getNewsAuthor,
    getNewsStoryMetadata,
    getRelatedNewsStories,
    toNewsDateTimeAttr,
} from "../data/newsPosts.js";
import { NewsCompactCard } from "../components/news/NewsCards.jsx";
import { getPostBySlug } from "../data/blogPosts.js";
import {
    trackNewsNewsletterClick,
    trackNewsStoryClick,
    trackNewsStoryView,
    trackRelatedNewsClick,
} from "../utils/analytics.js";
import RecommendationRail from "../components/recommendations/RecommendationRail.jsx";
import "./News.css";

function SourceList({ sources = [] }) {
    if (!sources.length) return null;

    // Only explain the categories actually present, so the legend never implies
    // a story contains unverified claims when it does not.
    const presentTypes = [...new Set(sources.map((source) => source.type))]
        .map((type) => NEWS_SOURCE_TYPES[type])
        .filter(Boolean);

    return (
        <section className="news-story-sources" aria-labelledby="news-story-sources-title">
            <h2 id="news-story-sources-title">Sources</h2>
            <p className="news-story-sources-intro">
                Every source is labeled so you can tell a confirmed fact from an unresolved claim.
            </p>

            <ul className="news-source-list">
                {sources.map((source) => {
                    const type = NEWS_SOURCE_TYPES[source.type] || NEWS_SOURCE_TYPES.claim;
                    return (
                        <li key={`${source.url}-${source.label}`} className={`news-source news-source--${type.key}`}>
                            <span className={`news-source-tag news-source-tag--${type.key}`}>
                                {type.label}
                            </span>
                            <div>
                                <a href={source.url} rel="noopener noreferrer nofollow" target="_blank">
                                    {source.label}
                                </a>
                                {source.publisher && (
                                    <span className="news-source-publisher">{source.publisher}</span>
                                )}
                                {source.note && <p className="news-source-note">{source.note}</p>}
                            </div>
                        </li>
                    );
                })}
            </ul>

            <dl className="news-source-legend">
                {presentTypes.map((type) => (
                    <div key={type.key}>
                        <dt>{type.label}</dt>
                        <dd>{type.description}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}

function NewsStoryPage({
    story,
    previewMode = false,
    onNavigate,
    onGoHome,
    onGoNews,
    onOpenStory,
    onOpenArticle,
}) {
    const isPreview = Boolean(previewMode || story?.isDraft || story?.isPublished === false);
    const metadata = useMemo(() => {
        const base = getNewsStoryMetadata(story);
        if (!isPreview) return base;
        return {
            ...base,
            noindex: true,
            // Keep editors from confusing draft previews with the public canonical.
            canonical: `${base.canonical}?preview=1`,
        };
    }, [story, isPreview]);
    // Related news resolves only against the public catalog (drafts are never related targets).
    const relatedStories = useMemo(() => getRelatedNewsStories(story), [story]);
    const relatedArticles = useMemo(
        () => (story.relatedBlogSlugs || []).map((slug) => getPostBySlug(slug)).filter(Boolean),
        [story],
    );
    const schema = useMemo(
        () => buildNewsArticleSchema(story, relatedStories),
        [story, relatedStories],
    );

    const author = getNewsAuthor(story.author);
    const coverageLabel = getCoverageLabel(story.coverageLevel);
    const statusLabel = NEWS_STATUS_LABELS[story.status];
    const publishedIso = toNewsDateTimeAttr(story.publishedAt);
    const updatedIso = toNewsDateTimeAttr(story.updatedAt);

    useEffect(() => {
        if (isPreview) return;
        trackNewsStoryView(story);
    }, [story, isPreview]);

    function handleRelatedStory(related, surface) {
        trackNewsStoryClick(related, { surface });
        trackRelatedNewsClick({ fromSlug: story.slug, toSlug: related.slug, type: "news" });
        onOpenStory?.(related);
    }

    function handleRelatedArticle(event, post) {
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;
        event.preventDefault();
        trackRelatedNewsClick({ fromSlug: story.slug, toSlug: post.slug, type: "blog" });
        onOpenArticle?.(post);
    }

    return (
        <main className="news-page news-story-page">
            <SEO
                title={metadata.title}
                description={metadata.description}
                url={metadata.canonical}
                type="article"
                image={metadata.image}
                schema={schema}
                noindex={metadata.noindex}
            />

            <article className="news-story">
                <header className="news-story-header">
                    <div className="news-shell">
                        <nav className="news-breadcrumb" aria-label="Breadcrumb">
                            <ol>
                                <li>
                                    <a
                                        href="/"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            onGoHome?.();
                                        }}
                                    >
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/news"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            onGoNews?.();
                                        }}
                                    >
                                        News
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/news"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            onGoNews?.(story.coverageLevel);
                                        }}
                                    >
                                        {coverageLabel}
                                    </a>
                                </li>
                                <li aria-current="page">{story.title}</li>
                            </ol>
                        </nav>

                        <div className="news-card-flags news-story-flags">
                            <span className={`news-badge news-badge--${story.coverageLevel}`}>
                                {coverageLabel}
                            </span>
                            <span className="news-card-category">{story.category}</span>
                            {story.location && (
                                <span className="news-card-location">{story.location}</span>
                            )}
                            {statusLabel && (
                                <span className={`news-status news-status--${story.status}`}>
                                    {statusLabel}
                                </span>
                            )}
                            {story.isDemo && (
                                <span className="news-demo-chip">Demo fixture</span>
                            )}
                        </div>

                        <h1>{story.title}</h1>
                        <p className="news-story-dek">{story.dek}</p>

                        <div className="news-story-byline">
                            <span className="news-story-avatar" aria-hidden="true">
                                {author.initials}
                            </span>
                            <div>
                                <strong>{author.name}</strong>
                                <span>{author.role}</span>
                            </div>
                            <p className="news-story-timestamps">
                                {publishedIso && (
                                    <time dateTime={publishedIso}>
                                        Published {formatNewsDate(story.publishedAt)}
                                    </time>
                                )}
                                {updatedIso && (
                                    <time dateTime={updatedIso}>
                                        Updated {formatNewsDate(story.updatedAt)}
                                    </time>
                                )}
                            </p>
                        </div>

                        {isPreview && (
                            <p className="news-demo-banner" role="note">
                                <strong>Editorial draft preview.</strong> This story is not public,
                                not in the sitemap, and is marked <code>noindex</code>. Available
                                only in local Vite development via{" "}
                                <code>?page=news-preview&amp;slug=…</code>.
                            </p>
                        )}

                        {story.isDemo && (
                            <p className="news-demo-banner" role="note">
                                <strong>Demo fixture.</strong> {story.demoNotice} It is excluded from
                                the sitemap and marked <code>noindex</code>.
                            </p>
                        )}
                    </div>
                </header>

                {story.heroImage && (
                    <figure className="news-story-hero">
                        <img
                            src={story.heroImage}
                            alt={story.heroAlt}
                            width="1600"
                            height="900"
                            decoding="async"
                        />
                        <figcaption>{story.heroCaption || story.heroAlt}</figcaption>
                    </figure>
                )}

                <div className="news-shell news-story-body">
                    <section className="news-story-summary" aria-labelledby="news-story-summary-title">
                        <h2 id="news-story-summary-title">Summary</h2>
                        <p>{story.summary}</p>
                    </section>

                    {story.whyItMatters && (
                        <section className="news-story-matters" aria-labelledby="news-story-matters-title">
                            <h2 id="news-story-matters-title">Why it matters</h2>
                            <p>{story.whyItMatters}</p>
                        </section>
                    )}

                    {(story.sections || []).map((section) => {
                        const claim = section.claimType ? NEWS_SOURCE_TYPES[section.claimType] : null;
                        return (
                            <section
                                key={section.id}
                                className="news-story-section"
                                aria-labelledby={`news-section-${section.id}`}
                            >
                                <h2 id={`news-section-${section.id}`}>{section.heading}</h2>
                                {claim && (
                                    <p className={`news-claim-label news-claim-label--${claim.key}`}>
                                        <span>{claim.label}</span>
                                        {claim.description}
                                    </p>
                                )}
                                {section.body.map((paragraph, index) => (
                                    <p key={`${section.id}-p${index}`}>{paragraph}</p>
                                ))}
                            </section>
                        );
                    })}

                    <SourceList sources={story.sources} />

                    {relatedStories.length > 0 && (
                        <section className="news-story-related" aria-labelledby="news-story-related-title">
                            <h2 id="news-story-related-title">Related news</h2>
                            <div className="news-layout-grid news-layout-grid--related">
                                {relatedStories.map((related) => (
                                    <NewsCompactCard
                                        key={related.id}
                                        story={related}
                                        onOpenStory={handleRelatedStory}
                                        surface="story-related-news"
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {relatedArticles.length > 0 && (
                        <section className="news-story-related-blog" aria-labelledby="news-story-blog-title">
                            <h2 id="news-story-blog-title">Related from the Cin Nova blog</h2>
                            <ul className="news-related-blog-list">
                                {relatedArticles.map((post) => (
                                    <li key={post.slug}>
                                        <a
                                            href={`/blog/${post.slug}`}
                                            onClick={(event) => handleRelatedArticle(event, post)}
                                        >
                                            <span>{post.category}</span>
                                            <strong>{post.title}</strong>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </article>

            <RecommendationRail
                pageType="news-story"
                route={`/news/${story.slug}`}
                title={story.title}
                category={story.category || ""}
                dek={story.dek || ""}
                summary={story.summary || ""}
                relatedNewsIds={story.relatedNewsIds || []}
                relatedBlogSlugs={story.relatedBlogSlugs || []}
                newsId={story.id}
                newsSlug={story.slug}
                heading="Recommended next"
                className="recommendation-rail--on-dark news-shell"
            />

            <section className="news-cta" aria-labelledby="news-story-cta-title">
                <div className="news-shell news-cta-card">
                    <div>
                        <span className="news-eyebrow">STAY INFORMED</span>
                        <h2 id="news-story-cta-title">The signal, delivered.</h2>
                        <p>Get the most important Cin Nova stories and perspectives in your inbox.</p>
                    </div>
                    <button
                        type="button"
                        className="news-primary-button"
                        onClick={() => {
                            trackNewsNewsletterClick({
                                location: "news_story",
                                storySlug: story.slug,
                            });
                            onNavigate?.("newsletter");
                        }}
                    >
                        Join the newsletter
                    </button>
                </div>
            </section>
        </main>
    );
}

export default NewsStoryPage;
