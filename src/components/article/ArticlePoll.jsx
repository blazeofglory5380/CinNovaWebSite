import { useEffect, useState } from "react";
import { trackEvent } from "../../utils/analytics.js";

function ArticlePoll({ poll, post }) {
    const storageKey = `cinnova-poll-${post.slug}`;
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        setSelected(null);
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) setSelected(saved);
        } catch {
            /* ignore */
        }
    }, [storageKey]);

    function vote(option) {
        setSelected(option);
        try {
            localStorage.setItem(storageKey, option);
        } catch {
            /* ignore */
        }
        trackEvent("article_poll_vote", {
            article_slug: post.slug,
            poll_question: poll.question,
            poll_answer: option,
        });
    }

    return (
        <div className="article-widget article-poll">
            <p className="article-widget-eyebrow">READER POLL</p>
            <h3>{poll.question}</h3>
            <div className="article-poll-options">
                {poll.options.map((option) => (
                    <button
                        key={option}
                        type="button"
                        className={`article-poll-option${selected === option ? " article-poll-option-selected" : ""}`}
                        onClick={() => vote(option)}
                        disabled={Boolean(selected)}
                        aria-pressed={selected === option}
                    >
                        {option}
                    </button>
                ))}
            </div>
            {selected && <p className="article-poll-thanks">Thanks — your response was recorded.</p>}
        </div>
    );
}

export default ArticlePoll;
