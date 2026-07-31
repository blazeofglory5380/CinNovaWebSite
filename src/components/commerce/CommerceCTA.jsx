import {
    AFFILIATE_COMMERCE_REL,
    EXTERNAL_COMMERCE_REL,
    DESTINATION_TYPES,
    canShowPurchaseCta,
    isExternalDestination,
    isSafeExternalCommerceUrl,
} from "../../data/commerceModels.js";
import {
    trackCommerceCtaClick,
    trackCommerceOutboundClick,
    trackBookExternalPurchaseClick,
} from "../../utils/analytics.js";
import "./CommerceCTA.css";

/**
 * Reusable commercial CTA.
 * External retailer/affiliate destinations open in a new tab with safe rel.
 * Internal destinations call onInternalNavigate — never force new tabs for SPA routes.
 */
function CommerceCTA({
    entity,
    label,
    ctaType,
    placement = "unknown",
    variant = "solid",
    disabled = false,
    onInternalNavigate,
    className = "",
}) {
    if (!entity) return null;

    const resolvedLabel = label || entity.primaryCtaLabel || "Learn More";
    const resolvedCtaType = ctaType || entity.primaryCtaType || "";
    const destinationUrl = entity.destinationUrl;
    const external =
        isExternalDestination(entity.destinationType) &&
        canShowPurchaseCta({
            availability: entity.availability,
            destinationUrl,
        }) &&
        isSafeExternalCommerceUrl(destinationUrl);
    const isDisabled =
        disabled ||
        (!external &&
            entity.destinationType === DESTINATION_TYPES.NONE &&
            !onInternalNavigate);

    const classes = [
        "bdna-btn",
        variant === "ghost" ? "bdna-btn--ghost" : "bdna-btn--solid",
        "commerce-cta",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    function fireAnalytics({ outbound = false } = {}) {
        trackCommerceCtaClick({
            entity,
            placement,
            ctaType: resolvedCtaType,
            label: resolvedLabel,
        });
        if (outbound && destinationUrl) {
            trackCommerceOutboundClick({
                entity,
                placement,
                ctaType: resolvedCtaType,
                url: destinationUrl,
            });
            if (entity.entityType === "book") {
                // Backward-compatible book event — outbound is NOT a purchase.
                trackBookExternalPurchaseClick({
                    bookSlug: entity.slug,
                    bookTitle: entity.title,
                    releaseStatus: entity.availability,
                });
            }
        }
    }

    function handleClick(event) {
        if (isDisabled) {
            event.preventDefault();
            return;
        }
        if (external) {
            fireAnalytics({ outbound: true });
            return;
        }
        fireAnalytics({ outbound: false });
        if (onInternalNavigate) {
            onInternalNavigate(entity);
        }
    }

    const rel = entity.affiliateEnabled ? AFFILIATE_COMMERCE_REL : EXTERNAL_COMMERCE_REL;

    // External commercial destinations always use a real <a> for accessibility,
    // middle-click, and safe rel attributes — never synthetic popup navigation.
    if (external) {
        return (
            <a
                className={classes}
                href={destinationUrl}
                target="_blank"
                rel={rel}
                onClick={handleClick}
                data-commerce-cta={resolvedCtaType}
                data-entity-slug={entity.slug}
            >
                {resolvedLabel}
            </a>
        );
    }

    return (
        <button
            type="button"
            className={classes}
            onClick={handleClick}
            disabled={isDisabled}
            aria-disabled={isDisabled || undefined}
            data-commerce-cta={resolvedCtaType}
            data-entity-slug={entity.slug}
        >
            {resolvedLabel}
        </button>
    );
}

export default CommerceCTA;
