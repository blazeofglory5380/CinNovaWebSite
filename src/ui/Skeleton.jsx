/**
 * Skeleton placeholders for loading content.
 *
 * Each placeholder is `aria-hidden` and the wrapper carries `aria-busy`, so
 * assistive tech announces "loading" once instead of reading decorative bars.
 */

export function Skeleton({ variant = "", width, height, className = "", style, ...rest }) {
    const variantClass = variant ? ` skeleton--${variant}` : "";
    return (
        <div
            className={`skeleton${variantClass}${className ? ` ${className}` : ""}`}
            style={{ width, height, ...style }}
            aria-hidden="true"
            {...rest}
        />
    );
}

/** A block of shimmering text lines; the last line is short, like real copy. */
export function SkeletonText({ lines = 3, label = "Loading content" }) {
    return (
        <div role="status" aria-busy="true" aria-label={label}>
            {Array.from({ length: lines }, (_, i) => (
                <Skeleton
                    key={i}
                    variant="text"
                    width={i === lines - 1 ? "70%" : "100%"}
                />
            ))}
        </div>
    );
}

/** Card-shaped placeholder: media block, title, two lines of body. */
export function SkeletonCard({ label = "Loading card" }) {
    return (
        <div className="frosted-card" role="status" aria-busy="true" aria-label={label}>
            <Skeleton variant="card" />
            <div style={{ padding: "16px" }}>
                <Skeleton variant="title" />
                <Skeleton variant="text" />
                <Skeleton variant="text" width="80%" />
            </div>
        </div>
    );
}
