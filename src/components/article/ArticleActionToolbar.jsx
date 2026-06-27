import { useState } from "react";

function scrollToId(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ArticleActionToolbar({ articleUrl, onBack }) {
    const [copied, setCopied] = useState(false);

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(articleUrl);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            const input = document.createElement("input");
            input.value = articleUrl;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        }
    }

    return (
        <div className="article-action-toolbar" role="toolbar" aria-label="Article actions">
            <button
                type="button"
                className="article-action-btn"
                onClick={copyLink}
                aria-label={copied ? "Article link copied" : "Copy article link"}
            >
                {copied ? "Link copied" : "Copy link"}
            </button>
            <button
                type="button"
                className="article-action-btn"
                onClick={() => scrollToId("article-takeaways")}
                aria-label="Jump to key takeaways"
            >
                Summary
            </button>
            <button
                type="button"
                className="article-action-btn"
                onClick={() => scrollToId("article-related-content")}
                aria-label="Jump to related articles and resources"
            >
                Related
            </button>
            <button
                type="button"
                className="article-action-btn article-action-btn-back"
                onClick={onBack}
                aria-label="Back to blog"
            >
                Back to blog
            </button>
        </div>
    );
}

export default ArticleActionToolbar;
