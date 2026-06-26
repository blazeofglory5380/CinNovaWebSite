import { useMemo, useState } from "react";
import "../App.css";
import SEO from "../components/SEO.jsx";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import ResourceThumbnail from "../components/ResourceThumbnail.jsx";
import ResourceEmailGate from "../components/ResourceEmailGate.jsx";
import {
    getRelatedArticlesForResource,
    getRelatedProductsForResource,
    getResourceUrl,
    resources,
    resourceCategoryConfig,
    withLibraryMeta,
} from "../data/resources.js";
import { siteUrl } from "../data/blogPosts.js";

function ResourcePage({ resource, onBack, onOpenResource, onSubscribe, onNavigate, onOpenArticle }) {
    const [gatedResource, setGatedResource] = useState(null);
    const libraryResource = useMemo(() => withLibraryMeta(resource), [resource]);

    const relatedResources = resources
        .filter((item) => item.id !== resource.id && item.category === resource.category)
        .slice(0, 3);
    const fallbackRelated = resources.filter((item) => item.id !== resource.id).slice(0, 3);
    const resourcesToShow = relatedResources.length ? relatedResources : fallbackRelated;

    const relatedArticles = useMemo(() => getRelatedArticlesForResource(resource, 3), [resource]);
    const relatedProducts = useMemo(() => getRelatedProductsForResource(resource), [resource]);

    const resourceUrl = getResourceUrl(resource);
    const catConfig = resourceCategoryConfig[resource.category];

    const resourceSchema = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: resource.title,
        description: resource.description,
        url: resourceUrl,
        genre: resource.category,
        about: resource.product,
        publisher: {
            "@type": "Organization",
            name: "Cin Nova",
            url: siteUrl,
        },
    };

    return (
        <main className="product-page resource-detail-page">
            <SEO
                title={`${resource.title} | Cin Nova Resources`}
                description={resource.description}
                url={resourceUrl}
                type="article"
                schema={resourceSchema}
            />

            <section className="section article-hero resource-hero">
                <button type="button" className="secondary-btn article-back-button" onClick={onBack}>
                    Back to Resources
                </button>
                <div className="resource-hero-layout">
                    <div className="resource-hero-copy">
                        <p className="eyebrow">{resource.category.toUpperCase()}</p>
                        <h1>{resource.title}</h1>
                        <p className="article-excerpt">{resource.description}</p>
                        <div className="article-meta-row resource-detail-meta-row">
                            <span>{resource.product}</span>
                            <span>{libraryResource.fileType}</span>
                            <span>{libraryResource.fileSize}</span>
                            <span>{resource.readTime}</span>
                            <span>{libraryResource.difficulty}</span>
                            <span>Updated {libraryResource.lastUpdatedLabel}</span>
                        </div>
                        <div className="resource-detail-hero-actions">
                            <button
                                type="button"
                                className="primary-btn"
                                onClick={() => setGatedResource(resource)}
                            >
                                ↓ {resource.downloadLabel}
                            </button>
                        </div>
                    </div>
                    <div className="resource-hero-thumb">
                        <ResourceThumbnail resource={resource} large={true} />
                    </div>
                </div>
            </section>

            <section className="section article-content-section">
                <div className="resource-detail-layout">
                    <article className="article-content-card resource-content-card">
                        {resource.sections.map((section, i) => (
                            <section key={section.heading} id={`section-${i}`}>
                                <h2>{section.heading}</h2>
                                <p>{section.body}</p>
                            </section>
                        ))}
                    </article>

                    <aside className="resource-detail-sidebar">
                        <div className="sidebar-widget resource-download-widget">
                            <p className="sidebar-widget-label">DOWNLOAD</p>
                            <p className="resource-dw-title">{resource.title}</p>
                            <div className="resource-dw-meta">
                                <span>{libraryResource.fileType}</span>
                                <span>{libraryResource.fileSize}</span>
                                <span>{resource.readTime}</span>
                                {catConfig && (
                                    <span style={{ color: catConfig.accentColor }}>
                                        {resource.category}
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                className="primary-btn resource-dw-btn"
                                onClick={() => setGatedResource(resource)}
                            >
                                ↓ {resource.downloadLabel}
                            </button>
                            <p className="resource-dw-note">Free download · Email required for access</p>
                        </div>

                        {resourcesToShow.length > 0 && (
                            <div className="sidebar-widget resource-related-widget">
                                <p className="sidebar-widget-label">RELATED RESOURCES</p>
                                <div className="resource-related-list">
                                    {resourcesToShow.map((item) => (
                                        <button
                                            type="button"
                                            key={item.id}
                                            className="resource-related-item"
                                            onClick={() => onOpenResource(item)}
                                        >
                                            <div className="resource-related-thumb">
                                                <ResourceThumbnail resource={item} />
                                            </div>
                                            <div className="resource-related-copy">
                                                <strong>{item.title}</strong>
                                                <small>
                                                    {item.category} · {item.readTime}
                                                </small>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </section>

            {relatedArticles.length > 0 && (
                <section className="section resource-related-articles" aria-labelledby="related-articles-title">
                    <div className="resource-library-strip-head">
                        <div>
                            <p className="eyebrow">FROM THE BLOG</p>
                            <h2 id="related-articles-title">Related articles</h2>
                            <p>Continue learning with editorial articles connected to this resource.</p>
                        </div>
                    </div>
                    <div className="resource-related-articles-grid">
                        {relatedArticles.map((article) => (
                            <article key={article.id} className="resource-related-article-card">
                                <p className="resource-related-article-category">{article.category}</p>
                                <h3>{article.title}</h3>
                                <p>{article.excerpt}</p>
                                <div className="resource-related-article-meta">
                                    <span>{article.readTime}</span>
                                    <span>{article.date}</span>
                                </div>
                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={() => onOpenArticle?.(article)}
                                >
                                    Read article
                                </button>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {relatedProducts.length > 0 && (
                <section className="section resource-related-products" aria-labelledby="related-products-title">
                    <div className="resource-library-strip-head">
                        <div>
                            <p className="eyebrow">CIN NOVA PRODUCTS</p>
                            <h2 id="related-products-title">Related products</h2>
                            <p>Explore the Cin Nova apps connected to this resource.</p>
                        </div>
                    </div>
                    <div className="resource-related-products-grid">
                        {relatedProducts.map((product) => (
                            <article key={product.page} className="resource-related-product-card">
                                <span className="resource-related-product-icon" aria-hidden="true">
                                    {product.icon}
                                </span>
                                <p className="resource-related-product-category">{product.category}</p>
                                <h3>{product.name}</h3>
                                <button
                                    type="button"
                                    className="primary-btn"
                                    onClick={() => onNavigate?.(product.page)}
                                >
                                    Explore {product.name}
                                </button>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {gatedResource && (
                <ResourceEmailGate
                    resource={gatedResource}
                    onSubscribe={onSubscribe}
                    onClose={() => setGatedResource(null)}
                />
            )}

            <section className="section" id="newsletter">
                <div className="newsletter-card">
                    <p className="eyebrow">RESOURCE UPDATES</p>
                    <h2>Get new guides and product resources in your inbox.</h2>
                    <NewsletterSignup
                        onSubscribe={onSubscribe}
                        source={`Resource: ${resource.title}`}
                        tags={[resource.category, resource.product, "Resource Reader"]}
                    />
                </div>
            </section>
        </main>
    );
}

export default ResourcePage;
