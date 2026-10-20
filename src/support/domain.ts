import type { ArchiveFileReference } from "../archive/domain";

export type SupportTicketStatusId = 1 | 2 | 3 | 4 | 5;
export type SupportTicketCapability =
    | "reply"
    | "internalReply"
    | "assign"
    | "requestClose"
    | "reject"
    | "close"
    | "cancel"
    | "createChild";

export interface SupportPageContext {
    version: 1;
    path: string;
    title?: string;
    language?: string;
    appVersion?: string;
    viewport?: { width: number; height: number };
}

export interface SupportCreateTicket {
    projectId: number;
    subProjectId: number;
    categoryId: number;
    priorityId: number;
    departmentId: number;
    subject: string;
    body?: string;
    attachments?: ArchiveFileReference[];
    parentId?: string;
    context?: SupportPageContext;
}

export interface SupportReply {
    body?: string;
    attachments?: ArchiveFileReference[];
    internal?: boolean;
    toDepartmentId?: number | null;
    toUserId?: string | null;
}

export interface SupportAssignment {
    action: "assign";
    departmentId?: number | null;
    userId?: string | null;
    estimatedDuration?: number | null;
    dueAt?: string | null;
    serviceTimeId?: number | null;
    description?: string;
}

export type SupportTicketAction =
    | SupportAssignment
    | { action: "requestClose" | "reject"; description: string }
    | { action: "close"; resolveTypeId: number }
    | { action: "cancel"; cancelReasonId: number };

export type SupportBatchAction = SupportTicketAction & { ticketIds: string[] };

export interface SupportTicketFilters {
    scope?: "mine" | "support";
    state?: "all" | "active" | "closed" | "cancelled";
    search?: string;
    statusId?: SupportTicketStatusId;
    projectId?: number;
    subProjectId?: number;
    categoryId?: number;
    priorityId?: number;
    departmentId?: number;
    userId?: string;
    unreadOnly?: boolean;
    dueBefore?: string;
    parentId?: string;
    cursor?: string;
    limit?: number;
}

export interface SupportTicketSummary {
    id: string;
    parentId: string | null;
    subject: string;
    statusId: SupportTicketStatusId;
    creatorId: string;
    creatorName: string;
    projectId: number;
    subProjectId: number;
    categoryId: number;
    priorityId: number;
    startDepartmentId: number;
    assignedDepartmentId: number | null;
    assignedUserId: string | null;
    assignedUserName: string | null;
    assignedAt: string | null;
    estimatedDuration: number | null;
    dueAt: string | null;
    serviceTimeId: number | null;
    createdAt: string;
    resolvedAt: string | null;
    resolveTypeId: number | null;
    cancelledAt: string | null;
    cancelReasonId: number | null;
    unreadCount: number;
}

export interface SupportTicketDetail extends SupportTicketSummary {
    canViewInternal: boolean;
    body: string | null;
    attachments: ArchiveFileReference[];
    context: SupportPageContext | null;
    allowedActions: SupportTicketCapability[];
}

export interface SupportTicketActivity {
    id: string;
    ticketId: string;
    activityTypeId: number;
    authorId: string;
    authorName: string;
    body: string | null;
    attachments: ArchiveFileReference[];
    internal: boolean;
    createdAt: string;
    toDepartmentId: number | null;
    toUserId: string | null;
}

export interface SupportPage<T> {
    items: T[];
    nextCursor: string | null;
}

export interface SupportDueTimeChange {
    id: string;
    ticketId: string;
    duration: number | null;
    dueAt: string | null;
    authorId: string;
    authorName: string;
    createdAt: string;
    description: string | null;
}

/** Counts of active unread tickets in the caller's own and currently eligible staff scopes. */
export interface SupportUnreadCounts {
    mine: number;
    support: number;
}

export interface SupportReferenceOption {
    id: number;
    title: string;
    disabled?: boolean;
}
export interface SupportReferences {
    projects: SupportReferenceOption[];
    subProjects: SupportReferenceOption[];
    categories: SupportReferenceOption[];
    priorities: SupportReferenceOption[];
    departments: SupportReferenceOption[];
    serviceTimes: SupportReferenceOption[];
    resolveTypes: SupportReferenceOption[];
    cancelReasons: SupportReferenceOption[];
    statuses: SupportReferenceOption[];
    activityTypes: SupportReferenceOption[];
    canWork: boolean;
    canAssign: boolean;
    canSupervise: boolean;
}

export interface SupportAssignmentTarget {
    id: string;
    name: string;
    departmentIds: number[];
}
