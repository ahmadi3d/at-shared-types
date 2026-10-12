import type { DataShape } from "../../dataShape/domain";
import type { DataContractVersionDefinition } from "../../dataContract/domain";

/** Bounded structural paths describe WHAT without exposing implementation configuration. */
export interface AiContractShapeNode {
    path: string;
    kind: DataShape["kind"];
    required: boolean;
    nullable: boolean;
    description: string;
    format: string | null;
    enum: string[];
    additionalProperties: boolean;
}

export interface AiContractSpecification {
    schemaVersion: 1;
    key: string;
    name: string;
    description: string;
    effect: "read" | "write";
    inputNodes: AiContractShapeNode[];
    outputNodes: AiContractShapeNode[];
    /** Business examples stay JSON text, separate from the AI envelope protocol. */
    representativeInputJson: string | null;
    mockOutputJson: string | null;
}

export interface AiCompiledContract {
    key: string;
    name: string;
    description: string;
    draft: Omit<DataContractVersionDefinition, "version" | "status">;
}

/** Null sections retain current private editor values; mock removal is explicit. */
export interface AiContractEditorDraft {
    name: string | null;
    description: string | null;
    effect: "read" | "write" | null;
    inputNodes: AiContractShapeNode[] | null;
    outputNodes: AiContractShapeNode[] | null;
    mockMode: "unchanged" | "remove" | "replace";
    mockOutputJson: string | null;
}
