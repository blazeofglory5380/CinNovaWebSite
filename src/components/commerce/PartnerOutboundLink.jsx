import { resolvePartnerLink, partnerTypeRequiresDisclosure } from "../../data/affiliate/index.js";
import {
    trackAffiliateOutboundClick,
    trackOutboundLinkClick,
} from "../../utils/analytics.js";

/**
 * Safe outbound partner link. Renders nothing unless BOTH gates pass:
 * global VITE_AFFILIATES_ENABLED and partner.enabled, with a validated HTTPS URL.
 */
function PartnerOutboundLink({
    partnerId,
    className = "",
    children,
    placement = "",
    onClick,
    "aria-label": ariaLabel,
}) {
    const resolved = resolvePartnerLink(partnerId);
    if (!resolved.renderable || !resolved.href || !resolved.partner) return null;

    const { partner, href, rel, disclosureRequired, isCommercial } = resolved;
    const accessibleName =
        ariaLabel ||
        (typeof children === "string" ? children : "") ||
        `${partner.name} (opens in a new tab)`;

    const handleClick = (event) => {
        if (isCommercial || partnerTypeRequiresDisclosure(partner.type)) {
            trackAffiliateOutboundClick({
                partnerId: partner.id,
                partnerType: partner.type,
                placement,
                url: href,
                disclosureShown: disclosureRequired,
            });
        } else {
            trackOutboundLinkClick({
                url: href,
                label: partner.name,
                location: placement || (typeof window !== "undefined" ? window.location.pathname : ""),
            });
        }
        onClick?.(event, resolved);
    };

    return (
        <a
            href={href}
            className={className}
            target="_blank"
            rel={rel}
            aria-label={accessibleName}
            data-partner-id={partner.id}
            data-partner-type={partner.type}
            data-affiliate-active={isCommercial ? "true" : "false"}
            onClick={handleClick}
        >
            {children}
        </a>
    );
}

export default PartnerOutboundLink;
