#!/usr/bin/env node
/**
 * End-to-end GA4 verification for the production bundle.
 *
 * Serves `dist/` with `vite preview`, drives it with a real Chromium, lets the
 * real gtag.js load, and asserts on the Measurement Protocol hits the tag tries
 * to send:
 *
 *   1. dist/index.html carries exactly one canonical Google tag in <head>
 *   2. the first load produces exactly one `page_view` for the correct tid
 *   3. SPA matrix Home → /news → /?page=products → /privacy yields 4 views
 *      (News nav uses canonical /news; legacy /?page=news is covered separately)
 *   4. no duplicate `page_view` is emitted for the same location
 *   5. debug_mode is applied only to opt-in debug sessions
 *
 * The `/g/collect` requests are recorded and then ABORTED, so running this test
 * never writes data into the live GA4 property.
 *
 * Usage: npm run test:analytics
 */

import { readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const EXPECTED_ID = process.env.VITE_GA_MEASUREMENT_ID?.trim() || "G-CD944CHBK6";
const PORT = Number(process.env.GA_TEST_PORT || 4177);
const ORIGIN = `http://localhost:${PORT}`;
const COLLECT_PATTERN = /^https:\/\/([a-z0-9-]+\.)?(google-analytics\.com|analytics\.google\.com)\/(g\/)?collect/;

const failures = [];

/** gtag.js emits `_dbg=true`; other debug surfaces emit `_dbg=1`. */
function isDebugFlagged(value) {
    return value === "1" || value === "true";
}

function countOccurrences(haystack, needle) {
    return haystack.split(needle).length - 1;
}

/**
 * The served HTML is what Google's Tag Diagnostics crawler sees, so the canonical
 * tag has to be verifiable statically — not just at runtime.
 */
function verifyDistHtml() {
    const distIndex = fileURLToPath(new URL("../dist/index.html", import.meta.url));
    const html = readFileSync(distIndex, "utf8");
    const head = html.slice(0, html.indexOf("</head>"));
    const loaders = countOccurrences(html, "googletagmanager.com/gtag/js");

    // An inline *executable* script without a nonce is blocked by the production
    // CSP, so anything GA depends on living inline would silently kill collection.
    // Comments are stripped first (prose may mention tags), and data blocks such as
    // `type="application/ld+json"` are excluded — CSP's script-src does not govern
    // them because the browser never executes them.
    const withoutComments = html.replace(/<!--[\s\S]*?-->/g, "");
    const inlineScripts = (
        withoutComments.match(/<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/gi) || []
    )
        .filter((s) => !/type\s*=\s*["'][^"']*\/(ld\+json|json)["']/i.test(s))
        .filter((s) => s.replace(/<\/?script[^>]*>/gi, "").trim().length > 0);

    check(
        "no unreplaced Vite env placeholder",
        !html.includes("%VITE_"),
        (html.match(/%VITE_[A-Z_]+%/g) || []).join(", ")
    );
    check("loads gtag.js exactly once", loaders === 1, `saw ${loaders}`);
    check(
        "the gtag.js loader sits inside <head>",
        head.includes(`googletagmanager.com/gtag/js?id=${EXPECTED_ID}`)
    );
    check(
        "no CSP-blocked inline script in the HTML",
        inlineScripts.length === 0,
        `${inlineScripts.length} inline script(s); script-src has no 'unsafe-inline'`
    );
    check(
        "the HTML does not attempt gtag config (CSP would block it)",
        !html.includes('gtag("config"') && !html.includes("gtag('config'")
    );
    check(
        "no Google Tag Manager container",
        !/GTM-[A-Z0-9]/.test(html) && !html.includes("gtm.js")
    );
    check("no retired measurement id", !html.includes("G-JGC9SCT63K"));
}

/**
 * The production CSP lives in vercel.json and is applied by Vercel's edge, so
 * `vite preview` serves dist/ with no headers at all. Without replaying the CSP
 * here, a CSP-fatal regression passes every assertion locally and breaks in
 * production — which is exactly what happened once.
 */
function readProductionCsp() {
    const cfgPath = fileURLToPath(new URL("../vercel.json", import.meta.url));
    const cfg = JSON.parse(readFileSync(cfgPath, "utf8"));
    for (const entry of cfg.headers || []) {
        for (const h of entry.headers || []) {
            if (h.key.toLowerCase() === "content-security-policy") return h.value;
        }
    }
    return null;
}

function check(label, condition, detail = "") {
    if (condition) {
        console.log(`  PASS  ${label}`);
    } else {
        console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
        failures.push(label);
    }
}

async function waitForServer(url, timeoutMs = 60000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        try {
            const res = await fetch(url, { redirect: "manual" });
            if (res.status < 500) return;
        } catch {
            // Server not up yet.
        }
        await new Promise((resolve) => setTimeout(resolve, 300));
    }
    throw new Error(`Preview server did not start at ${url}`);
}

