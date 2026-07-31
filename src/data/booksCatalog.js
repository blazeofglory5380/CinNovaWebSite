/**
 * CinNova Books catalog — publishing storefront data (no checkout in this phase).
 *
 * Cover artwork must be approved project identity assets (not stock/placeholder).
 * Shared cinematic frames may use intentional object-position crops so each title
 * shows its own narrative side without inventing new art.
 *
 * Keep this module free of seoConfig imports — seoConfig imports booksCatalog for
 * sitemap entries, and a cycle can break SPA hydration.
 */

const SITE_URL = "https://getcinnova.com";

export const BOOK_RELEASE_STATUSES = Object.freeze({
    AVAILABLE: "AVAILABLE",
    COMING_SOON: "COMING_SOON",
    IN_DEVELOPMENT: "IN_DEVELOPMENT",
});

export const BOOK_STATUS_LABELS = Object.freeze({
    AVAILABLE: "Available",
    COMING_SOON: "Coming Soon",
    IN_DEVELOPMENT: "In Development",
});

/** Shared approved Books hero — Nightmare Forest (left) + Beyond the Last Light (right). */
export const BOOKS_SHARED_CINEMATIC_ART =
    "/images/hero/cinnova-books-hero-nightmare-beyond-master.png";

/** @typedef {"AVAILABLE"|"COMING_SOON"|"IN_DEVELOPMENT"} BookReleaseStatus */

/**
 * @typedef {object} BookEntry
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} category
 * @property {BookReleaseStatus} releaseStatus
 * @property {string} cover
 * @property {string} coverAlt
 * @property {"contain"|"cover"} [coverFit]
 * @property {string} [coverPosition]
 * @property {string} description
 * @property {string[]} formats
 * @property {string} ctaLabel
 * @property {boolean} featured
 * @property {string|null} externalUrl
 * @property {string} internalRoute
 * @property {string} [synopsis]
 */

