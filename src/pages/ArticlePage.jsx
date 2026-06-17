import "../App.css";

function ArticlePage({ post, posts, onBack, onOpenArticle, onSubscribe }) {
    const relatedArticles = posts
        .filter((item) => item.id !== post.id && item.category === post.category)
        .slice(0, 3);

    const fallbackRelated = posts.filter((item) => item.id !== post.id).slice(0, 3);
    const articlesToShow = relatedArticles.length ? relatedArticles : fallbackRelated;

    function handleNewsletterSubmit(event) {
        event.preventDefault();
        onSubscribe();
    }

    return (
        <main className="product-page article-page">
            <section className="section article-hero">
                <button className="secondary-btn article-back-button" onClick={onBack}>
                    Back to Blog
                </button>
                <p className="eyebrow">{post.category.toUpperCase()}</p>
                <h1>{post.title}</h1>
                <p className="article-excerpt">{post.excerpt}</p>
                <div className="article-meta-row">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                    <span>{post.author}</span>
                </div>
            </section>

            <section className="section article-content-section">
                <article className="article-content-card">
                    {post.content.map((section) => (
                        <section key={section.heading}>
                            <h2>{section.heading}</h2>
                            <p>{section.body}</p>
                        </section>
                    ))}
                </article>
            </section>

            <section className="section showcase-section">
                <div className="section-heading">
                    <p className="eyebrow">RELATED ARTICLES</p>
                    <h2>Keep reading.</h2>
                    <p>More Cin Nova articles connected to this topic.</p>
                </div>

                <div className="article-grid">
                    {articlesToShow.map((item) => (
                        <article
                            className="article-card article-card-clickable"
                            key={item.id}
                            onClick={() => onOpenArticle(item)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") onOpenArticle(item);
                            }}
                        >
                            <span>{item.category}</span>
                            <h3>{item.title}</h3>
                            <p>{item.excerpt}</p>
                            <button onClick={() => onOpenArticle(item)}>Read Article</button>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section" id="newsletter">
                <div className="newsletter-card">
                    <p className="eyebrow">JOIN THE NEWSLETTER</p>
                    <h2>Get future Cin Nova articles and app updates.</h2>
                    <form className="signup-form" onSubmit={handleNewsletterSubmit}>
                        <input type="email" placeholder="Enter your email address" required />
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </section>
        </main>
    );
}

export default ArticlePage;
