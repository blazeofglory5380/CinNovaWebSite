function BusinessCTABanner({
    eyebrow,
    title,
    description,
    primaryLabel,
    onPrimary,
    secondaryLabel,
    onSecondary,
    children,
}) {
    return (
        <section className="section bc-cta-banner" aria-labelledby="bc-cta-title">
            <div className="bc-cta-inner">
                <div className="bc-cta-copy">
                    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
                    <h2 id="bc-cta-title">{title}</h2>
                    {description && <p>{description}</p>}
                </div>
                <div className="bc-cta-actions">
                    {children}
                    {primaryLabel && (
                        <button type="button" className="primary-btn" onClick={onPrimary}>
                            {primaryLabel}
                        </button>
                    )}
                    {secondaryLabel && (
                        <button type="button" className="secondary-btn" onClick={onSecondary}>
                            {secondaryLabel}
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}

export default BusinessCTABanner;
