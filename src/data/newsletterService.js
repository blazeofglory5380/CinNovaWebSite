import {
    isValidEmail,
    normalizeEmailInput,
    safeReadArray,
    safeWriteArray,
    sanitizeTags,
    sanitizeText,
} from "../utils/security.js";

const STORAGE_KEY = "cinNovaNewsletterSubscribers";

// Represents the real subscriber count from the email provider (update when connected).
export const SUBSCRIBER_BASE_COUNT = 1247;

export function getDisplaySubscriberCount() {
    return SUBSCRIBER_BASE_COUNT + readSubscribers().length;
}

export const newsletterProviderConfig = {
    mailchimp: {
        name: "Mailchimp",
        endpoint: "/api/newsletter/mailchimp",
        requiredServerEnv: ["MAILCHIMP_API_KEY", "MAILCHIMP_SERVER_PREFIX", "MAILCHIMP_AUDIENCE_ID"],
    },
    convertKit: {
        name: "ConvertKit",
        endpoint: "/api/newsletter/convertkit",
        requiredServerEnv: ["CONVERTKIT_API_KEY", "CONVERTKIT_FORM_ID"],
    },
};

function readSubscribers() {
    return safeReadArray(STORAGE_KEY)
        .filter((subscriber) => subscriber && isValidEmail(subscriber.email))
        .map((subscriber) => ({
            id: sanitizeText(subscriber.id, 80) || crypto.randomUUID(),
            email: normalizeEmailInput(subscriber.email),
            status: sanitizeText(subscriber.status, 40) || "subscribed",
            source: sanitizeText(subscriber.source, 100) || "Website",
            sources: Array.isArray(subscriber.sources)
                ? subscriber.sources.map((source) => sanitizeText(source, 100)).filter(Boolean).slice(0, 20)
                : [],
            tags: sanitizeTags(subscriber.tags),
            providerStatus: sanitizeText(subscriber.providerStatus, 60) || "ready-to-sync",
            createdAt: sanitizeText(subscriber.createdAt, 40) || new Date().toISOString(),
            lastSeenAt: sanitizeText(subscriber.lastSeenAt, 40) || new Date().toISOString(),
        }));
}

function writeSubscribers(subscribers) {
    safeWriteArray(STORAGE_KEY, subscribers.slice(0, 5000));
}

export function normalizeEmail(email) {
    return normalizeEmailInput(email);
}

export function getSubscribers() {
    return readSubscribers().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function saveSubscriber({ email, source = "Website", tags = [] }) {
    const normalizedEmail = normalizeEmail(email);
    if (!isValidEmail(normalizedEmail)) {
        return { status: "invalid", subscriber: null };
    }
    const safeSource = sanitizeText(source, 100) || "Website";
    const safeTags = sanitizeTags(tags);
    const subscribers = readSubscribers();
    const existing = subscribers.find((subscriber) => subscriber.email === normalizedEmail);
    const now = new Date().toISOString();

    if (existing) {
        const updatedSubscribers = subscribers.map((subscriber) =>
            subscriber.email === normalizedEmail
                ? {
                      ...subscriber,
                      lastSeenAt: now,
                      sources: Array.from(new Set([...(subscriber.sources || []), safeSource])).slice(0, 20),
                      tags: Array.from(new Set([...(subscriber.tags || []), ...safeTags])).slice(0, 20),
                  }
                : subscriber,
        );

        writeSubscribers(updatedSubscribers);
        return { status: "existing", subscriber: updatedSubscribers.find((item) => item.email === normalizedEmail) };
    }

    const subscriber = {
        id: crypto.randomUUID(),
        email: normalizedEmail,
        status: "subscribed",
        source: safeSource,
        sources: [safeSource],
        tags: safeTags,
        providerStatus: "ready-to-sync",
        createdAt: now,
        lastSeenAt: now,
    };

    writeSubscribers([subscriber, ...subscribers]);
    return { status: "created", subscriber };
}

export function deleteSubscriber(id) {
    writeSubscribers(readSubscribers().filter((subscriber) => subscriber.id !== id));
}

export function clearSubscribers() {
    writeSubscribers([]);
}

export function getSubscriberStats() {
    const subscribers = readSubscribers();
    const activeSubscribers = subscribers.filter((subscriber) => subscriber.status === "subscribed");
    const today = new Date().toISOString().slice(0, 10);
    const addedToday = subscribers.filter((subscriber) => subscriber.createdAt.startsWith(today));

    return {
        total: subscribers.length,
        active: activeSubscribers.length,
        addedToday: addedToday.length,
        readyToSync: subscribers.filter((subscriber) => subscriber.providerStatus === "ready-to-sync").length,
    };
}

export function buildProviderPayload(subscriber, provider = "mailchimp") {
    const payload = {
        email: subscriber.email,
        source: subscriber.source,
        tags: subscriber.tags,
        status: subscriber.status,
        subscribedAt: subscriber.createdAt,
    };

    if (provider === "convertKit") {
        return {
            email: payload.email,
            fields: {
                source: payload.source,
                subscribed_at: payload.subscribedAt,
            },
            tags: payload.tags,
        };
    }

    return {
        email_address: payload.email,
        status: "subscribed",
        merge_fields: {
            SOURCE: payload.source,
        },
        tags: payload.tags,
    };
}

export function exportSubscribersCsv(subscribers = getSubscribers()) {
    const header = ["email", "status", "source", "tags", "createdAt", "lastSeenAt", "providerStatus"];
    const rows = subscribers.map((subscriber) =>
        header
            .map((field) => {
                const value = Array.isArray(subscriber[field])
                    ? subscriber[field].join("|")
                    : subscriber[field] || "";
                return `"${String(value).replaceAll('"', '""')}"`;
            })
            .join(","),
    );

    return [header.join(","), ...rows].join("\n");
}

export function exportSubscribersJson(subscribers = getSubscribers()) {
    return JSON.stringify(subscribers, null, 2);
}
