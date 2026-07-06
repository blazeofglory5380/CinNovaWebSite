import { useEffect, useRef, useState } from "react";

/*
 * NavMoreMenu — desktop "More" dropdown for secondary top-nav links.
 *
 * Desktop: a toggle button that opens an absolutely-positioned menu (closes on
 * outside click, Escape, or selection). Mobile: the toggle is hidden and the
 * items render flat inside the hamburger overlay (handled in CSS), so every
 * link stays reachable on small screens.
 *
 * `items` = [{ label, onSelect }].
 */
function NavMoreMenu({ label = "More", items }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        function onDocPointer(event) {
            if (ref.current && !ref.current.contains(event.target)) setOpen(false);
        }
        function onKey(event) {
            if (event.key === "Escape") setOpen(false);
        }
        document.addEventListener("mousedown", onDocPointer);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDocPointer);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <div className={`nav-more${open ? " nav-more-open" : ""}`} ref={ref}>
            <button
                type="button"
                className="nav-more-toggle"
                aria-expanded={open}
                aria-haspopup="true"
                onClick={() => setOpen((value) => !value)}
            >
                {label}
                <span className="nav-more-caret" aria-hidden="true">▾</span>
            </button>
            <div className="nav-more-menu">
                {items.map((item) => (
                    <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                            item.onSelect();
                            setOpen(false);
                        }}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default NavMoreMenu;
