import SEO from "../components/SEO.jsx";
import {
    getBookUrl,
    getBookCoverStyle,
    isPurchasable,
    statusLabel,
} from "../data/booksCatalog.js";
import {
    trackBookCardClick,
    trackBookExternalPurchaseClick,
} from "../utils/analytics.js";
import "../styles/brand-dna.css";
import "./Books.css";

function statusClass(status) {
    if (status === "AVAILABLE") return "books-v2__status--available";
    if (status === "COMING_SOON") return "books-v2__status--coming-soon";
    return "books-v2__status--in-development";
}

function BookDetailPage({ book, onBackToBooks }) {
    const purchasable = isPurchasable(book);
    const schema = {
        "@context": "https://schema.org",
        "@type": "Book",
        name: book.title,
        description: book.description,
        url: getBookUrl(book),
        genre: book.category,
        publisher: { "@type": "Organization", name: "CinNova" },
    };

    function primaryAction() {
        trackBookCardClick({
            bookSlug: book.slug,
            bookTitle: book.title,
            releaseStatus: book.releaseStatus,
        });
        if (purchasable) {
            trackBookExternalPurchaseClick({
                bookSlug: book.slug,
                bookTitle: book.title,
                releaseStatus: book.releaseStatus,
            });
            window.open(book.externalUrl, "_blank", "noopener,noreferrer");
        }
    }

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
                            <span className={`books-v2__status ${statusClass(book.releaseStatus)}`}>
                                {statusLabel(book)}
                            </span>
                            <span className="books-v2__cat">{book.category}</span>
                        </div>
                        <h1 className="books-v2__detail-title">{book.title}</h1>
                        <p className="books-v2__lead">{book.synopsis || book.description}</p>
                        <p className="books-v2__formats">{book.formats.join(" · ")}</p>
                        <div className="books-v2__card-actions">
                            {purchasable ? (
                                <button type="button" className="bdna-btn bdna-btn--solid" onClick={primaryAction}>
                                    View on Amazon
                                </button>
                            ) : (
                                <button type="button" className="bdna-btn bdna-btn--solid" disabled>
                                    {book.ctaLabel}
                                </button>
                            )}
                            <button type="button" className="bdna-btn bdna-btn--ghost" onClick={onBackToBooks}>
                                Back to catalog
                            </button>
                        </div>
                        {!purchasable && (
                            <p className="books-v2__lead" style={{ marginTop: 18 }}>
                                This title is not available for purchase on CinNova yet. Status: {statusLabel(book)}.
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default BookDetailPage;
