import { useEffect, useMemo, useState } from "react";
import "../App.css";
import SEO from "../components/SEO.jsx";
import AdSlot from "../components/AdSlot.jsx";
import {
    blogCategories,
    estimateArticleReadingTime,
    getBlogUrl,
    getCategoryUrl,
    postMetrics,
    slugifyCategory,
    siteUrl,
} from "../data/blogPosts.js";
import NewsletterSignup from "../components/NewsletterSignup.jsx";

const categoryConfig = {
    "Artificial Intelligence": { icon: "AI", desc: "AI tools, assistants, safety, and workflows" },
    "Real Estate Technology": { icon: "RE", desc: "Property analysis, investing, and market intelligence" },
    "Education Technology": { icon: "ED", desc: "Study tools, tutoring, learning analytics, and Kiddo" },
    "Healthcare Technology": { icon: "HT", desc: "Family safety, poison prevention, and responsible health UX" },
    "Construction Technology": { icon: "CT", desc: "Contractor tools, estimating, documentation, and jobsites" },
    "Data Centers & Databases": { icon: "DB", desc: "Infrastructure, data design, privacy, and performance" },
    "Robotics & Automation": { icon: "RA", desc: "Robotics, automation strategy, and workflow systems" },
    "Future Technology": { icon: "FT", desc: "Emerging technology trends and practical future software" },
    "Business & Entrepreneurship": { icon: "BE", desc: "Founder lessons, product strategy, content, and growth" },
    "CinNova Updates": { icon: "CN", desc: "Product roadmaps, launch plans, and ecosystem updates" },
};

