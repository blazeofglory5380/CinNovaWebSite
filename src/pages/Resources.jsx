import { useMemo, useState } from "react";
import "../App.css";
import SEO from "../components/SEO.jsx";
import ResourceThumbnail from "../components/ResourceThumbnail.jsx";
import {
    resourceCategories,
    resourceCategoryConfig,
    resources,
    getResourceUrl,
    downloadResource,
} from "../data/resources.js";
import { siteUrl } from "../data/blogPosts.js";

function ResourceCard({ resource, onOpenResource }) {
    const catConfig = resourceCategoryConfig[resource.category];
    return (
        <article
            className="resource-card-v2"
            onClick={() => onOpenResource(resource)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter") onOpenResource(resource);
            }}
        >
            <div className="resource-card-thumb">
                <ResourceThumbnail resource={resource} />
            </div>
            <div className="resource-card-body">
                <div className="resource-card-badges">
                    <span
                        className="resource-cat-pill"
                        style={{
                            "--rc-accent": catConfig?.accentColor || "#38bdf8",
                            "--rc-accent-bg": catConfig?.accentBg || "rgba(56, 189, 248, 0.12)",
                            "--rc-accent-border": catConfig?.accentBorder || "rgba(56, 189, 248, 0.25)",
                        }}
                    >
                        {resource.category}
                    </span>
                    <span className="resource-product-pill">{resource.product}</span>
                </div>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
            </div>
            <div className="resource-card-footer">
                <div className="resource-card-meta">
                    <small>{resource.format}</small>
                    <small>{resource.readTime} read</small>
                </div>
                <button
                    className="resource-dl-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        downloadResource(resource);
                    }}
                >
                    ↓ {resource.downloadLabel}
                </button>
            </div>
        </article>
    );
}

function Resources({ onOpenResource }) {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const featuredResource = resources.find((r) => r.featured) || resources[0];

    const filteredResources = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        return resources.filter((r) => {
            const matchesCat = activeCategory === "All" || r.category === activeCategory;
            const matchesSearch =
                !q ||
                [r.title, r.category, r.product, r.format, r.description]
                    .join(" ")
                    .toLowerCase()
                    .includes(q);
            return matchesCat && matchesSearch;
        });
    }, [activeCategory, searchTerm]);

    const categoryGroups = useMemo(() => {
        return resourceCategories
            .filter((c) => c !== "All")
            .map((cat) => ({
                category: cat,
                config: resourceCategoryConfig[cat],
                items: filteredResources.filter((r) => r.category === cat),
            }))
            .filter((g) => g.items.length > 0);
    }, [filteredResources]);

    const resourcesSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Cin Nova Resources Center",
        url: `${siteUrl}/?page=resources`,
        description:
            "Free guides, checklists, templates, white papers, product brochures, and case studies from Cin Nova.",
        publisher: {
            "@type": "Organization",
            name: "Cin Nova",
            url: siteUrl,
        },
        hasPart: resources.map((r) => ({
            "@type": "CreativeWork",
            name: r.title,
            description: r.description,
            url: getResourceUrl(r),
        })),
    };

    return (
        <main className="product-page resources-page">
            <SEO
                title="Resources Center | Cin Nova"
                description="Free guides, checklists, templates, white papers, product brochures, and case studies from Cin Nova."
                url={`${siteUrl}/?page=resources`}
                type="website"
                schema={resourcesSchema}
            />

            <section className="section blog-hero-section">
                <div className="section-heading blog-hero-copy">
                    <p className="eyebrow">RESOURCES CENTER</p>
                    <h2>Guides, checklists, templates, and more — all free.</h2>
                    <p>
                        Browse {resources.length} downloadable resources built to help you understand
                        the Cin Nova ecosystem, learn from real use cases, and apply practical
                        frameworks to education, safety, and real estate.
                    </p>
                    <div className="resources-hero-stats">
                        <span>📚 {resources.length} resources</span>
                        <span>📂 6 categories</span>
                        <span>⬇️ 4,280+ downloads</span>
                    </div>
                </div>
            </section>

            <section className="section blog-featured-section">
                <div className="blog-featured resource-featured">
                    <div>
                        <p className="eyebrow">
                            {featuredResource.category.toUpperCase()} · FEATURED
                        </p>
                        <h2>{featuredResource.title}</h2>
                        <p>{featuredResource.description}</p>
                        <div className="article-meta-row">
                            <span>{featuredResource.product}</span>
                            <span>{featuredResource.format}</span>
                            <span>{featuredResource.readTime}</span>
                        </div>
                        <div className="resource-featured-actions">
                            <button
                                className="primary-btn"
                                onClick={() => onOpenResource(featuredResource)}
                            >
                                View Resource
                            </button>
                            <button
                                className="secondary-btn"
                                onClick={() => downloadResource(featuredResource)}
                            >
                                ↓ {featuredResource.downloadLabel}
                            </button>
                        </div>
                    </div>
                    <div className="blog-featured-panel resource-download-panel">
                        <p className="product-category">DOWNLOAD READY</p>
                        <strong>{featuredResource.format}</strong>
                        <span>{featuredResource.downloadLabel}</span>
                        <div className="resource-file-preview">
                            <i />
                            <i />
                            <i />
                            <i />
                        </div>
                    </div>
                </div>
            </section>

            <section className="section blog-tools-section">
                <div className="blog-tools">
                    <label className="blog-search">
                        <span>Search resources</span>
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search guides, safety, real estate, templates..."
                        />
                    </label>
                    <div className="blog-categories">
                        {resourceCategories.map((cat) => {
                            const config = resourceCategoryConfig[cat];
                            return (
                                <button
                                    className={`blog-category-pill${activeCategory === cat ? " active" : ""}`}
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    {config ? `${config.icon} ` : ""}
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {categoryGroups.length === 0 ? (
                <section className="section showcase-section">
                    <p className="resources-empty-state">
                        No resources match your search. Try a different term.
                    </p>
                </section>
            ) : (
                categoryGroups.map((group) => (
                    <section
                        key={group.category}
                        className="section resource-category-section"
                        id={`rc-${group.category.replace(/\s+/g, "-").toLowerCase()}`}
                    >
                        <div
                            className="resource-cat-header"
                            style={{
                                "--rc-accent": group.config.accentColor,
                                "--rc-accent-bg": group.config.accentBg,
                                "--rc-accent-border": group.config.accentBorder,
                            }}
                        >
                            <div className="resource-cat-icon-block">{group.config.icon}</div>
                            <div className="resource-cat-meta">
                                <h3>{group.category}</h3>
                                <p>{group.config.description}</p>
                            </div>
                            <span className="resource-cat-count">
                                {group.items.length}{" "}
                                {group.items.length === 1 ? "resource" : "resources"}
                            </span>
                        </div>
                        <div className="resource-grid-v2">
                            {group.items.map((resource) => (
                                <ResourceCard
                                    key={resource.id}
                                    resource={resource}
                                    onOpenResource={onOpenResource}
                                />
                            ))}
                        </div>
                    </section>
                ))
            )}
        </main>
    );
}

export default Resources;
