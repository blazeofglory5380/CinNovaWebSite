import { useEffect, useState } from "react";
import { answerArticleQuestion } from "../../data/articleEngagement.js";
import { trackEvent } from "../../utils/analytics.js";

function ArticleAssistant({ post }) {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "Ask me about this article — I can point you to relevant sections and key ideas.",
        },
    ]);

    useEffect(() => {
        setQuestion("");
        setMessages([
            {
                role: "assistant",
                text: "Ask me about this article — I can point you to relevant sections and key ideas.",
            },
        ]);
    }, [post.slug]);

    function handleSubmit(event) {
        event.preventDefault();
        const trimmed = question.trim();
        if (!trimmed) return;
        const answer = answerArticleQuestion(trimmed, post);
        setMessages((prev) => [
            ...prev,
            { role: "user", text: trimmed },
            { role: "assistant", text: answer },
        ]);
        trackEvent("article_assistant_question", {
            article_slug: post.slug,
            question_length: trimmed.length,
        });
        setQuestion("");
    }

    return (
        <div className="sidebar-widget article-assistant">
            <p className="sidebar-widget-label">ARTICLE ASSISTANT</p>
            <div className="article-assistant-messages" aria-live="polite">
                {messages.map((message, i) => (
                    <div
                        key={`${message.role}-${i}`}
                        className={`article-assistant-bubble article-assistant-${message.role}`}
                    >
                        {message.text}
                    </div>
                ))}
            </div>
            <form className="article-assistant-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask about this article…"
                    aria-label="Ask a question about this article"
                />
                <button type="submit" className="primary-btn">
                    Ask
                </button>
            </form>
        </div>
    );
}

export default ArticleAssistant;
