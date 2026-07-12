type Brand<T, B extends string> = T & { readonly __brand: B };

export type AtAiCapabilityId = Brand<string, "AtAiCapabilityId">;
export type AtAiPromptId = Brand<string, "AtAiPromptId">;

// allow underscores inside each segment
const SEG = `[a-z0-9_]+`;

const RX = {
    capability: new RegExp(`^cap\\.${SEG}(?:\\.${SEG}){3,}$`, "i"),
    prompt: new RegExp(`^prompt\\.${SEG}(?:\\.${SEG}){3,}\\.v[0-9]+$`, "i"),
} as const;

function validate(kind: keyof typeof RX, id: string): void {
    if (!RX[kind].test(id)) {
        throw new Error(`[AI-PROTOCOL] Invalid ${kind} id: "${id}"`);
    }
}

/**
 * Normalize a segment for Ids (snake_case).
 * - trims
 * - lowercases
 * - converts spaces and dashes to underscores
 * - removes illegal chars (keeps a-z0-9 and _)
 * - collapses multiple underscores
 * - trims leading/trailing underscores
 */
function normalizeSegment(seg: string): string {
    return seg
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_")     // spaces/dashes -> _
        .replace(/[^a-z0-9_]/g, "")  // keep only a-z0-9_
        .replace(/_+/g, "_")         // collapse __
        .replace(/^_+|_+$/g, "");    // trim edges
}

function joinSegments(...segs: string[]): string {
    return segs.map(normalizeSegment).filter(Boolean).join(".");
}

export const AtAiId = {
    validateCapability(id: string): AtAiCapabilityId {
        validate("capability", id);
        return id as AtAiCapabilityId;
    },

    validatePrompt(id: string): AtAiPromptId {
        validate("prompt", id);
        return id as AtAiPromptId;
    },

    makeCapability(parts: {
        app: string;
        area: string;
        target: string;
        action: string;
    }): AtAiCapabilityId {
        const id = `cap.${joinSegments(parts.app, parts.area, parts.target, parts.action)}`;
        return AtAiId.validateCapability(id);
    },

    makePrompt(parts: {
        app: string;
        area: string;
        target: string;
        action: string;
        v: number;
    }): AtAiPromptId {
        const major = Math.max(0, Math.floor(parts.v));
        const id = `prompt.${joinSegments(parts.app, parts.area, parts.target, parts.action)}.v${major}`;
        return AtAiId.validatePrompt(id);
    },
} as const;
