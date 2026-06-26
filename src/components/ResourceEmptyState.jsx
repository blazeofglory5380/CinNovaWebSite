function ResourceEmptyState({ onClearFilters }) {
    return (
        <div className="resource-empty-state" role="status">
            <div className="resource-empty-illustration" aria-hidden="true">
                <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
                    <rect x="18" y="22" width="64" height="52" rx="10" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="2" />
                    <path d="M34 42h40M34 52h28M34 62h34" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="82" cy="58" r="18" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
                    <path d="M90 66l10 10" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="82" cy="58" r="7" stroke="#2563eb" strokeWidth="2.5" />
                </svg>
            </div>
            <h3>No resources found.</h3>
            <p>Try another keyword or clear your filters.</p>
            <button type="button" className="primary-btn resource-empty-clear" onClick={onClearFilters}>
                Clear filters
            </button>
        </div>
    );
}

export default ResourceEmptyState;
