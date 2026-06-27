import MarketingPhoto from "./MarketingPhoto.jsx";
import { defaultResourceCover, getResourceCoverImage, resourceProductBrands } from "../data/marketingImages.js";
import { formatResourceReadTime } from "../data/resources.js";

function FormatIcon() {
    return (
        <svg
            className="rt-format-icon"
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M3 2.5h6.5L13 6v7.5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
            />
            <path d="M9.5 2.5V6H13" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M5 9h6M5 11.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
}

function ResourceThumbnail({ resource, large = false, imageLoading = "lazy", imagePriority = false }) {
    let cover;
    try {
        cover = resource?.coverImage?.src
            ? resource.coverImage
            : getResourceCoverImage(resource);
    } catch {
        cover = null;
    }
    if (!cover?.src) {
        cover = defaultResourceCover;
    }

    const readTimeLabel = formatResourceReadTime(resource?.readTime);
    const brand = resourceProductBrands[resource?.product] || resourceProductBrands["Cin Nova"];

    return (
        <div
            className={`resource-thumb-photo${large ? " resource-thumb-photo-large" : ""}`}
            aria-hidden="true"
        >
            <MarketingPhoto
                src={cover.src}
                alt={cover.alt}
                className="resource-thumb-photo-img"
                loading={imageLoading}
                fetchPriority={imagePriority ? "high" : undefined}
                objectPosition={cover.objectPosition || "50% 50%"}
            />
            <div className="resource-thumb-photo-scrim" />
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
            <div className="resource-thumb-photo-footer">
                <span className="rt-format-tag">
                    <FormatIcon />
                    {resource.format}
                </span>
                <span className="rt-time-tag">{readTimeLabel}</span>
            </div>
        </div>
    );
}

export default ResourceThumbnail;
