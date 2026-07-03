/*
 * SectionHead — reusable Brand DNA section header (mono eyebrow + title,
 * optional trailing "more" link, optional centered layout).
 *
 * Extracted from the Blog homepage so every migrated page shares the same
 * editorial section furniture. Must render inside a `.brand-dna` scope.
 */
function SectionHead({ eyebrow, title, more = null, center = false }) {
    return (
        <div className={`bdna-sect-head${center ? " bdna-sect-head--center" : ""}`}>
            <div>
                {eyebrow ? <p className="bdna-sect-label">{eyebrow}</p> : null}
                {title ? <h2 className="bdna-sect-title">{title}</h2> : null}
            </div>
            {more}
        </div>
    );
}

export default SectionHead;
