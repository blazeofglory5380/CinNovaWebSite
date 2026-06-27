import { useEffect, useState } from "react";

function ArticleChecklist({ checklist, post }) {
    const storageKey = `cinnova-checklist-${post.slug}-${checklist.id}`;
    const [checked, setChecked] = useState(() => checklist.items.map(() => false));

    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) setChecked(JSON.parse(saved));
        } catch {
            /* ignore */
        }
    }, [storageKey]);

    function toggle(index) {
        const next = checked.map((value, i) => (i === index ? !value : value));
        setChecked(next);
        try {
            localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
            /* ignore */
        }
    }

    const doneCount = checked.filter(Boolean).length;

    return (
        <div className="article-widget article-checklist">
            <p className="article-widget-eyebrow">SAFETY CHECKLIST</p>
            <h3>{checklist.title}</h3>
            <p className="article-widget-copy">
                {doneCount} of {checklist.items.length} complete
            </p>
            <ul className="article-checklist-list">
                {checklist.items.map((item, i) => (
                    <li key={item}>
                        <label className="article-checklist-item">
                            <input
                                type="checkbox"
                                checked={checked[i]}
                                onChange={() => toggle(i)}
                            />
                            <span>{item}</span>
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ArticleChecklist;
