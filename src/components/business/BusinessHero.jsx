function BusinessHero({ eyebrow, title, description, actions = [], pills = [] }) {
    return (
        <section className="section bc-hero" aria-labelledby="bc-hero-title">
            <div className="bc-hero-inner">
                <div className="bc-hero-copy">
                    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
                    <h1 id="bc-hero-title">{title}</h1>
                    {description && <p className="bc-hero-lead">{description}</p>}
                    {pills.length > 0 && (
                        <div className="bc-hero-pills" role="list" aria-label="Highlights">
                            {pills.map((pill) => (
                                <span key={pill} role="listitem" className="bc-hero-pill">
                                    {pill}
                                </span>
                            ))}
                        </div>
                    )}
                    {actions.length > 0 && (
                        <div className="bc-hero-actions">
                            {actions.map((action) => {
                                if (action.href) {
                                    return (
                                        <a
                                            key={action.label}
                                            href={action.href}
                                            className={action.variant === "secondary" ? "secondary-btn" : "primary-btn"}
                                        >
                                            {action.label}
                                        </a>
                                    );
                                }
                                return (
                                    <button
                                        key={action.label}
                                        type="button"
                                        className={action.variant === "secondary" ? "secondary-btn" : "primary-btn"}
                                        onClick={action.onClick}
                                    >
                                        {action.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className="bc-hero-accent" aria-hidden="true">
                    <span className="bc-hero-accent-ring" />
                    <span className="bc-hero-accent-mark">CN</span>
                </div>
            </div>
        </section>
    );
}

export default BusinessHero;
