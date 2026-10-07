import type { AtJsonObject, AtJsonValue } from "../../core/domain/json.types";
import type { DataShape } from "../../dataShape/domain";

export type TabularRowKey = string | number;

/** Renderer-neutral column semantics; hosts resolve UI-column/enum formatting. */
export interface TabularColumnDefinition {
    key: string;
    title?: string;
    languageKey?: string;
    valuePath?: string;
    shape?: DataShape;
    uiColumnKey?: string;
    enumId?: string;
    hidden?: boolean;
    readOnly?: boolean;
}

export interface TabularQueryContext {
    inputs?: AtJsonObject;
    filter?: AtJsonValue;
    sort?: Array<{
        key: string;
        direction: "asc" | "desc"
    }>;
    offset?: number;
    limit?: number;
    /** Identifies the exact server query whose selection is being represented. */
    queryKey?: string;
}

export interface TabularResultSet {
    key: string;
    title?: string;
    languageKey?: string;
    rows: AtJsonObject[];
    columns?: TabularColumnDefinition[];
    rowKeyPath?: string;
    totalCount?: number;
    queryContext?: TabularQueryContext;
}

/** An additional projection of the final canonical value, never a raw DTO. */
export interface TabularResultBundle {
    version: 1;
    resultSets: TabularResultSet[];
}
