import { useMemo } from "react";
import SEO from "../components/SEO.jsx";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import CinNovaCoreHero from "../components/brand-dna/CinNovaCoreHero.jsx";
import GlassCard from "../components/brand-dna/GlassCard.jsx";
import GlassPanel from "../components/brand-dna/GlassPanel.jsx";
import SectionHead from "../components/brand-dna/SectionHead.jsx";
import Dispatch from "../components/brand-dna/Dispatch.jsx";
import EcosystemCarousel from "../components/EcosystemCarousel.jsx";
import { NewsCompactCard } from "../components/news/NewsCards.jsx";
import { getRecentlyAddedResources } from "../data/resources.js";
import { normalizeProductStatus } from "../data/products.js";
import { getLatestNewsStories } from "../data/newsPosts.js";
import { siteUrl, defaultOgImage } from "../data/seoConfig.js";
import { buildImageObject } from "../data/schemaHelpers.js";
import { trackProductExploreClick } from "../utils/analytics.js";
import { MotionSectionWrap } from "../motion/MotionSectionWrap.jsx";
import "../styles/brand-dna.css";
import "./HomePage.css";

const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": `${siteUrl}/#organization`,
            name: "Cin Nova",
            url: siteUrl,
            logo: buildImageObject({ src: defaultOgImage, alt: "Cin Nova" }),
            description:
                "Cin Nova builds practical AI software products for education, safety, real estate, and everyday decision-making.",
            sameAs: [`${siteUrl}/blog`, `${siteUrl}/newsletter`],
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
            "TechMate AI and CinNova Real Estate reduce friction in everyday troubleshooting and investment analysis with clear, guided workflows.",
    },
    {
        title: "Businesses grow with clarity",
        description:
            "Guides, templates, and product resources give teams a shared language for launches, safety programs, and customer education.",
    },
];

function parsePostDate(dateString = "") {
    const parsed = Date.parse(dateString);
    return Number.isNaN(parsed) ? 0 : parsed;
}

