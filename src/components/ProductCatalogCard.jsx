import { normalizeProductStatus } from "../data/products.js";
import { MotionCardWrap } from "../motion/MotionCardWrap.jsx";
import { trackProductExploreClick } from "../utils/analytics.js";

function ProductCatalogCard({ product, onLearnMore, buttonClassName = "secondary-btn" }) {
    const status = normalizeProductStatus(product.status);

    const handleLearnMore = () => {
        trackProductExploreClick({
            productName: product.name,
            sourcePage:
                typeof window !== "undefined"
                    ? new URLSearchParams(window.location.search).get("page") || window.location.pathname
                    : "",
            destinationPage: product.page,
        });
        onLearnMore?.(product.page);
    };

    return (
        <MotionCardWrap className="home-v12-ecosystem-card product-catalog-card">
            {product.image && (
                <div className="home-v12-ecosystem-photo">
                    <img src={product.image} alt={product.imageAlt} loading="lazy" decoding="async" />
                    <span
                        className={`home-v12-product-brand${product.name.length > 14 ? " home-v12-product-brand--compact" : ""}`}
                    >
                        {product.name}
                    </span>
                </div>
            )}
            <div className="home-v12-ecosystem-body">
                <div className="home-v12-ecosystem-meta">
                    <span className={`home-v12-status home-v12-status--${status.variant}`}>{status.label}</span>
                    <span className="home-v12-ecosystem-category">{product.category}</span>
                </div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <button type="button" className={buttonClassName} onClick={handleLearnMore}>
                    Learn More
                </button>
            </div>
        </MotionCardWrap>
    );
}

export default ProductCatalogCard;
