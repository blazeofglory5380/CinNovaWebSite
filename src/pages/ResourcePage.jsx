import { useMemo, useState } from "react";
import "../App.css";
import SEO from "../components/SEO.jsx";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import ResourcePublicationCard from "../components/ResourcePublicationCard.jsx";
import ResourceThumbnail from "../components/ResourceThumbnail.jsx";
import ResourceEmailGate from "../components/ResourceEmailGate.jsx";
import {
    getRelatedArticlesForResource,
    getRelatedProductsForResource,
    getRelatedResources,
    getResourceUrl,
    formatResourceReadTime,
    resourceCategoryConfig,
    withLibraryMeta,
} from "../data/resources.js";
import { siteUrl } from "../data/blogPosts.js";

function ResourcePage({ resource, onBack, onOpenResource, onSubscribe, onNavigate, onOpenArticle }) {
    const [gatedResource, setGatedResource] = useState(null);
    const libraryResource = useMemo(() => withLibraryMeta(resource), [resource]);
    const relatedResources = useMemo(() => getRelatedResources(libraryResource, 3), [libraryResource]);
    const relatedArticles = useMemo(() => getRelatedArticlesForResource(resource, 3), [resource]);
    const relatedProducts = useMemo(() => getRelatedProductsForResource(resource), [resource]);

    const resourceUrl = getResourceUrl(resource);
    const catConfig = resourceCategoryConfig[resource.category];
    const toc = libraryResource.tableOfContents || [];

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
        <main className="product-page resource-detail-page resource-detail-page-v14">
            <SEO
                title={`${resource.title} | Cin Nova Resources`}
                description={resource.description}
                url={resourceUrl}
                type="article"
                schema={resourceSchema}
            />

            <section className="section resource-detail-hero" aria-labelledby="resource-detail-title">
                <button type="button" className="secondary-btn article-back-button" onClick={onBack}>
                    Back to Resources
                </button>
                <div className="resource-detail-hero-grid">
                    <div className="resource-detail-hero-copy">
                        <p className="eyebrow">{resource.category.toUpperCase()}</p>
                        <h1 id="resource-detail-title">{resource.title}</h1>
                        <p className="resource-detail-lead">{resource.description}</p>

                        <dl className="resource-detail-meta-grid">
                            <div>
                                <dt>Product</dt>
                                <dd>{resource.product}</dd>
                            </div>
                            <div>
                                <dt>Category</dt>
                                <dd>{resource.category}</dd>
                            </div>
                            <div>
                                <dt>Type</dt>
                                <dd>{libraryResource.resourceType}</dd>
                            </div>
                            <div>
                                <dt>Reading time</dt>
                                <dd>{formatResourceReadTime(resource.readTime)}</dd>
                            </div>
                            <div>
                                <dt>Difficulty</dt>
                                <dd>{libraryResource.difficulty}</dd>
                            </div>
                            <div>
                                <dt>File size</dt>
                                <dd>{libraryResource.fileSize}</dd>
                            </div>
                            <div className="resource-detail-meta-wide">
                                <dt>Last updated</dt>
                                <dd>{libraryResource.lastUpdatedLabel}</dd>
                            </div>
                        </dl>

                        <div className="resource-detail-hero-actions">
                            <button
                                type="button"
                                className="primary-btn resource-detail-download-btn"
                                onClick={() => setGatedResource(resource)}
                            >
                                ↓ {resource.downloadLabel}
                            </button>
                        </div>
                    </div>

                    <div className="resource-detail-hero-media">
                        <ResourceThumbnail resource={libraryResource} large={true} imageLoading="eager" imagePriority={true} />
                    </div>
                </div>
            </section>

            <section className="section resource-detail-content-section">
                <div className="resource-detail-layout-v14">
                    <div className="resource-detail-main">
                        {toc.length > 0 && (
                            <nav className="resource-detail-toc" aria-label="Table of contents">
                                <p className="resource-detail-section-label">ON THIS PAGE</p>
                                <ol>
                                    {toc.map((entry) => (
                                        <li key={entry.id}>
                                            <a href={`#${entry.id}`}>{entry.label}</a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        )}

                        <section id="whats-inside" className="resource-detail-block">
                            <h2>What&apos;s inside</h2>
                            <ul className="resource-detail-bullet-list">
                                {libraryResource.whatsInside.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section id="who-its-for" className="resource-detail-block">
                            <h2>Who it&apos;s for</h2>
                            <ul className="resource-detail-bullet-list">
                                {libraryResource.whoItsFor.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <article className="resource-detail-article">
                            {resource.sections.map((section, index) => (
                                <section key={section.heading} id={`section-${index}`} className="resource-detail-block">
                                    <h2>{section.heading}</h2>
                                    <p>{section.body}</p>
                                </section>
                            ))}
                        </article>
                    </div>

                    <aside className="resource-detail-sidebar-v14" aria-label="Resource actions">
                        <div className="resource-detail-download-card">
                            <p className="resource-detail-section-label">DOWNLOAD</p>
                            <p className="resource-detail-download-title">{resource.title}</p>
                            <div className="resource-detail-download-meta">
                                <span>{libraryResource.fileType}</span>
                                <span>{libraryResource.fileSize}</span>
                                <span>{formatResourceReadTime(resource.readTime)}</span>
                                {catConfig && (
                                    <span style={{ color: catConfig.accentColor }}>{resource.category}</span>
                                )}
                            </div>
                            <button
                                type="button"
                                className="primary-btn resource-detail-download-btn"
                                onClick={() => setGatedResource(resource)}
                            >
                                ↓ {resource.downloadLabel}
                            </button>
                            <p className="resource-detail-download-note">Free download · Email required for access</p>
                        </div>
                    </aside>
                </div>
            </section>

            {relatedResources.length > 0 && (
                <section className="section resource-detail-related" aria-labelledby="related-resources-title">
                    <div className="resource-library-strip-head">
                        <div>
                            <p className="eyebrow">KEEP EXPLORING</p>
                            <h2 id="related-resources-title">Related resources</h2>
                            <p>More publications matched to this product, category, and format.</p>
                        </div>
                    </div>
                    <div className="resource-pub-grid resource-pub-grid--strip">
                        {relatedResources.map((item) => (
                            <ResourcePublicationCard
                                key={item.id}
                                resource={item}
                                onPreview={onOpenResource}
                                onDownload={setGatedResource}
                                variant="strip"
                            />
                        ))}
                    </div>
                </section>
            )}

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
                            <h2 id="related-products-title">Related product</h2>
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
