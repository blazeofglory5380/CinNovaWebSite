import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "./useToast.js";

/**
 * Copy text to the clipboard with a transient `copied` flag and a toast.
 *
 * Falls back to a hidden input + execCommand on browsers that block the
 * async Clipboard API (notably non-secure contexts and older Safari).
 *
 * @returns {{ copied: boolean, copy: (text: string) => Promise<boolean> }}
 */
export function useCopyToClipboard({ resetMs = 2000, toastMessage = "Link copied" } = {}) {
    const [copied, setCopied] = useState(false);
    const { showToast } = useToast();
    const timer = useRef(0);

    useEffect(() => () => clearTimeout(timer.current), []);

    const flag = useCallback(() => {
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), resetMs);
    }, [resetMs]);

    const copy = useCallback(
        async (text) => {
            if (!text) return false;

            try {
                if (navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(text);
                } else {
                    throw new Error("Clipboard API unavailable");
                }
            } catch {
                try {
                    const input = document.createElement("textarea");
                    input.value = text;
                    input.setAttribute("readonly", "");
                    input.style.position = "fixed";
                    input.style.opacity = "0";
                    document.body.appendChild(input);
                    input.select();
                    const ok = document.execCommand("copy");
                    document.body.removeChild(input);
                    if (!ok) throw new Error("execCommand copy failed");
                } catch {
                    showToast("Couldn't copy — please copy manually", { variant: "error" });
                    return false;
                }
            }

            flag();
            if (toastMessage) showToast(toastMessage, { variant: "success" });
            return true;
        },
        [flag, showToast, toastMessage],
    );

    return { copied, copy };
}
