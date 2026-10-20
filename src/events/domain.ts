/** Business facts only. Delivery cursors and server-side routing never enter this envelope. */
export interface AtEventMetadata {
    eventId: string;
    version: 1;
    occurredAt: string;
    source: string;
    correlationId: string;
    causationId?: string;
    aggregate: {
        type: "support.ticket";
        id: string;
        /** Positive decimal revision when the producer has an authoritative revision. */
        revision?: string;
    };
}

export type SupportTicketChange = "details" | "status" | "assignment" | "dueTime" | "seen";

export interface AtEventPayloads {
    "support.ticket.created": { ticketId: string };
    "support.ticket.updated": { ticketId: string; changes: SupportTicketChange[] };
    "support.ticket.activity.created": {
        ticketId: string;
        activityId: string;
        visibility: "public" | "internal";
    };
}

export type AtEventType = keyof AtEventPayloads;

/** Distributive union preserves the event-name/payload relationship at every call site. */
export type AtApplicationEvent<T extends AtEventType = AtEventType> = {
    [K in T]: AtEventMetadata & { type: K; payload: AtEventPayloads[K] };
}[T];

/** Internal routing hint, resolved/authorized on the server; never sent to a browser. */
export type AtEventAudience =
    | { kind: "users"; userIds: readonly string[] }
    | { kind: "resource"; resourceType: "support.ticket"; resourceId: string };

/** Fan-out observes each event per subscriber; competing shares work by logical group. */
export type AtEventSubscription =
    | { mode: "fanOut"; subscriberId: string }
    | { mode: "competing"; group: string; subscriberId: string };
