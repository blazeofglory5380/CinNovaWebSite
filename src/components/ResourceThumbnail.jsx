import MarketingPhoto from "./MarketingPhoto.jsx";
import { formatResourceReadTime } from "../data/resources.js";
import { getResourceCoverImage } from "../data/marketingImages.js";

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

function ResourceThumbnail({ resource, large = false }) {
    const cover = getResourceCoverImage(resource);
    const readTimeLabel = formatResourceReadTime(resource.readTime);

    return (
        <div
            className={`resource-thumb-photo${large ? " resource-thumb-photo-large" : ""}`}
            aria-hidden="true"
        >
            <MarketingPhoto src={cover.src} alt={cover.alt} className="resource-thumb-photo-img" />
            <div className="resource-thumb-photo-scrim" />
            <div className="resource-thumb-photo-overlay">
                <span className="rt-product-tag">{resource.product}</span>
                <span className="rt-cat-tag">{resource.category}</span>
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
