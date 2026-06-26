import MarketingPhoto from "./MarketingPhoto.jsx";

function ProductPhotoThumb({ src, alt, badge, className = "" }) {
    if (!src) return badge ? <div className={`product-photo-thumb-badge-only ${className}`}>{badge}</div> : null;

    return (
        <div className={`product-photo-thumb ${className}`.trim()}>
            <MarketingPhoto src={src} alt={alt} className="product-photo-thumb-img" />
            {badge && <span className="product-photo-thumb-badge" aria-hidden="true">{badge}</span>}
        </div>
    );
}

export default ProductPhotoThumb;
