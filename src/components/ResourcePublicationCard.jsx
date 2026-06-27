import { Component } from "react";
import MarketingPhoto from "./MarketingPhoto.jsx";
import ResourceThumbnail from "./ResourceThumbnail.jsx";
import { defaultResourceCover, resourceProductBrands } from "../data/marketingImages.js";
import { resourceCategoryConfig, formatResourceReadTime } from "../data/resources.js";
import { highlightSearchText } from "../utils/highlightSearch.js";

function MetaIcon({ type }) {
    const icons = {
        time: (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
                <path d="M8 4.5V8l2.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
        ),
        file: (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 2.5h5.5L12 5v8.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.2" />
                <path d="M9.5 2.5V5H12" stroke="currentColor" strokeWidth="1.2" />
            </svg>
        ),
        size: (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="3" y="5" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <path d="M5.5 5V4a2.5 2.5 0 0 1 5 0v1" stroke="currentColor" strokeWidth="1.2" />
            </svg>
        ),
        level: (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 12 7 4l2 4 4-6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        updated: (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="3" y="4" width="10" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <path d="M3 7h10M6 2v2M10 2v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
        ),
    };
    return icons[type] || null;
}

function HighlightedTitle({ title, query }) {
    const parts = highlightSearchText(title, query);
    return (
        <>
            {parts.map((part, index) =>
                part.match ? (
                    <mark key={`${part.text}-${index}`} className="resource-search-hit">
                        {part.text}
                    </mark>
                ) : (
                    <span key={`${part.text}-${index}`}>{part.text}</span>
                ),
            )}
        </>
    );
}

function ResourcePublicationCardInner({
    resource,
    onPreview,
    onDownload,
    variant = "standard",
    editorsPick = false,
    publicationStatus = null,
    rankBadge = null,
    searchQuery = "",
    imageLoading = "lazy",
    imagePriority = false,
}) {
    const catConfig = resourceCategoryConfig[resource.category];
    const isHero = variant === "hero";
    const isFeatured = variant === "hero" || variant === "featured";

    return (
        <article
            className={`resource-pub-card resource-pub-card--${variant}${isFeatured ? " resource-pub-card--featured" : ""}`}
            style={{
                "--rpc-accent": catConfig?.accentColor || "#38bdf8",
                "--rpc-accent-bg": catConfig?.accentBg || "rgba(56, 189, 248, 0.1)",
            }}
        >
            <div className="resource-pub-cover">
                <ResourceThumbnail
                    resource={resource}
                    large={isHero}
                    imageLoading={imagePriority ? "eager" : imageLoading}
                    imagePriority={imagePriority}
                />
            </div>

            <div className="resource-pub-body">
                <div
                    className="resource-pub-flags"
                    aria-label={
                        editorsPick || publicationStatus || rankBadge ? "Resource highlights" : undefined
                    }
                    aria-hidden={!(editorsPick || publicationStatus || rankBadge) || undefined}
                >
                    {editorsPick && (
                        <span className="resource-pub-flag resource-pub-flag--editors">Editor&apos;s Pick</span>
                    )}
                    {publicationStatus && (
                        <span className={`resource-pub-flag resource-pub-flag--${publicationStatus.variant}`}>
                            {publicationStatus.label}
                        </span>
                    )}
                    {rankBadge?.label && (
                        <span className="resource-pub-flag resource-pub-flag--top">{rankBadge.label}</span>
                    )}
                    {rankBadge && (
                        <span
                            className={`resource-pub-rank resource-pub-rank--${rankBadge.rank}`}
                            aria-label={`Rank ${rankBadge.rank}`}
                        >
                            #{rankBadge.rank}
                        </span>
                    )}
                </div>

                <div className="resource-pub-labels">
                    <span className="resource-pub-category">{resource.category}</span>
                    <span className="resource-pub-product">{resource.product}</span>
                </div>

                <h3 className="resource-pub-title">
                    {searchQuery ? (
                        <HighlightedTitle title={resource.title} query={searchQuery} />
                    ) : (
                        resource.title
                    )}
                </h3>
                <p className="resource-pub-description">{resource.description}</p>

                <dl className="resource-pub-meta">
                    <div>
                        <dt>
                            <MetaIcon type="time" />
                            Reading time
                        </dt>
                        <dd>{formatResourceReadTime(resource.readTime)}</dd>
                    </div>
                    <div>
                        <dt>
                            <MetaIcon type="file" />
                            File type
                        </dt>
                        <dd>{resource.fileType}</dd>
                    </div>
                    <div>
                        <dt>
                            <MetaIcon type="size" />
                            File size
                        </dt>
                        <dd>{resource.fileSize}</dd>
                    </div>
                    <div>
                        <dt>
                            <MetaIcon type="level" />
                            Difficulty
                        </dt>
                        <dd>{resource.difficulty}</dd>
                    </div>
                    <div className="resource-pub-meta-wide">
                        <dt>
                            <MetaIcon type="updated" />
                            Updated
                        </dt>
                        <dd>{resource.lastUpdatedLabel}</dd>
                    </div>
                </dl>

                <div className="resource-pub-actions">
                    <button
                        type="button"
                        className="secondary-btn resource-pub-preview"
                        onClick={() => onPreview?.(resource)}
                        aria-label={`Preview ${resource.title}`}
                    >
                        Preview
                    </button>
                    <button
                        type="button"
                        className="primary-btn resource-pub-download"
                        onClick={() => onDownload?.(resource)}
                        aria-label={`Download ${resource.title}`}
                    >
                        ↓ {resource.downloadLabel}
                    </button>
                </div>
            </div>
        </article>
    );
}

class ResourceCardErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            const { resource, onPreview, onDownload } = this.props;
            const brand = resourceProductBrands[resource?.product] || resourceProductBrands["Cin Nova"];

            return (
                <article className="resource-pub-card resource-pub-card--fallback">
                    <div className="resource-pub-cover">
                        <MarketingPhoto
                            src={defaultResourceCover.src}
                            alt={defaultResourceCover.alt}
                            className="resource-thumb-photo-img"
                            objectPosition={defaultResourceCover.objectPosition}
                        />
                        <div className="resource-thumb-photo-overlay">
                            <span
                                className="rt-brand-pill"
                                style={{
                                    "--rt-brand-bg": brand.bg,
                                    "--rt-brand-fg": brand.fg,
                                }}
                            >
                                {brand.label}
                            </span>
                        </div>
                    </div>
                    <div className="resource-pub-body">
                        <h3 className="resource-pub-title">{resource?.title || "Resource"}</h3>
                        <p className="resource-pub-description">
                            {resource?.description || "This resource is temporarily unavailable."}
                        </p>
                        <div className="resource-pub-actions">
                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={() => onPreview?.(resource)}
                            >
                                Preview
                            </button>
                            <button
                                type="button"
                                className="primary-btn"
                                onClick={() => onDownload?.(resource)}
                            >
                                Download
                            </button>
                        </div>
                    </div>
                </article>
            );
        }

        return this.props.children;
    }
}

