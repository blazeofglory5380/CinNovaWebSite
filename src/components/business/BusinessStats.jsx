function BusinessStats({ stats, note, titleId }) {
    return (
        <section className="section bc-stats-section" aria-labelledby={titleId || undefined}>
            {note && <p className="bc-stats-note">{note}</p>}
            <div className="bc-stats-grid" role="list">
                {stats.map((stat) => (
                    <article key={stat.label} className="bc-stat-card" role="listitem">
                        <strong className="bc-stat-value">{stat.value}</strong>
                        <p className="bc-stat-label">{stat.label}</p>
                        {stat.placeholder && <span className="bc-stat-placeholder">Placeholder metric</span>}
                    </article>
                ))}
            </div>
        </section>
    );
}

export default BusinessStats;
