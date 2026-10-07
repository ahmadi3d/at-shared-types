import type { AtJsonObject } from "../../core/domain/json.types";

export type FormMakerEventActionType = string;

export interface FormMakerEventActionOutput {
    variable?: string;
}

/** Registry-owned JSON configuration; this is the existing event-flow grammar. */
export interface FormMakerEventActionDefinition<TConfig = AtJsonObject> {
    id: string;
    type: FormMakerEventActionType;
    config?: TConfig;
    output?: FormMakerEventActionOutput;
    enabled?: boolean;
}

export interface FormMakerEventRuleDefinition<TConfig = AtJsonObject> {
    id: string;
    actions: FormMakerEventActionDefinition<TConfig>[];
    enabled?: boolean;
}

export interface FormMakerEventDefinition<TConfig = AtJsonObject> {
    rules: FormMakerEventRuleDefinition<TConfig>[];
}

export type FormMakerEvents<TConfig = AtJsonObject> = Record<
    string,
    FormMakerEventDefinition<TConfig>
>;