/** @type {BookEntry[]} */
export const booksCatalog = [
    {
        id: "book-southeast-asian-table",
        slug: "the-southeast-asian-table",
        title: "The Southeast Asian Table",
        category: "Cookbook",
        releaseStatus: BOOK_RELEASE_STATUSES.AVAILABLE,
        // Phase 6P final Kindle front cover from the TSAT publishing project.
        cover: "/images/books/the-southeast-asian-table/phase-6p-kindle-front-cover-final.jpg",
        coverAlt:
            "The Southeast Asian Table Kindle cover by Thea Cin — dark green title panel over a feast table of Southeast Asian dishes",
        coverFit: "contain",
        coverPosition: "center center",
        description:
            "A CinNova Press cookbook celebrating Southeast Asian home cooking — flavors, rituals, and tables meant to be shared.",
        synopsis:
            "Recipes and stories for everyday cooks who want fragrant, approachable Southeast Asian dishes without losing the spirit of the table.",
        // Verified highlights only — drawn from existing catalog copy / formats. No invented reviews or stats.
        highlights: [
            "Recipes and stories for everyday home cooks",
            "Southeast Asian flavors, rituals, and tables meant to be shared",
            "Approachable dishes without losing the spirit of the table",
            "Kindle and ebook edition available now via Amazon",
        ],
        formats: ["Kindle", "Ebook"],
        ctaLabel: "View on Amazon",
        featured: true,
        // Verified commercial ASIN for the live Kindle edition.
        externalUrl: "https://www.amazon.com/dp/B0H8YL3L5L",
        internalRoute: "/books/the-southeast-asian-table",
    },
    {
        id: "book-beyond-the-last-light",
        slug: "beyond-the-last-light",
        title: "Beyond the Last Light",
        category: "Thriller · Horror · Science Fiction",
        releaseStatus: BOOK_RELEASE_STATUSES.COMING_SOON,
        cover: BOOKS_SHARED_CINEMATIC_ART,
        coverAlt:
            "Beyond the Last Light — traveler facing a distant city of light beneath a vast planet sky",
        coverFit: "cover",
        // Intentional crop of the approved composite: sci-fi / city-of-light side.
        coverPosition: "82% 42%",
        description:
            "A dark speculative thriller from CinNova Books — worlds on the edge of light, memory, and what comes after.",
        synopsis:
            "When the last reliable lights fail, survivors chase truth across a fractured landscape where science fiction, horror, and human resolve collide.",
        formats: ["Ebook", "Print (planned)"],
        ctaLabel: "Learn More",
        featured: false,
        externalUrl: null,
        internalRoute: "/books/beyond-the-last-light",
    },
    {
        id: "book-nightmare-forest",
        slug: "nightmare-forest",
        title: "Nightmare Forest",
        category: "Illustrated Fiction",
        releaseStatus: BOOK_RELEASE_STATUSES.IN_DEVELOPMENT,
        cover: BOOKS_SHARED_CINEMATIC_ART,
        coverAlt:
            "Nightmare Forest — antlered forest figure and masked children in a moonlit haunted wood",
        coverFit: "cover",
        // Intentional crop of the approved composite: forest / folklore side.
        coverPosition: "16% 48%",
        description:
            "An illustrated book and franchise property in development — folklore, forest dread, and cinematic world-building.",
        synopsis:
            "Nightmare Forest is being developed as a book and illustrated property. Story worlds and art direction are in progress; it is not available for purchase yet.",
        formats: ["Illustrated edition (planned)"],
        ctaLabel: "In Development",
        featured: false,
        externalUrl: null,
        internalRoute: "/books/nightmare-forest",
    },
    {
        id: "book-kiddo-illustrated",
        slug: "kiddo-illustrated-collection",
        title: "Kiddo Illustrated Collection",
        category: "Children’s · Companion Editions",
        releaseStatus: BOOK_RELEASE_STATUSES.IN_DEVELOPMENT,
        // Approved Kiddo Reading Castle world art (kiddoAssets registry).
        cover: "/images/Kiddo/worlds/ReadingCastle/kiddo-world-reading-castle-v01.png",
        coverAlt:
            "Kiddo Reading Castle — storybook towers and fairy-tale gates from the illustrated learning world",
        coverFit: "cover",
        coverPosition: "center 42%",
        description:
            "Upcoming illustrated companions and story collections from the Kiddo learning universe — characters, worlds, and parent-friendly reads.",
        synopsis:
            "A publishing lane for Kiddo companions and illustrated stories. Individual titles will be listed as they are cleared for release; nothing here is purchasable yet.",
        formats: ["Illustrated print (planned)", "Ebook (planned)"],
        ctaLabel: "In Development",
        featured: false,
        externalUrl: null,
        internalRoute: "/books/kiddo-illustrated-collection",
    },
];

export function getBooksIndexPath() {
    return "/books";
}

export function getBooksIndexUrl() {
    return `${SITE_URL}/books`;
}

export function getBookPath(book) {
    return `/books/${book.slug}`;
}

export function getBookUrl(book) {
    return `${SITE_URL}/books/${book.slug}`;
}

export function getBookBySlug(slug) {
    return booksCatalog.find((book) => book.slug === slug) || null;
}

export function getFeaturedBook() {
    return booksCatalog.find((book) => book.featured) || booksCatalog[0];
}

export function getCatalogBooks() {
    const rank = {
        [BOOK_RELEASE_STATUSES.AVAILABLE]: 0,
        [BOOK_RELEASE_STATUSES.COMING_SOON]: 1,
        [BOOK_RELEASE_STATUSES.IN_DEVELOPMENT]: 2,
    };
    return booksCatalog
        .slice()
        .sort((a, b) => (rank[a.releaseStatus] ?? 9) - (rank[b.releaseStatus] ?? 9));
}

export function isPurchasable(book) {
    return book.releaseStatus === BOOK_RELEASE_STATUSES.AVAILABLE && Boolean(book.externalUrl);
}

export function statusLabel(book) {
    return BOOK_STATUS_LABELS[book.releaseStatus] || book.releaseStatus;
}

/** Inline styles for approved cover presentation (fit + intentional crop). */
export function getBookCoverStyle(book) {
    return {
        objectFit: book.coverFit || "cover",
        objectPosition: book.coverPosition || "center center",
    };
}