function ArticleThumb({ post }) {
    if (post.heroImage) {
        return (
            <div className="home-v2__thumb">
                <img src={post.heroImage} alt={post.heroImageAlt || post.title} loading="lazy" decoding="async" />
            </div>
        );
    }

    return (
        <div className="home-v2__thumb home-v2__thumb--fallback" aria-hidden="true">
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
    onOpenNewsStory,
    onOpenResource,
    onGoResources,
    onGoBlog,
    onGoNews,
    onSubscribe,
}) {
    const latestResources = useMemo(() => getRecentlyAddedResources(3), []);
    const latestNews = useMemo(() => getLatestNewsStories({ limit: 5 }), []);
    const latestArticles = useMemo(
        () => [...posts].sort((a, b) => parsePostDate(b.date) - parsePostDate(a.date)).slice(0, 3),
        [posts],
    );
    const featuredProducts = products.filter((product) => FEATURED_PRODUCT_PAGES.includes(product.page));

    function openProduct(page, name = "") {
        trackProductExploreClick({ productName: name, sourcePage: "home", destinationPage: page });
        onNavigate?.(page);
        window.scrollTo(0, 0);
    }

    return (
        <main className="homepage-v2 brand-dna">
            <SEO
                title="Cin Nova | Practical AI for Learning, Safety, and Smarter Decisions"
                description="Cin Nova is the central hub for practical AI products, free resources, and editorial insights — built for students, families, professionals, and businesses."
                url={siteUrl}
                type="website"
                image={defaultOgImage}
                schema={homeSchema}
            />

            {/* ── Hero — full 16:9 cinematic night-city video, no text overlay ── */}
            <CinNovaCoreHero
                videoSrc="/videos/cinnova-home-hero-cinematic-night-city-rain.mp4"
                videoOnly
                srHeading="CinNova — One AI ecosystem built for real life"
            />

            {/* ── Ecosystem — all products ────────────────────────────── */}
            <MotionSectionWrap as="section" className="home-v2__section" id="ecosystem" aria-label="Cin Nova ecosystem">
                <SectionHead eyebrow="CinNova Ecosystem" title="Five products. One mission." />
                <p className="home-v2__lead">
                    Each platform solves a different real-world problem — and together they form a practical AI
                    ecosystem for everyday life.
                </p>
                <EcosystemCarousel
                    products={products}
                    productDetails={productDetails}
                    openProduct={openProduct}
                />
            </MotionSectionWrap>

            {/* ── Why CinNova ─────────────────────────────────────────── */}
            <MotionSectionWrap as="section" className="home-v2__section" aria-label="Why CinNova">
                <SectionHead eyebrow="Why CinNova" title="Software that works together for real people." />
                <p className="home-v2__lead">
                    CinNova is not a collection of disconnected apps. It is a mission-driven ecosystem designed to
                    help students, families, professionals, and businesses move from confusion to confident action.
                </p>
                <div className="home-v2__pillars">
                    {whyCinNovaPillars.map((pillar) => (
                        <GlassPanel key={pillar.title} as="article" className="home-v2__pillar">
                            <h3>{pillar.title}</h3>
                            <p>{pillar.description}</p>
                        </GlassPanel>
                    ))}
                </div>
            </MotionSectionWrap>

            {/* ── Featured products ───────────────────────────────────── */}
            <MotionSectionWrap as="section" className="home-v2__section" aria-label="Featured products">
                <SectionHead eyebrow="Featured Products" title="Start with the platforms leading the ecosystem." />
                <p className="home-v2__lead">
                    Explore the products getting the most traction across education, safety, and real estate.
                </p>
                <div className="home-v2__grid home-v2__grid--featured">
                    {featuredProducts.map((product) => {
                        const status = normalizeProductStatus(product.status);
                        return (
                            <GlassCard
                                key={product.name}
                                className="home-v2__product-card"
                                media={
                                    <img src={product.image} alt={product.imageAlt} loading="lazy" decoding="async" />
                                }
                                onClick={() => openProduct(product.page, product.name)}
                                aria-label={`${product.name} — learn more`}
                            >
                                <div className="home-v2__card-meta">
                                    <span className={`home-v2__status home-v2__status--${status.variant}`}>{status.label}</span>
                                    <span className="home-v2__cat">{product.category}</span>
                                </div>
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <span className="home-v2__cue">Learn More →</span>
                            </GlassCard>
                        );
                    })}
                </div>
            </MotionSectionWrap>

            {/* ── Latest resources ────────────────────────────────────── */}
            <MotionSectionWrap as="section" className="home-v2__section" aria-label="Latest resources">
                <SectionHead eyebrow="Latest Resources" title="Fresh guides, templates, and checklists." />
                <p className="home-v2__lead">
                    Free publications from the CinNova Resources Center — updated as new assets ship.
                </p>
                <div className="home-v2__grid">
                    {latestResources.map((resource) => (
                        <GlassCard
                            key={resource.id}
                            className="home-v2__text-card"
                            onClick={() => onOpenResource?.(resource)}
                            aria-label={`${resource.title} — view resource`}
                        >
                            <span className="home-v2__cat">{resource.category}</span>
                            <h3>{resource.title}</h3>
                            <p>{resource.description}</p>
                            <div className="home-v2__card-foot">
                                <span>{resource.product}</span>
                                <span>{resource.readTime}</span>
                            </div>
                            <span className="home-v2__cue">View resource →</span>
                        </GlassCard>
                    ))}
                </div>
                <div className="home-v2__section-action">
                    <button type="button" className="bdna-btn bdna-btn--ghost" onClick={onGoResources}>
                        Browse all resources →
                    </button>
                </div>
            </MotionSectionWrap>

            {/* ── Latest news ─────────────────────────────────────────── */}
            <MotionSectionWrap as="section" className="home-v2__section" aria-label="Latest news">
                <SectionHead eyebrow="Latest News" title="Verified reporting from the CinNova News Center." />
                <p className="home-v2__lead">
                    New developments across technology, business, infrastructure, and public policy.
                </p>
                <div className="home-v2__grid">
                    {latestNews.map((story) => (
                        <NewsCompactCard
                            key={story.id}
                            story={story}
                            onOpenStory={onOpenNewsStory}
                            surface="homepage-latest-news"
                        />
                    ))}
                </div>
                <div className="home-v2__section-action">
                    <button type="button" className="bdna-btn bdna-btn--ghost" onClick={() => onGoNews?.("all")}>
                        Visit the News Center →
                    </button>
                </div>
            </MotionSectionWrap>

            {/* ── Latest articles ─────────────────────────────────────── */}
            <MotionSectionWrap as="section" className="home-v2__section" aria-label="Latest articles">
                <SectionHead eyebrow="Latest Articles" title="Research and insights from the CinNova blog." />
                <p className="home-v2__lead">
                    Editorial coverage of AI, education, safety, real estate, and product building.
                </p>
                <div className="home-v2__grid">
                    {latestArticles.map((post) => (
                        <GlassCard
                            key={post.id}
                            className="home-v2__article-card"
                            media={<ArticleThumb post={post} />}
                            onClick={() => onOpenArticle?.(post)}
                            aria-label={`${post.title} — read article`}
                        >
                            <span className="home-v2__cat">{post.category}</span>
                            <h3>{post.title}</h3>
                            <p>{post.excerpt}</p>
                            <div className="home-v2__card-foot">
                                <span>{post.readTime}</span>
                                <span>{post.date}</span>
                            </div>
                            <span className="home-v2__cue">Read article →</span>
                        </GlassCard>
                    ))}
                </div>
                <div className="home-v2__section-action">
                    <button type="button" className="bdna-btn bdna-btn--solid" onClick={onGoBlog}>
                        Visit the blog →
                    </button>
                </div>
            </MotionSectionWrap>

            {/* ── Newsletter (Dispatch) ───────────────────────────────── */}
            <section className="home-v2__section" id="newsletter" aria-label="Newsletter">
                <Dispatch
                    eyebrow="Stay in the loop"
                    title="Product launches, free resources, and practical AI insights."
                    copy="Join the CinNova newsletter for launch announcements, new resource drops, and editorial highlights — no spam, unsubscribe anytime."
                >
                    <ul className="home-v2__perks">
                        <li>Early access to product betas</li>
                        <li>New guides and templates as they publish</li>
                        <li>Curated articles from the CinNova blog</li>
                    </ul>
                    <NewsletterSignup
                        onSubscribe={onSubscribe}
                        source="Homepage"
                        tags={["Homepage", "Product Updates", "Resource Reader"]}
                    />
                </Dispatch>
            </section>
        </main>
    );
}

export default HomePage;