function ResourcePublicationCard(props) {
    return (
        <ResourceCardErrorBoundary
            resource={props.resource}
            onPreview={props.onPreview}
            onDownload={props.onDownload}
        >
            <ResourcePublicationCardInner {...props} />
        </ResourceCardErrorBoundary>
    );
}

export function ResourceCategoryCard({ category, config, count, cover, active, onSelect }) {
    if (category === "All") return null;

    return (
        <button
            type="button"
            className={`resource-category-card${active ? " is-active" : ""}`}
            onClick={() => onSelect?.(category)}
            aria-pressed={active}
            style={{
                "--rcc-accent": config?.accentColor || "#38bdf8",
                "--rcc-accent-bg": config?.accentBg || "rgba(56, 189, 248, 0.12)",
            }}
        >
            <div className="resource-category-card-photo">
                {cover && (
                    <MarketingPhoto
                        src={cover.src}
                        alt={cover.alt}
                        className="resource-category-card-img"
                        loading="lazy"
                    />
                )}
            </div>
            <div className="resource-category-card-copy">
                <p className="resource-category-card-eyebrow">{count} resources</p>
                <h3>{category}</h3>
                <p>{config?.description}</p>
                <span className="resource-category-card-action" aria-hidden="true">
                    Browse →
                </span>
            </div>
        </button>
    );
}

export default ResourcePublicationCard;
