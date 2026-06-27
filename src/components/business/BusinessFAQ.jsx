import { useId, useState } from "react";

function BusinessFAQ({ items, title = "Frequently asked questions" }) {
    const baseId = useId();
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="bc-faq">
            <h2 className="bc-faq-title" id={`${baseId}-title`}>
                {title}
            </h2>
            <div className="bc-faq-list" role="region" aria-labelledby={`${baseId}-title`}>
                {items.map((item, index) => {
                    const isOpen = openIndex === index;
                    const panelId = `${baseId}-panel-${index}`;
                    const buttonId = `${baseId}-button-${index}`;

                    return (
                        <div key={item.question} className={`bc-faq-item${isOpen ? " bc-faq-item--open" : ""}`}>
                            <h3 className="bc-faq-question-wrap">
                                <button
                                    id={buttonId}
                                    type="button"
                                    className="bc-faq-question"
                                    aria-expanded={isOpen}
                                    aria-controls={panelId}
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                >
                                    <span>{item.question}</span>
                                    <span className="bc-faq-icon" aria-hidden="true">
                                        {isOpen ? "−" : "+"}
                                    </span>
                                </button>
                            </h3>
                            <div
                                id={panelId}
                                role="region"
                                aria-labelledby={buttonId}
                                className="bc-faq-answer"
                                hidden={!isOpen}
                            >
                                <p>{item.answer}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default BusinessFAQ;
