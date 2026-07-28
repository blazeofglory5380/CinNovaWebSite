/**
 * Shared story card compositions for the News Center.
 *
 * Three deliberately different shapes so coverage sections do not all repeat
 * the same card:
 *   - NewsLeadCard      wide hero card that opens a section
 *   - NewsCompactCard   image + dek card used in grids and the latest feed
 *   - NewsHeadlineItem  text-only row for headline lists
 *
 * All three render a real <a href="/news/<slug>"> so the links are crawlable
 * and open in a new tab / can be copied, while the SPA intercepts the click.
 */

import {
    formatNewsDateShort,
    getCoverageLabel,
    getNewsStoryPath,
    toNewsDateTimeAttr,
    NEWS_STATUS_LABELS,
} from "../../data/newsPosts.js";

export function NewsCoverageBadge({ coverageLevel }) {
    return (
        <span className={`news-badge news-badge--${coverageLevel}`}>
            {getCoverageLabel(coverageLevel)}
        </span>
    );
}

export function NewsStatusChip({ status }) {
    const label = NEWS_STATUS_LABELS[status];
    if (!label) return null;
    return <span className={`news-status news-status--${status}`}>{label}</span>;
}

export function NewsDemoChip({ story }) {
    if (!story.isDemo) return null;
    return (
        <span className="news-demo-chip" title={story.demoNotice}>
            Demo fixture
        </span>
    );
}

/** Timestamp + optional location line. */
export function NewsCardMeta({ story, showLocation = true }) {
    const published = toNewsDateTimeAttr(story.publishedAt);
    const updated = toNewsDateTimeAttr(story.updatedAt);
    return (
        <p className="news-card-meta">
            {published && (
                <time dateTime={published}>{formatNewsDateShort(story.publishedAt)}</time>
            )}
            {updated && (
                <>
                    <span aria-hidden="true">·</span>
                    <time dateTime={updated}>Updated {formatNewsDateShort(story.updatedAt)}</time>
                </>
            )}
            {showLocation && story.location && (
                <>
                    <span aria-hidden="true">·</span>
                    <span className="news-card-location">{story.location}</span>
                </>
            )}
        </p>
    );
}

function buildStoryLinkProps(story, onOpenStory, surface) {
    return {
        href: getNewsStoryPath(story),
        onClick: (event) => {
            // Let modified clicks fall through to the browser (new tab, etc.).
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) return;
            event.preventDefault();
            onOpenStory?.(story, surface);
        },
    };
}

export function NewsLeadCard({ story, onOpenStory, surface = "lead" }) {
    const link = buildStoryLinkProps(story, onOpenStory, surface);
    return (
        <article className="news-story-card news-story-card--lead">
            <a className="news-card-media" {...link} tabIndex={-1} aria-hidden="true">
                <img src={story.heroImage} alt={story.heroAlt} loading="lazy" decoding="async" />
            </a>
            <div className="news-card-body">
                <div className="news-card-flags">
                    <NewsCoverageBadge coverageLevel={story.coverageLevel} />
                    <span className="news-card-category">{story.category}</span>
                    <NewsStatusChip status={story.status} />
                    <NewsDemoChip story={story} />
                </div>
                <h3>
                    <a {...link}>{story.title}</a>
                </h3>
                <p className="news-card-dek">{story.dek}</p>
                <NewsCardMeta story={story} />
                <a className="news-card-link" {...link}>
                    Read story
                    <span aria-hidden="true"> →</span>
                    <span className="news-sr-only">: {story.title}</span>
                </a>
            </div>
        </article>
    );
}

export function NewsCompactCard({ story, onOpenStory, surface = "compact" }) {
    const link = buildStoryLinkProps(story, onOpenStory, surface);
    return (
        <article className="news-story-card news-story-card--compact">
            <a className="news-card-media" {...link} tabIndex={-1} aria-hidden="true">
                <img src={story.heroImage} alt={story.heroAlt} loading="lazy" decoding="async" />
            </a>
            <div className="news-card-body">
                <div className="news-card-flags">
                    <NewsCoverageBadge coverageLevel={story.coverageLevel} />
                    <span className="news-card-category">{story.category}</span>
                    <NewsStatusChip status={story.status} />
                    <NewsDemoChip story={story} />
                </div>
                <h3>
                    <a {...link}>{story.title}</a>
                </h3>
                <p className="news-card-dek">{story.dek}</p>
                <NewsCardMeta story={story} />
                <a className="news-card-link" {...link}>
                    Read story
                    <span aria-hidden="true"> →</span>
                    <span className="news-sr-only">: {story.title}</span>
                </a>
            </div>
        </article>
    );
}

export function NewsHeadlineItem({ story, onOpenStory, surface = "headline-list" }) {
    const link = buildStoryLinkProps(story, onOpenStory, surface);
    return (
        <li className="news-headline-item">
            <div className="news-card-flags">
                <NewsCoverageBadge coverageLevel={story.coverageLevel} />
                <span className="news-card-category">{story.category}</span>
                <NewsStatusChip status={story.status} />
                <NewsDemoChip story={story} />
            </div>
            <h3>
                <a {...link}>{story.title}</a>
            </h3>
            <NewsCardMeta story={story} />
        </li>
    );
}
