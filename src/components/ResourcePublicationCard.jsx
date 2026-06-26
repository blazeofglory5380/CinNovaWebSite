import MarketingPhoto from "./MarketingPhoto.jsx";
import ResourceThumbnail from "./ResourceThumbnail.jsx";
import { resourceCategoryConfig, formatResourceReadTime } from "../data/resources.js";

function ResourcePublicationCard({
    resource,
    onPreview,
    onDownload,
    variant = "standard",
    featured = false,
}) {
    const catConfig = resourceCategoryConfig[resource.category];

    return (
        <article
            className={`resource-pub-card resource-pub-card--${variant}${featured ? " resource-pub-card--featured" : ""}`}
            style={{
                "--rpc-accent": catConfig?.accentColor || "#38bdf8",
                "--rpc-accent-bg": catConfig?.accentBg || "rgba(56, 189, 248, 0.1)",
            }}
        >
            <div className="resource-pub-cover">
                <ResourceThumbnail resource={resource} large={variant === "hero"} />
                {featured && <span className="resource-pub-badge">Featured</span>}
            </div>

            <div className="resource-pub-body">
                <div className="resource-pub-labels">
                    <span className="resource-pub-category">{resource.category}</span>
                    <span className="resource-pub-product">{resource.product}</span>
                </div>

                <h3 className="resource-pub-title">{resource.title}</h3>
                <p className="resource-pub-description">{resource.description}</p>

                {variant === "hero" && (
                    <div className="resource-pub-hero-chips" aria-label="Resource details">
                        <span>{resource.format}</span>
                        <span>{resource.fileType}</span>
                        <span>{resource.fileSize}</span>
                        <span>{resource.difficulty}</span>
                        <span>Updated {resource.lastUpdatedLabel}</span>
                    </div>
                )}

                <dl className="resource-pub-meta">
                    <div>
                        <dt>Reading time</dt>
                        <dd>{formatResourceReadTime(resource.readTime)}</dd>
                    </div>
                    <div>
                        <dt>File type</dt>
                        <dd>{resource.fileType}</dd>
                    </div>
                    <div>
                        <dt>File size</dt>
                        <dd>{resource.fileSize}</dd>
                    </div>
                    <div>
                        <dt>Difficulty</dt>
                        <dd>{resource.difficulty}</dd>
                    </div>
                    <div className="resource-pub-meta-wide">
                        <dt>Last updated</dt>
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
                    <MarketingPhoto src={cover.src} alt={cover.alt} className="resource-category-card-img" />
                )}
            </div>
            <div className="resource-category-card-copy">
                <p className="resource-category-card-eyebrow">{count} resources</p>
                <h3>{category}</h3>
                <p>{config?.description}</p>
            </div>
        </button>
    );
}

export default ResourcePublicationCard;
