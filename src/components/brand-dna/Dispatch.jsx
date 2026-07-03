/*
 * Dispatch — reusable Brand DNA newsletter/CTA block.
 *
 * The glass "dispatch" panel from the Blog homepage, generalized. Pass the
 * form (e.g. <NewsletterSignup/>) as children so this component stays
 * decoupled from any specific newsletter wiring. Must render inside a
 * `.brand-dna` scope.
 */
function Dispatch({ eyebrow = "The Dispatch", title, copy, children }) {
    return (
        <div className="bdna-dispatch bdna-glass bdna-glass--lit">
            {eyebrow ? <p className="bdna-eyebrow">{eyebrow}</p> : null}
            {title ? <h2 className="bdna-dispatch__title">{title}</h2> : null}
            {copy ? <p className="bdna-dispatch__copy">{copy}</p> : null}
            {children}
        </div>
    );
}

export default Dispatch;
