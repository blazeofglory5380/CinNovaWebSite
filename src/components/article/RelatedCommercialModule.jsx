import CommerceCTA from "../commerce/CommerceCTA.jsx";
import AvailabilityBadge from "../commerce/AvailabilityBadge.jsx";
import AffiliateDisclosure from "../commerce/AffiliateDisclosure.jsx";
import NewsletterSignup from "../NewsletterSignup.jsx";
import { getBookBySlug, getBookCoverStyle, isPurchasable } from "../../data/booksCatalog.js";
import { getCommerceEntityForBook } from "../../data/commerceCatalog.js";
import { resolveCommercialModule } from "../../data/commercialModules.js";
import "./RelatedCommercialModule.css";

/**
 * Manually enabled commercial module for blog articles.
 * Never auto-inserts random promotions. Requires post.commercialModule.enabled.
 */
function RelatedCommercialModule({
    post,
    onNavigate,
    onOpenBook,
    onSubscribe,
}) {
    const resolved = resolveCommercialModule(post?.commercialModule);
    if (!resolved) return null;

    if (resolved.type === "newsletter") {
        return (
            <aside className="related-commercial" aria-label="Newsletter">
                <p className="related-commercial__eyebrow">From CinNova</p>
                <h2 className="related-commercial__title">{resolved.title}</h2>
                <p className="related-commercial__copy">{resolved.copy}</p>
                <NewsletterSignup
                    onSubscribe={onSubscribe}
                    source={`Article commercial: ${post?.slug || "blog"}`}
                    tags={["Blog", "Commercial Module", post?.category].filter(Boolean)}
                    placement="blog_article_commercial"
                    entitySlug={post?.slug || ""}
                    campaignId={resolved.campaignId}
                    buttonLabel="Join Updates"
                />
            </aside>
        );
    }

    if (resolved.type === "book") {
        const book = getBookBySlug(resolved.bookSlug);
        if (!book) return null;
        const commerce = getCommerceEntityForBook(book);
        const purchasable = isPurchasable(book);

        return (
            <aside className="related-commercial" aria-label="Related book">
                <p className="related-commercial__eyebrow">Related from CinNova Books</p>
                <div className="related-commercial__book">
                    <div
                        className={`related-commercial__cover${book.coverFit === "contain" ? " related-commercial__cover--contain" : ""}`}
                    >
                        <img src={book.cover} alt={book.coverAlt} loading="lazy" decoding="async" style={getBookCoverStyle(book)} />
                    </div>
                    <div>
                        <div className="related-commercial__meta">
                            <AvailabilityBadge status={book.releaseStatus} />
                            <span className="related-commercial__cat">{book.category}</span>
                        </div>
                        <h2 className="related-commercial__title">{book.title}</h2>
                        <p className="related-commercial__copy">{book.description}</p>
                        <div className="related-commercial__actions">
                            {purchasable ? (
                                <CommerceCTA entity={commerce} placement="blog_article_commercial" />
                            ) : null}
                            <button
                                type="button"
                                className="bdna-btn bdna-btn--ghost"
                                onClick={() => onOpenBook?.(book.slug)}
                            >
                                {purchasable ? "Book details" : "Learn more"}
                            </button>
                        </div>
                        <AffiliateDisclosure affiliateEnabled={Boolean(commerce?.affiliateEnabled)} />
                    </div>
                </div>
            </aside>
        );
    }

    if (resolved.type === "product") {
        return (
            <aside className="related-commercial" aria-label="Related product">
                <p className="related-commercial__eyebrow">Related CinNova product</p>
                <h2 className="related-commercial__title">{resolved.title}</h2>
                <p className="related-commercial__copy">{resolved.copy}</p>
                <button
                    type="button"
                    className="bdna-btn bdna-btn--solid"
                    onClick={() => onNavigate?.(resolved.productPage)}
                >
                    {resolved.ctaLabel}
                </button>
            </aside>
        );
    }

    return null;
}

export default RelatedCommercialModule;
