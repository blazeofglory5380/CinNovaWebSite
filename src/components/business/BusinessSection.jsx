function BusinessSection({ eyebrow, title, description, children, id, className = "" }) {
    const titleId = id ? `${id}-title` : undefined;

    return (
        <section className={`section bc-section ${className}`.trim()} id={id} aria-labelledby={titleId}>
            {(eyebrow || title || description) && (
                <div className="section-heading bc-section-heading">
                    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
                    {title && <h2 id={titleId}>{title}</h2>}
                    {description && <p>{description}</p>}
                </div>
            )}
            {children}
        </section>
    );
}

export default BusinessSection;
