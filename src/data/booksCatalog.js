/**
 * CinNova Books catalog — publishing storefront data (no checkout in this phase).
 */

import { siteUrl } from "./seoConfig.js";

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
        cover: "/images/marketing/about-safety-first.jpg",
        coverAlt: "Warm kitchen and family-table atmosphere for The Southeast Asian Table",
        description:
            "A CinNova Press cookbook celebrating Southeast Asian home cooking — flavors, rituals, and tables meant to be shared.",
        synopsis:
            "Recipes and stories for everyday cooks who want fragrant, approachable Southeast Asian dishes without losing the spirit of the table.",
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
        cover: "/images/hero/cinnova-books-hero-nightmare-beyond-master.png",
        coverAlt: "Cinematic sci-fi atmosphere for Beyond the Last Light",
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
        cover: "/images/hero/cinnova-books-hero-nightmare-beyond-master.png",
        coverAlt: "Enchanted forest atmosphere for Nightmare Forest",
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
        cover: "/images/Kiddo/worlds/ReadingCastle/kiddo-world-reading-castle-v01.png",
        coverAlt: "Kiddo Reading Castle world art for the illustrated companion collection",
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
    return `${siteUrl}/books`;
}

export function getBookPath(book) {
    return `/books/${book.slug}`;
}

export function getBookUrl(book) {
    return `${siteUrl}/books/${book.slug}`;
}

export function getBookBySlug(slug) {
    return booksCatalog.find((book) => book.slug === slug) || null;
}

export function getFeaturedBook() {
    return booksCatalog.find((book) => book.featured) || booksCatalog[0];
}

export function getCatalogBooks() {
    return booksCatalog.slice();
}

export function isPurchasable(book) {
    return book.releaseStatus === BOOK_RELEASE_STATUSES.AVAILABLE && Boolean(book.externalUrl);
}

export function statusLabel(book) {
    return BOOK_STATUS_LABELS[book.releaseStatus] || book.releaseStatus;
}
