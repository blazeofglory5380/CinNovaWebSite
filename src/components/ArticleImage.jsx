import { useState } from "react";

export default function ArticleImage({ src, alt = "", caption = "", className = "", priority = false }) {
    const [failed, setFailed] = useState(false);

    if (!src || failed) return null;

    return (
        <figure className={`article-image-figure${className ? ` ${className}` : ""}`}>
            <img
                src={src}
                alt={alt}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : undefined}
                decoding="async"
                className="article-image"
                onError={() => setFailed(true)}
            />
            {caption && (
                <figcaption className="article-image-caption">{caption}</figcaption>
            )}
        </figure>
    );
}
