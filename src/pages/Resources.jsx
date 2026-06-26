import { useMemo, useState } from "react";
import "../App.css";
import SEO from "../components/SEO.jsx";
import MarketingPhoto from "../components/MarketingPhoto.jsx";
import ResourceEmailGate from "../components/ResourceEmailGate.jsx";
import ResourcePublicationCard, { ResourceCategoryCard } from "../components/ResourcePublicationCard.jsx";
import { resourceCategoryCovers, siteMarketing } from "../data/marketingImages.js";
import {
    filterLibraryResources,
    getFeaturedResources,
    getLibraryResources,
    getPopularResources,
    getRecentlyAddedResources,
    getResourceLibraryStats,
    getResourceUrl,
    resourceCategories,
    resourceCategoryConfig,
    resourceDifficultyFilters,
    resourceProductFilters,
    resourceTypeFilters,
    resources,
} from "../data/resources.js";
import { siteUrl } from "../data/blogPosts.js";

function ResourceStrip({ title, description, items, onPreview, onDownload }) {
    if (!items.length) return null;

    return (
        <section className="section resource-library-strip" aria-labelledby={`strip-${title.replace(/\s+/g, "-").toLowerCase()}`}>
            <div className="resource-library-strip-head">
                <div>
                    <p className="eyebrow">LIBRARY</p>
                    <h2 id={`strip-${title.replace(/\s+/g, "-").toLowerCase()}`}>{title}</h2>
                    {description && <p>{description}</p>}
                </div>
            </div>
            <div className="resource-pub-grid resource-pub-grid--strip">
                {items.map((resource) => (
                    <ResourcePublicationCard
                        key={resource.id}
                        resource={resource}
                        onPreview={onPreview}
                        onDownload={onDownload}
                        variant="strip"
                    />
                ))}
            </div>
        </section>
    );
}

