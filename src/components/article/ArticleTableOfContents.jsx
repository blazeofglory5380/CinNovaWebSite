import { useEffect, useState } from "react";

function ArticleTableOfContents({ sections = [], className = "" }) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const headings = sections.map((_, i) => document.getElementById(`section-${i}`)).filter(Boolean);
        if (!headings.length) return undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length) {
                    const id = visible[0].target.id;
                    const index = Number(id.replace("section-", ""));
                    if (!Number.isNaN(index)) setActiveIndex(index);
                }
            },
            { rootMargin: "-20% 0px -55% 0px", threshold: 0 }
        );

        headings.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [sections]);

    if (!sections.length) return null;

    return (
        <nav className={`sidebar-widget article-toc ${className}`.trim()} aria-label="Table of contents">
            <p className="sidebar-widget-label">IN THIS ARTICLE</p>
            <ol className="toc-list">
                {sections.map((section, i) => (
                    <li key={section.heading}>
                        <a
                            href={`#section-${i}`}
                            className={`toc-link${activeIndex === i ? " toc-link-active" : ""}`}
                            aria-current={activeIndex === i ? "location" : undefined}
                        >
                            {section.heading}
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}

export default ArticleTableOfContents;
