import { useEffect } from "react";
import SEO from "../components/SEO.jsx";
import CommerceCTA from "../components/commerce/CommerceCTA.jsx";
import AvailabilityBadge from "../components/commerce/AvailabilityBadge.jsx";
import AffiliateDisclosure from "../components/commerce/AffiliateDisclosure.jsx";
import NewsletterSignup from "../components/NewsletterSignup.jsx";
import {
    getBookUrl,
    getBookCoverStyle,
    isPurchasable,
    statusLabel,
    BOOK_RELEASE_STATUSES,
} from "../data/booksCatalog.js";
import { getCommerceEntityForBook } from "../data/commerceCatalog.js";
import { saveSubscriber } from "../data/newsletterService.js";
import { trackCommerceItemView } from "../utils/analytics.js";
import "../styles/brand-dna.css";
import "./Books.css";

function BookDetailPage({ book, onBackToBooks }) {
    const purchasable = isPurchasable(book);
    const commerce = getCommerceEntityForBook(book);
    const showJoinUpdates =
        book.releaseStatus === BOOK_RELEASE_STATUSES.COMING_SOON ||
        book.releaseStatus === BOOK_RELEASE_STATUSES.IN_DEVELOPMENT;

    // Book schema: omit offers/price/availability inventing. AVAILABLE books
    // still do not include Offer until CinNova has a verified on-site price.
    const schema = {
        "@context": "https://schema.org",
        "@type": "Book",
        name: book.title,
        description: book.description,
        url: getBookUrl(book),
        genre: book.category,
        publisher: { "@type": "Organization", name: "CinNova" },
    };

    useEffect(() => {
        const entity = getCommerceEntityForBook(book);
        if (entity) {
            trackCommerceItemView({ entity, placement: "book_detail" });
        }
        // Intentionally keyed on slug — entity object is rebuilt each render.
        // eslint-disable-next-line react-hooks/exhaustive-deps -- book.slug
    }, [book.slug]);

    return (
        <main className="books-v2 brand-dna">
            <SEO
                title={`${book.title} | CinNova Books`}
                description={book.description}
                url={getBookUrl(book)}
                type="website"
                image={book.cover}
                schema={schema}
            />

            <section className="books-v2__section" aria-label={book.title}>
                <button type="button" className="bdna-btn bdna-btn--ghost" onClick={onBackToBooks}>
                    ← All Books
                </button>

                <div className="books-v2__featured" style={{ marginTop: 28 }}>
                    <div
                        className={`books-v2__featured-cover${book.coverFit === "contain" ? " books-v2__featured-cover--contain" : ""}`}
                    >
                        <img
                            src={book.cover}
                            alt={book.coverAlt}
                            decoding="async"
                            style={getBookCoverStyle(book)}
                        />
                    </div>
                    <div className="books-v2__featured-copy">
                        <div className="books-v2__card-meta">
                            <AvailabilityBadge status={book.releaseStatus} className="books-v2__status" />
                            <span className="books-v2__cat">{book.category}</span>
                        </div>
                        <h1 className="books-v2__detail-title">{book.title}</h1>
                        <p className="books-v2__lead">{book.synopsis || book.description}</p>
                        <p className="books-v2__formats">{book.formats.join(" · ")}</p>
                        {commerce?.retailer && purchasable && (
                            <p className="books-v2__formats">Retailer: {commerce.retailer}</p>
                        )}
                        <div className="books-v2__card-actions">
                            {purchasable ? (
                                <CommerceCTA
                                    entity={commerce}
                                    placement="book_detail_primary"
                                />
                            ) : (
                                <button type="button" className="bdna-btn bdna-btn--solid" disabled>
                                    {book.releaseStatus === BOOK_RELEASE_STATUSES.COMING_SOON
                                        ? "Coming Soon"
                                        : "In Development"}
                                </button>
                            )}
                            <button type="button" className="bdna-btn bdna-btn--ghost" onClick={onBackToBooks}>
                                Back to catalog
                            </button>
                        </div>
                        <AffiliateDisclosure affiliateEnabled={Boolean(commerce?.affiliateEnabled)} />
                        {!purchasable && (
                            <p className="books-v2__lead" style={{ marginTop: 18 }}>
                                This title is not available for purchase on CinNova yet. Status: {statusLabel(book)}.
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {showJoinUpdates && (
                <section className="books-v2__section" aria-label="Join updates">
                    <h2 className="books-v2__detail-title" style={{ fontSize: "1.35rem" }}>
                        Join updates
                    </h2>
                    <p className="books-v2__lead">
                        Get CinNova Books news when this title moves forward. No fake waitlist — this uses the
                        existing CinNova newsletter.
                    </p>
                    <NewsletterSignup
                        onSubscribe={saveSubscriber}
                        source="Book Detail"
                        tags={["Books", book.slug, book.releaseStatus]}
                        placement="book_detail"
                        entitySlug={book.slug}
                        campaignId={`book-updates-${book.slug}`}
                        buttonLabel="Join Updates"
                        placeholder="Email for title updates"
                    />
                </section>
            )}
        </main>
    );
}

export default BookDetailPage;
