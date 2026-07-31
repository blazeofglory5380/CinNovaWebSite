import { useEffect } from "react";
import SEO from "../components/SEO.jsx";
import CinNovaCoreHero from "../components/brand-dna/CinNovaCoreHero.jsx";
import SectionHead from "../components/brand-dna/SectionHead.jsx";
import CommerceCTA from "../components/commerce/CommerceCTA.jsx";
import AvailabilityBadge from "../components/commerce/AvailabilityBadge.jsx";
import AffiliateDisclosure from "../components/commerce/AffiliateDisclosure.jsx";
import {
    getBooksIndexUrl,
    getCatalogBooks,
    getFeaturedBook,
    getBookCoverStyle,
} from "../data/booksCatalog.js";
import { getCommerceEntityForBook } from "../data/commerceCatalog.js";
import {
    trackBookCardClick,
    trackBooksHeroExploreClick,
    trackBooksHeroFeaturedClick,
    trackCommerceItemView,
} from "../utils/analytics.js";
import "../styles/brand-dna.css";
import "./Books.css";

const BOOKS_HERO_VIDEO = "/images/hero/cinnova-books-hero-nightmare-beyond.mp4";
const BOOKS_HERO_POSTER = "/images/hero/cinnova-books-hero-nightmare-beyond-master.png";

function BookCard({ book, onOpenBook }) {
    const commerce = getCommerceEntityForBook(book);

    return (
        <article className="books-v2__card" data-status={book.releaseStatus}>
            <div className={`books-v2__card-cover${book.coverFit === "contain" ? " books-v2__card-cover--contain" : ""}`}>
                <img
                    src={book.cover}
                    alt={book.coverAlt}
                    loading="lazy"
                    decoding="async"
                    style={getBookCoverStyle(book)}
                />
            </div>
            <div className="books-v2__card-body">
                <div className="books-v2__card-meta">
                    <AvailabilityBadge status={book.releaseStatus} className="books-v2__status" />
                    <span className="books-v2__cat">{book.category}</span>
                </div>
                <h3>{book.title}</h3>
                <p>{book.description}</p>
                <p className="books-v2__formats">{book.formats.join(" · ")}</p>
                {commerce?.retailer && (
                    <p className="books-v2__formats">Retailer: {commerce.retailer}</p>
                )}
                <div className="books-v2__card-actions">
                    <CommerceCTA
                        entity={commerce}
                        placement="books_catalog_card"
                        onInternalNavigate={() => {
                            trackBookCardClick({
                                bookSlug: book.slug,
                                bookTitle: book.title,
                                releaseStatus: book.releaseStatus,
                            });
                            onOpenBook(book.slug);
                        }}
                    />
                    <button
                        type="button"
                        className="bdna-btn bdna-btn--ghost"
                        onClick={() => {
                            trackBookCardClick({
                                bookSlug: book.slug,
                                bookTitle: book.title,
                                releaseStatus: book.releaseStatus,
                            });
                            onOpenBook(book.slug);
                        }}
                    >
                        Details
                    </button>
                </div>
                <AffiliateDisclosure affiliateEnabled={Boolean(commerce?.affiliateEnabled)} />
            </div>
        </article>
    );
}

