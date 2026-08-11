/**
 * Phase M2 legal activation classifications.
 * Never set READY without documented attorney + business sign-off.
 */

export const LEGAL_CLASSIFICATIONS = Object.freeze({
    ENGINEERING_COMPLETE: "ENGINEERING_COMPLETE",
    BUSINESS_REVIEW_REQUIRED: "BUSINESS_REVIEW_REQUIRED",
    ATTORNEY_REVIEW_REQUIRED: "ATTORNEY_REVIEW_REQUIRED",
    READY: "READY",
});

export const LEGAL_ACTIVATION_MATRIX = Object.freeze([
    {
        key: "terms",
        classifications: [
            LEGAL_CLASSIFICATIONS.BUSINESS_REVIEW_REQUIRED,
            LEGAL_CLASSIFICATIONS.ATTORNEY_REVIEW_REQUIRED,
        ],
    },
    {
        key: "privacy",
        classifications: [
            LEGAL_CLASSIFICATIONS.BUSINESS_REVIEW_REQUIRED,
            LEGAL_CLASSIFICATIONS.ATTORNEY_REVIEW_REQUIRED,
        ],
    },
    {
        key: "cookie-policy",
        classifications: [
            LEGAL_CLASSIFICATIONS.ENGINEERING_COMPLETE,
            LEGAL_CLASSIFICATIONS.ATTORNEY_REVIEW_REQUIRED,
        ],
    },
    {
        key: "affiliate-disclosure",
        classifications: [
            LEGAL_CLASSIFICATIONS.ENGINEERING_COMPLETE,
            LEGAL_CLASSIFICATIONS.ATTORNEY_REVIEW_REQUIRED,
        ],
    },
    {
        key: "refund-policy",
        classifications: [
            LEGAL_CLASSIFICATIONS.ENGINEERING_COMPLETE,
            LEGAL_CLASSIFICATIONS.ATTORNEY_REVIEW_REQUIRED,
        ],
        blocksLivePayments: true,
    },
    {
        key: "digital-product-terms",
        classifications: [
            LEGAL_CLASSIFICATIONS.ENGINEERING_COMPLETE,
            LEGAL_CLASSIFICATIONS.ATTORNEY_REVIEW_REQUIRED,
        ],
        blocksLivePayments: true,
    },
    {
        key: "sponsorship-disclosure",
        classifications: [
            LEGAL_CLASSIFICATIONS.ENGINEERING_COMPLETE,
            LEGAL_CLASSIFICATIONS.ATTORNEY_REVIEW_REQUIRED,
        ],
    },
    {
        key: "accessibility",
        classifications: [
            LEGAL_CLASSIFICATIONS.ENGINEERING_COMPLETE,
            LEGAL_CLASSIFICATIONS.BUSINESS_REVIEW_REQUIRED,
        ],
    },
    {
        key: "dmca",
        classifications: [
            LEGAL_CLASSIFICATIONS.ENGINEERING_COMPLETE,
            LEGAL_CLASSIFICATIONS.ATTORNEY_REVIEW_REQUIRED,
        ],
    },
    {
        key: "disclaimer",
        classifications: [
            LEGAL_CLASSIFICATIONS.ENGINEERING_COMPLETE,
            LEGAL_CLASSIFICATIONS.BUSINESS_REVIEW_REQUIRED,
        ],
    },
]);

export function listLivePaymentLegalBlockers(matrix = LEGAL_ACTIVATION_MATRIX) {
    return matrix.filter(
        (row) =>
            row.blocksLivePayments
            || row.classifications.includes(LEGAL_CLASSIFICATIONS.ATTORNEY_REVIEW_REQUIRED),
    );
}

export function anyDocumentMarkedReady(matrix = LEGAL_ACTIVATION_MATRIX) {
    return matrix.some((row) => row.classifications.includes(LEGAL_CLASSIFICATIONS.READY));
}
