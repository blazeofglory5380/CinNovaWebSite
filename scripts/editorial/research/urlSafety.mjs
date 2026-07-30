import { isIP } from "node:net";

export const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
export const REQUEST_TIMEOUT_MS = 12_000;
export const MAX_REDIRECTS = 4;

function isPrivateIpv4(hostname) {
    const parts = hostname.split(".").map(Number);
    if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
    return (
        parts[0] === 10 ||
        parts[0] === 127 ||
        parts[0] === 0 ||
        (parts[0] === 169 && parts[1] === 254) ||
        (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
        (parts[0] === 192 && parts[1] === 168) ||
        (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127) ||
        (parts[0] === 198 && (parts[1] === 18 || parts[1] === 19)) ||
        parts[0] >= 224
    );
}

function isPrivateIpv6(hostname) {
    const value = hostname.toLowerCase().replace(/^\[|\]$/g, "");
    return (
        value === "::" ||
        value === "::1" ||
        value.startsWith("fc") ||
        value.startsWith("fd") ||
        value.startsWith("fe8") ||
        value.startsWith("fe9") ||
        value.startsWith("fea") ||
        value.startsWith("feb") ||
        value.startsWith("::ffff:127.") ||
        value.startsWith("::ffff:10.") ||
        value.startsWith("::ffff:192.168.")
    );
}

export function isSafePublicUrl(value) {
    try {
        const url = new URL(value);
        if (url.protocol !== "https:" || url.username || url.password) return false;
        const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
        if (!hostname || hostname === "localhost" || hostname.endsWith(".localhost") || hostname.endsWith(".local")) return false;
        const ipVersion = isIP(hostname.replace(/^\[|\]$/g, ""));
        if (ipVersion === 4 && isPrivateIpv4(hostname)) return false;
        if (ipVersion === 6 && isPrivateIpv6(hostname)) return false;
        return true;
    } catch {
        return false;
    }
}

export function assertHttpsUrl(value) {
    if (!isSafePublicUrl(value)) throw new TypeError(`Unsafe or invalid public HTTPS URL: ${value}`);
    return new URL(value);
}

async function readLimitedBody(response, maxBytes) {
    if (!response.body) return "";
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let total = 0;
    let text = "";
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.byteLength;
        if (total > maxBytes) {
            await reader.cancel("response-size-limit");
            throw new Error(`Response exceeds ${maxBytes} bytes`);
        }
        text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
}

export async function safeFetch(url, options = {}) {
    const timeoutMs = options.timeoutMs || REQUEST_TIMEOUT_MS;
    const maxBytes = options.maxBytes || MAX_RESPONSE_BYTES;
    const maxRedirects = options.maxRedirects ?? MAX_REDIRECTS;
    const externalSignal = options.signal;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(new Error("request-timeout")), timeoutMs);
    const abortExternal = () => controller.abort(externalSignal.reason);
    externalSignal?.addEventListener("abort", abortExternal, { once: true });

    try {
        let current = assertHttpsUrl(url).href;
        for (let redirects = 0; redirects <= maxRedirects; redirects += 1) {
            const response = await fetch(current, {
                method: "GET",
                headers: {
                    Accept: "application/rss+xml, application/atom+xml, application/feed+json, application/json, text/xml;q=0.9",
                    "User-Agent": "CinNovaEditorialResearch/10B.1 (+https://cinnova.com/)",
                    ...(options.headers || {}),
                },
                redirect: "manual",
                credentials: "omit",
                cache: "no-store",
                signal: controller.signal,
            });

            if ([301, 302, 303, 307, 308].includes(response.status)) {
                if (redirects === maxRedirects) throw new Error("Too many redirects");
                const location = response.headers.get("location");
                if (!location) throw new Error("Redirect missing Location header");
                current = assertHttpsUrl(new URL(location, current).href).href;
                continue;
            }

            const declaredLength = Number(response.headers.get("content-length") || 0);
            if (declaredLength > maxBytes) throw new Error(`Response exceeds ${maxBytes} bytes`);
            const text = await readLimitedBody(response, maxBytes);
            return {
                ok: response.ok,
                status: response.status,
                text,
                finalUrl: current,
                error: response.ok ? null : `HTTP ${response.status}`,
            };
        }
        throw new Error("Redirect handling failed");
    } catch (error) {
        return {
            ok: false,
            status: 0,
            text: "",
            finalUrl: null,
            error: error?.name === "AbortError" ? "Request timed out" : String(error?.message || error),
        };
    } finally {
        clearTimeout(timeout);
        externalSignal?.removeEventListener("abort", abortExternal);
    }
}
