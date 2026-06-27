import { useMemo } from "react";
import SEO from "../components/SEO.jsx";
import MarketingPhoto from "../components/MarketingPhoto.jsx";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import { getRecentlyAddedResources } from "../data/resources.js";
import { siteMarketing } from "../data/marketingImages.js";
import { siteUrl } from "../data/blogPosts.js";

const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": `${siteUrl}/#organization`,
            name: "Cin Nova",
            url: siteUrl,
            description:
                "Cin Nova builds practical AI software products for education, safety, real estate, and everyday decision-making.",
            sameAs: [`${siteUrl}/blog`, `${siteUrl}/?page=newsletter`],
        },
        {
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            url: siteUrl,
            name: "Cin Nova",
            publisher: { "@id": `${siteUrl}/#organization` },
        },
    ],
};

const FEATURED_PRODUCT_PAGES = ["studynest", "poisonguard", "real-estate"];

const whyCinNovaPillars = [
    {
        title: "Students learn smarter",
        description:
            "StudyNest and Kiddo turn study time and early learning into structured progress — with AI support that adapts to each learner.",
    },
    {
        title: "Families stay safer",
        description:
            "PoisonGuard helps households identify hazards, prepare for emergencies, and make faster safety decisions when it matters most.",
    },
    {
        title: "Professionals move faster",
        description:
            "TechMate AI and Cin Nova Real Estate reduce friction in everyday troubleshooting and investment analysis with clear, guided workflows.",
    },
    {
        title: "Businesses grow with clarity",
        description:
            "Guides, templates, and product resources give teams a shared language for launches, safety programs, and customer education.",
    },
];

function normalizeProductStatus(status) {
    if (status === "Active Build") return { label: "Available", variant: "available" };
    if (status === "In Development") return { label: "Beta", variant: "beta" };
    return { label: "Coming Soon", variant: "coming-soon" };
}

function parsePostDate(dateString = "") {
    const parsed = Date.parse(dateString);
    return Number.isNaN(parsed) ? 0 : parsed;
}

function ArticleThumb({ post }) {
    if (post.heroImage) {
        return (
            <div className="home-v12-article-thumb">
                <img src={post.heroImage} alt={post.heroImageAlt || post.title} loading="lazy" decoding="async" />
            </div>
        );
    }

    return (
        <div className="home-v12-article-thumb home-v12-article-thumb-fallback" aria-hidden="true">
            <span>{post.category.slice(0, 2).toUpperCase()}</span>
        </div>
    );
}

