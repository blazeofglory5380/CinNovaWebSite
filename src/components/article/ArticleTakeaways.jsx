import { useState } from "react";
import { getArticleTakeaways } from "../../data/articleEngagement.js";

function TakeawayCard({ takeaway, index }) {
    const [open, setOpen] = useState(index === 0);

    return (
        <div className={`article-takeaway-card${open ? " article-takeaway-card-open" : ""}`}>
            <button
                type="button"
                className="article-takeaway-trigger"
                aria-expanded={open}
                aria-controls={`takeaway-panel-${index}`}
                onClick={() => setOpen(!open)}
            >
                <span className="article-takeaway-index">{String(index + 1).padStart(2, "0")}</span>
                <strong>{takeaway.title}</strong>
                <span className="article-takeaway-chevron" aria-hidden="true">
                    {open ? "−" : "+"}
                </span>
            </button>
            {open && (
                <div id={`takeaway-panel-${index}`} className="article-takeaway-panel">
                    <p>{takeaway.body}</p>
                </div>
            )}
        </div>
    );
}

function ArticleTakeaways({ post }) {
    const takeaways = getArticleTakeaways(post);
    if (!takeaways.length) return null;

    return (
        <section
            id="article-takeaways"
            className="article-takeaways"
            aria-label="Key takeaways"
        >
            <p className="article-widget-eyebrow">KEY TAKEAWAYS</p>
            <h2>What to remember from this article</h2>
            <div className="article-takeaway-list">
                {takeaways.map((takeaway, index) => (
                    <TakeawayCard key={`${takeaway.title}-${index}`} takeaway={takeaway} index={index} />
                ))}
            </div>
        </section>
    );
}

export default ArticleTakeaways;
