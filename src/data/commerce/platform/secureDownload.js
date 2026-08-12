/**
 * Phase M3 — secure digital download path checks.
 * Entitlement required. No path traversal, repo files, or permanent bucket URLs.
 */

import { authorizeSecureDownload } from "./entitlementGrants.js";

const ALLOWED_TEST_ASSETS = Object.freeze({
    "test-digital-pack": "cinnova-test-pack.txt",
});

export function assertSafeDownloadAsset({ productId = "", requestedPath = "" } = {}) {
    if (!productId || !ALLOWED_TEST_ASSETS[productId]) {
        return { ok: false, error: "UNKNOWN_ASSET" };
    }
    const path = String(requestedPath || "");
    if (!path) return { ok: true, error: null, filename: ALLOWED_TEST_ASSETS[productId] };

    if (path.includes("..") || path.includes("\\") || path.startsWith("/") || path.includes(":")) {
        return { ok: false, error: "PATH_TRAVERSAL" };
    }
    if (/(\.git|node_modules|src\/|unpublished|manuscript)/i.test(path)) {
        return { ok: false, error: "REPO_PATH_FORBIDDEN" };
    }
    if (/^https?:\/\//i.test(path) && /s3\.|storage\.googleapis|blob\.core/i.test(path)) {
        return { ok: false, error: "RAW_BUCKET_URL_FORBIDDEN" };
    }
    if (path !== ALLOWED_TEST_ASSETS[productId]) {
        return { ok: false, error: "ASSET_MISMATCH" };
    }
    return { ok: true, error: null, filename: ALLOWED_TEST_ASSETS[productId] };
}

export function authorizeTestDownload({
    entitlementId,
    customerId,
    productId,
    requestedPath = "",
    now = Date.now(),
} = {}) {
    const ent = authorizeSecureDownload({ entitlementId, customerId, productId, now });
    if (!ent.ok) return { ...ent, headers: null, body: null };

    const asset = assertSafeDownloadAsset({ productId, requestedPath });
    if (!asset.ok) return { ok: false, error: asset.error, headers: null, body: null };

    return {
        ok: true,
        error: null,
        grant: ent.grant,
        headers: {
            "Content-Disposition": `attachment; filename="${asset.filename}"`,
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
        },
        url: null,
        permanentUrlForbidden: true,
        body: "CinNova TEST digital product placeholder. Not a production asset.",
    };
}

export function isDownloadGrantExpired(grant, now = Date.now()) {
    if (!grant?.expiresAt) return true;
    return Date.parse(grant.expiresAt) <= now;
}
