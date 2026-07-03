/*
 * GlassPanel — reusable Brand DNA glass-material surface.
 *
 * The base emerald optical-glass panel used across the CinNova ecosystem.
 * Must be rendered inside a `.brand-dna` scope so the `--bdna-*` tokens
 * resolve. Use GlassCard for article/link cards; GlassPanel for generic
 * containers (rails, dispatch, guide, etc.).
 */
function GlassPanel({
    as: Tag = "div",
    lit = false,
    interactive = false,
    className = "",
    children,
    ...rest
}) {
    const classes = [
        "bdna-glass",
        lit ? "bdna-glass--lit" : "",
        interactive ? "bdna-glass--interactive" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <Tag className={classes} {...rest}>
            {children}
        </Tag>
    );
}

export default GlassPanel;