function startPreview() {
    // Spawn Vite's bin entry with the current Node binary. Invoking `npx`
    // directly fails on Windows, where spawning a `.cmd` without a shell throws
    // EINVAL on modern Node.
    const viteBin = fileURLToPath(new URL("../node_modules/vite/bin/vite.js", import.meta.url));
    const child = spawn(
        process.execPath,
        [viteBin, "preview", "--port", String(PORT), "--strictPort"],
        { stdio: ["ignore", "pipe", "pipe"], shell: false }
    );
    child.stdout.on("data", () => {});
    child.stderr.on("data", (chunk) => process.stderr.write(chunk));
    return child;
}

function parseHit(url, postData = null) {
    const params = new URL(url).searchParams;
    // gtag may send event name / page_location in the URL or in a POST body.
    if (postData) {
        try {
            const body = new URLSearchParams(String(postData));
            for (const [key, value] of body.entries()) {
                if (!params.has(key)) params.set(key, value);
            }
        } catch {
            // Ignore non-form bodies; URL params are still usable.
        }
    }
    return {
        url,
        tid: params.get("tid"),
        en: params.get("en"),
        dl: params.get("dl"),
        dt: params.get("dt"),
        // `_dbg` is what routes a hit into GA4 DebugView. gtag.js serialises
        // `debug_mode: true` as `_dbg=true`; other surfaces emit `_dbg=1`.
        debug: params.get("_dbg") ?? params.get("ep.debug_mode"),
        // Consent Mode signals — absent means consent mode is not in play.
        gcs: params.get("gcs"),
        gcd: params.get("gcd"),
        cid: params.get("cid"),
        sid: params.get("sid"),
    };
}

function pageViews(hits) {
    return hits.filter((h) => h.en === "page_view");
}

/** Drive an SPA destination via history + popstate so React route state updates. */
async function spaGoto(page, path) {
    await page.evaluate((nextPath) => {
        globalThis.history.pushState({}, "", nextPath);
        globalThis.dispatchEvent(new PopStateEvent("popstate"));
    }, path);
}

async function waitForHits(hits, predicate, timeoutMs = 25000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        if (predicate(hits)) return true;
        await new Promise((resolve) => setTimeout(resolve, 250));
    }
    return false;
}

