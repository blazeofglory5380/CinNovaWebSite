import { useEffect, useMemo, useState } from "react";
import "../App.css";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import AuthorProfile from "../components/AuthorProfile.jsx";
import ArticleCTA from "../components/ArticleCTA.jsx";
import SEO from "../components/SEO.jsx";
import SponsoredDisclosure from "../components/SponsoredDisclosure.jsx";
import AdSlot from "../components/AdSlot.jsx";
import RecommendedProducts from "../components/RecommendedProducts.jsx";
import BlogProductCTA from "../components/BlogProductCTA.jsx";
import ArticleImage from "../components/ArticleImage.jsx";
import {
    estimateArticleReadingTime,
    getArticleUrl,
    getAuthorProfile,
    siteUrl,
    slugifyCategory,
} from "../data/blogPosts.js";
import { getAffiliateLinksForIds } from "../data/affiliateLinks.js";
import { trackArticleView } from "../utils/analytics.js";

function ReadingProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        function onScroll() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className="reading-progress-track" aria-hidden="true">
            <div className="reading-progress-fill" style={{ width: `${progress}%` }} />
        </div>
    );
}

function extractPullQuote(body = "") {
    const sentences = body.match(/[^.!?]+[.!?]+/g) || [];
    return (
        sentences.find((s) => {
            const t = s.trim();
            return t.length >= 90 && t.length <= 210;
        })?.trim() || null
    );
}

