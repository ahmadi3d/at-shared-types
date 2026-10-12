import type { AtJsonObject } from "../../core/domain/json.types";

export type AiFormControl =
    | "TextBox"
    | "IntegerTextBox"
    | "FloatTextBox"
    | "DatePicker"
    | "CheckBox"
    | "ComboBox"
    | "MultiComboBox";
export interface AiFormFieldSpecification {
    name: string;
    label: string;
    control: AiFormControl;
    required: boolean;
    size: number;
    enumKey: string | null;
    uiColumnKey: string | null;
    /** Visibility reads the value of a declared checkbox; it never executes caller-provided code. */
    visibleWhen: { fieldName: string } | null;
}
export interface AiFormSpecification {
    schemaVersion: 1;
    title: string;
    description: string;
    locale: "en" | "fa";
    sections: Array<{
        name: string;
        label: string;
        renderer: "Card" | "Box" | "Section" | "Paper";
        fields: AiFormFieldSpecification[];
    }>;
}
/** Backend-approved catalog projections, reacquired at preview/commit. Model input cannot supply them. */
export interface AiFormAuthoringCatalog {
    enums: Readonly<Record<string, { optionsAllowed: boolean }>>;
    uiColumns: Readonly<
        Record<
            string,
            {
                control: AiFormControl;
                enumKey: string | null;
                required: boolean;
                labels: Partial<Record<"en" | "fa", string>>;
            }
        >
    >;
}
export interface AiFormCompilationIssue {
    code: string;
    path: string;
}
export interface AiCompiledForm {
    definition: AtJsonObject;
    warnings: AiFormCompilationIssue[];
}
export type AiFormEditorDraft =
    | { changes: Array<{ fieldName: string; label: string; required: boolean }>; append: null }
    | { changes: null; append: AiFormSpecification };
