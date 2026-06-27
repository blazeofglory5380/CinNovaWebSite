import { useState } from "react";
import { highlightGlossaryTerms } from "../../data/articleEngagement.js";

function GlossaryTerm({ term, definition }) {
    const [open, setOpen] = useState(false);

    return (
        <span className="article-glossary-inline">
            <button
                type="button"
                className="article-glossary-inline-btn"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
            >
                {term}
            </button>
            {open && (
                <span className="article-glossary-inline-popover" role="tooltip">
                    {definition}
                </span>
            )}
        </span>
    );
}

function ArticleGlossaryText({ text, glossary }) {
    const parts = highlightGlossaryTerms(text, glossary);
    return (
        <>
            {parts.map((part, i) =>
                part.type === "term" ? (
                    <GlossaryTerm key={`${part.value}-${i}`} term={part.value} definition={part.definition} />
                ) : (
                    <span key={`text-${i}`}>{part.value}</span>
                )
            )}
        </>
    );
}

export default ArticleGlossaryText;