function TableOfContents({ sections }) {
    return (
        <nav className="sidebar-widget article-toc" aria-label="Table of contents">
            <p className="sidebar-widget-label">IN THIS ARTICLE</p>
            <ol className="toc-list">
                {sections.map((section, i) => (
                    <li key={i}>
                        <a href={`#section-${i}`} className="toc-link">
                            {section.heading}
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}

function ShareButtons({ url, title }) {
    const enc = encodeURIComponent;
    const buttons = [
        {
            label: "Facebook",
            href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
            cls: "share-fb",
        },
        {
            label: "X (Twitter)",
            href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`,
            cls: "share-x",
        },
        {
            label: "LinkedIn",
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
            cls: "share-li",
        },
        {
            label: "Email",
            href: `mailto:?subject=${enc(title)}&body=${enc("Read this article: " + url)}`,
            cls: "share-email",
        },
    ];

    return (
        <div className="sidebar-widget share-widget">
            <p className="sidebar-widget-label">SHARE THIS ARTICLE</p>
            <div className="share-buttons">
                {buttons.map((b) => (
                    <a
                        key={b.label}
                        href={b.href}
                        className={`share-btn ${b.cls}`}
                        target={b.cls !== "share-email" ? "_blank" : undefined}
                        rel="noopener noreferrer"
                    >
                        {b.label}
                    </a>
                ))}
            </div>
        </div>
    );
}

function RelatedSidebar({ articles, onOpenArticle }) {
    if (!articles.length) return null;
    return (
        <div className="sidebar-widget related-sidebar">
            <p className="sidebar-widget-label">RELATED ARTICLES</p>
            <div className="related-sidebar-list">
                {articles.map((item) => (
                    <a
                        href={`/blog/${item.slug}`}
                        key={item.id}
                        className="related-sidebar-item"
                        onClick={(event) => {
                            event.preventDefault();
                            onOpenArticle(item);
                        }}
                    >
                        <span>{item.category}</span>
                        <strong>{item.title}</strong>
                        <small>{item.readTime}</small>
                    </a>
                ))}
            </div>
        </div>
    );
}

function RelatedReadingBlock({ articles, onOpenArticle }) {
    if (!articles.length) return null;
    return (
        <aside className="related-reading-block" aria-label="Related reading">
            <p className="sidebar-widget-label">RELATED READING</p>
            <div className="related-reading-grid">
                {articles.map((item) => (
                    <a
                        href={`/blog/${item.slug}`}
                        key={item.id}
                        className="related-reading-card"
                        onClick={(event) => {
                            event.preventDefault();
                            onOpenArticle(item);
                        }}
                    >
                        <span>{item.category}</span>
                        <strong>{item.title}</strong>
                        <small>{item.readTime}</small>
                    </a>
                ))}
            </div>
        </aside>
    );
}

function PrevNextNav({ prev, next, onOpenArticle }) {
    if (!prev && !next) return null;
    return (
        <div className="prev-next-nav">
            {prev ? (
                <button className="prev-next-link" onClick={() => onOpenArticle(prev)}>
                    <span className="prev-next-dir">← Previous</span>
                    <span className="prev-next-cat">{prev.category}</span>
                    <strong>{prev.title}</strong>
                </button>
            ) : (
                <div />
            )}
            {next ? (
                <button className="prev-next-link prev-next-link-right" onClick={() => onOpenArticle(next)}>
                    <span className="prev-next-dir">Next →</span>
                    <span className="prev-next-cat">{next.category}</span>
                    <strong>{next.title}</strong>
                </button>
            ) : (
                <div />
            )}
        </div>
    );
}

function ArticleHeroVisual({ post }) {
    const cover = post.coverImage || {
        label: post.thumbnail?.label || post.category.slice(0, 2).toUpperCase(),
        kicker: post.category,
        title: post.thumbnail?.title || post.category,
        alt: `${post.title} hero illustration`,
    };

    return (
        <figure
            className="article-cover article-cover-hero"
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
                <span>Cin Nova Editorial</span>
            </figcaption>
        </figure>
    );
}

function ArticlePublicationMeta({ post, author, readingTime }) {
    const byline = post.editorialByline || author.name;
    const topics = post.coverageTopics || [post.category];

    return (
        <div className="article-publication-meta" aria-label="Article publication details">
            <div className="article-byline-lockup">
                <AuthorProfile author={author} variant="compact" />
                <div>
                    <span>By {byline}</span>
                    <small>{author.role}</small>
                </div>
            </div>
            <div className="article-date-stack">
                <span>{post.publishedLabel || `Published: ${post.date}`}</span>
                <span>{post.updatedLabel || `Updated: ${post.date}`}</span>
                <span>{readingTime}</span>
            </div>
            <div className="article-topic-strip" aria-label="Coverage topics">
                {topics.map((topic) => (
                    <span key={topic}>{topic}</span>
                ))}
            </div>
        </div>
    );
}

function ArticlePage({ post, posts, onBack, onOpenArticle, onSubscribe, onNavigate }) {
    const author = getAuthorProfile(post.author);
    const affiliateLinks = getAffiliateLinksForIds(post.affiliateIds || []);
    const readingTime = estimateArticleReadingTime(post);

    useEffect(() => {
        trackArticleView(post);
    }, [post.slug]);

    const articlesToShow = useMemo(() => {
        const relatedBySlug = (post.relatedReading || [])
            .map((slug) => posts.find((item) => item.slug === slug))
            .filter(Boolean);
        const relatedArticles = posts
            .filter((item) => item.id !== post.id && item.category === post.category)
            .slice(0, 3);
        const fallbackRelated = posts
            .filter((item) => item.id !== post.id && item.cornerstone)
            .slice(0, 3);
        const list = relatedBySlug.length
            ? relatedBySlug
            : relatedArticles.length
              ? relatedArticles
              : fallbackRelated;
        return list.map((item) => ({
            ...item,
            readTime: item.readTime || estimateArticleReadingTime(item),
        }));
    }, [post.id, post.relatedReading, post.category, posts]);

    const moreFromAuthor = posts
        .filter((item) => item.id !== post.id && item.author === post.author)
        .slice(0, 3);

    const currentIndex = posts.findIndex((p) => p.id === post.id);
    const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
    const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

    const articleUrl = getArticleUrl(post);

    const articleSchema = useMemo(() => {
        const safeDate = (raw) => {
            try {
                const d = new Date(raw);
                return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
            } catch {
                return new Date().toISOString();
            }
        };
        const sections = Array.isArray(post.content) ? post.content : [];
        return {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title || "",
            description: post.excerpt || "",
            url: articleUrl,
            mainEntityOfPage: articleUrl,
            datePublished: safeDate(post.date),
            dateModified: safeDate(post.date),
            articleSection: post.category || "",
            articleBody: sections.map((s) => `${s.heading || ""}: ${s.body || ""}`).join("\n\n"),
            author: {
                "@type": "Organization",
                name: author.name,
                url: siteUrl,
            },
            publisher: {
                "@type": "Organization",
                name: "Cin Nova",
                url: siteUrl,
            },
        };
    }, [post.id, articleUrl, author.name]);

    return (
        <main className="product-page article-page">
            <ReadingProgressBar />
            {post.sponsored && post.sponsor && (
                <SponsoredDisclosure sponsor={post.sponsor} />
            )}
            <SEO
                title={`${post.title} | Cin Nova Blog`}
                description={post.excerpt}
                url={articleUrl}
                type="article"
                image={post.ogImage || `${siteUrl}/og-image.png`}
                schema={articleSchema}
            />

            <section className="section article-hero">
                <button className="secondary-btn article-back-button" onClick={onBack}>
                    Back to Blog
                </button>
                <p className="eyebrow">{post.category.toUpperCase()}</p>
                <h1>{post.title}</h1>
                <p className="article-excerpt">{post.excerpt}</p>
                <ArticlePublicationMeta post={post} author={author} readingTime={readingTime} />
                {post.heroImage ? (
                    <ArticleImage
                        src={post.heroImage}
                        alt={post.heroImageAlt || post.title}
                        caption={post.heroImageCaption || ""}
                        className="article-hero-image"
                    />
                ) : (
                    <ArticleHeroVisual post={post} />
                )}
            </section>

            <section className="section article-content-section">
                <div className="article-body-layout">
                    <article className="article-content-card article-body-counter">
                        {(Array.isArray(post.content) ? post.content : []).map((section, i, arr) => {
                            const isIntro = i === 0;
                            const isCallout = /takeaway|key point|conclusion|summary/i.test(section.heading);
                            const midpoint = Math.ceil(arr.length / 2);
                            const pullQuote = !isIntro && !isCallout && i === midpoint
                                ? extractPullQuote(section.body)
                                : null;
                            const sectionClass = [
                                "article-section",
                                isIntro ? "article-section-intro" : "",
                                isCallout ? "article-section-callout" : "",
                            ].filter(Boolean).join(" ");

                            return (
                                <section className={sectionClass} key={section.heading} id={`section-${i}`}>
                                    <h2>{section.heading}</h2>
                                    {section.body && <p>{section.body}</p>}
                                    {Array.isArray(section.list) && (
                                        <ul>
                                            {section.list.map((item, idx) => (
                                                <li key={idx}>{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {Array.isArray(section.numberedList) && (
                                        <ol>
                                            {section.numberedList.map((item, idx) => (
                                                <li key={idx}>{item}</li>
                                            ))}
                                        </ol>
                                    )}
                                    {pullQuote && (
                                        <blockquote className="article-pullquote" aria-label="Key insight">
                                            {pullQuote}
                                        </blockquote>
                                    )}
                                    {section.image && (
                                        <ArticleImage
                                            src={section.image}
                                            alt={section.imageAlt || section.heading}
                                            caption={section.imageCaption || ""}
                                        />
                                    )}
                                    {i === 1 && <ArticleCTA onSubscribe={onSubscribe} />}
                                </section>
                            );
                        })}
                        <RelatedReadingBlock
                            articles={articlesToShow}
                            onOpenArticle={onOpenArticle}
                        />
                    </article>

                    <aside className="article-sidebar">
                        <TableOfContents sections={Array.isArray(post.content) ? post.content : []} />
                        <ShareButtons url={articleUrl} title={post.title} />
                        <RelatedSidebar articles={articlesToShow} onOpenArticle={onOpenArticle} />
                        <AdSlot placement="sidebar" onNavigate={onNavigate} />
                    </aside>
                </div>
            </section>

            <section className="section article-product-cta-section">
                <BlogProductCTA category={post.category} onNavigate={onNavigate} />
            </section>

            {affiliateLinks.length > 0 && (
                <section className="section affiliate-section">
                    <div className="affiliate-block">
                        <p className="affiliate-block-eyebrow">RECOMMENDED TOOLS</p>
                        <h2>Tools mentioned or related to this article.</h2>
                        <p className="affiliate-disclosure-note">
                            Some links below are affiliate links — Cin Nova earns a small
                            commission at no extra cost to you when you use them.
                        </p>
                        <div className="affiliate-links-grid">
                            {affiliateLinks.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer sponsored"
                                    className="affiliate-link-card"
                                >
                                    <div className="affiliate-link-body">
                                        <strong>{link.name}</strong>
                                        <span className="affiliate-link-category">{link.category}</span>
                                        <p>{link.tagline}</p>
                                    </div>
                                    <span className="affiliate-arrow">→</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <RecommendedProducts category={post.category} onNavigate={onNavigate} />

            <section className="section article-author-section">
                <div className="article-author-card">
                    <p className="eyebrow">ABOUT THE AUTHOR</p>
                    <AuthorProfile author={author} variant="card" />
                </div>
            </section>

            <section className="section article-nav-section">
                <PrevNextNav prev={prevPost} next={nextPost} onOpenArticle={onOpenArticle} />
            </section>

            {moreFromAuthor.length > 0 && (
                <section className="section showcase-section">
                    <div className="section-heading">
                        <p className="eyebrow">MORE FROM THIS AUTHOR</p>
                        <h2>More from {author.name}.</h2>
                        <p>Recent articles by the same author profile.</p>
                    </div>
                    <div className="article-grid">
                        {moreFromAuthor.map((item) => (
                            <article
                                className="article-card article-card-clickable"
                                key={item.id}
                                onClick={() => onOpenArticle(item)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") onOpenArticle(item);
                                }}
                            >
                                <span>{item.category}</span>
                                <h3>{item.title}</h3>
                                <p>{item.excerpt}</p>
                                <a
                                    href={`/blog/${item.slug}`}
                                    className="article-card-action"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        onOpenArticle(item);
                                    }}
                                >
                                    Read Article
                                </a>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            <section className="section" id="newsletter">
                <div className="newsletter-card article-end-newsletter">
                    <p className="eyebrow">JOIN THE NEWSLETTER</p>
                    <h2>Join the Cin Nova Newsletter.</h2>
                    <p className="newsletter-copy">
                        Get AI, Education, Real Estate, and Technology insights in your inbox.
                    </p>
                    <NewsletterSignup
                        onSubscribe={onSubscribe}
                        source={`Article: ${post.title}`}
                        tags={[post.category, "Article Reader"]}
                    />
                </div>
            </section>
        </main>
    );
}

export default ArticlePage;
