/**
 * Phase 12.6 — Product relationship graph (cross-product recommendations).
 */

import {
    RELATIONSHIP_KIND_LIST,
    RELATIONSHIP_KINDS,
} from "./constants.js";
import { getCommerceProductById } from "./productCatalog.js";

/**
 * @typedef {object} ProductRelationship
 * @property {string} id
 * @property {string} fromProductId
 * @property {string} toProductId
 * @property {string} kind
 * @property {string} label
 * @property {number} weight
 */

/**
 * @param {object} input
 * @returns {Readonly<ProductRelationship>}
 */
export function createProductRelationship(input) {
    if (!input?.id || !input?.fromProductId || !input?.toProductId) {
        throw new Error("Relationship requires id, fromProductId, toProductId");
    }
    if (!RELATIONSHIP_KIND_LIST.includes(input.kind)) {
        throw new Error(`Invalid relationship kind: ${input.kind}`);
    }
    if (input.fromProductId === input.toProductId) {
        throw new Error("Self-relationships are not allowed");
    }

    return Object.freeze({
        id: input.id,
        fromProductId: input.fromProductId,
        toProductId: input.toProductId,
        kind: input.kind,
        label: input.label ?? input.kind,
        weight: Number.isFinite(input.weight) ? input.weight : 1,
        // Relationships never imply ownership, bundle purchase, or entitlement.
        grantsEntitlement: false,
        grantsOwnership: false,
        impliesAvailability: false,
    });
}

function rel(id, from, to, kind, label, weight = 1) {
    return createProductRelationship({
        id,
        fromProductId: from,
        toProductId: to,
        kind,
        label,
        weight,
    });
}

/**
 * Seed graph from Phase 12 vision examples. Targets that are not yet cataloged
 * are omitted; only edges between known commerce product ids are kept.
 */
const RAW_EDGES = [
    // Beyond the Last Light → Nightmare Forest, writing resources
    rel(
        "rel-btll-nightmare",
        "commerce-book-beyond-the-last-light",
        "commerce-book-nightmare-forest",
        RELATIONSHIP_KINDS.SEQUEL,
        "Nightmare Forest",
        10,
    ),
    rel(
        "rel-btll-writing",
        "commerce-book-beyond-the-last-light",
        "commerce-resource-writing",
        RELATIONSHIP_KINDS.RESOURCE_FOR,
        "Writing Resources",
        6,
    ),
    // Cookbook → resource / future cooking surfaces
    rel(
        "rel-tsat-resource",
        "commerce-book-southeast-asian-table",
        "commerce-resource-writing",
        RELATIONSHIP_KINDS.COMPLEMENT,
        "Related CinNova resources",
        4,
    ),
    // PoisonGuard → premium / family / alerts (plans + bundle)
    rel(
        "rel-pg-premium",
        "commerce-app-poisonguard",
        "commerce-bundle-safety-family",
        RELATIONSHIP_KINDS.UPGRADE_TO,
        "Family Safety Bundle",
        8,
    ),
    // StudyNest → premium / practice / teacher (same product, upgrade semantics via plan)
    rel(
        "rel-sn-course",
        "commerce-app-studynest",
        "commerce-course-ai-foundations",
        RELATIONSHIP_KINDS.COMPLEMENT,
        "AI Foundations Course",
        5,
    ),
    // StageScout → travel / group planning resources
    rel(
        "rel-ss-resources",
        "commerce-app-stagescout",
        "commerce-resource-writing",
        RELATIONSHIP_KINDS.RESOURCE_FOR,
        "Travel / planning resources",
        5,
    ),
    // Cross-app discovery
    rel(
        "rel-pg-studynest",
        "commerce-app-poisonguard",
        "commerce-app-studynest",
        RELATIONSHIP_KINDS.RECOMMENDS,
        "StudyNest",
        2,
    ),
    rel(
        "rel-re-techmate",
        "commerce-app-real-estate",
        "commerce-app-techmate",
        RELATIONSHIP_KINDS.RECOMMENDS,
        "TechMate AI",
        2,
    ),
];

function resolveBookCommerceId(slugFragment) {
    // Catalog ids are commerce-${book.id}; book ids use book-<slug-ish> forms.
    const candidates = [
        `commerce-book-${slugFragment}`,
        `commerce-${slugFragment}`,
    ];
    for (const id of candidates) {
        if (getCommerceProductById(id)) return id;
    }
    return null;
}

function normalizeEdge(edge) {
    let from = edge.fromProductId;
    let to = edge.toProductId;

    // Repair book ids if catalog uses book-* legacy ids.
    if (!getCommerceProductById(from) && from.startsWith("commerce-book-")) {
        const frag = from.replace("commerce-book-", "");
        from =
            resolveBookCommerceId(frag) ||
            resolveBookCommerceId(`book-${frag}`) ||
            from;
    }
    if (!getCommerceProductById(to) && to.startsWith("commerce-book-")) {
        const frag = to.replace("commerce-book-", "");
        to =
            resolveBookCommerceId(frag) ||
            resolveBookCommerceId(`book-${frag}`) ||
            to;
    }

    if (!getCommerceProductById(from) || !getCommerceProductById(to)) {
        return null;
    }
    return createProductRelationship({
        ...edge,
        fromProductId: from,
        toProductId: to,
    });
}

function buildGraph() {
    // Defer product lookup until catalog is fully initialized.
    const edges = [];
    for (const edge of RAW_EDGES) {
        const normalized = normalizeEdge(edge);
        if (normalized) edges.push(normalized);
    }
    return Object.freeze(edges);
}

let _graph = null;

export function listProductRelationships() {
    if (!_graph) _graph = buildGraph();
    return _graph.slice();
}

export function listRecommendationsForProduct(productId) {
    return listProductRelationships()
        .filter((r) => r.fromProductId === productId)
        .sort((a, b) => b.weight - a.weight);
}

export function listRelatedProductIds(productId) {
    return listRecommendationsForProduct(productId).map((r) => r.toProductId);
}

export function validateProductRelationships(edges = listProductRelationships()) {
    const errors = [];
    const ids = new Set();
    const pairs = new Set();
    for (const edge of edges) {
        if (ids.has(edge.id)) errors.push(`duplicate relationship ${edge.id}`);
        ids.add(edge.id);
        const pair = `${edge.fromProductId}->${edge.toProductId}:${edge.kind}`;
        if (pairs.has(pair)) errors.push(`duplicate edge ${pair}`);
        pairs.add(pair);
        if (!getCommerceProductById(edge.fromProductId)) {
            errors.push(`${edge.id}: missing from product`);
        }
        if (!getCommerceProductById(edge.toProductId)) {
            errors.push(`${edge.id}: missing to product`);
        }
        if (edge.grantsEntitlement) {
            errors.push(`${edge.id}: relationships must not grant entitlements`);
        }
        if (edge.grantsOwnership) {
            errors.push(`${edge.id}: relationships must not grant ownership`);
        }
        if (edge.impliesAvailability) {
            errors.push(`${edge.id}: relationships must not imply availability`);
        }
    }
    return { ok: errors.length === 0, errors };
}
