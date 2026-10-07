import type { CommandDefinition } from "../../command/domain/command";
import type { TabularColumnDefinition } from "./result";

export type ResultGridResultBinding =
    | {
        kind: "resultSet";
        key: string
    }
    | {
        kind: "valuePath";
        path: string
    };

export interface ResultGridRowCommandPresentation {
    mode: "buttons" | "icons" | "menu" | "auto";
    /** Auto mode collapses to a menu above this count (default 3). */
    maxInline?: number;
}

export interface ResultGridCommandBinding {
    command: CommandDefinition;
    /** Omitted means the active tab at invocation time. */
    tabId?: string;
}

export interface ResultGridTabDefinition {
    id: string;
    title?: string;
    languageKey?: string;
    hidden?: boolean;
    result: ResultGridResultBinding;
    columns?: TabularColumnDefinition[];
    selection?: {
        mode: "none" | "single" | "multiple";
        rowKeyPath?: string;
    };
    readOnly?: boolean;
    rowCommands?: CommandDefinition[];
    rowCommandPresentation?: ResultGridRowCommandPresentation;
    toolbarCommands?: CommandDefinition[];
    footerCommands?: CommandDefinition[];
}

export interface ResultGridDefinition {
    version: 1;
    tabs:
    | { mode: "automatic" }
    | {
        mode: "configured";
        items: ResultGridTabDefinition[];
        unmapped?: "ignore" | "append"
    };
    /** Remote mode uses the installed renderer's licensed paging capabilities. */
    rowModel?: "client" | "server";
    defaultTabId?: string;
    toolbarCommands?: ResultGridCommandBinding[];
    footerCommands?: ResultGridCommandBinding[];
}
