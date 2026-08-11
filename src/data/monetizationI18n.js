/**
 * Phase M1 — monetization UI strings + locale-aware price formatting.
 * Billing currency is never silently changed; display formatting only.
 */

export const MONETIZATION_LOCALES = Object.freeze([
    "en",
    "fr",
    "de",
    "es",
    "nb",
    "hi",
]);

const STRINGS = Object.freeze({
    en: {
        storeTitle: "CinNova Store",
        storeOffline: "Hosted checkout is offline. Browse products; purchases are not available yet.",
        checkoutDisabled: "Checkout is disabled. No payment will be processed.",
        cartEmpty: "Your cart is empty.",
        affiliateDisclosureTitle: "Affiliate Disclosure",
        contactSalesTitle: "Contact Sales",
        mediaKitMetricsOnRequest: "Available on request",
        comingSoon: "Coming soon",
        joinWaitlist: "Join waitlist",
        refundPolicyTitle: "Refund Policy",
        digitalProductTermsTitle: "Digital Product Terms",
        cookiePolicyTitle: "Cookie Policy",
        disclaimerTitle: "Disclaimer",
        accessibilityTitle: "Accessibility Statement",
        dmcaTitle: "Copyright / DMCA",
        sponsorshipDisclosureTitle: "Sponsorship & Advertising Disclosure",
        demoLabel: "DEMO",
        attorneyReviewRequired: "This page has not received attorney review.",
    },
    fr: {
        storeTitle: "Boutique CinNova",
        storeOffline: "Le paiement hébergé est hors ligne. Parcourez les produits ; les achats ne sont pas encore disponibles.",
        checkoutDisabled: "Le paiement est désactivé. Aucun paiement ne sera traité.",
        cartEmpty: "Votre panier est vide.",
        affiliateDisclosureTitle: "Divulgation d’affiliation",
        contactSalesTitle: "Contacter les ventes",
        mediaKitMetricsOnRequest: "Disponible sur demande",
        comingSoon: "Bientôt disponible",
        joinWaitlist: "Rejoindre la liste d’attente",
        refundPolicyTitle: "Politique de remboursement",
        digitalProductTermsTitle: "Conditions des produits numériques",
        cookiePolicyTitle: "Politique de cookies",
        disclaimerTitle: "Avertissement",
        accessibilityTitle: "Déclaration d’accessibilité",
        dmcaTitle: "Droit d’auteur / DMCA",
        sponsorshipDisclosureTitle: "Divulgation sponsoring et publicité",
        demoLabel: "DÉMO",
        attorneyReviewRequired: "Cette page n’a pas fait l’objet d’une revue juridique.",
    },
    de: {
        storeTitle: "CinNova Shop",
        storeOffline: "Gehosteter Checkout ist offline. Produkte ansehen; Käufe sind noch nicht verfügbar.",
        checkoutDisabled: "Checkout ist deaktiviert. Es wird keine Zahlung verarbeitet.",
        cartEmpty: "Ihr Warenkorb ist leer.",
        affiliateDisclosureTitle: "Affiliate-Offenlegung",
        contactSalesTitle: "Vertrieb kontaktieren",
        mediaKitMetricsOnRequest: "Auf Anfrage verfügbar",
        comingSoon: "Demnächst",
        joinWaitlist: "Warteliste beitreten",
        refundPolicyTitle: "Rückerstattungsrichtlinie",
        digitalProductTermsTitle: "Bedingungen für digitale Produkte",
        cookiePolicyTitle: "Cookie-Richtlinie",
        disclaimerTitle: "Haftungsausschluss",
        accessibilityTitle: "Barrierefreiheitserklärung",
        dmcaTitle: "Urheberrecht / DMCA",
        sponsorshipDisclosureTitle: "Sponsoring- und Werbeoffenlegung",
        demoLabel: "DEMO",
        attorneyReviewRequired: "Diese Seite wurde nicht anwaltlich geprüft.",
    },
    es: {
        storeTitle: "Tienda CinNova",
        storeOffline: "El checkout alojado está fuera de línea. Explore productos; las compras aún no están disponibles.",
        checkoutDisabled: "El checkout está desactivado. No se procesará ningún pago.",
        cartEmpty: "Tu carrito está vacío.",
        affiliateDisclosureTitle: "Divulgación de afiliados",
        contactSalesTitle: "Contactar ventas",
        mediaKitMetricsOnRequest: "Disponible bajo petición",
        comingSoon: "Próximamente",
        joinWaitlist: "Unirse a la lista de espera",
        refundPolicyTitle: "Política de reembolsos",
        digitalProductTermsTitle: "Términos de productos digitales",
        cookiePolicyTitle: "Política de cookies",
        disclaimerTitle: "Aviso legal",
        accessibilityTitle: "Declaración de accesibilidad",
        dmcaTitle: "Copyright / DMCA",
        sponsorshipDisclosureTitle: "Divulgación de patrocinio y publicidad",
        demoLabel: "DEMO",
        attorneyReviewRequired: "Esta página no ha sido revisada por un abogado.",
    },
    nb: {
        storeTitle: "CinNova-butikk",
        storeOffline: "Hostet betaling er offline. Se produkter; kjøp er ikke tilgjengelig ennå.",
        checkoutDisabled: "Betaling er deaktivert. Ingen betaling vil bli behandlet.",
        cartEmpty: "Handlekurven din er tom.",
        affiliateDisclosureTitle: "Affiliate-opplysning",
        contactSalesTitle: "Kontakt salg",
        mediaKitMetricsOnRequest: "Tilgjengelig på forespørsel",
        comingSoon: "Kommer snart",
        joinWaitlist: "Bli med på ventelisten",
        refundPolicyTitle: "Refusjonspolicy",
        digitalProductTermsTitle: "Vilkår for digitale produkter",
        cookiePolicyTitle: "Informasjonskapsler",
        disclaimerTitle: "Ansvarsfraskrivelse",
        accessibilityTitle: "Tilgjengelighetserklæring",
        dmcaTitle: "Opphavsrett / DMCA",
        sponsorshipDisclosureTitle: "Sponsing- og annonseopplysning",
        demoLabel: "DEMO",
        attorneyReviewRequired: "Denne siden er ikke juridisk gjennomgått.",
    },
    hi: {
        storeTitle: "CinNova स्टोर",
        storeOffline: "होस्टेड चेकआउट ऑफलाइन है। उत्पाद देखें; खरीदारी अभी उपलब्ध नहीं है।",
        checkoutDisabled: "चेकआउट बंद है। कोई भुगतान संसाधित नहीं होगा।",
        cartEmpty: "आपकी कार्ट खाली है।",
        affiliateDisclosureTitle: "एफिलिएट प्रकटीकरण",
        contactSalesTitle: "सेल्स से संपर्क करें",
        mediaKitMetricsOnRequest: "अनुरोध पर उपलब्ध",
        comingSoon: "जल्द आ रहा है",
        joinWaitlist: "वेटलिस्ट में शामिल हों",
        refundPolicyTitle: "रिफंड नीति",
        digitalProductTermsTitle: "डिजिटल उत्पाद शर्तें",
        cookiePolicyTitle: "कुकी नीति",
        disclaimerTitle: "अस्वीकरण",
        accessibilityTitle: "पहुँच-योग्यता कथन",
        dmcaTitle: "कॉपीराइट / DMCA",
        sponsorshipDisclosureTitle: "प्रायोजन और विज्ञापन प्रकटीकरण",
        demoLabel: "डेमो",
        attorneyReviewRequired: "इस पृष्ठ की वकील समीक्षा नहीं हुई है।",
    },
});

export function normalizeMonetizationLocale(locale = "en") {
    const code = String(locale || "en").toLowerCase().split("-")[0];
    return MONETIZATION_LOCALES.includes(code) ? code : "en";
}

export function getMonetizationString(key, locale = "en") {
    const loc = normalizeMonetizationLocale(locale);
    return STRINGS[loc]?.[key] || STRINGS.en[key] || key;
}

/**
 * Display-only currency formatting. Does not change billing currency.
 * When amount is null/undefined, returns a coming-soon label.
 */
export function formatMonetizationPrice(amount, {
    locale = "en",
    currency = "USD",
    billingCurrencyLocked = true,
} = {}) {
    if (amount == null || Number.isNaN(Number(amount))) {
        return getMonetizationString("comingSoon", locale);
    }
    const loc = normalizeMonetizationLocale(locale);
    try {
        return new Intl.NumberFormat(loc, {
            style: "currency",
            currency: billingCurrencyLocked ? currency : currency,
        }).format(Number(amount));
    } catch {
        return `${currency} ${Number(amount).toFixed(2)}`;
    }
}

export function listMonetizationLocales() {
    return [...MONETIZATION_LOCALES];
}
