import { useMemo, useState } from "react";
import "../App.css";
import { blogCategories, blogPosts } from "../data/blogPosts.js";

function Blog({ onOpenArticle, onSubscribe }) {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const featuredPost = blogPosts[0];
    const filteredPosts = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return blogPosts.filter((post) => {
            const matchesCategory =
                activeCategory === "All" || post.category === activeCategory;
            const matchesSearch =
                !normalizedSearch ||
                post.title.toLowerCase().includes(normalizedSearch) ||
                post.excerpt.toLowerCase().includes(normalizedSearch) ||
                post.category.toLowerCase().includes(normalizedSearch);

            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchTerm]);

    function handleNewsletterSubmit(event) {
        event.preventDefault();
        onSubscribe();
    }

    return (
        <main className="product-page blog-page">
            <section className="section blog-hero-section">
                <div className="section-heading blog-hero-copy">
                    <p className="eyebrow">CIN NOVA BLOG</p>
                    <h2>Ideas for building, learning, safety, and smarter software.</h2>
                    <p>
                        Practical articles about AI, education, real estate, family safety,
                        parenting, product updates, and the work behind the Cin Nova ecosystem.
                    </p>
                </div>
            </section>

            <section className="section blog-featured-section">
                <div className="blog-featured blog-featured-clickable">
                    <div>
                        <p className="eyebrow">{featuredPost.category.toUpperCase()}</p>
                        <h2>{featuredPost.title}</h2>
                        <p>{featuredPost.excerpt}</p>
                        <div className="article-meta-row">
                            <span>{featuredPost.date}</span>
                            <span>{featuredPost.readTime}</span>
                            <span>{featuredPost.author}</span>
                        </div>
                        <button
                            className="primary-btn"
                            onClick={() => onOpenArticle(featuredPost)}
                        >
                            Read Featured Article
                        </button>
                    </div>

                    <div className="blog-featured-panel">
                        <p className="product-category">ARTICLE DETAILS</p>
                        <strong>{featuredPost.category}</strong>
                        <span>{featuredPost.readTime}</span>
                        <span>{featuredPost.date}</span>
                        <div className="featured-mini-bars">
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
                        <span>Search articles</span>
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search AI, education, real estate..."
                        />
                    </label>

                    <div className="blog-categories">
                        {["All", ...blogCategories].map((category) => (
                            <button
                                className={`blog-category-pill ${
                                    activeCategory === category ? "active" : ""
                                }`}
                                key={category}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section showcase-section" id="articles">
                <div className="section-heading">
                    <p className="eyebrow">LATEST ARTICLES</p>
                    <h2>Fresh from the Cin Nova blog.</h2>
                    <p>
                        Browse starter articles ready to grow into a full publishing engine
                        for the company site.
                    </p>
                </div>

                <div className="article-grid">
                    {filteredPosts.map((post) => (
                        <article
                            className="article-card article-card-clickable"
                            key={post.id}
                            onClick={() => onOpenArticle(post)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") onOpenArticle(post);
                            }}
                        >
                            <span>{post.category}</span>
                            <h3>{post.title}</h3>
                            <p>{post.excerpt}</p>
                            <div className="article-card-meta">
                                <small>{post.date}</small>
                                <small>{post.readTime}</small>
                            </div>
                            <button onClick={() => onOpenArticle(post)}>Read More</button>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section" id="newsletter">
                <div className="newsletter-card">
                    <p className="eyebrow">STAY IN THE LOOP</p>
                    <h2>Get new articles and product updates in your inbox.</h2>
                    <p className="newsletter-copy">
                        Subscribe for launch notes, article drops, and behind-the-scenes
                        updates as Cin Nova builds its app ecosystem.
                    </p>
                    <form className="signup-form" onSubmit={handleNewsletterSubmit}>
                        <input type="email" placeholder="Enter your email address" required />
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </section>
        </main>
    );
}

export default Blog;
