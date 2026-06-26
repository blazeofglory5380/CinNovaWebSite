import MarketingPhoto from "./MarketingPhoto.jsx";
import { getResourceCoverImage } from "../data/marketingImages.js";

function ResourceThumbnail({ resource, large = false }) {
    const cover = getResourceCoverImage(resource);

    return (
        <div
            className={`resource-thumb-photo${large ? " resource-thumb-photo-large" : ""}`}
            aria-hidden="true"
        >
            <MarketingPhoto src={cover.src} alt={cover.alt} className="resource-thumb-photo-img" />
            <div className="resource-thumb-photo-overlay">
                <span className="rt-product-tag">{resource.product}</span>
                <span className="rt-cat-tag">{resource.category}</span>
            </div>
            <div className="resource-thumb-photo-footer">
                <span className="rt-format-tag">{resource.format}</span>
                <span className="rt-time-tag">{resource.readTime}</span>
            </div>
        </div>
    );
}

export default ResourceThumbnail;
