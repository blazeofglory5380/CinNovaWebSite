import MarketingPhoto from "./MarketingPhoto.jsx";

function ProductHeroPhoto({ src, alt }) {
    if (!src) return null;

    return (
        <div className="product-hero-photo">
            <MarketingPhoto src={src} alt={alt} className="product-hero-photo-img" loading="eager" fetchPriority="high" />
        </div>
    );
}

export default ProductHeroPhoto;