function Resources({ onOpenResource, onSubscribe }) {
    const library = useMemo(() => getLibraryResources(), []);
    const stats = useMemo(() => getResourceLibraryStats(), []);
    const featuredResources = useMemo(() => getFeaturedResources(3), []);
    const recentlyAdded = useMemo(() => getRecentlyAddedResources(4), []);
    const popularDownloads = useMemo(() => getPopularResources(4), []);

    const [activeCategory, setActiveCategory] = useState("All");
    const [activeProduct, setActiveProduct] = useState("All");
    const [activeResourceType, setActiveResourceType] = useState("All");
    const [activeDifficulty, setActiveDifficulty] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [gatedResource, setGatedResource] = useState(null);

    const filteredResources = useMemo(
        () =>
            filterLibraryResources(library, {
                category: activeCategory,
                product: activeProduct,
                resourceType: activeResourceType,
                difficulty: activeDifficulty,
                search: searchTerm,
            }),
        [library, activeCategory, activeProduct, activeResourceType, activeDifficulty, searchTerm],
    );

    const categoryCounts = useMemo(() => {
        const counts = Object.fromEntries(
            resourceCategories.filter((cat) => cat !== "All").map((cat) => [cat, 0]),
        );
        library.forEach((item) => {
            counts[item.category] = (counts[item.category] || 0) + 1;
        });
        return counts;
    }, [library]);

    const hasActiveFilters =
        activeCategory !== "All" ||
        activeProduct !== "All" ||
        activeResourceType !== "All" ||
        activeDifficulty !== "All" ||
        searchTerm.trim().length > 0;

    function clearFilters() {
        setActiveCategory("All");
        setActiveProduct("All");
        setActiveResourceType("All");
        setActiveDifficulty("All");
        setSearchTerm("");
    }

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

    const hero = siteMarketing.resourcesHero;

    return (
        <main className="product-page resources-page resources-library-page">
            <SEO
                title="Resources Center | Cin Nova"
                description="Free guides, checklists, templates, white papers, product brochures, and case studies from Cin Nova."
                url={`${siteUrl}/?page=resources`}
                type="website"
                schema={resourcesSchema}
            />

            <section className="section resources-library-hero" aria-labelledby="resources-hero-title">
                <div className="resources-library-hero-copy">
                    <p className="eyebrow">DIGITAL KNOWLEDGE LIBRARY</p>
                    <h1 id="resources-hero-title">Resources built for learning, safety, and smarter decisions.</h1>
                    <p>
                        Browse publication-quality guides, checklists, templates, and product resources
                        from the Cin Nova ecosystem — free to preview and download.
                    </p>
                    <div className="resources-library-stats" role="list" aria-label="Resource library statistics">
                        <div className="resources-library-stat" role="listitem">
                            <strong>{stats.total}</strong>
                            <span>Resources</span>
                        </div>
                        <div className="resources-library-stat" role="listitem">
                            <strong>{stats.categories}</strong>
                            <span>Categories</span>
                        </div>
                        <div className="resources-library-stat" role="listitem">
                            <strong>{stats.products}</strong>
                            <span>Products</span>
                        </div>
                        <div className="resources-library-stat" role="listitem">
                            <strong>{stats.types}</strong>
                            <span>Formats</span>
                        </div>
                    </div>
                </div>
                <div className="resources-library-hero-photo">
                    <MarketingPhoto src={hero.src} alt={hero.alt} className="resources-library-hero-img" />
                </div>
            </section>

            {featuredResources.length > 0 && (
                <section className="section resource-library-featured" aria-labelledby="featured-resources-title">
                    <div className="resource-library-strip-head">
                        <div>
                            <p className="eyebrow">EDITOR'S PICKS</p>
                            <h2 id="featured-resources-title">Featured resources</h2>
                            <p>Hand-picked publications to help you get started across education, safety, and real estate.</p>
                        </div>
                    </div>
                    <div className="resource-pub-grid resource-pub-grid--featured">
                        {featuredResources.map((resource, index) => (
                            <ResourcePublicationCard
                                key={resource.id}
                                resource={resource}
                                onPreview={onOpenResource}
                                onDownload={setGatedResource}
                                variant={index === 0 ? "hero" : "featured"}
                                featured
                            />
                        ))}
                    </div>
                </section>
            )}

            <section className="section resource-library-categories" aria-labelledby="browse-categories-title">
                <div className="resource-library-strip-head">
                    <div>
                        <p className="eyebrow">BROWSE BY TOPIC</p>
                        <h2 id="browse-categories-title">Explore by category</h2>
                        <p>Select a collection to filter the library below.</p>
                    </div>
                    {activeCategory !== "All" && (
                        <button type="button" className="secondary-btn" onClick={() => setActiveCategory("All")}>
                            Show all categories
                        </button>
                    )}
                </div>
                <div className="resource-category-card-grid">
                    {resourceCategories
                        .filter((cat) => cat !== "All")
                        .map((category) => (
                            <ResourceCategoryCard
                                key={category}
                                category={category}
                                config={resourceCategoryConfig[category]}
                                count={categoryCounts[category] || 0}
                                cover={resourceCategoryCovers[category]}
                                active={activeCategory === category}
                                onSelect={setActiveCategory}
                            />
                        ))}
                </div>
            </section>

            <section className="section resource-library-filters" aria-label="Resource filters">
                <div className="resource-library-filters-bar">
                    <label className="resource-library-search">
                        <span className="sr-only">Search resources</span>
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search guides, templates, safety, real estate..."
                            aria-label="Search resources"
                        />
                    </label>

                    <div className="resource-library-filter-group">
                        <label htmlFor="filter-category">
                            Category
                            <select
                                id="filter-category"
                                value={activeCategory}
                                onChange={(e) => setActiveCategory(e.target.value)}
                            >
                                {resourceCategories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label htmlFor="filter-product">
                            Product
                            <select
                                id="filter-product"
                                value={activeProduct}
                                onChange={(e) => setActiveProduct(e.target.value)}
                            >
                                {resourceProductFilters.map((product) => (
                                    <option key={product} value={product}>
                                        {product}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label htmlFor="filter-type">
                            Resource type
                            <select
                                id="filter-type"
                                value={activeResourceType}
                                onChange={(e) => setActiveResourceType(e.target.value)}
                            >
                                {resourceTypeFilters.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label htmlFor="filter-difficulty">
                            Difficulty
                            <select
                                id="filter-difficulty"
                                value={activeDifficulty}
                                onChange={(e) => setActiveDifficulty(e.target.value)}
                            >
                                {resourceDifficultyFilters.map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>

                <div className="resource-library-results-bar">
                    <p>
                        Showing <strong>{filteredResources.length}</strong> of {library.length} resources
                    </p>
                    {hasActiveFilters && (
                        <button type="button" className="resource-library-clear" onClick={clearFilters}>
                            Clear filters
                        </button>
                    )}
                </div>
            </section>

            <ResourceStrip
                title="Recently added"
                description="The latest publications added to the Cin Nova library."
                items={recentlyAdded}
                onPreview={onOpenResource}
                onDownload={setGatedResource}
            />

            <ResourceStrip
                title="Popular downloads"
                description="Resources readers return to most often."
                items={popularDownloads}
                onPreview={onOpenResource}
                onDownload={setGatedResource}
            />

            <section className="section resource-library-catalog" aria-labelledby="all-resources-title">
                <div className="resource-library-strip-head">
                    <div>
                        <p className="eyebrow">FULL LIBRARY</p>
                        <h2 id="all-resources-title">All resources</h2>
                    </div>
                </div>

                {filteredResources.length === 0 ? (
                    <p className="resources-empty-state" role="status">
                        No resources match your filters. Try adjusting your search or clearing filters.
                    </p>
                ) : (
                    <div className="resource-pub-grid">
                        {filteredResources.map((resource) => (
                            <ResourcePublicationCard
                                key={resource.id}
                                resource={resource}
                                onPreview={onOpenResource}
                                onDownload={setGatedResource}
                            />
                        ))}
                    </div>
                )}
            </section>

            {gatedResource && (
                <ResourceEmailGate
                    resource={gatedResource}
                    onSubscribe={onSubscribe}
                    onClose={() => setGatedResource(null)}
                />
            )}
        </main>
    );
}

export default Resources;
