/** Menu data supplies presentation/destinations; executable pages remain code-registered. */
export type PublishedMenuDestination =
    | {
        kind: "path";
        path: string
    }
    | {
        kind: "form";
        formId: number
    };

export interface PublishedMenuItem {
    id: string;
    label: string;
    languageKey?: string;
    icon?: string;
    visible: boolean;
    disabled: boolean;
    destination?: PublishedMenuDestination;
    children: PublishedMenuItem[];
}

export interface PublishedMenu {
    schemaVersion: 1;
    targetKey: "new-parto";
    menuId: number;
    revision: number;
    publishedAt: string;
    items: PublishedMenuItem[];
}
