import { useEffect, useState } from "react";
import {
    buildStudyToolsFromPost,
    checklistsByProduct,
    getInteractiveBlockType,
    launchChecklistItems,
} from "../../data/articleEngagement.js";

function AiExplainerBlock({ post }) {
    const sections = (post.content || []).slice(0, 3);
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="article-interactive-block article-interactive-explainer">
            <p className="article-widget-eyebrow">WHAT THIS MEANS</p>
            <h3>Plain-language explainers</h3>
            <div className="article-explainer-list">
                {sections.map((section, i) => (
                    <div key={`${section.heading}-${i}`} className="article-explainer-item">
                        <button
                            type="button"
                            className="article-explainer-trigger"
                            aria-expanded={openIndex === i}
                            aria-controls={`explainer-panel-${i}`}
                            id={`explainer-trigger-${i}`}
                            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                        >
                            {section.heading}
                            <span aria-hidden="true">{openIndex === i ? "−" : "+"}</span>
                        </button>
                        {openIndex === i && (
                            <p className="article-explainer-body" id={`explainer-panel-${i}`}>
                                {section.body?.split(/[.!?]/).slice(0, 2).join(". ").trim() ||
                                    "See the full section above for details."}
                                .
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function StudyQuizBlock({ post }) {
    const { quiz } = buildStudyToolsFromPost(post);
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);
    const current = quiz[index];

    if (!quiz.length) return null;

    function answer(choiceIndex) {
        if (!current) return;
        if (choiceIndex === current.correct) setScore((s) => s + 1);
        if (index >= quiz.length - 1) {
            setDone(true);
            return;
        }
        setIndex(index + 1);
    }

    return (
        <div className="article-interactive-block article-interactive-quiz">
            <p className="article-widget-eyebrow">CHECK YOUR UNDERSTANDING</p>
            <h3>Quick comprehension check</h3>
            {!done && current ? (
                <>
                    <p className="article-quiz-prompt">{current.question}</p>
                    <div className="article-quiz-options">
                        {current.options.map((option, i) => (
                            <button
                                key={option}
                                type="button"
                                className="article-quiz-option"
                                onClick={() => answer(i)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    <p className="article-widget-copy">
                        Question {index + 1} of {quiz.length}
                    </p>
                </>
            ) : (
                <p className="article-calc-result">
                    Score: <strong>{score}</strong> / {quiz.length}
                </p>
            )}
        </div>
    );
}

function SafetyChecklistBlock({ post }) {
    const checklist = checklistsByProduct.poisonguard[0];
    const storageKey = `cinnova-safety-checklist-${post.slug}`;
    const [checked, setChecked] = useState(() => checklist.items.map(() => false));

    useEffect(() => {
        let next = checklist.items.map(() => false);
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length === checklist.items.length) {
                    next = parsed;
                }
            }
        } catch {
            /* ignore */
        }
        setChecked(next);
    }, [storageKey, checklist.items.length]);

    function toggle(i) {
        const next = checked.map((value, idx) => (idx === i ? !value : value));
        setChecked(next);
        try {
            localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
            /* ignore */
        }
    }

    const doneCount = checked.filter(Boolean).length;

    return (
        <div className="article-interactive-block article-interactive-checklist">
            <p className="article-widget-eyebrow">SAFETY CHECKLIST</p>
            <h3>{checklist.title}</h3>
            <p className="article-widget-copy">
                {doneCount} of {checklist.items.length} complete
            </p>
            <ul className="article-checklist-list">
                {checklist.items.map((item, i) => (
                    <li key={item}>
                        <label className="article-checklist-item">
                            <input type="checkbox" checked={checked[i]} onChange={() => toggle(i)} aria-label={item} />
                            <span>{item}</span>
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function RealEstateCalculatorBlock() {
    const [rent, setRent] = useState(2400);
    const [expenses, setExpenses] = useState(1800);
    const cashFlow = rent - expenses;

    return (
        <div className="article-interactive-block article-interactive-calculator">
            <p className="article-widget-eyebrow">DEAL SNAPSHOT</p>
            <h3>Simple cash flow estimate</h3>
            <p className="article-widget-copy">
                A lightweight placeholder — full analysis lives in Cin Nova Real Estate.
            </p>
            <div className="article-calc-grid">
                <label className="article-calc-field">
                    <span>Monthly rent</span>
                    <input
                        type="number"
                        value={rent}
                        onChange={(e) => setRent(Number(e.target.value) || 0)}
                    />
                </label>
                <label className="article-calc-field">
                    <span>Monthly expenses</span>
                    <input
                        type="number"
                        value={expenses}
                        onChange={(e) => setExpenses(Number(e.target.value) || 0)}
                    />
                </label>
            </div>
            <p className="article-calc-result">
                Estimated cash flow:{" "}
                <strong>
                    {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                    }).format(cashFlow)}
                </strong>
                /mo
            </p>
        </div>
    );
}

function LaunchChecklistBlock({ post }) {
    const storageKey = `cinnova-launch-checklist-${post.slug}`;
    const [checked, setChecked] = useState(() => launchChecklistItems.map(() => false));

    useEffect(() => {
        let next = checklist.items.map(() => false);
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length === checklist.items.length) {
                    next = parsed;
                }
            }
        } catch {
            /* ignore */
        }
        setChecked(next);
    }, [storageKey, checklist.items.length]);

    function toggle(i) {
        const next = checked.map((value, idx) => (idx === i ? !value : value));
        setChecked(next);
        try {
            localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
            /* ignore */
        }
    }

    const doneCount = checked.filter(Boolean).length;

    return (
        <div className="article-interactive-block article-interactive-checklist">
            <p className="article-widget-eyebrow">LAUNCH CHECKLIST</p>
            <h3>Product launch readiness</h3>
            <p className="article-widget-copy">
                {doneCount} of {launchChecklistItems.length} complete
            </p>
            <ul className="article-checklist-list">
                {launchChecklistItems.map((item, i) => (
                    <li key={item}>
                        <label className="article-checklist-item">
                            <input type="checkbox" checked={checked[i]} onChange={() => toggle(i)} aria-label={item} />
                            <span>{item}</span>
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ArticleInteractiveBlock({ post }) {
    const blockType = getInteractiveBlockType(post);
    if (!blockType) return null;

    switch (blockType) {
        case "explainer":
            return <AiExplainerBlock post={post} />;
        case "quiz":
            return <StudyQuizBlock post={post} />;
        case "safety-checklist":
            return <SafetyChecklistBlock post={post} />;
        case "calculator":
            return <RealEstateCalculatorBlock />;
        case "launch-checklist":
            return <LaunchChecklistBlock post={post} />;
        default:
            return null;
    }
}

export default ArticleInteractiveBlock;
