import BlogProductCTA from "../BlogProductCTA.jsx";
import NewsletterSignup from "../NewsletterSignup.jsx";
import { getNewsStoryUrl } from "../../data/newsPosts.js";

function RelatedContentModule({
    post,
    articles,
    resources,
    newsStories = [],
    onOpenArticle,
    onOpenResource,
    onSubscribe,
    onNavigate,
}) {
    return (
        <section
            id="article-related-content"
            className="article-related-module section"
            aria-label="Related content"
        >
            {articles.length > 0 && (
                <div className="article-related-section">
                    <p className="sidebar-widget-label">RELATED ARTICLES</p>
                    <div className="related-reading-grid">
                        {articles.map((item) => (
                            <a
                                href={`/blog/${item.slug}`}
                                key={item.id}
                                className="related-reading-card"
                                onClick={(event) => {
                                    event.preventDefault();
                                    onOpenArticle(item);
                                }}
                            >
                                <span>{item.category}</span>
                                <strong>{item.title}</strong>
                                <small>{item.readTime}</small>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {newsStories.length > 0 && (
                <div className="article-related-section">
                    <p className="sidebar-widget-label">RELATED NEWS</p>
                    <div className="related-reading-grid">
                        {newsStories.map((story) => (
                            <a
                                href={getNewsStoryUrl(story).replace(/^https?:\/\/[^/]+/, "") || `/news/${story.slug}`}
                                key={story.id}
                                className="related-reading-card"
                            >
                                <span>{String(story.coverageLevel || "news").toUpperCase()}</span>
                                <strong>{story.title}</strong>
                                <small>Cin Nova News</small>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {resources.length > 0 && (
                <div className="article-related-section">
                    <p className="sidebar-widget-label">RELATED RESOURCES</p>
                    <div className="article-download-list">
                        {resources.map((resource) => (
                            <a
                                href={`/resources/${resource.slug}`}
                                key={resource.slug}
                                className="article-download-card"
                                onClick={(event) => {
                                    event.preventDefault();
                                    onOpenResource?.(resource);
                                }}
                            >
                                <span className="article-download-format">{resource.format}</span>
                                <strong>{resource.title}</strong>
                                <p>{resource.description}</p>
                                <span className="article-download-cta">View resource →</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            <div className="article-related-section article-related-product">
                <BlogProductCTA category={post.category} onNavigate={onNavigate} />
            </div>

            <div className="article-related-section article-related-newsletter">
                <div className="newsletter-card article-end-newsletter">
                    <p className="eyebrow">JOIN THE NEWSLETTER</p>
                    <h2>Join the Cin Nova Newsletter.</h2>
                    <p className="newsletter-copy">
                        Get AI, Education, Real Estate, and Technology insights in your inbox.
                    </p>
                    <NewsletterSignup
                        onSubscribe={onSubscribe}
                        source={`Article: ${post.title}`}
                        tags={[post.category, "Article Reader"]}
                    />
                </div>
            </div>
        </section>
    );
}

export default RelatedContentModule;
