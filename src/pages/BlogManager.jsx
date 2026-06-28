import { useMemo, useState } from "react";
import "../App.css";
import SEO from "../components/SEO.jsx";
import { blogAuthors, blogCategories, siteUrl } from "../data/blogPosts.js";
import {
    deleteManagedPost,
    resetManagedPosts,
    saveManagedPost,
    slugifyTitle,
} from "../data/blogManagerService.js";
import { sanitizeText } from "../utils/security.js";

const emptyForm = {
    title: "",
    slug: "",
    category: "AI & Technology",
    excerpt: "",
    date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }),
    readTime: "5 min read",
    author: "Cin Nova Team",
    status: "draft",
    featured: false,
    sectionHeading: "Overview",
    sectionBody: "",
};

function postToForm(post) {
    return {
        ...emptyForm,
        ...post,
        sectionHeading: post.content?.[0]?.heading || "Overview",
        sectionBody: post.content?.map((section) => `${section.heading}\n${section.body}`).join("\n\n") || "",
    };
}

function formToPost(form) {
    const [firstLine, ...bodyLines] = form.sectionBody.split("\n");
    const sectionBody = bodyLines.join("\n").trim() || form.sectionBody.trim();

    return {
        id: form.id,
        createdAt: form.createdAt,
        title: sanitizeText(form.title, 160),
        slug: sanitizeText(form.slug, 120) || slugifyTitle(form.title),
        category: form.category,
        excerpt: sanitizeText(form.excerpt, 320),
        date: sanitizeText(form.date, 80),
        readTime: sanitizeText(form.readTime, 40),
        author: form.author,
        status: form.status,
        featured: form.featured,
        content: [
            {
                heading: sanitizeText(firstLine, 140) || sanitizeText(form.sectionHeading, 140) || "Overview",
                body: sanitizeText(sectionBody, 6000) || sanitizeText(form.excerpt, 320),
            },
        ],
    };
}

function BlogManager({ posts, onPostsChange }) {
    const [form, setForm] = useState(emptyForm);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const authorNames = Object.keys(blogAuthors);

    const filteredPosts = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        if (!normalizedSearch) return posts;

        return posts.filter((post) =>
            [post.title, post.category, post.author, post.status]
                .join(" ")
                .toLowerCase()
                .includes(normalizedSearch),
        );
    }, [posts, searchTerm]);

    function updateField(field, value) {
        const limits = {
            title: 160,
            slug: 120,
            excerpt: 320,
            date: 80,
            readTime: 40,
            sectionBody: 6000,
        };
        const safeValue = typeof value === "string" && limits[field] ? value.slice(0, limits[field]) : value;
        setForm((current) => ({
            ...current,
            [field]: safeValue,
            slug: field === "title" && !current.id ? slugifyTitle(safeValue) : current.slug,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        const nextPosts = saveManagedPost(formToPost(form));
        onPostsChange(nextPosts);
        setForm(emptyForm);
        setStatusMessage("Article saved locally.");
    }

    function handleEdit(post) {
        setForm(postToForm(post));
        setStatusMessage("Editing article.");
        window.scrollTo(0, 0);
    }

    function handleDelete(post) {
        if (!window.confirm(`Delete "${post.title}"?`)) return;
        const nextPosts = deleteManagedPost(post.id);
        onPostsChange(nextPosts);
        setStatusMessage("Article deleted locally.");
    }

    function handleReset() {
        if (!window.confirm("Reset local blog posts to starter content?")) return;
        const nextPosts = resetManagedPosts();
        onPostsChange(nextPosts);
        setForm(emptyForm);
        setStatusMessage("Starter articles restored.");
    }

    return (
        <main className="product-page blog-manager-page">
            <SEO
                title="Blog Manager | Cin Nova"
                description="Manage Cin Nova blog articles locally with drafts, publishing, categories, authors, and featured article controls."
                url={`${siteUrl}/blog-admin`}
                type="website"
                noindex
            />

            <section className="section">
                <div className="section-heading">
                    <p className="eyebrow">BLOG MANAGEMENT</p>
                    <h2>Manage articles locally.</h2>
                    <p>
                        Add, edit, delete, draft, publish, categorize, assign authors, and choose
                        the featured article. Data is stored in this browser for now.
                    </p>
                </div>

                <form className="blog-manager-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                className="form-input"
                                value={form.title}
                                onChange={(event) => updateField("title", event.target.value)}
                                placeholder="Article title"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Slug</label>
                            <input
                                className="form-input"
                                value={form.slug}
                                onChange={(event) => updateField("slug", event.target.value)}
                                placeholder="article-slug"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select
                                className="form-input"
                                value={form.category}
                                onChange={(event) => updateField("category", event.target.value)}
                            >
                                {blogCategories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Author</label>
                            <select
                                className="form-input"
                                value={form.author}
                                onChange={(event) => updateField("author", event.target.value)}
                            >
                                {authorNames.map((author) => (
                                    <option key={author} value={author}>
                                        {author}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                className="form-input"
                                value={form.status}
                                onChange={(event) => updateField("status", event.target.value)}
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Read Time</label>
                            <input
                                className="form-input"
                                value={form.readTime}
                                onChange={(event) => updateField("readTime", event.target.value)}
                                placeholder="5 min read"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Excerpt</label>
                        <textarea
                            className="form-input form-textarea"
                            value={form.excerpt}
                            onChange={(event) => updateField("excerpt", event.target.value)}
                            placeholder="Short article summary"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Content</label>
                        <textarea
                            className="form-input form-textarea blog-content-editor"
                            value={form.sectionBody}
                            onChange={(event) => updateField("sectionBody", event.target.value)}
                            placeholder={"Opening Section Heading\nWrite the article body here."}
                            required
                        />
                    </div>

                    <label className="blog-manager-toggle">
                        <input
                            type="checkbox"
                            checked={form.featured}
                            onChange={(event) => updateField("featured", event.target.checked)}
                        />
                        Featured article
                    </label>

                    <div className="newsletter-admin-actions">
                        <button type="submit">
                            {form.id ? "Update Article" : "Add Article"}
                        </button>
                        <button type="button" onClick={() => setForm(emptyForm)}>
                            Clear Form
                        </button>
                        <button type="button" className="danger-action" onClick={handleReset}>
                            Reset Starter Posts
                        </button>
                    </div>
                    {statusMessage && <p className="newsletter-success">{statusMessage}</p>}
                </form>
            </section>

            <section className="section showcase-section">
                <div className="section-heading">
                    <p className="eyebrow">ARTICLE LIBRARY</p>
                    <h2>All local articles.</h2>
                    <p>Drafts stay hidden from the public blog until published.</p>
                </div>

                <label className="blog-search newsletter-admin-search">
                    <span>Search articles</span>
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value.slice(0, 120))}
                        placeholder="Search title, category, author, status..."
                        maxLength={120}
                    />
                </label>

                <div className="subscriber-table-wrap">
                    <table className="subscriber-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Author</th>
                                <th>Status</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPosts.map((post) => (
                                <tr key={post.id}>
                                    <td>{post.title}</td>
                                    <td>{post.category}</td>
                                    <td>{post.author}</td>
                                    <td>{post.status}</td>
                                    <td>{post.featured ? "Yes" : "No"}</td>
                                    <td>
                                        <div className="blog-manager-table-actions">
                                            <button onClick={() => handleEdit(post)}>Edit</button>
                                            <button onClick={() => handleDelete(post)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}

export default BlogManager;
