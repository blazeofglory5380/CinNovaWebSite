import { useEffect, useId, useMemo, useRef } from "react";
import {
    RECOMMENDATION_TYPE_LABELS,
    buildRecommendationContext,
    getRecommendationsForPage,
} from "../../data/recommendations/index.js";
import {
    trackRecommendationClick,
    trackRecommendationImpression,
} from "../../utils/analytics.js";
import "./RecommendationRail.css";

function typeLabel(type) {
    return RECOMMENDATION_TYPE_LABELS[type] || type;
}

/**
 * Editorial-safe recommendation rail.
 * Renders internal + official reference links only (no commercial slot).
 */
function RecommendationRail({
    pageType = "home",
    route = "/",
    title = "",
    category = "",
    tags = [],
    seoKeywords = [],
    excerpt = "",
    dek = "",
    summary = "",
    topics = [],
    relatedNewsIds = [],
    relatedBlogSlugs = [],
    relatedReading = [],
    newsId = null,
    newsSlug = null,
    blogSlug = null,
    resourceSlug = null,
    guideKey = null,
    productPage = null,
    bookSlug = null,
    onNavigate = null,
    heading = "Recommended for you",
    className = "",
}) {
    const headingId = useId();
    const impressedRef = useRef(false);

    const context = useMemo(
        () =>
            buildRecommendationContext({
                pageType,
                route,
                title,
                category,
                tags,
                seoKeywords,
                excerpt,
                dek,
                summary,
                topics,
                relatedNewsIds,
                relatedBlogSlugs,
                relatedReading,
                newsId,
                newsSlug,
                blogSlug,
                resourceSlug,
                guideKey,
                productPage,
                bookSlug,
            }),
        [
            pageType,
            route,
            title,
            category,
            tags,
            seoKeywords,
            excerpt,
            dek,
            summary,
            topics,
            relatedNewsIds,
            relatedBlogSlugs,
            relatedReading,
            newsId,
            newsSlug,
            blogSlug,
            resourceSlug,
            guideKey,
            productPage,
            bookSlug,
        ],
    );

    const result = useMemo(() => getRecommendationsForPage(context), [context]);
    const items = useMemo(() => result.items || [], [result.items]);

    useEffect(() => {
        if (!result.enabled || !items.length || impressedRef.current) return;
        impressedRef.current = true;
        items.forEach((item) => {
            trackRecommendationImpression({
                recommendationType: item.type,
                recommendationPosition: item.position,
                recommendationCategory: item.category,
                pageType,
                itemId: item.id,
            });
        });
    }, [items, pageType, result.enabled]);

    if (!result.enabled || items.length === 0) return null;

    function handleActivate(event, item) {
        trackRecommendationClick({
            recommendationType: item.type,
            recommendationPosition: item.position,
            recommendationCategory: item.category,
            pageType,
            itemId: item.id,
        });

        if (item.external) {
            // Let the browser open the official site (new tab via rel/target).
            return;
        }

        event.preventDefault();
        if (typeof onNavigate === "function") {
            onNavigate(item.href, item);
            return;
        }

        // Default SPA navigation: push URL and reuse App popstate routing.
        if (typeof window !== "undefined") {
            window.history.pushState({}, "", item.href);
            window.dispatchEvent(new PopStateEvent("popstate"));
            window.scrollTo(0, 0);
        }
    }

    return (
        <section
            className={`recommendation-rail ${className}`.trim()}
            aria-labelledby={headingId}
            data-recommendation-engine="11.4c"
            data-commercial-slot="off"
        >
            <div className="recommendation-rail-header">
                <p className="recommendation-rail-eyebrow">Explore next</p>
                <h2 id={headingId}>{heading}</h2>
                <p className="recommendation-rail-note">
                    Editorial recommendations only. No ads, affiliate links, or commercial offers
                    in this module.
                </p>
            </div>

            <ul className="recommendation-rail-list" role="list">
                {items.map((item) => {
                    const label = `${typeLabel(item.type)}: ${item.title}`;
                    const rel = item.external
                        ? "noopener noreferrer"
                        : undefined;
                    const target = item.external ? "_blank" : undefined;
                    return (
                        <li key={`${item.type}:${item.id}`} className="recommendation-rail-item">
                            <a
                                className="recommendation-rail-card"
                                href={item.href}
                                rel={rel}
                                target={target}
                                aria-label={label}
                                data-recommendation-type={item.type}
                                data-recommendation-position={item.position}
                                onClick={(event) => handleActivate(event, item)}
                            >
                                <span className="recommendation-rail-type">
                                    {typeLabel(item.type)}
                                </span>
                                <strong className="recommendation-rail-title">{item.title}</strong>
                                {item.meta?.statusLabel ? (
                                    <span className="recommendation-rail-status">
                                        {item.meta.statusLabel}
                                    </span>
                                ) : null}
                                {item.description ? (
                                    <span className="recommendation-rail-desc">
                                        {item.description}
                                    </span>
                                ) : null}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

export default RecommendationRail;
