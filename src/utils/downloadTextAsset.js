/**
 * Client-side text-asset download.
 *
 * Press and brand assets are generated in the browser and downloaded as a Blob
 * rather than served from `public/`. That means a media-kit link can never 404
 * because a binary was not committed, and the content always matches whatever
 * the page is currently showing.
 *
 * Mirrors the approach already used by src/pages/MediaKit.jsx.
 */

import { trackEvent } from "./analytics.js";

/**
 * @param {{ filename: string, lines?: string[], content?: string, type?: string, source?: string }} asset
 * @returns {boolean} whether the download was started
 */
export function downloadTextAsset({ filename, lines, content, type = "text/plain;charset=utf-8", source = "" }) {
    if (typeof document === "undefined" || !filename) return false;

    const body = typeof content === "string" ? content : (lines || []).join("\n");
    const blob = new Blob([body], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    trackEvent("asset_download", { file_name: filename, source });
    return true;
}
