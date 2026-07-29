import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

/**
 * CI lint baseline for the Vite/React browser app.
 *
 * Keep classic hook safety (`rules-of-hooks`, `exhaustive-deps`).
 * Do not enable the full React Compiler rule pack from
 * eslint-plugin-react-hooks recommended — those rules are incompatible
 * with intentional UI sync patterns in this codebase and are not required
 * for correctness without the compiler.
 */
export default defineConfig([
    globalIgnores([
        "dist",
        // Generated / vendored assets (not application source)
        "packages/**/dist/**",
        "public/draco/**",
        "backups/**",
        "Hero/**",
    ]),
    {
        files: ["src/**/*.{js,jsx}"],
        extends: [js.configs.recommended, reactRefresh.configs.vite],
        languageOptions: {
            globals: globals.browser,
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        plugins: {
            "react-hooks": reactHooks,
        },
        rules: {
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            // Fast Refresh guidance — keep non-blocking for mixed util/component modules
            "react-refresh/only-export-components": "warn",
        },
    },
    {
        // Node-side API routes and editorial scripts (process/__dirname, etc.)
        files: ["api/**/*.js", "scripts/**/*.{js,mjs}", "eslint.config.js"],
        extends: [js.configs.recommended],
        languageOptions: {
            globals: globals.node,
            sourceType: "module",
        },
        rules: {
            // Allow intentionally unused helpers marked with a leading underscore.
            "no-unused-vars": ["error", { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }],
        },
    },
    {
        // Playwright page.evaluate() callbacks run in a browser context.
        files: ["scripts/capture-*-poster.mjs", "scripts/capture-*.mjs"],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },
    },
    {
        files: ["src/scanner/**/*.js"],
        languageOptions: {
            globals: globals.node,
        },
    },
]);
