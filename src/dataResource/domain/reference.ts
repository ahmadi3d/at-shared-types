import type { DataResourceId } from "./identity";

/**
 * Lightweight persisted handle to a configured resource.
 * Invocation payloads, results, and request state remain runtime concerns.
 */
export interface DataResourceReference {
    resourceId: DataResourceId;
}
