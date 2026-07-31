import "./AffiliateDisclosure.css";

const DEFAULT_COPY =
    "CinNova may earn a commission from qualifying purchases made through certain links.";

/**
 * Renders ONLY when affiliateEnabled is explicitly true for the destination/item.
 * Do not show on ordinary retailer links (e.g. non-affiliate Amazon).
 */
function AffiliateDisclosure({
    affiliateEnabled = false,
    className = "",
    children,
}) {
    if (!affiliateEnabled) return null;
    return (
        <p className={`affiliate-disclosure ${className}`.trim()} role="note">
            {children || DEFAULT_COPY}
        </p>
    );
}

export default AffiliateDisclosure;
