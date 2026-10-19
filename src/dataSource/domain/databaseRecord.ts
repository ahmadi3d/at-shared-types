/** Invocation context for the backend-owned legacy original-ID/confirmation adapter. */
export interface DatabaseRecordContext {
    version: 1;
    key: string | number;
    /** Opaque, short-lived and single-use; issued after an authorized rollback-only check. */
    confirmationToken?: string;
}

export interface DatabaseRecordConfirmation {
    token: string;
    message: string;
}

export interface DatabaseRecordContextCapability {
    kind: "legacy-record-id";
    version: 1;
}
