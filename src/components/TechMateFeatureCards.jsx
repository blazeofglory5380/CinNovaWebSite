import { MotionCardWrap } from "../motion/MotionCardWrap.jsx";
import "./TechMateFeatureCards.css";

/*
 * TechMateFeatureCards — TechMate feature grid with glowing icon panels
 *
 *
 * Renders the same feature data (title/category/description) but swaps each
 * card's blank image area for a dark-navy, blue/purple-glow panel with a cyan
 * line icon matched to the topic — matching the approved TechMate hero. No
 * images/stock photos. Scoped under `.tmf-card`.
 */

// Topic-matched cyan line icons (24x24, stroke = currentColor).
const ICONS = {
    // ── Phase 3D honest help-card set ──────────────────────────────────
    "Diagnose common device problems": (
        <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /><path d="M8 10l2.2 2.2L16 7" /></>
    ),
    "Explain error messages": (
        <><path d="M4 5h16v10h-7l-4 3v-3H4z" /><path d="M12 8v3M12 12.6h.01" /></>
    ),
    "Guide setup and installation": (
        <><path d="M12 3v10" /><path d="M8 9l4 4 4-4" /><path d="M4 15v4a1 1 0 001 1h14a1 1 0 001-1v-4" /></>
    ),
    "Help with smart-home issues": (
        <><path d="M4 11l8-6 8 6" /><path d="M6 10v9h12v-9" /><path d="M9.4 14.6a3.6 3.6 0 015.2 0" /><path d="M12 17h.01" /></>
    ),
    "Organize repair/support steps": (
        <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 3h6v3H9z" /><path d="M8.5 11l1.3 1.3L12.5 9.6M8.5 16l1.3 1.3L12.5 14.6" /></>
    ),
    "Device Troubleshooting": (
        <><rect x="5" y="5" width="14" height="14" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></>
    ),
    "Software Support": (
        <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 8h18" /><path d="M9 12l-2 2.5L9 17M14.5 12l2 2.5-2 2.5" /></>
    ),
    "Network Diagnostics": (
        <><circle cx="6" cy="6" r="2.4" /><circle cx="18" cy="6" r="2.4" /><circle cx="12" cy="18" r="2.4" /><path d="M8.2 7.2l2.6 8.6M15.8 7.2l-2.6 8.6M8.2 6h7.6" /></>
    ),
    "Error Code Lookup": (
        <><circle cx="10.5" cy="10.5" r="6.5" /><path d="M20 20l-4.2-4.2" /><path d="M10.5 7.5v3.5M10.5 13.6h.01" /></>
    ),
    "Step-by-Step Repair Guides": (
        <><path d="M10 6h11M10 12h11M10 18h11" /><path d="M3.5 6l1.3 1.3L7.5 5M3.5 12l1.3 1.3L7.5 11M3.5 18l1.3 1.3L7.5 17" /></>
    ),
    "IT Help Desk Assistant": (
        <><path d="M4 13a8 8 0 0116 0" /><rect x="2.5" y="13" width="4" height="7" rx="2" /><rect x="17.5" y="13" width="4" height="7" rx="2" /><path d="M20 20a4 4 0 01-4 4h-2.5" /></>
    ),
    "Knowledge Base": (
        <><path d="M12 6c-2-1.4-5-2-8-2v14c3 0 6 .6 8 2 2-1.4 5-2 8-2V4c-3 0-6 .6-8 2z" /><path d="M12 6v14" /></>
    ),
    "AI Chat Assistant": (
        <><path d="M20.5 12a8 8 0 01-11.4 7.2L4 20.5l1.3-4.4A8 8 0 1120.5 12z" /><path d="M12 8l.8 2.4 2.4.8-2.4.8L12 14.4l-.8-2.4L8.8 11l2.4-.8z" /></>
    ),
};

const DEFAULT_ICON = (
    <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M9 12h6M12 9v6" /></>
);

function TechMateFeatureCards({ features = [] }) {
    return (
        <div className="product-grid product-grid-photo">
            {features.map((f) => (
                <MotionCardWrap key={f.title} className="product-card product-card-photo tmf-card">
                    <div className="feature-photo-wrap" role="img" aria-label={f.title}>
                        <span className="tmf-grid" aria-hidden="true" />
                        <span className="tmf-glow" aria-hidden="true" />
                        <span className="tmf-corner tmf-corner--tl" aria-hidden="true" />
                        <span className="tmf-corner tmf-corner--br" aria-hidden="true" />
                        <span className="tmf-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                {ICONS[f.title] || DEFAULT_ICON}
                            </svg>
                        </span>
                    </div>
                    {f.category && <p className="product-category">{f.category}</p>}
                    <h3>{f.title}</h3>
                    {f.description && <p>{f.description}</p>}
                </MotionCardWrap>
            ))}
        </div>
    );
}

export default TechMateFeatureCards;
