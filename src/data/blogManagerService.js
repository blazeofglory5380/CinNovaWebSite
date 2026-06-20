import { blogPosts } from "./blogPosts.js";
import { safeReadArray, safeWriteArray, sanitizeTags, sanitizeText } from "../utils/security.js";

const STORAGE_KEY = "cinNovaManagedBlogPosts";

export function slugifyTitle(title) {
    return title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function withDefaults(post, index = 0) {
    const content = Array.isArray(post.content) ? post.content : [];
    return {
        status: "published",
        featured: index === 0,
        readTime: sanitizeText(post.readTime, 40) || "5 min read",
        date: sanitizeText(post.date, 80) || new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }),
        ...post,
        title: sanitizeText(post.title, 160),
        slug: sanitizeText(post.slug || slugifyTitle(post.title || ""), 120),
        category: sanitizeText(post.category, 80),
        excerpt: sanitizeText(post.excerpt, 320),
        author: sanitizeText(post.author, 100) || "Cin Nova Team",
        tags: sanitizeTags(post.tags),
        content: content.length
            ? content.slice(0, 12).map((section) => ({
                  heading: sanitizeText(section.heading, 140) || "Overview",
                  body: sanitizeText(section.body, 6000),
                  ...(Array.isArray(section.list) && { list: section.list }),
                  ...(Array.isArray(section.numberedList) && { numberedList: section.numberedList }),
                  ...(section.image && { image: section.image }),
                  ...(section.imageAlt && { imageAlt: section.imageAlt }),
                  ...(section.imageCaption && { imageCaption: section.imageCaption }),
              }))
            : [{ heading: "Overview", body: sanitizeText(post.excerpt, 6000) || "Article content goes here." }],
    };
}

function starterPosts() {
    return blogPosts.map((post, index) => withDefaults(post, index));
}

function readPosts() {
    if (typeof window === "undefined") return starterPosts();

    const stored = safeReadArray(STORAGE_KEY);
    if (!stored.length) return starterPosts();

    const starters = starterPosts();
    const starterIds = new Set(starters.map((post) => post.id));
    const customStoredPosts = stored
        .filter((post) => !starterIds.has(post.id))
        .map((post, index) => withDefaults(post, starters.length + index));

    return [...starters, ...customStoredPosts];
}

function writePosts(posts) {
    safeWriteArray(STORAGE_KEY, posts.slice(0, 250));
}

export function getManagedPosts() {
    return readPosts().sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPublishedPosts(posts = getManagedPosts()) {
    return posts.filter((post) => post.status === "published");
}

export function getManagedPostBySlug(slug, posts = getManagedPosts()) {
    return posts.find((post) => post.slug === slug);
}

export function saveManagedPost(postInput) {
    const posts = readPosts();
    const now = new Date().toISOString();
    const title = sanitizeText(postInput.title, 160);
    const excerpt = sanitizeText(postInput.excerpt, 320);
    const id = postInput.id || Date.now();
    const slug = sanitizeText(postInput.slug || slugifyTitle(title), 120);
    const normalizedPost = {
        ...postInput,
        id,
        slug,
        title,
        excerpt,
        category: sanitizeText(postInput.category, 80),
        date: sanitizeText(postInput.date, 80),
        readTime: sanitizeText(postInput.readTime, 40),
        author: sanitizeText(postInput.author, 100),
        status: postInput.status === "published" ? "published" : "draft",
        tags: sanitizeTags(postInput.tags),
        updatedAt: now,
        createdAt: postInput.createdAt || now,
        content: postInput.content?.length
            ? postInput.content.slice(0, 12).map((section) => ({
                  heading: sanitizeText(section.heading, 140) || "Overview",
                  body: sanitizeText(section.body, 6000),
              }))
            : [{ heading: "Overview", body: excerpt }],
    };

    let nextPosts = posts.some((post) => post.id === id)
        ? posts.map((post) => (post.id === id ? normalizedPost : post))
        : [normalizedPost, ...posts];

    if (normalizedPost.featured) {
        nextPosts = nextPosts.map((post) =>
            post.id === normalizedPost.id ? post : { ...post, featured: false },
        );
    }

    writePosts(nextPosts);
    return getManagedPosts();
}

export function deleteManagedPost(id) {
    const nextPosts = readPosts().filter((post) => post.id !== id);
    writePosts(nextPosts);
    return getManagedPosts();
}

export function resetManagedPosts() {
    const posts = starterPosts();
    writePosts(posts);
    return getManagedPosts();
}
