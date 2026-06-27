import { getOtherProducts } from "../data/products.js";
import ProductCatalogCard from "./ProductCatalogCard.jsx";

function ProductEcosystemSection({ currentPage, onNavigate }) {
    const otherProducts = getOtherProducts(currentPage);

    function openProduct(page) {
        onNavigate?.(page);
        window.scrollTo(0, 0);
    }

    return (
        <section className="section product-ecosystem-section" aria-labelledby="product-ecosystem-title">
            <div className="product-ecosystem-head">
                <p className="eyebrow">CIN NOVA ECOSYSTEM</p>
                <h2 id="product-ecosystem-title">Explore the Cin Nova Ecosystem</h2>
                <p>Discover the other platforms built on the same practical AI foundation.</p>
            </div>
            <div className="home-v12-ecosystem-grid product-ecosystem-grid">
                {otherProducts.map((product) => (
                    <ProductCatalogCard
                        key={product.page}
                        product={product}
                        onLearnMore={openProduct}
                    />
                ))}
            </div>
            <div className="product-ecosystem-actions">
                <button type="button" className="secondary-btn" onClick={() => openProduct("products")}>
                    View All Products
                </button>
            </div>
        </section>
    );
}

export default ProductEcosystemSection;
