import { useEffect, useState } from "react";

function scrollToSection(index) {
    const el = document.getElementById(`section-${index}`);
    if (!el) return;
    const navOffset = 96;
    const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

function ArticleTableOfContents({ sections = [], variant = "sidebar" }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = variant === "mobile";

    useEffect(() => {
        setActiveIndex(0);
        setMobileOpen(false);
    }, [sections]);

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

    const list = (
        <ol className="toc-list">
            {sections.map((section, i) => (
                <li key={`${section.heading}-${i}`}>
                    <a
                        href={`#section-${i}`}
                        className={`toc-link${activeIndex === i ? " toc-link-active" : ""}`}
                        aria-current={activeIndex === i ? "location" : undefined}
                        onClick={(event) => {
                            event.preventDefault();
                            scrollToSection(i);
                            if (isMobile) setMobileOpen(false);
                        }}
                    >
                        {section.heading}
                    </a>
                </li>
            ))}
        </ol>
    );

    if (isMobile) {
        return (
            <nav className="article-toc article-toc-mobile" aria-label="Table of contents">
                <button
                    type="button"
                    className="article-toc-mobile-toggle"
                    aria-expanded={mobileOpen}
                    aria-controls="article-toc-mobile-panel"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    <span>In this article</span>
                    <span className="article-toc-mobile-count">{sections.length} sections</span>
                    <span aria-hidden="true">{mobileOpen ? "−" : "+"}</span>
                </button>
                {mobileOpen && (
                    <div id="article-toc-mobile-panel" className="article-toc-mobile-panel">
                        {list}
                    </div>
                )}
            </nav>
        );
    }

    return (
        <nav className="sidebar-widget article-toc article-toc-sidebar" aria-label="Table of contents">
            <p className="sidebar-widget-label">IN THIS ARTICLE</p>
            {list}
        </nav>
    );
}

export default ArticleTableOfContents;
