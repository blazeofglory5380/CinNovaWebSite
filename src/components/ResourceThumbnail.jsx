import { resourceCategoryConfig } from "../data/resources.js";

function ResourceThumbnail({ resource, large = false }) {
    const config = resourceCategoryConfig[resource.category] || {
        icon: "📄",
        accentColor: "#38bdf8",
    };

    return (
        <div
            className={`resource-thumb${large ? " resource-thumb-large" : ""}`}
            style={{
                "--rc-accent": config.accentColor,
                "--rc-accent-bg": config.accentBg || "rgba(56, 189, 248, 0.12)",
                "--rc-accent-border": config.accentBorder || "rgba(56, 189, 248, 0.25)",
            }}
            aria-hidden="true"
        >
            <div className="resource-thumb-bar" />
            <div className="resource-thumb-icon">{config.icon}</div>
            <div className="resource-thumb-lines">
                <span className="rtl-full" />
                <span className="rtl-med" />
                <span className="rtl-short" />
            </div>
            <div className="resource-thumb-foot">
                <span className="resource-thumb-format">{resource.format}</span>
                <span className="resource-thumb-time">{resource.readTime}</span>
            </div>
        </div>
    );
}

export default ResourceThumbnail;
