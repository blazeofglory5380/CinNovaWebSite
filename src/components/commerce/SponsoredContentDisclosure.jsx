import { normalizeSponsorMeta } from "../../data/sponsorMeta.js";
import "./SponsoredContentDisclosure.css";

/**
 * Phase 11.1 sponsored disclosure for commerce-aware surfaces.
 * Existing article SponsoredDisclosure remains for legacy article sponsor objects.
 * Renders only when normalizeSponsorMeta succeeds (real name + https URL).
 */
function SponsoredContentDisclosure({ sponsor, className = "" }) {
    const meta = normalizeSponsorMeta(sponsor);
    if (!meta) return null;

    return (
        <div className={`sponsored-content-disclosure ${className}`.trim()} role="note">
            <span className="sponsored-content-disclosure__label">Sponsored</span>
            <span className="sponsored-content-disclosure__text">
                {meta.disclosure} Sponsor:{" "}
                <a
                    href={meta.sponsorUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="sponsored-content-disclosure__link"
                >
                    {meta.sponsorName}
                </a>
                .
            </span>
        </div>
    );
}

export default SponsoredContentDisclosure;