function Books({ onNavigate, onOpenBook }) {
    const featured = getFeaturedBook();
    const featuredCommerce = getCommerceEntityForBook(featured);
    const catalog = getCatalogBooks();
    const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "CinNova Books",
        description: "Original fiction, illustrated worlds, cookbooks, and companion editions from CinNova.",
        url: getBooksIndexUrl(),
        publisher: { "@type": "Organization", name: "CinNova", url: "https://getcinnova.com" },
    };

    useEffect(() => {
        const entity = getCommerceEntityForBook(featured);
        if (entity) {
            trackCommerceItemView({ entity, placement: "books_index" });
        }
        // Intentionally keyed on slug — entity object is rebuilt each render.
        // eslint-disable-next-line react-hooks/exhaustive-deps -- featured.slug
    }, [featured.slug]);

    function scrollToCatalog() {
        trackBooksHeroExploreClick();
        document.getElementById("books-catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function scrollToFeatured() {
        trackBooksHeroFeaturedClick();
        document.getElementById("books-featured")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return (
        <main className="books-v2 brand-dna">
            <SEO
                title="Books | CinNova Publishing"
                description="Explore CinNova Books — original fiction, illustrated worlds, cookbooks, and companion editions from CinNova Press."
                url={getBooksIndexUrl()}
                type="website"
                image={BOOKS_HERO_POSTER}
                schema={schema}
            />

            <CinNovaCoreHero
                className="cn-core-hero--books"
                eyebrow="CinNova Books"
                titleA="Stories That Open"
                titleB="New Worlds"
                subtitle="Original fiction, illustrated worlds, cookbooks, and companion editions from CinNova."
                videoSrc={BOOKS_HERO_VIDEO}
                poster={BOOKS_HERO_POSTER}
                objectPosition="center center"
                preload="metadata"
                primaryCta={{ label: "Explore Books", onClick: scrollToCatalog }}
                secondaryCta={{ label: "Featured Release", onClick: scrollToFeatured }}
            />

            <section id="books-featured" className="books-v2__section" aria-label="Featured release">
                <SectionHead eyebrow="Featured Release" title={featured.title} />
                <div className="books-v2__featured">
                    <div
                        className={`books-v2__featured-cover${featured.coverFit === "contain" ? " books-v2__featured-cover--contain" : ""}`}
                    >
                        <img
                            src={featured.cover}
                            alt={featured.coverAlt}
                            loading="lazy"
                            decoding="async"
                            style={getBookCoverStyle(featured)}
                        />
                    </div>
                    <div className="books-v2__featured-copy">
                        <div className="books-v2__card-meta">
                            <AvailabilityBadge status={featured.releaseStatus} className="books-v2__status" />
                            <span className="books-v2__cat">{featured.category}</span>
                        </div>
                        <p className="books-v2__lead">{featured.description}</p>
                        <p className="books-v2__formats">{featured.formats.join(" · ")}</p>
                        {featuredCommerce?.retailer && (
                            <p className="books-v2__formats">Available via {featuredCommerce.retailer}</p>
                        )}
                        <div className="books-v2__card-actions">
                            <CommerceCTA
                                entity={featuredCommerce}
                                placement="books_featured"
                                onInternalNavigate={() => onOpenBook(featured.slug)}
                            />
                            <button
                                type="button"
                                className="bdna-btn bdna-btn--ghost"
                                onClick={() => onOpenBook(featured.slug)}
                            >
                                Book details
                            </button>
                        </div>
                        <AffiliateDisclosure affiliateEnabled={Boolean(featuredCommerce?.affiliateEnabled)} />
                    </div>
                </div>
            </section>

            <section id="books-catalog" className="books-v2__section" aria-label="Book catalog">
                <SectionHead eyebrow="Catalog" title="Titles from CinNova Books" />
                <p className="books-v2__lead">
                    Available editions, coming releases, and properties still in development — clearly labeled so
                    nothing looks purchasable before it is ready.
                </p>
                <div className="books-v2__grid">
                    {catalog.map((book) => (
                        <BookCard key={book.id} book={book} onOpenBook={onOpenBook} />
                    ))}
                </div>
            </section>

            <section className="books-v2__section books-v2__note" aria-label="Publishing note">
                <p>
                    CinNova Books is the publishing home for CinNova Press titles and companion editions. Checkout
                    remains on verified external storefronts for available releases.{" "}
                    <button type="button" className="books-v2__text-link" onClick={() => onNavigate("products")}>
                        Explore CinNova products
                    </button>
                    .
                </p>
            </section>
        </main>
    );
}

export default Books;
