/**
 * Phase M1 — cross-promotion catalog for CinNova apps & books.
 * Do not claim availability unless releaseStatus is AVAILABLE.
 * Do not invent unapproved products.
 */

export const PROMO_AVAILABILITY = Object.freeze({
    AVAILABLE: "AVAILABLE",
    COMING_SOON: "COMING_SOON",
    IN_DEVELOPMENT: "IN_DEVELOPMENT",
    CONCEPT: "CONCEPT",
});

/** Approved / known CinNova apps for promotional surfaces. */
export const APP_PROMO_CATALOG = Object.freeze([
    {
        id: "app-poisonguard",
        slug: "poisonguard",
        name: "PoisonGuard",
        kind: "app",
        availability: PROMO_AVAILABILITY.IN_DEVELOPMENT,
        landingPage: "poisonguard",
        description: "Poison and chemical safety guidance for families and pets.",
        ctaLabel: "Explore PoisonGuard",
        downloadUrl: null,
        buyUrl: null,
    },
    {
        id: "app-stagescout",
        slug: "stagescout",
        name: "StageScout",
        kind: "app",
        availability: PROMO_AVAILABILITY.COMING_SOON,
        landingPage: null,
        description: "Future CinNova app — StageScout. Landing page pending.",
        ctaLabel: "Coming soon",
        downloadUrl: null,
        buyUrl: null,
    },
    {
        id: "app-studynest",
        slug: "studynest",
        name: "StudyNest",
        kind: "app",
        availability: PROMO_AVAILABILITY.IN_DEVELOPMENT,
        landingPage: "studynest",
        description: "AI-powered studying for students of all levels.",
        ctaLabel: "Explore StudyNest",
        downloadUrl: null,
        buyUrl: null,
    },
    {
        id: "app-kiddo",
        slug: "kiddo",
        name: "Kiddo",
        kind: "app",
        availability: PROMO_AVAILABILITY.CONCEPT,
        landingPage: "kiddo",
        description: "Interactive early learning for young children.",
        ctaLabel: "Explore Kiddo",
        downloadUrl: null,
        buyUrl: null,
    },
    {
        id: "app-nightmare-forest",
        slug: "nightmare-forest",
        name: "Nightmare Forest",
        kind: "app",
        availability: PROMO_AVAILABILITY.COMING_SOON,
        landingPage: null,
        description: "Future CinNova game/app — Nightmare Forest. Not live for download.",
        ctaLabel: "Coming soon",
        downloadUrl: null,
        buyUrl: null,
    },
]);

export function listAppPromos() {
    return APP_PROMO_CATALOG.map((a) => ({ ...a }));
}

export function canClaimAppAvailable(entry) {
    return entry?.availability === PROMO_AVAILABILITY.AVAILABLE && Boolean(entry.downloadUrl || entry.buyUrl);
}

export function getAppPromoCta(entry) {
    if (!entry) return { label: "Coming soon", href: null, disabled: true };
    if (canClaimAppAvailable(entry)) {
        return { label: entry.ctaLabel, href: entry.downloadUrl || entry.buyUrl, disabled: false };
    }
    if (entry.landingPage) {
        return { label: entry.ctaLabel, href: `/products/${entry.landingPage}`, disabled: false };
    }
    return { label: "Coming soon", href: null, disabled: true };
}
