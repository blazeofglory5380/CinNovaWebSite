import { prefersReducedMotion, useCopyToClipboard } from "../../ui/index.js";

function scrollToId(id) {
    document.getElementById(id)?.scrollIntoView({
        // Honour the OS reduced-motion setting instead of always smooth-scrolling.
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
    });
}

function ArticleActionToolbar({ articleUrl, onBack }) {
    const { copied, copy } = useCopyToClipboard({ toastMessage: "Article link copied" });

    return (
        <div className="article-action-toolbar" role="toolbar" aria-label="Article actions">
            <button
                type="button"
                className="article-action-btn hover-lift copy-confirmation"
                onClick={() => copy(articleUrl)}
                aria-label={copied ? "Article link copied" : "Copy article link"}
            >
                {copied ? (
                    <span className="copy-confirmation__feedback">
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                            <path
                                d="M4.5 10.5l3.5 3.5 7.5-7.5"
                                stroke="currentColor"
                                strokeWidth="2.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Link copied
                    </span>
                ) : (
                    "Copy link"
                )}
            </button>
            <button
                type="button"
                className="article-action-btn hover-lift"
                onClick={() => scrollToId("article-takeaways")}
                aria-label="Jump to key takeaways"
            >
                Summary
            </button>
            <button
                type="button"
                className="article-action-btn hover-lift"
                onClick={() => scrollToId("article-related-content")}
                aria-label="Jump to related articles and resources"
            >
                Related
            </button>
            <button
                type="button"
                className="article-action-btn article-action-btn-back hover-lift"
                onClick={onBack}
                aria-label="Back to blog"
            >
                Back to blog
            </button>
        </div>
    );
}

export default ArticleActionToolbar;
