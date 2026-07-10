import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ToastContext } from "./toastContext.js";

const DEFAULT_DURATION = 3000;
const LEAVE_MS = 180; // must stay >= the .is-leaving animation duration

let nextId = 0;

function ToastIcon({ variant }) {
    if (variant === "success") {
        return (
            <span className="toast__icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path
                        d="M4.5 10.5l3.5 3.5 7.5-7.5"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
        );
    }
    if (variant === "error") {
        return (
            <span className="toast__icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path
                        d="M6 6l8 8M14 6l-8 8"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                    />
                </svg>
            </span>
        );
    }
    return null;
}

/**
 * Global toast host. Renders an aria-live region so screen readers announce
 * confirmations (e.g. "Link copied") without stealing focus.
 */
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef(new Map());

    const clearTimer = useCallback((id) => {
        const handle = timers.current.get(id);
        if (handle) {
            clearTimeout(handle.hide);
            clearTimeout(handle.remove);
            timers.current.delete(id);
        }
    }, []);

    const dismissToast = useCallback(
        (id) => {
            clearTimer(id);
            setToasts((prev) =>
                prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
            );
            const remove = setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
                timers.current.delete(id);
            }, LEAVE_MS);
            timers.current.set(id, { hide: 0, remove });
        },
        [clearTimer],
    );

    const showToast = useCallback(
        (message, options = {}) => {
            const { variant = "success", duration = DEFAULT_DURATION } = options;
            const id = ++nextId;

            setToasts((prev) => [...prev, { id, message, variant, leaving: false }]);

            const hide = setTimeout(() => {
                setToasts((prev) =>
                    prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
                );
                const remove = setTimeout(() => {
                    setToasts((prev) => prev.filter((t) => t.id !== id));
                    timers.current.delete(id);
                }, LEAVE_MS);
                timers.current.set(id, { hide: 0, remove });
            }, duration);

            timers.current.set(id, { hide, remove: 0 });
            return id;
        },
        [],
    );

    // Flush every pending timer on unmount so nothing fires into a dead tree.
    useEffect(() => {
        const pending = timers.current;
        return () => {
            pending.forEach(({ hide, remove }) => {
                clearTimeout(hide);
                clearTimeout(remove);
            });
            pending.clear();
        };
    }, []);

    const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div
                className="toast-viewport"
                role="region"
                aria-label="Notifications"
            >
                {/* Polite live region: announced, never interrupts. */}
                <div aria-live="polite" aria-atomic="false" className="cn-visually-hidden">
                    {toasts.filter((t) => !t.leaving).map((t) => (
                        <span key={t.id}>{t.message}</span>
                    ))}
                </div>
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`toast toast--${toast.variant}${toast.leaving ? " is-leaving" : ""}`}
                    >
                        <ToastIcon variant={toast.variant} />
                        <span className="toast__message" aria-hidden="true">
                            {toast.message}
                        </span>
                        <button
                            type="button"
                            className="toast__close"
                            onClick={() => dismissToast(toast.id)}
                            aria-label="Dismiss notification"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