async function main() {
    console.log(`GA4 e2e check — expecting measurement ID ${EXPECTED_ID}\n`);

    console.log("Static dist/index.html:");
    verifyDistHtml();
    console.log("\nRuntime behaviour:");

    const server = startPreview();
    let browser;

    try {
        await waitForServer(`${ORIGIN}/`);

        browser = await chromium.launch();
        const context = await browser.newContext();

        // Replay the production CSP onto the document response, so this run fails
        // the same way production would. Only the top-level document matters — a
        // CSP header on a sub-resource is ignored by the browser — and rewriting
        // every asset would needlessly proxy images that SPA navigation cancels
        // mid-flight, which surfaces as an ECONNRESET from route.fetch().
        const CSP = readProductionCsp();
        check("production CSP found in vercel.json", Boolean(CSP));
        if (CSP) {
            await context.route(`${ORIGIN}/**`, async (route) => {
                if (route.request().resourceType() !== "document") {
                    await route.continue().catch(() => {});
                    return;
                }
                try {
                    const response = await route.fetch();
                    await route.fulfill({
                        response,
                        headers: { ...response.headers(), "content-security-policy": CSP },
                    });
                } catch {
                    // Navigation was superseded or cancelled; let it proceed unmodified.
                    await route.continue().catch(() => {});
                }
            });
        }

        const hits = [];
        // Record every Measurement Protocol hit, then abort it so the live GA4
        // property never receives synthetic test traffic.
        await context.route(COLLECT_PATTERN, async (route) => {
            const request = route.request();
            hits.push(parseHit(request.url(), request.postData()));
            await route.abort();
        });

        const page = await context.newPage();
        const consoleErrors = [];
        const cspViolations = [];
        page.on("console", (msg) => {
            if (msg.type() !== "error") return;
            consoleErrors.push(msg.text());
            if (/Content Security Policy/i.test(msg.text())) cspViolations.push(msg.text());
        });

        // ── 1. Initial load ──────────────────────────────────────────────────
        await page.goto(`${ORIGIN}/`, { waitUntil: "domcontentloaded" });

        const gotFirst = await waitForHits(hits, (h) => h.some((x) => x.en === "page_view"));
        check("initial load sends a page_view hit", gotFirst);

        const tagState = await page.evaluate(() => ({
            dataLayerIsArray: Array.isArray(globalThis.dataLayer),
            gtagType: typeof globalThis.gtag,
            loaderScripts: Array.from(globalThis.document.scripts)
                .map((el) => el.src)
                .filter((src) => src.includes("googletagmanager.com/gtag/js")),
            commands: Array.from(globalThis.dataLayer || []).map((args) => Array.from(args)),
        }));

        check("window.dataLayer is initialised", tagState.dataLayerIsArray);
        check("window.gtag is a function", tagState.gtagType === "function");
        check(
            "exactly one gtag.js loader is present in the DOM",
            tagState.loaderScripts.length === 1,
            `saw ${tagState.loaderScripts.length}: ${tagState.loaderScripts.join(", ")}`
        );
        check(
            "the loader uses the expected measurement id",
            tagState.loaderScripts[0]?.includes(EXPECTED_ID),
            String(tagState.loaderScripts[0])
        );

        const configCommands = tagState.commands.filter((c) => c[0] === "config");
        check(
            "exactly one config command is issued",
            configCommands.length === 1,
            `saw ${configCommands.length}`
        );
        check(
            "config disables the automatic page view",
            configCommands[0]?.[2]?.send_page_view === false
        );
        check(
            "page views are sent as explicit page_view events",
            tagState.commands.some((c) => c[0] === "event" && c[1] === "page_view")
        );

        // Let any stray duplicate arrive before counting.
        await page.waitForTimeout(2500);
        const firstLoadViews = hits.filter((h) => h.en === "page_view");
        check(
            "initial load sends exactly one page_view",
            firstLoadViews.length === 1,
            `saw ${firstLoadViews.length}`
        );
        check(
            "hit carries the correct measurement id",
            firstLoadViews.every((h) => h.tid === EXPECTED_ID),
            firstLoadViews.map((h) => h.tid).join(", ")
        );
        check(
            "hit page_location matches the loaded route",
            firstLoadViews[0]?.dl === `${ORIGIN}/`,
            String(firstLoadViews[0]?.dl)
        );

        // ── 2. Query + clean SPA destinations ────────────────────────────────
        // Home → /news → ?page=products → /privacy  => 4 distinct page_views
        // News uses the real nav button (pushRoute + eager track). Remaining
        // query/clean hops use popstate so React state stays in sync.

        await page.getByRole("button", { name: "News", exact: true }).first().click();
        const gotNews = await waitForHits(hits, (h) => pageViews(h).length >= 2);
        check("News Center (/news) sends a page_view", gotNews);
        await page.waitForTimeout(800);

        const newsProbe = await page.evaluate(() => ({
            href: globalThis.location.href,
            commands: Array.from(globalThis.dataLayer || []).map((args) => Array.from(args)),
        }));
        const newsPageViewQueued = newsProbe.commands.some(
            (c) => Array.isArray(c) && c[0] === "event" && c[1] === "page_view"
        );
        check(
            "News navigation lands on /news",
            newsProbe.href === `${ORIGIN}/news` || newsProbe.href.endsWith("/news"),
            newsProbe.href
        );
        check("dataLayer contains at least one page_view event command", newsPageViewQueued);
        check(
            "News page_view reports /news",
            pageViews(hits)[1]?.dl === `${ORIGIN}/news`,
            String(pageViews(hits)[1]?.dl)
        );

        const routeSteps = [
            { path: "/?page=products", label: "legacy Products query route", expectedCount: 3 },
            { path: "/privacy", label: "Privacy destination", expectedCount: 4 },
        ];

        for (const step of routeSteps) {
            await spaGoto(page, step.path);
            const got = await waitForHits(
                hits,
                (h) => pageViews(h).length >= step.expectedCount
            );
            check(`${step.label} (${step.path}) sends a page_view`, got);
            await page.waitForTimeout(800);
            check(
                `${step.label} page_view reports ${step.path}`,
                pageViews(hits)[step.expectedCount - 1]?.dl === `${ORIGIN}${step.path}`,
                String(pageViews(hits)[step.expectedCount - 1]?.dl)
            );
        }

        await page.waitForTimeout(1500);
        const views = pageViews(hits);
        check("exactly 4 page_view events after the route matrix", views.length === 4, `saw ${views.length}`);
        check(
            "every page_view uses the expected measurement id",
            views.every((h) => h.tid === EXPECTED_ID),
            views.map((h) => h.tid).join(", ")
        );

        const locations = views.map((v) => v.dl);
        check(
            "no duplicate page_view for the same location",
            new Set(locations).size === locations.length,
            locations.join(" | ")
        );

        // Re-track the same destination; dedupe must suppress a 5th page_view.
        const beforeDedupe = pageViews(hits).length;
        await spaGoto(page, "/privacy");
        await page.waitForTimeout(1500);
        check(
            "re-tracking the same URL does not emit a duplicate page_view",
            pageViews(hits).length === beforeDedupe,
            `before=${beforeDedupe} after=${pageViews(hits).length}`
        );

        const gaErrors = consoleErrors.filter((t) => t.includes("[GA4]"));
        check("no [GA4] console errors", gaErrors.length === 0, gaErrors.join(" | "));
        check(
            "no Content Security Policy violations under the production CSP",
            cspViolations.length === 0,
            cspViolations.map((v) => v.slice(0, 160)).join(" | ")
        );

        // ── 3. Production traffic must NOT be flagged for DebugView ───────────
        check(
            "normal traffic carries no debug flag",
            hits.every((h) => !h.debug),
            hits.map((h) => `${h.en}:_dbg=${h.debug ?? "absent"}`).join(" | ")
        );

        // ── 4. Opt-in debug session IS flagged ───────────────────────────────
        for (const probe of ["ga_debug=1", "gtm_debug=1785400000000"]) {
            const debugPage = await context.newPage();
            const debugHits = [];
            await debugPage.route(COLLECT_PATTERN, async (route) => {
                const request = route.request();
                debugHits.push(parseHit(request.url(), request.postData()));
                await route.abort();
            });

            await debugPage.goto(`${ORIGIN}/?${probe}`, { waitUntil: "domcontentloaded" });
            const gotDebug = await waitForHits(
                debugHits,
                (h) => h.some((x) => x.en === "page_view")
            );
            check(`?${probe} sends a page_view`, gotDebug);

            const view = debugHits.find((h) => h.en === "page_view");
            check(
                `?${probe} flags the hit for DebugView (_dbg)`,
                isDebugFlagged(view?.debug),
                `_dbg=${view?.debug ?? "absent"}`
            );
            check(
                `?${probe} still reports the correct measurement id`,
                view?.tid === EXPECTED_ID,
                String(view?.tid)
            );
            check(
                `?${probe} sends exactly one page_view`,
                debugHits.filter((h) => h.en === "page_view").length === 1,
                `saw ${debugHits.filter((h) => h.en === "page_view").length}`
            );

            // The flag must persist past the route change that drops the query.
            await spaGoto(debugPage, "/blog");
            await waitForHits(
                debugHits,
                (h) => h.filter((x) => x.en === "page_view").length >= 2
            );
            const second = debugHits.filter((h) => h.en === "page_view")[1];
            check(
                `?${probe} keeps debug_mode across SPA navigation`,
                isDebugFlagged(second?.debug),
                `_dbg=${second?.debug ?? "absent"}`
            );

            await debugPage.close();
        }

        console.log(`\nRecorded ${hits.length} production-mode hit(s):`);
        for (const hit of hits) {
            console.log(
                `  en=${hit.en} tid=${hit.tid} _dbg=${hit.debug ?? "absent"} ` +
                    `gcs=${hit.gcs ?? "absent"} cid=${hit.cid} sid=${hit.sid}`
            );
            console.log(`     dl=${hit.dl}`);
        }
    } finally {
        if (browser) await browser.close();
        server.kill();
    }

    if (failures.length > 0) {
        console.error(`\n${failures.length} check(s) failed.`);
        process.exitCode = 1;
        return;
    }
    console.log("\nAll GA4 checks passed.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
