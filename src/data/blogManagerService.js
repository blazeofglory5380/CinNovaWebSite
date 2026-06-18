import { blogPosts } from "./blogPosts.js";

const STORAGE_KEY = "cinNovaManagedBlogPosts";

export function slugifyTitle(title) {
    return title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function withDefaults(post, index = 0) {
    return {
        status: "published",
        featured: index === 0,
        readTime: post.readTime || "5 min read",
        date: post.date || new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }),
        ...post,
        content: post.content?.length
            ? post.content
            : [{ heading: "Overview", body: post.excerpt || "Article content goes here." }],
    };
}

function starterPosts() {
    return blogPosts.map((post, index) => withDefaults(post, index));
}

function readPosts() {
    if (typeof window === "undefined") return starterPosts();

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : starterPosts();
    } catch {
        return starterPosts();
    }
}

function writePosts(posts) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
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
    const id = postInput.id || Date.now();
    const slug = postInput.slug || slugifyTitle(postInput.title);
    const normalizedPost = {
        ...postInput,
        id,
        slug,
        updatedAt: now,
        createdAt: postInput.createdAt || now,
        content: postInput.content?.length
            ? postInput.content
            : [{ heading: "Overview", body: postInput.excerpt }],
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
