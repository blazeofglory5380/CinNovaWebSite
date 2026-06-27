import { useEffect, useState } from "react";

function ArticleProgressBar({ targetSelector = ".article-content-card", articleSlug = "" }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setProgress(0);
    }, [articleSlug]);

    useEffect(() => {
        function onScroll() {
            const el = document.querySelector(targetSelector);
            if (!el) {
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                setProgress(docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0);
                return;
            }
            const rect = el.getBoundingClientRect();
            const elTop = window.scrollY + rect.top;
            const elHeight = el.offsetHeight;
            const viewport = window.innerHeight;
            const scrolled = window.scrollY - elTop + viewport * 0.15;
            const total = Math.max(elHeight - viewport * 0.3, 1);
            setProgress(Math.min(100, Math.max(0, (scrolled / total) * 100)));
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        onScroll();
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [targetSelector, articleSlug]);

    const rounded = Math.round(progress);

    return (
        <div
            className="article-progress-bar"
            role="progressbar"
            aria-valuenow={rounded}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Article reading progress: ${rounded} percent`}
        >
            <div className="article-progress-fill" style={{ width: `${progress}%` }} />
            <span className="article-progress-label" aria-hidden="true">
                {rounded}%
            </span>
        </div>
    );
}

export default ArticleProgressBar;
