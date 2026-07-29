#!/usr/bin/env node
/**
 * End-to-end GA4 verification for the production bundle.
 *
 * Serves `dist/` with `vite preview`, drives it with a real Chromium, lets the
 * real gtag.js load, and asserts on the Measurement Protocol hits the tag tries
 * to send:
 *
 *   1. the first load produces exactly one `page_view` for the correct tid
 *   2. a client-side route change produces exactly one more `page_view`
 *   3. no duplicate `page_view` is emitted for the same location
 *
 * The `/g/collect` requests are recorded and then ABORTED, so running this test
 * never writes data into the live GA4 property.
 *
 * Usage: npm run test:analytics
 */

import { spawn } from "node:child_process";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const EXPECTED_ID = process.env.VITE_GA_MEASUREMENT_ID?.trim() || "G-CD944CHBK6";
const PORT = Number(process.env.GA_TEST_PORT || 4177);
const ORIGIN = `http://localhost:${PORT}`;
const COLLECT_PATTERN = /^https:\/\/([a-z0-9-]+\.)?(google-analytics\.com|analytics\.google\.com)\/(g\/)?collect/;

const failures = [];

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

function parseHit(url) {
    const params = new URL(url).searchParams;
    return {
        url,
        tid: params.get("tid"),
        en: params.get("en"),
        dl: params.get("dl"),
        dt: params.get("dt"),
    };
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

    const server = startPreview();
    let browser;

    try {
        await waitForServer(`${ORIGIN}/`);

        browser = await chromium.launch();
        const context = await browser.newContext();

        const hits = [];
        // Record every Measurement Protocol hit, then abort it so the live GA4
        // property never receives synthetic test traffic.
        await context.route(COLLECT_PATTERN, async (route) => {
            hits.push(parseHit(route.request().url()));
            await route.abort();
        });

        const page = await context.newPage();
        const consoleErrors = [];
        page.on("console", (msg) => {
            if (msg.type() === "error") consoleErrors.push(msg.text());
        });

        // ── 1. Initial load ──────────────────────────────────────────────────
        await page.goto(`${ORIGIN}/`, { waitUntil: "domcontentloaded" });

        const gotFirst = await waitForHits(hits, (h) => h.some((x) => x.en === "page_view"));
        check("initial load sends a page_view hit", gotFirst);

        const tagState = await page.evaluate(() => ({
            dataLayerIsArray: Array.isArray(globalThis.dataLayer),
            gtagType: typeof globalThis.gtag,
            scriptSrc: globalThis.document.getElementById("ga4-script")?.src || null,
            commands: Array.from(globalThis.dataLayer || []).map((args) => Array.from(args)),
        }));

        check("window.dataLayer is initialised", tagState.dataLayerIsArray);
        check("window.gtag is a function", tagState.gtagType === "function");
        check(
            "gtag.js is injected with the expected id",
            tagState.scriptSrc?.includes(EXPECTED_ID),
            String(tagState.scriptSrc)
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

        // ── 2. Client-side route change ──────────────────────────────────────
        const target = await page.evaluate(() => {
            const hrefs = Array.from(globalThis.document.querySelectorAll('a[href^="/"]'))
                .map((a) => a.getAttribute("href"))
                .filter((h) => h && h !== "/" && !h.startsWith("//"));
            return hrefs[0] || null;
        });

        if (!target) {
            check("found an internal link to exercise SPA routing", false);
        } else {
            await page.click(`a[href="${target}"]`);
            const gotSecond = await waitForHits(
                hits,
                (h) => h.filter((x) => x.en === "page_view").length >= 2
            );
            check(`SPA navigation to ${target} sends a page_view`, gotSecond);

            await page.waitForTimeout(2500);
            const views = hits.filter((h) => h.en === "page_view");
            check(
                "SPA navigation sends exactly one additional page_view",
                views.length === 2,
                `saw ${views.length}`
            );
            check(
                "second page_view reports the new route",
                views[1]?.dl === `${ORIGIN}${target}`,
                String(views[1]?.dl)
            );

            const locations = views.map((v) => v.dl);
            check(
                "no duplicate page_view for the same location",
                new Set(locations).size === locations.length,
                locations.join(" | ")
            );
        }

        const gaErrors = consoleErrors.filter((t) => t.includes("[GA4]"));
        check("no [GA4] console errors", gaErrors.length === 0, gaErrors.join(" | "));

        console.log(`\nRecorded ${hits.length} Measurement Protocol hit(s):`);
        for (const hit of hits) {
            console.log(`  en=${hit.en} tid=${hit.tid} dl=${hit.dl}`);
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
