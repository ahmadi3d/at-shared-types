type Brand<T, B extends string> = T & { readonly __brand: B };

export type ATAICapabilityID = Brand<string, "ATAICapabilityID">;
export type ATAIPromptID = Brand<string, "ATAIPromptID">;

const RX = {
    capability: /^cap\.[a-z0-9]+(?:\.[a-z0-9]+){3,}$/i,
    prompt: /^prompt\.[a-z0-9]+(?:\.[a-z0-9]+){3,}\.v[0-9]+$/i,
} as const;

function validate(kind: keyof typeof RX, id: string): void {
    if (!RX[kind].test(id)) {
        throw new Error(`[AI-PROTOCOL] Invalid ${kind} id: "${id}"`);
    }
}

/**
 * Normalize a segment for IDs.
 * Keep it strict: IDs should be stable, grep-friendly, and predictable.
 * - trims
 * - lowercases
 * - converts spaces/underscores to dots
 * - removes illegal chars (keeps a-z0-9 and dots)
 * - collapses multiple dots
 */
function normalizeSegment(seg: string): string {
    return seg
        .trim()
        .toLowerCase()
        .replace(/[\s_]+/g, ".")
        .replace(/[^a-z0-9.]/g, "")
        .replace(/\.+/g, ".")
        .replace(/^\.+|\.+$/g, "");
}

function joinSegments(...segs: string[]): string {
    return segs.map(normalizeSegment).filter(Boolean).join(".");
}

export const ATAIID = {
    /** Validate & brand an existing capability id (throws if invalid). */
    validateCapability(id: string): ATAICapabilityID {
        validate("capability", id);
        return id as ATAICapabilityID;
    },

    /** Validate & brand an existing prompt id (throws if invalid). */
    validatePrompt(id: string): ATAIPromptID {
        validate("prompt", id);
        return id as ATAIPromptID;
    },

    /**
     * Build a capability id from parts (then validates & brands).
     * Format: cap.<app>.<area>.<object>.<verb>
     */
    makeCapability(parts: {
        app: string;
        area: string;
        target: string;
        action: string;
    }): ATAICapabilityID {
        const id = `cap.${joinSegments(parts.app, parts.area, parts.target, parts.action)}`;
        return ATAIID.validateCapability(id);
    },

    /**
     * Build a prompt id from parts (then validates & brands).
     * Format: prompt.<app>.<area>.<object>.<verb>.v<major>
     */
    makePrompt(parts: {
        app: string;
        area: string;
        target: string;
        action: string;
        v: number; // major version
    }): ATAIPromptID {
        const major = Math.max(0, Math.floor(parts.v));
        const id = `prompt.${joinSegments(parts.app, parts.area, parts.target, parts.action)}.v${major}`;
        return ATAIID.validatePrompt(id);
    },
} as const;
