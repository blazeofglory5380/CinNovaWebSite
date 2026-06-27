import ProductCatalogCard from "./ProductCatalogCard.jsx";

function ProductCatalogGrid({ products, onNavigate, buttonClassName }) {
    function openProduct(page) {
        onNavigate?.(page);
        window.scrollTo(0, 0);
    }

    return (
        <div className="home-v12-ecosystem-grid product-catalog-grid">
            {products.map((product) => (
                <ProductCatalogCard
                    key={product.page}
                    product={product}
                    onLearnMore={openProduct}
                    buttonClassName={buttonClassName}
                />
            ))}
        </div>
    );
}

export default ProductCatalogGrid;
