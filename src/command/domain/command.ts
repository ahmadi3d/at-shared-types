import type { AtJsonObject } from "../../core/domain/json.types";
import type { RuntimeCondition } from "../../runtime/domain/condition";
import type { GridSelectionSnapshot, TabularRowKey } from "../../tabular/domain";
import type { FormMakerEventDefinition } from "./eventFlow";

export type CommandPlacement = "standalone" | "row" | "toolbar" | "footer";

export interface CommandPresentation {
    label?: string;
    languageKey?: string;
    icon?: string;
    variant?: "text" | "outlined" | "contained";
    color?: "inherit" | "primary" | "secondary" | "success" | "error" | "warning" | "info";
}

export interface CommandConfirmation {
    message?: string;
    languageKey?: string;
}

/** A preset is an authoring recipe; execution dispatches only on flow actions. */
export interface CommandDefinition {
    version: 1;
    id: string;
    presentation: CommandPresentation;
    visibleWhen?: RuntimeCondition;
    enabledWhen?: RuntimeCondition;
    confirmation?: CommandConfirmation;
    flow: FormMakerEventDefinition;
    authoring?: {
        presetId: string;
        presetVersion: number;
    };
}

/** Published under event.command by every placement before executing the flow. */
export interface CommandInvocationContext {
    commandId: string;
    host: {
        id: string;
        kind: string;
        placement: CommandPlacement;
    };
    tabId?: string;
    resultSetKey?: string;
    row?: {
        index: number;
        key?: TabularRowKey;
        data: AtJsonObject;
    };
    selection?: GridSelectionSnapshot;
}