function HomePage({
    products,
    productDetails,
    posts,
    onNavigate,
    onOpenArticle,
    onOpenResource,
    onGoResources,
    onGoBlog,
    onSubscribe,
}) {
    const latestResources = useMemo(() => getRecentlyAddedResources(3), []);
    const latestArticles = useMemo(
        () => [...posts].sort((a, b) => parsePostDate(b.date) - parsePostDate(a.date)).slice(0, 3),
        [posts],
    );
    const featuredProducts = products.filter((product) => FEATURED_PRODUCT_PAGES.includes(product.page));
    const hero = siteMarketing.homeHero;

    function openProduct(page) {
        onNavigate?.(page);
        window.scrollTo(0, 0);
    }

    return (
        <main className="homepage-v12">
            <SEO
                title="Cin Nova | Practical AI for Learning, Safety, and Smarter Decisions"
                description="Cin Nova is the central hub for practical AI products, free resources, and editorial insights — built for students, families, professionals, and businesses."
                url={siteUrl}
                type="website"
                schema={homeSchema}
            />

            <section className="home-v12-hero section" aria-labelledby="home-v12-hero-title">
                <div className="home-v12-hero-grid">
                    <div className="home-v12-hero-copy">
                        <p className="eyebrow">THE CIN NOVA ECOSYSTEM</p>
                        <h1 id="home-v12-hero-title">
                            Practical AI that helps people learn, stay safe, and make better decisions.
                        </h1>
                        <p className="home-v12-hero-lead">
                            Cin Nova builds connected software for education, family safety, technology support,
                            early learning, and real estate — plus a growing library of free guides and research.
                        </p>
                        <div className="home-v12-hero-actions">
                            <button type="button" className="primary-btn" onClick={() => onNavigate?.("products")}>
                                Explore Products
                            </button>
                            <button type="button" className="secondary-btn" onClick={onGoResources}>
                                Browse Free Resources
                            </button>
                        </div>
                        <div className="home-v12-hero-stats" role="list" aria-label="Cin Nova at a glance">
                            <div role="listitem">
                                <strong>5</strong>
                                <span>Products</span>
                            </div>
                            <div role="listitem">
                                <strong>12</strong>
                                <span>Free resources</span>
                            </div>
                            <div role="listitem">
                                <strong>1</strong>
                                <span>Connected ecosystem</span>
                            </div>
                        </div>
                    </div>
                    <div className="home-v12-hero-visual">
                        <MarketingPhoto
                            src={hero.src}
                            alt={hero.alt}
                            className="home-v12-hero-img"
                            loading="eager"
                        />
                    </div>
                </div>
            </section>

            <section className="section home-v12-ecosystem" id="ecosystem" aria-labelledby="home-v12-ecosystem-title">
                <div className="home-v12-section-head">
                    <p className="eyebrow">CIN NOVA ECOSYSTEM</p>
                    <h2 id="home-v12-ecosystem-title">Five products. One mission.</h2>
                    <p>
                        Each platform solves a different real-world problem — and together they form a practical AI
                        ecosystem for everyday life.
                    </p>
                </div>
                <div className="home-v12-ecosystem-grid">
                    {products.map((product) => {
                        const status = normalizeProductStatus(product.status);
                        const audience = productDetails[product.page]?.whoFor?.[0] || product.category;

                        return (
                            <article key={product.name} className="home-v12-ecosystem-card">
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
                                        <span className={`home-v12-status home-v12-status--${status.variant}`}>
                                            {status.label}
                                        </span>
                                        <span className="home-v12-ecosystem-category">{product.category}</span>
                                    </div>
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <p className="home-v12-ecosystem-audience">
                                        <strong>Audience:</strong> {audience}
                                    </p>
                                    <button type="button" className="secondary-btn" onClick={() => openProduct(product.page)}>
                                        Learn More
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="section home-v12-why" aria-labelledby="home-v12-why-title">
                <div className="home-v12-section-head">
                    <p className="eyebrow">WHY CIN NOVA</p>
                    <h2 id="home-v12-why-title">Software that works together for real people.</h2>
                    <p>
                        Cin Nova is not a collection of disconnected apps. It is a mission-driven ecosystem designed to
                        help students, families, professionals, and businesses move from confusion to confident action.
                    </p>
                </div>
                <div className="home-v12-why-grid">
                    {whyCinNovaPillars.map((pillar) => (
                        <article key={pillar.title} className="home-v12-why-card">
                            <h3>{pillar.title}</h3>
                            <p>{pillar.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section home-v12-featured" aria-labelledby="home-v12-featured-title">
                <div className="home-v12-section-head">
                    <p className="eyebrow">FEATURED PRODUCTS</p>
                    <h2 id="home-v12-featured-title">Start with the platforms leading the ecosystem.</h2>
                    <p>Explore the products getting the most traction across education, safety, and real estate.</p>
                </div>
                <div className="home-v12-featured-grid">
                    {featuredProducts.map((product) => {
                        const status = normalizeProductStatus(product.status);
                        return (
                            <article key={product.name} className="home-v12-featured-card">
                                <div className="home-v12-featured-photo">
                                    <img src={product.image} alt={product.imageAlt} loading="lazy" decoding="async" />
                                    <span
                                        className={`home-v12-product-brand home-v12-product-brand--featured${product.name.length > 14 ? " home-v12-product-brand--compact" : ""}`}
                                    >
                                        {product.name}
                                    </span>
                                </div>
                                <div className="home-v12-featured-body">
                                    <span className={`home-v12-status home-v12-status--${status.variant}`}>
                                        {status.label}
                                    </span>
                                    <p className="home-v12-featured-category">{product.category}</p>
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <button type="button" className="primary-btn" onClick={() => openProduct(product.page)}>
                                        Learn More
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="section home-v12-resources" aria-labelledby="home-v12-resources-title">
                <div className="home-v12-section-head">
                    <p className="eyebrow">LATEST RESOURCES</p>
                    <h2 id="home-v12-resources-title">Fresh guides, templates, and checklists.</h2>
                    <p>Free publications from the Cin Nova Resources Center — updated as new assets ship.</p>
                </div>
                <div className="home-v12-resources-grid">
                    {latestResources.map((resource) => (
                        <article key={resource.id} className="home-v12-resource-card">
                            <p className="home-v12-resource-category">{resource.category}</p>
                            <h3>{resource.title}</h3>
                            <p>{resource.description}</p>
                            <div className="home-v12-resource-meta">
                                <span>{resource.product}</span>
                                <span>{resource.readTime}</span>
                            </div>
                            <button type="button" className="secondary-btn" onClick={() => onOpenResource?.(resource)}>
                                View resource
                            </button>
                        </article>
                    ))}
                </div>
                <div className="home-v12-section-action">
                    <button type="button" className="secondary-btn" onClick={onGoResources}>
                        Browse all resources →
                    </button>
                </div>
            </section>

            <section className="section home-v12-articles" aria-labelledby="home-v12-articles-title">
                <div className="home-v12-section-head">
                    <p className="eyebrow">LATEST ARTICLES</p>
                    <h2 id="home-v12-articles-title">Research and insights from the Cin Nova blog.</h2>
                    <p>Editorial coverage of AI, education, safety, real estate, and product building.</p>
                </div>
                <div className="home-v12-articles-grid">
                    {latestArticles.map((post) => (
                        <article key={post.id} className="home-v12-article-card">
                            <ArticleThumb post={post} />
                            <p className="home-v12-article-category">{post.category}</p>
                            <h3>{post.title}</h3>
                            <p>{post.excerpt}</p>
                            <div className="home-v12-article-meta">
                                <span>{post.readTime}</span>
                                <span>{post.date}</span>
                            </div>
                            <button type="button" className="secondary-btn" onClick={() => onOpenArticle?.(post)}>
                                Read article
                            </button>
                        </article>
                    ))}
                </div>
                <div className="home-v12-section-action">
                    <button type="button" className="primary-btn" onClick={onGoBlog}>
                        Visit the blog →
                    </button>
                </div>
            </section>

            <section className="section home-v12-newsletter" id="newsletter" aria-labelledby="home-v12-newsletter-title">
                <div className="home-v12-newsletter-card">
                    <div className="home-v12-newsletter-copy">
                        <p className="eyebrow">STAY IN THE LOOP</p>
                        <h2 id="home-v12-newsletter-title">Product launches, free resources, and practical AI insights.</h2>
                        <p>
                            Join the Cin Nova newsletter for launch announcements, new resource drops, and editorial
                            highlights — no spam, unsubscribe anytime.
                        </p>
                        <ul className="home-v12-newsletter-perks">
                            <li>Early access to product betas</li>
                            <li>New guides and templates as they publish</li>
                            <li>Curated articles from the Cin Nova blog</li>
                        </ul>
                    </div>
                    <div className="home-v12-newsletter-form-wrap">
                        <NewsletterSignup
                            onSubscribe={onSubscribe}
                            source="Homepage"
                            tags={["Homepage", "Product Updates", "Resource Reader"]}
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}

export default HomePage;
