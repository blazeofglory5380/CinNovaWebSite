import { useEffect, useState } from "react";

function ArticleReadingProgress({ targetSelector = ".article-content-card" }) {
    const [progress, setProgress] = useState(0);

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
    }, [targetSelector]);

    return (
        <div className="reading-progress-track" aria-hidden="true">
            <div className="reading-progress-fill" style={{ width: `${progress}%` }} />
        </div>
    );
}

export default ArticleReadingProgress;
