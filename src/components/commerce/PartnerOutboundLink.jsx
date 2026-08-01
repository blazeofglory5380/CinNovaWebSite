import { resolvePartnerLink } from "../../data/affiliate/index.js";
import { trackAffiliateOutboundClick } from "../../utils/analytics.js";

/**
 * Safe outbound partner link. Renders nothing unless the partner is globally
 * and individually enabled with a validated destination (no hardcoded URLs).
 */
function PartnerOutboundLink({
    partnerId,
    className = "",
    children,
    placement = "",
    onClick,
}) {
    const resolved = resolvePartnerLink(partnerId);
    if (!resolved.renderable || !resolved.href || !resolved.partner) return null;

    const { partner, href, rel, disclosureRequired, campaignId } = resolved;

    const handleClick = (event) => {
        trackAffiliateOutboundClick({
            partnerId: partner.id,
            partnerName: partner.name,
            partnerType: partner.type,
            placement,
            url: href,
            campaignId,
            disclosureShown: disclosureRequired,
        });
        onClick?.(event, resolved);
    };

    return (
        <a
            href={href}
            className={className}
            target="_blank"
            rel={rel}
            data-partner-id={partner.id}
            data-partner-type={partner.type}
            data-affiliate-active="true"
            onClick={handleClick}
        >
            {children}
        </a>
    );
}

export default PartnerOutboundLink;
