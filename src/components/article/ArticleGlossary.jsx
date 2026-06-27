import { useState } from "react";

function ArticleGlossary({ glossary = {} }) {
    const entries = Object.entries(glossary);
    const [activeTerm, setActiveTerm] = useState(entries[0]?.[0] || null);

    if (!entries.length) return null;

    return (
        <div className="sidebar-widget article-glossary">
            <p className="sidebar-widget-label">GLOSSARY</p>
            <div className="article-glossary-terms">
                {entries.map(([term]) => (
                    <button
                        key={term}
                        type="button"
                        className={`article-glossary-term${activeTerm === term ? " article-glossary-term-active" : ""}`}
                        onClick={() => setActiveTerm(term)}
                    >
                        {term}
                    </button>
                ))}
            </div>
            {activeTerm && (
                <div className="article-glossary-definition">
                    <strong>{activeTerm}</strong>
                    <p>{glossary[activeTerm]}</p>
                </div>
            )}
        </div>
    );
}

export default ArticleGlossary;
