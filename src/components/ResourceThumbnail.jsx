const productPalettes = {
    StudyNest:                 { bg1: "#dbeafe", bg2: "#eff6ff", accent: "#2563eb", light: "#93c5fd" },
    PoisonGuard:               { bg1: "#bbf7d0", bg2: "#f0fdf4", accent: "#16a34a", light: "#6ee7b7" },
    "Cin Nova Real Estate":    { bg1: "#fde68a", bg2: "#fffbeb", accent: "#d97706", light: "#fcd34d" },
    "TechMate AI":             { bg1: "#ddd6fe", bg2: "#faf5ff", accent: "#7c3aed", light: "#c4b5fd" },
    Kiddo:                     { bg1: "#fecdd3", bg2: "#fff1f2", accent: "#e11d48", light: "#fda4af" },
    "Cin Nova":                { bg1: "#c7d2fe", bg2: "#eef2ff", accent: "#4338ca", light: "#a5b4fc" },
};
const defaultPalette = productPalettes["Cin Nova"];

function CategoryArt({ category, accent, light }) {
    if (category === "Free Guides") {
        return (
            <svg viewBox="0 0 80 64" className="rt-art-svg" aria-hidden="true">
                <rect x="8"  y="8"  width="28" height="48" rx="3" fill={light} stroke={accent} strokeWidth="1.5"/>
                <rect x="44" y="8"  width="28" height="48" rx="3" fill={light} stroke={accent} strokeWidth="1.5"/>
                <line x1="36" y1="14" x2="44" y2="14" stroke={accent} strokeWidth="1.5"/>
                <line x1="36" y1="32" x2="44" y2="32" stroke={accent} strokeWidth="1.5"/>
                <line x1="36" y1="50" x2="44" y2="50" stroke={accent} strokeWidth="1.5"/>
                {[20, 28, 36, 44].map((y) => (
                    <g key={y}>
                        <line x1="14" y1={y} x2="30" y2={y} stroke={accent} strokeWidth="1" strokeOpacity="0.45"/>
                        <line x1="50" y1={y} x2="66" y2={y} stroke={accent} strokeWidth="1" strokeOpacity="0.45"/>
                    </g>
                ))}
            </svg>
        );
    }
    if (category === "Checklists") {
        return (
            <svg viewBox="0 0 80 64" className="rt-art-svg" aria-hidden="true">
                <rect x="8" y="4" width="64" height="56" rx="4" fill={light} stroke={accent} strokeWidth="1.5"/>
                {[16, 30, 44].map((y, i) => (
                    <g key={y}>
                        <rect x="15" y={y} width="12" height="12" rx="2"
                              fill={i === 0 ? accent : "white"} stroke={accent} strokeWidth="1.5"/>
                        {i === 0 && (
                            <polyline
                                points={`17,${y+6} 20,${y+9} 26,${y+3}`}
                                fill="none" stroke="white" strokeWidth="1.8"
                                strokeLinecap="round" strokeLinejoin="round"/>
                        )}
                        <line x1="32" y1={y + 6} x2="65" y2={y + 6}
                              stroke={accent} strokeWidth="1.5" strokeOpacity={i === 0 ? 0.8 : 0.45}/>
                    </g>
                ))}
                <line x1="15" y1="56" x2="45" y2="56" stroke={accent} strokeWidth="1" strokeOpacity="0.3"/>
            </svg>
        );
    }
    if (category === "Templates") {
        return (
            <svg viewBox="0 0 80 64" className="rt-art-svg" aria-hidden="true">
                <rect x="10" y="4"  width="60" height="56" rx="4" fill={light} stroke={accent} strokeWidth="1.5"/>
                <rect x="10" y="4"  width="60" height="16" rx="4" fill={accent} fillOpacity="0.75"/>
                <line x1="10" y1="20" x2="70" y2="20" stroke={accent} strokeWidth="0.5"/>
                {[30, 38, 46, 54].map((y) => (
                    <line key={y} x1="17" y1={y} x2="63" y2={y}
                          stroke={accent} strokeWidth="1.5" strokeOpacity="0.4"/>
                ))}
                <line x1="17" y1="54" x2="44" y2="54" stroke={accent} strokeWidth="1.5" strokeOpacity="0.25"/>
            </svg>
        );
    }
    if (category === "White Papers") {
        return (
            <svg viewBox="0 0 80 64" className="rt-art-svg" aria-hidden="true">
                <rect x="10" y="4" width="60" height="56" rx="4" fill={light} stroke={accent} strokeWidth="1.5"/>
                <rect x="10" y="4" width="60" height="20" rx="4" fill={accent} fillOpacity="0.15" stroke="none"/>
                <line x1="17" y1="14" x2="50" y2="14" stroke={accent} strokeWidth="2" strokeOpacity="0.6"/>
                <line x1="17" y1="20" x2="40" y2="20" stroke={accent} strokeWidth="1.2" strokeOpacity="0.4"/>
                <rect x="17" y="34" width="9"  height="20" rx="2" fill={accent} fillOpacity="0.65"/>
                <rect x="29" y="28" width="9"  height="26" rx="2" fill={accent} fillOpacity="0.85"/>
                <rect x="41" y="38" width="9"  height="16" rx="2" fill={accent} fillOpacity="0.45"/>
                <rect x="53" y="30" width="9"  height="24" rx="2" fill={accent} fillOpacity="0.75"/>
                <line x1="15" y1="56" x2="65" y2="56" stroke={accent} strokeWidth="1" strokeOpacity="0.4"/>
            </svg>
        );
    }
    if (category === "Product Brochures") {
        return (
            <svg viewBox="0 0 80 64" className="rt-art-svg" aria-hidden="true">
                <rect x="4"  y="8" width="20" height="48" rx="3" fill={light}  stroke={accent} strokeWidth="1.5"/>
                <rect x="30" y="8" width="20" height="48" rx="3" fill={accent} fillOpacity="0.18" stroke={accent} strokeWidth="1.5"/>
                <rect x="56" y="8" width="20" height="48" rx="3" fill={light}  stroke={accent} strokeWidth="1.5"/>
                <circle cx="40" cy="26" r="7" fill={accent} fillOpacity="0.7"/>
                <line x1="33" y1="38" x2="47" y2="38" stroke={accent} strokeWidth="1.5" strokeOpacity="0.6"/>
                <line x1="35" y1="44" x2="45" y2="44" stroke={accent} strokeWidth="1.2" strokeOpacity="0.4"/>
                {[20, 28, 36, 44].map((y) => (
                    <g key={y}>
                        <line x1="8"  y1={y} x2="20" y2={y} stroke={accent} strokeWidth="1" strokeOpacity="0.4"/>
                        <line x1="60" y1={y} x2="72" y2={y} stroke={accent} strokeWidth="1" strokeOpacity="0.4"/>
                    </g>
                ))}
            </svg>
        );
    }
    if (category === "Case Studies") {
        return (
            <svg viewBox="0 0 80 64" className="rt-art-svg" aria-hidden="true">
                <rect x="6" y="6" width="68" height="52" rx="4" fill={light} stroke={accent} strokeWidth="1.5"/>
                <polyline
                    points="14,46 24,36 34,40 46,22 62,30"
                    fill="none" stroke={accent} strokeWidth="2.2"
                    strokeLinejoin="round" strokeLinecap="round"/>
                <polyline
                    points="14,46 24,36 34,40 46,22 62,30"
                    fill={accent} fillOpacity="0.08"
                    stroke="none"/>
                {[[14,46],[24,36],[34,40],[46,22],[62,30]].map(([cx, cy]) => (
                    <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill={accent}/>
                ))}
                <line x1="14" y1="52" x2="66" y2="52" stroke={accent} strokeWidth="1" strokeOpacity="0.35"/>
                <line x1="14" y1="14" x2="14" y2="52" stroke={accent} strokeWidth="1" strokeOpacity="0.35"/>
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 80 64" className="rt-art-svg" aria-hidden="true">
            <rect x="12" y="4" width="56" height="56" rx="4" fill={light} stroke={accent} strokeWidth="1.5"/>
            {[18, 28, 38, 48].map((y) => (
                <line key={y} x1="20" y1={y} x2="60" y2={y}
                      stroke={accent} strokeWidth="1.5" strokeOpacity="0.45"/>
            ))}
        </svg>
    );
}

function ResourceThumbnail({ resource, large = false }) {
    const palette = productPalettes[resource.product] || defaultPalette;

    return (
        <div
            className={`resource-thumb${large ? " resource-thumb-large" : ""}`}
            style={{
                "--rt-bg1":   palette.bg1,
                "--rt-bg2":   palette.bg2,
                "--rt-accent": palette.accent,
                "--rt-light":  palette.light,
            }}
            aria-hidden="true"
        >
            <div className="rt-top-row">
                <span className="rt-product-tag">{resource.product}</span>
                <span className="rt-cat-tag">{resource.category}</span>
            </div>
            <div className="rt-center">
                <CategoryArt
                    category={resource.category}
                    accent={palette.accent}
                    light={palette.light}
                />
            </div>
            <div className="rt-foot-row">
                <span className="rt-format-tag">{resource.format}</span>
                <span className="rt-time-tag">{resource.readTime}</span>
            </div>
        </div>
    );
}

export default ResourceThumbnail;
