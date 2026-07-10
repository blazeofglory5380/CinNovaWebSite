import { useEffect, useMemo, useState } from "react";
import "../App.css";
import "../styles/brand-dna.css";
import "./Blog.css";
import SEO from "../components/SEO.jsx";
import AdSlot from "../components/AdSlot.jsx";
import CinNovaCoreHero from "../components/brand-dna/CinNovaCoreHero.jsx";
import GlassPanel from "../components/brand-dna/GlassPanel.jsx";
import GlassCard from "../components/brand-dna/GlassCard.jsx";
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
import { MotionSectionWrap } from "../motion/MotionSectionWrap.jsx";

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
            // This week's featured story takes the large lead card. Falls back to the
            // evergreen AI guide, then any cornerstone, then the first post.
            posts.find((p) => p.slug === "anthropic-vs-federal-government-military-ai") ||
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
            ? "CinNova Blog | AI, Apps, Education, Safety, and Real Estate"
            : `${activeCategory} Articles | CinNova Blog`;
    const seoDescription =
        activeCategory === "All"
            ? "Read CinNova articles about AI software, education, real estate, safety, parenting, product updates, and building useful app businesses."
            : `Read CinNova ${activeCategory} articles from the company blog and app ecosystem.`;
    const pageUrl = activeCategory === "All" ? getBlogUrl() : getCategoryUrl(activeCategory);
    const blogSchema = {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "CinNova Blog",
        url: pageUrl,
        description: seoDescription,
        publisher: {
            "@type": "Organization",
            name: "CinNova",
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

    function scrollToArticles() {
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
            accent: "emerald",
            alt: `${post.title} article cover`,
        };

        return (
            <figure
                className={`article-cover article-cover-${variant}`}
                data-category={slugifyCategory(post.category)}
                data-accent={cover.accent || "emerald"}
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

    const heroSubtitle =
        activeCategory === "All"
            ? "Practical AI insights for real estate, education, safety, and smarter decisions — ideas, tutorials, and product stories from across the CinNova ecosystem."
            : `${activeCategory} — articles and research from the CinNova ecosystem.`;

    return (
        <main className="product-page blog-page blog-v2 brand-dna">
            <SEO
                title={seoTitle}
                description={seoDescription}
                url={pageUrl}
                type="website"
                schema={blogSchema}
            />

            {/* ── Hero ─────────────────────────────────────────────── */}
            <CinNovaCoreHero
                eyebrow="CinNova Research · Publication"
                titleA="The CinNova"
                titleB="Blog"
                subtitle={heroSubtitle}
                primaryCta={{ label: "Explore Articles", onClick: scrollToArticles }}
                secondaryCta={{ label: "Free AI Guide", onClick: onOpenGuide }}
            />

            {/* ── Featured article section ─────────────────────────── */}
            {cornerstonePost && (
                <section className="blog-v2__section blog-v2__featured">
                    <div className="blog-v2__heading">
                        <p className="bdna-eyebrow">Featured Story</p>
                    </div>
                    <div className="blog-v2__featured-grid">
                        <GlassPanel
                            as="a"
                            lit
                            interactive
                            className="blog-v2__feature-lead"
                            href={`/blog/${cornerstonePost.slug}`}
                            onClick={(event) => handleArticleLink(event, cornerstonePost)}
                        >
                            <div className="blog-v2__feature-media">
                                <ArticleVisual post={cornerstonePost} variant="newspaper" />
                            </div>
                            <div className="blog-v2__feature-body">
                                <div className="blog-v2__meta-row">
                                    <span className="blog-v2__chip">{cornerstonePost.category}</span>
                                    <span>{cornerstonePost.date}</span>
                                    <span>{getReadTime(cornerstonePost)}</span>
                                </div>
                                <h2 className="blog-v2__feature-title">{cornerstonePost.title}</h2>
                                <p className="blog-v2__feature-excerpt">{cornerstonePost.excerpt}</p>
                                <span className="blog-v2__byline">By {cornerstonePost.author}</span>
                                <span className="blog-v2__read-link">Read Article →</span>
                            </div>
                        </GlassPanel>

                        {featuredPost && featuredPost.id !== cornerstonePost.id && (
                            <GlassPanel
                                as="a"
                                interactive
                                className="blog-v2__feature-secondary"
                                href={`/blog/${featuredPost.slug}`}
                                onClick={(event) => handleArticleLink(event, featuredPost)}
                            >
                                <ArticleVisual post={featuredPost} variant="featured" />
                                <div className="blog-v2__feature-secondary-body">
                                    <span className="blog-v2__chip">{featuredPost.category}</span>
                                    <h3>{featuredPost.title}</h3>
                                    <p>{featuredPost.excerpt}</p>
                                    <div className="blog-v2__meta-row">
                                        <span>{featuredPost.date}</span>
                                        <span>{getReadTime(featuredPost)}</span>
                                    </div>
                                </div>
                            </GlassPanel>
                        )}
                    </div>

                    {secondaryFeaturedPosts.length > 0 && (
                        <div className="blog-v2__strip">
                            {secondaryFeaturedPosts.map((post) => (
                                <a
                                    href={`/blog/${post.slug}`}
                                    className="blog-v2__strip-item bdna-glass bdna-glass--interactive"
                                    key={post.id}
                                    onClick={(event) => handleArticleLink(event, post)}
                                >
                                    <ArticleVisual post={post} />
                                    <span className="blog-v2__chip">{post.category}</span>
                                    <strong>{post.title}</strong>
                                    <small>{getReadTime(post)}</small>
                                </a>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* ── Category rail (search + topics) ──────────────────── */}
            <section className="blog-v2__section blog-v2__rail">
                <GlassPanel className="blog-v2__rail-inner">
                    <label className="blog-v2__search">
                        <span>Search articles</span>
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value.slice(0, 120))}
                            placeholder="Search AI, education, real estate..."
                            maxLength={120}
                        />
                    </label>
                    <div className="blog-v2__pills">
                        {["All", ...blogCategories].map((category) => (
                            <a
                                href={category === "All" ? "/blog" : `/blog/category/${slugifyCategory(category)}`}
                                className={`blog-v2__pill ${activeCategory === category ? "is-active" : ""}`}
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
                </GlassPanel>
            </section>

            {/* ── Trending ─────────────────────────────────────────── */}
            {trendingPosts.length > 0 && (
                <section className="blog-v2__section">
                    <div className="blog-v2__heading">
                        <p className="bdna-eyebrow">What's trending</p>
                        <h2>Articles people are reading now</h2>
                    </div>
                    <div className="blog-v2__grid">
                        {trendingPosts.map((post, index) => (
                            <GlassCard
                                key={post.id}
                                className="blog-v2__card reveal-on-scroll"
                                style={{ "--cn-reveal-index": index }}
                                media={<ArticleVisual post={post} />}
                                onClick={() => onOpenArticle(post)}
                                onKeyDown={(e) => { if (e.key === "Enter") onOpenArticle(post); }}
                            >
                                <div className="blog-v2__card-top">
                                    <span className="blog-v2__cat">{post.category}</span>
                                    <span className="blog-v2__chip blog-v2__chip--trend">Trending</span>
                                    {post.sponsored && <span className="blog-v2__chip blog-v2__chip--gold">Sponsored</span>}
                                </div>
                                <h3>{post.title}</h3>
                                <p>{post.excerpt}</p>
                                <div className="blog-v2__card-meta">
                                    <small>{post.author}</small>
                                    <small>{getReadTime(post)}</small>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Article grid ─────────────────────────────────────── */}
            <section className="blog-v2__section" id="articles">
                <div className="blog-v2__heading">
                    <p className="bdna-eyebrow">Latest articles</p>
                    <h2>Fresh from the CinNova blog</h2>
                    <p className="blog-v2__heading-copy">
                        {activeCategory === "All"
                            ? "AI, education, real estate, safety, parenting, product updates, and entrepreneurship."
                            : `Showing ${activeCategory} articles.`}
                    </p>
                </div>
                <div className="blog-v2__grid">
                    {filteredPosts.map((post, index) => (
                        <GlassCard
                            key={post.id}
                            className="blog-v2__card reveal-on-scroll"
                            style={{ "--cn-reveal-index": Math.min(index, 5) }}
                            media={<ArticleVisual post={post} />}
                            onClick={() => onOpenArticle(post)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") onOpenArticle(post);
                            }}
                        >
                            <div className="blog-v2__card-top">
                                <span className="blog-v2__cat">{post.category}</span>
                                {post.sponsored && <span className="blog-v2__chip blog-v2__chip--gold">Sponsored</span>}
                            </div>
                            <h3>{post.title}</h3>
                            <p>{post.excerpt}</p>
                            <div className="blog-v2__card-meta">
                                <small>{post.author}</small>
                                <small>{getReadTime(post)}</small>
                            </div>
                        </GlassCard>
                    ))}
                    {filteredPosts.length === 0 && (
                        <p className="blog-v2__empty">No articles match your search yet.</p>
                    )}
                </div>
            </section>

            {/* ── Browse by topic (restyled) ───────────────────────── */}
            <section className="blog-v2__section">
                <div className="blog-v2__heading">
                    <p className="bdna-eyebrow">Browse by topic</p>
                    <h2>Featured categories</h2>
                </div>
                <div className="blog-v2__topics">
                    {blogCategories.map((cat) => {
                        const config = categoryConfig[cat] || { icon: "CN", desc: "" };
                        const count = posts.filter((p) => p.category === cat).length;
                        return (
                            <a
                                href={`/blog/category/${slugifyCategory(cat)}`}
                                className="blog-v2__topic bdna-glass bdna-glass--interactive"
                                key={cat}
                                onClick={(event) => {
                                    event.preventDefault();
                                    jumpToArticles(cat);
                                }}
                            >
                                <span className="blog-v2__topic-icon">{config.icon}</span>
                                <strong>{cat}</strong>
                                <p>{config.desc}</p>
                                <small>{count} {count === 1 ? "article" : "articles"}</small>
                            </a>
                        );
                    })}
                </div>
            </section>

            {/* ── Editor picks (restyled) ──────────────────────────── */}
            {popularPosts.length > 0 && (
                <section className="blog-v2__section">
                    <div className="blog-v2__heading">
                        <p className="bdna-eyebrow">Editor picks</p>
                        <h2>Start with these practical reads</h2>
                    </div>
                    <div className="blog-v2__picks">
                        {popularPosts.map((post, i) => (
                            <article
                                className="blog-v2__pick bdna-glass bdna-glass--interactive"
                                key={post.id}
                                onClick={() => onOpenArticle(post)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === "Enter") onOpenArticle(post); }}
                            >
                                <span className="blog-v2__pick-rank">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <div className="blog-v2__pick-info">
                                    <span className="blog-v2__chip">{post.category}</span>
                                    <h3>{post.title}</h3>
                                    <p>{post.excerpt}</p>
                                    <div className="blog-v2__card-meta">
                                        <small>{post.author}</small>
                                        <small>{getReadTime(post)}</small>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Free guide CTA (restyled) ────────────────────────── */}
            <section className="blog-v2__section">
                <GlassPanel lit className="blog-v2__guide">
                    <div className="blog-v2__guide-cover">
                        <span>CN</span>
                        <small>Free Guide</small>
                    </div>
                    <div className="blog-v2__guide-copy">
                        <p className="bdna-eyebrow">Free download</p>
                        <h2>Get the CinNova AI Guide — free</h2>
                        <p>
                            A practical breakdown of five ways AI is changing education, home
                            safety, real estate, tech support, and early learning.
                        </p>
                        <button
                            className="bdna-btn bdna-btn--primary"
                            onClick={onOpenGuide}
                        >
                            Download Free Guide →
                        </button>
                        <p className="blog-v2__guide-note">
                            Free download. No credit card. Subscribes you to the CinNova newsletter.
                        </p>
                    </div>
                </GlassPanel>
            </section>

            {/* ── Ad slot (preserved, restyled wrapper) ────────────── */}
            <section className="blog-v2__section blog-v2__ad">
                <AdSlot placement="banner" onNavigate={onNavigate} />
            </section>

            {/* ── Dispatch (newsletter) ────────────────────────────── */}
            <section className="blog-v2__section" id="newsletter">
                <MotionSectionWrap className="blog-v2__dispatch bdna-glass bdna-glass--lit">
                    <p className="bdna-eyebrow">The Dispatch</p>
                    <h2>New articles and product updates in your inbox</h2>
                    <p className="blog-v2__dispatch-copy">
                        Launch notes, article drops, and behind-the-scenes updates as
                        CinNova builds its app ecosystem.
                    </p>
                    <NewsletterSignup
                        onSubscribe={onSubscribe}
                        source="Blog"
                        tags={["Blog Reader"]}
                    />
                </MotionSectionWrap>
            </section>
        </main>
    );
}

export default Blog;
