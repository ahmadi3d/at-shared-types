import type { AtJsonObject } from "../../core/domain/json.types";
import type { TabularQueryContext, TabularRowKey } from "./result";

export type GridTabSelection =
    | {
        mode: "explicit";
        keys: TabularRowKey[];
        /** Only include materialized rows; keys remain the selection identity. */
        rows?: AtJsonObject[];
    }
    | {
        mode: "allMatching";
        excludedKeys: TabularRowKey[];
        queryContext: TabularQueryContext;
    };

export interface GridTabSelectionSnapshot {
    tabId: string;
    resultSetKey: string;
    selection: GridTabSelection;
}

/** Interaction state. A host writes it into form/Action data only explicitly. */
export interface GridSelectionSnapshot {
    activeTabId?: string;
    tabs: Record<string, GridTabSelectionSnapshot>;
}