function Blog({
    posts,
    onOpenArticle,
    onSubscribe,
    onOpenGuide,
    onNavigate,
    activeCategory: routedCategory = "All",
    onOpenCategory,
}) {
    const [activeCategory, setActiveCategory] = useState(routedCategory);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setActiveCategory(routedCategory || "All");
    }, [routedCategory]);

    const featuredPosts = useMemo(
        () => posts.filter((post) => post.featured || post.cornerstone).slice(0, 15),
        [posts]
    );
    const cornerstonePost = useMemo(
        () =>
            posts.find((p) => p.slug === "the-complete-guide-to-artificial-intelligence-in-2026") ||
            posts.find((p) => p.cornerstone) ||
            posts[0],
        [posts]
    );
    const featuredPost = useMemo(() => {
        const candidates = featuredPosts.filter((post) => post.id !== cornerstonePost?.id);
        return candidates[0] || featuredPosts[0] || posts[0];
    }, [featuredPosts, cornerstonePost, posts]);
    const secondaryFeaturedPosts = useMemo(
        () =>
            featuredPosts
                .filter(
                    (post) =>
                        post.id !== featuredPost?.id && post.id !== cornerstonePost?.id
                )
                .slice(0, 14),
        [featuredPosts, featuredPost, cornerstonePost]
    );

    const trendingPosts = useMemo(
        () =>
            posts
                .filter((post) => post.cornerstone || postMetrics[post.id]?.trending || post.trending)
                .slice(0, 15),
        [posts]
    );

    const popularPosts = useMemo(
        () => posts.filter((post) => post.popular).slice(0, 5),
        [posts]
    );

    const filteredPosts = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        return posts.filter((post) => {
            const matchesCategory =
                activeCategory === "All" || post.category === activeCategory;
            const matchesSearch =
                !normalizedSearch ||
                post.title.toLowerCase().includes(normalizedSearch) ||
                post.excerpt.toLowerCase().includes(normalizedSearch) ||
                post.category.toLowerCase().includes(normalizedSearch);
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchTerm, posts]);

    const seoTitle =
        activeCategory === "All"
            ? "Cin Nova Blog | AI, Apps, Education, Safety, and Real Estate"
            : `${activeCategory} Articles | Cin Nova Blog`;
    const seoDescription =
        activeCategory === "All"
            ? "Read Cin Nova articles about AI software, education, real estate, safety, parenting, product updates, and building useful app businesses."
            : `Read Cin Nova ${activeCategory} articles from the company blog and app ecosystem.`;
    const pageUrl = activeCategory === "All" ? getBlogUrl() : getCategoryUrl(activeCategory);
    const blogSchema = {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Cin Nova Blog",
        url: pageUrl,
        description: seoDescription,
        publisher: {
            "@type": "Organization",
            name: "Cin Nova",
            url: siteUrl,
        },
        blogPost: posts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            author: {
                "@type": "Organization",
                name: post.author,
            },
        })),
    };

    function openCategory(cat) {
        setActiveCategory(cat);
        onOpenCategory?.(cat);
    }

    function jumpToArticles(cat) {
        openCategory(cat);
        document.getElementById("articles")?.scrollIntoView({ behavior: "smooth" });
    }

    function handleArticleLink(event, post) {
        event.preventDefault();
        event.stopPropagation();
        onOpenArticle(post);
    }

    function getReadTime(post) {
        return estimateArticleReadingTime(post);
    }

    function ArticleVisual({ post, variant = "card" }) {
        if (post.heroImage) {
            return (
                <div className={`article-thumb-photo article-thumb-photo-${variant}`}>
                    <img
                        src={post.heroImage}
                        alt={post.heroImageAlt || post.title}
                        loading="lazy"
                        decoding="async"
                    />
                </div>
            );
        }

        const config = categoryConfig[post.category] || { icon: "CN", desc: "" };
        const cover = post.coverImage || {
            label: post.thumbnail?.label || config.icon,
            kicker: post.category,
            title: post.thumbnail?.title || post.category,
            accent: "blue",
            alt: `${post.title} article cover`,
        };

        return (
            <figure
                className={`article-cover article-cover-${variant}`}
                data-category={slugifyCategory(post.category)}
                data-accent={cover.accent || "blue"}
                aria-label={cover.alt}
            >
                <div className="article-cover-grid" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                </div>
                <div className="article-cover-mark">
                    <span>{cover.label}</span>
                </div>
                <figcaption>
                    <small>{cover.kicker}</small>
                    <strong>{cover.title}</strong>
                </figcaption>
            </figure>
        );
    }

    return (
        <main className="product-page blog-page">
            <SEO
                title={seoTitle}
                description={seoDescription}
                url={pageUrl}
                type="website"
                schema={blogSchema}
            />

            <section className="section blog-hero-section">
                <div className="section-heading blog-hero-copy">
                    <p className="eyebrow">CIN NOVA BLOG</p>
                    <h2>Ideas for building, learning, safety, and smarter software.</h2>
                    <p>
                        Practical articles about AI, education, real estate, family safety,
                        parenting, product updates, and the work behind the Cin Nova ecosystem.
                    </p>
                </div>
            </section>

            {cornerstonePost && (
                <section className="section newspaper-featured-section">
                    <div className="newspaper-featured-inner">
                        <div className="newspaper-featured-header">
                            <span className="newspaper-featured-label">Featured Story</span>
                        </div>
                        <div className="newspaper-featured-body">
                            <div className="newspaper-featured-visual">
                                <ArticleVisual post={cornerstonePost} variant="newspaper" />
                            </div>
                            <div className="newspaper-featured-text">
                                <div className="newspaper-meta-row">
                                    <span className="newspaper-category">{cornerstonePost.category}</span>
                                    <span className="newspaper-date">{cornerstonePost.date}</span>
                                    <span className="newspaper-readtime">{getReadTime(cornerstonePost)}</span>
                                </div>
                                <h2 className="newspaper-headline">{cornerstonePost.title}</h2>
                                <p className="newspaper-summary">{cornerstonePost.excerpt}</p>
                                <div className="newspaper-byline">By {cornerstonePost.author}</div>
                                <a
                                    href={`/blog/${cornerstonePost.slug}`}
                                    className="primary-btn newspaper-cta"
                                    onClick={(event) => handleArticleLink(event, cornerstonePost)}
                                >
                                    Read Article →
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {featuredPost && (
                <section className="section blog-featured-section">
                    <div className="blog-featured blog-featured-clickable">
                        <div>
                            <ArticleVisual post={featuredPost} variant="featured" />
                            <p className="eyebrow">{featuredPost.category.toUpperCase()}</p>
                            <h2>{featuredPost.title}</h2>
                            <p>{featuredPost.excerpt}</p>
                            <div className="article-meta-row">
                                <span>{featuredPost.date}</span>
                                <span>{getReadTime(featuredPost)}</span>
                                <span>{featuredPost.author}</span>
                            </div>
                            <a
                                href={`/blog/${featuredPost.slug}`}
                                className="primary-btn"
                                onClick={(event) => handleArticleLink(event, featuredPost)}
                            >
                                Read Featured Article
                            </a>
                        </div>
                        <div className="blog-featured-panel">
                            <ArticleVisual post={featuredPost} variant="panel" />
                            <p className="product-category">FEATURED ARTICLE</p>
                            <strong>{featuredPost.category}</strong>
                            <span>{getReadTime(featuredPost)}</span>
                            <span>{featuredPost.date}</span>
                            <span>By {featuredPost.author}</span>
                        </div>
                    </div>
                    {secondaryFeaturedPosts.length > 0 && (
                        <div className="featured-article-strip">
                            {secondaryFeaturedPosts.map((post) => (
                                <a
                                    href={`/blog/${post.slug}`}
                                    className="featured-strip-item"
                                    key={post.id}
                                    onClick={(event) => handleArticleLink(event, post)}
                                >
                                    <ArticleVisual post={post} />
                                    <span>{post.category}</span>
                                    <strong>{post.title}</strong>
                                    <small>{getReadTime(post)}</small>
                                </a>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {trendingPosts.length > 0 && (
                <section className="section trending-section">
                    <div className="section-heading">
                        <p className="eyebrow">WHAT'S TRENDING</p>
                        <h2>Articles people are reading now.</h2>
                        <p>The articles getting the most attention across the Cin Nova blog this week.</p>
                    </div>
                    <div className="article-grid">
                        {trendingPosts.map((post) => (
                            <article
                                className="article-card article-card-clickable"
                                key={post.id}
                                onClick={() => onOpenArticle(post)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === "Enter") onOpenArticle(post); }}
                            >
                                <div className="article-card-top-row trending-badge-row">
                                    <span className="article-category-badge">{post.category}</span>
                                    <span className="trending-badge">Trending</span>
                                    {post.sponsored && <span className="sponsored-card-badge">Sponsored</span>}
                                </div>
                                <ArticleVisual post={post} />
                                <h3>{post.title}</h3>
                                <p>{post.excerpt}</p>
                                <div className="article-card-meta">
                                    <small>{post.author}</small>
                                    <small>{post.date}</small>
                                    <small>{getReadTime(post)}</small>
                                </div>
                                <a
                                    href={`/blog/${post.slug}`}
                                    className="article-card-action"
                                    onClick={(event) => handleArticleLink(event, post)}
                                >
                                    Read Article
                                </a>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            <section className="section blog-tools-section">
                <div className="blog-tools">
                    <label className="blog-search">
                        <span>Search articles</span>
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value.slice(0, 120))}
                            placeholder="Search AI, education, real estate..."
                            maxLength={120}
                        />
                    </label>
                    <div className="blog-categories">
                        {["All", ...blogCategories].map((category) => (
                            <a
                                href={category === "All" ? "/blog" : `/blog/category/${slugifyCategory(category)}`}
                                className={`blog-category-pill ${
                                    activeCategory === category ? "active" : ""
                                }`}
                                key={category}
                                onClick={(event) => {
                                    event.preventDefault();
                                    openCategory(category);
                                }}
                            >
                                {category}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section guide-cta-section">
                <div className="guide-cta-card">
                    <div className="guide-cta-cover">
                        <span>CN</span>
                        <small>Free Guide</small>
                    </div>
                    <div className="guide-cta-copy">
                        <p className="eyebrow">FREE DOWNLOAD</p>
                        <h2>Get the Cin Nova AI Guide — free.</h2>
                        <p>
                            A practical breakdown of five ways AI is changing education, home
                            safety, real estate, tech support, and early learning. Enter your
                            email and the guide downloads instantly.
                        </p>
                        <div className="guide-cta-bullets">
                            <span>AI in Education</span>
                            <span>AI in Safety</span>
                            <span>AI in Real Estate</span>
                            <span>AI in Tech</span>
                            <span>AI in Early Learning</span>
                        </div>
                        <button
                            className="primary-btn guide-cta-btn"
                            onClick={onOpenGuide}
                        >
                            Download Free Guide →
                        </button>
                        <p className="guide-cta-note">
                            Free download. No credit card. Subscribes you to the Cin Nova newsletter.
                        </p>
                    </div>
                </div>
            </section>

            <section className="section blog-ad-section">
                <AdSlot placement="banner" onNavigate={onNavigate} />
            </section>

            <section className="section categories-section">
                <div className="section-heading">
                    <p className="eyebrow">BROWSE BY TOPIC</p>
                    <h2>Featured Categories.</h2>
                    <p>Find articles by the topics that matter most to you.</p>
                </div>
                <div className="categories-grid">
                    {blogCategories.map((cat) => {
                        const config = categoryConfig[cat] || { icon: "CN", desc: "" };
                        const count = posts.filter((p) => p.category === cat).length;
                        return (
                            <a
                                href={`/blog/category/${slugifyCategory(cat)}`}
                                className="category-card"
                                key={cat}
                                onClick={(event) => {
                                    event.preventDefault();
                                    jumpToArticles(cat);
                                }}
                            >
                                <span className="category-icon">{config.icon}</span>
                                <strong>{cat}</strong>
                                <p>{config.desc}</p>
                                <small>{count} {count === 1 ? "article" : "articles"}</small>
                            </a>
                        );
                    })}
                </div>
            </section>

            <section className="section showcase-section" id="articles">
                <div className="section-heading">
                    <p className="eyebrow">LATEST ARTICLES</p>
                    <h2>Fresh from the Cin Nova blog.</h2>
                    <p>
                        Browse articles covering AI, education, real estate, safety, parenting,
                        product updates, and entrepreneurship.
                    </p>
                </div>
                <div className="article-grid">
                    {filteredPosts.map((post) => (
                        <article
                            className="article-card article-card-clickable"
                            key={post.id}
                            onClick={() => onOpenArticle(post)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") onOpenArticle(post);
                            }}
                        >
                            <div className="article-card-top-row">
                                <span className="article-category-badge">{post.category}</span>
                                {post.sponsored && <span className="sponsored-card-badge">Sponsored</span>}
                            </div>
                            <ArticleVisual post={post} />
                            <h3>{post.title}</h3>
                            <p>{post.excerpt}</p>
                            <div className="article-card-meta">
                                <small>{post.author}</small>
                                <small>{post.date}</small>
                                <small>{getReadTime(post)}</small>
                            </div>
                            <a
                                href={`/blog/${post.slug}`}
                                className="article-card-action"
                                onClick={(event) => handleArticleLink(event, post)}
                            >
                                Read More
                            </a>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section popular-section">
                <div className="section-heading">
                    <p className="eyebrow">EDITOR PICKS</p>
                    <h2>Start with these practical reads.</h2>
                    <p>Selected articles that introduce the core CinNova product lanes and technology themes.</p>
                </div>
                <div className="popular-articles-list">
                    {popularPosts.map((post, i) => (
                        <article
                            className="popular-article-item"
                            key={post.id}
                            onClick={() => onOpenArticle(post)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === "Enter") onOpenArticle(post); }}
                        >
                            <span className="popular-rank">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <div className="popular-info">
                                <span>{post.category}</span>
                                <h3>{post.title}</h3>
                                <p>{post.excerpt}</p>
                                <div className="article-card-meta">
                                    <small>{post.author}</small>
                                    <small>{getReadTime(post)}</small>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section" id="newsletter">
                <div className="newsletter-card">
                    <p className="eyebrow">STAY IN THE LOOP</p>
                    <h2>Get new articles and product updates in your inbox.</h2>
                    <p className="newsletter-copy">
                        Get launch notes, article drops, and behind-the-scenes updates as
                        Cin Nova builds its app ecosystem.
                    </p>
                    <NewsletterSignup
                        onSubscribe={onSubscribe}
                        source="Blog"
                        tags={["Blog Reader"]}
                    />
                </div>
            </section>
        </main>
    );
}

export default Blog;
