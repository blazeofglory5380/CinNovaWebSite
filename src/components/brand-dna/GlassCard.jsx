/*
 * GlassCard — reusable Brand DNA article/link card.
 *
 * Editorial glass card in the AI Core language: a media/thumb slot on top and
 * a body slot below, wrapped in the emerald optical-glass material with a
 * hover float + rim glow. Ecosystem-shareable — product pages can reuse it for
 * any "card that links somewhere" pattern.
 *
 * Renders as a button by default (SPA callback navigation). Pass `as="a"` +
 * `href` for anchor semantics while still handling onClick.
 */
function GlassCard({
    as: Tag = "button",
    media = null,
    className = "",
    children,
    ...rest
}) {
    const typeProp = Tag === "button" ? { type: "button" } : {};

    return (
        <Tag
            className={`bdna-card bdna-glass bdna-glass--interactive ${className}`.trim()}
            {...typeProp}
            {...rest}
        >
            {media ? <div className="bdna-card__media">{media}</div> : null}
            <div className="bdna-card__body">{children}</div>
        </Tag>
    );
}

export default GlassCard;
