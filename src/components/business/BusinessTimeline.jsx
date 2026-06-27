function BusinessTimeline({ items }) {
    return (
        <ol className="bc-timeline" aria-label="Timeline">
            {items.map((item) => (
                <li key={item.phase} className="bc-timeline-item">
                    <div className="bc-timeline-marker" aria-hidden="true">
                        <span>{item.phase}</span>
                    </div>
                    <div className="bc-timeline-body">
                        <span
                            className="bc-timeline-status"
                            style={{
                                "--bc-status-color": item.statusColor || "#64748b",
                            }}
                        >
                            {item.status}
                        </span>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                    </div>
                </li>
            ))}
        </ol>
    );
}

export default BusinessTimeline;
