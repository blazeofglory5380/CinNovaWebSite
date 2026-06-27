import { useEffect, useRef } from "react";
import PoisonGuardFeatureVisual from "./PoisonGuardFeatureVisual.jsx";

const FOCUSABLE =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function PoisonGuardFeatureModal({ feature, onClose, returnFocusRef }) {
    const panelRef = useRef(null);
    const closeBtnRef = useRef(null);

    useEffect(() => {
        const previousFocus = returnFocusRef?.current;
        closeBtnRef.current?.focus();

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
                return;
            }

            if (event.key !== "Tab" || !panelRef.current) return;

            const focusable = [...panelRef.current.querySelectorAll(FOCUSABLE)];
            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
            previousFocus?.focus?.();
        };
    }, [onClose, returnFocusRef]);

    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    if (!feature) return null;

    return (
        <div className="modal-backdrop pg-feature-modal-backdrop" onClick={handleBackdropClick}>
            <div
                className="modal-panel pg-feature-modal-panel"
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="pg-feature-modal-title"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    ref={closeBtnRef}
                    type="button"
                    className="modal-close"
                    onClick={onClose}
                    aria-label="Close feature details"
                >
                    ×
                </button>

                <div className="pg-feature-modal-layout">
                    <div className="pg-feature-modal-art">
                        <PoisonGuardFeatureVisual type={feature.visualType} size="modal" />
                    </div>
                    <div className="pg-feature-modal-body">
                        <p className="eyebrow">{feature.category.toUpperCase()}</p>
                        <h2 id="pg-feature-modal-title">{feature.title}</h2>
                        <p className="pg-feature-modal-desc">{feature.description}</p>
                        <p className="pg-feature-modal-explainer">{feature.modalExplanation}</p>
                        <div className="pg-feature-modal-mockup" aria-label="Example interface preview">
                            <p className="pg-feature-modal-mockup-label">Example preview</p>
                            <PoisonGuardFeatureVisual type={feature.visualType} size="card" />
                        </div>
                        <span className="pg-feature-modal-beta">{feature.betaLabel}</span>
                        <button type="button" className="primary-btn pg-btn-primary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PoisonGuardFeatureModal;
