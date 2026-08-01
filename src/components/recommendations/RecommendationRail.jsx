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
    heading = "Related reading",
    className = "",
}) {
    const headingId = useId();
    const noteId = useId();
    const impressedKeyRef = useRef("");

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
        if (!result.enabled || items.length === 0) return;
        const batchKey = `${pageType}|${route}|${items.map((i) => `${i.type}:${i.id}`).join(",")}`;
        if (impressedKeyRef.current === batchKey) return;
        impressedKeyRef.current = batchKey;

        items.forEach((item) => {
            if (item.type === "FUTURE_COMMERCIAL") return;
            trackRecommendationImpression({
                recommendationType: item.type,
                recommendationPosition: item.position,
                recommendationCategory: item.category,
                pageType,
                itemId: item.id,
                route,
            });
        });
    }, [items, pageType, route, result.enabled]);

    if (!result.enabled || items.length === 0) return null;

    function handleActivate(event, item) {
        trackRecommendationClick({
            recommendationType: item.type,
            recommendationPosition: item.position,
            recommendationCategory: item.category,
            pageType,
            itemId: item.id,
            isExternal: Boolean(item.external),
            destinationUrl: item.external ? item.href : "",
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
            aria-describedby={noteId}
            data-recommendation-engine="11.4c"
            data-commercial-slot="off"
        >
            <div className="recommendation-rail-header">
                <p className="recommendation-rail-eyebrow">Explore next</p>
                <h2 id={headingId}>{heading}</h2>
                <p id={noteId} className="recommendation-rail-note">
                    Editorial recommendations only. Official company links are ordinary public
                    websites for context — not sponsorships, partnerships, or affiliate offers.
                </p>
            </div>

            <ul className="recommendation-rail-list" role="list">
                {items.map((item) => {
                    const externalSuffix = item.external ? " (opens in a new tab)" : "";
                    const label = `${typeLabel(item.type)}: ${item.title}${externalSuffix}`;
                    const rel = item.external ? "noopener noreferrer" : undefined;
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
                                data-recommendation-external={item.external ? "true" : "false"}
                                onClick={(event) => handleActivate(event, item)}
                            >
                                <span className="recommendation-rail-type">
                                    {typeLabel(item.type)}
                                    {item.external ? " · Official site" : ""}
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
