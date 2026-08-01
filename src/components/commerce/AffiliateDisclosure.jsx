import "./AffiliateDisclosure.css";
import { getDefaultAffiliateDisclosure } from "../../data/affiliate/index.js";

/**
 * FTC-style disclosure for commercial partner links.
 * Renders ONLY when affiliateEnabled / showDisclosure is explicitly true.
 */
function AffiliateDisclosure({
    affiliateEnabled = false,
    showDisclosure = undefined,
    partnerType = "",
    className = "",
    children,
}) {
    const visible = showDisclosure === undefined ? Boolean(affiliateEnabled) : Boolean(showDisclosure);
    if (!visible) return null;

    const copy = children || getDefaultAffiliateDisclosure();

    return (
        <aside
            className={`affiliate-disclosure ${className}`.trim()}
            role="note"
            data-partner-type={partnerType || undefined}
            data-ftc-disclosure="true"
        >
            <p className="affiliate-disclosure-label">Disclosure</p>
            <p className="affiliate-disclosure-copy">{copy}</p>
        </aside>
    );
}

export default AffiliateDisclosure;
